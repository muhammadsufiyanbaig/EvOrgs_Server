import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from '../../../Config/db';
import { chats, serviceInquiries, adInquiries } from '../../../Schema';
import { eq, or } from 'drizzle-orm';
import { verifyToken } from '../../../Config/auth/JWT';
import { v4 as uuidv4 } from 'uuid';
import { SocketUser } from '../Types';

export function initializeChatSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = verifyToken(token);
      if (decoded && typeof decoded !== 'string') {
        socket.data.user = { id: decoded.userId, type: decoded.type } as SocketUser;
        next();
      } else {
        next(new Error('Invalid token'));
      }
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const { user } = socket.data as { user: SocketUser };

    // Join user-specific room
    socket.join(user.id);

    // Handle new message
    socket.on('sendMessage', async (data: {
      receiverId: string;
      message: string;
      messageType: 'Text' | 'Image' | 'File' | 'Location';
      bookingId?: string;
      serviceType?: 'Venue' | 'Farmhouse' | 'CateringPackage' | 'PhotographyPackage' | 'Advertisement';
      serviceId?: string;
      adId?: string;
      parentMessageId?: string;
      attachmentUrl?: string;
    }) => {
      try {
        const chatId = uuidv4();
        const messageData = {
          id: chatId,
          senderId: user.id,
          receiverId: data.receiverId,
          message: data.message,
          messageType: data.messageType,
          bookingId: data.bookingId,
          serviceType: data.serviceType,
          [data.serviceType === 'Venue' ? 'venueId' :
           data.serviceType === 'Farmhouse' ? 'farmhouseId' :
           data.serviceType === 'CateringPackage' ? 'cateringPackageId' :
           data.serviceType === 'PhotographyPackage' ? 'photographyPackageId' :
           'serviceAdId']: data.serviceId || data.adId,
          parentMessageId: data.parentMessageId,
          attachmentUrl: data.attachmentUrl,
          status: 'Sent' as const,
          sentAt: new Date(),
        };
        console.log('Sending message:', messageData);
        
        // Insert into appropriate table
        if (data.adId) {
          await db.insert(adInquiries).values({
            id: uuidv4(),
            chatId,
            userId: user.type === 'user' ? user.id : data.receiverId,
            vendorId: user.type === 'vendor' ? user.id : data.receiverId,
            adId: data.adId,
            inquiryText: data.message,
            status: 'Open',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (data.serviceType && data.serviceId && data.serviceType !== 'Advertisement') {
          await db.insert(serviceInquiries).values({
            id: uuidv4(),
            chatId,
            userId: user.type === 'user' ? user.id : data.receiverId,
            vendorId: user.type === 'vendor' ? user.id : data.receiverId,
            serviceType: data.serviceType,
            serviceId: data.serviceId,
            inquiryText: data.message,
            status: 'Open',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          await db.insert(chats).values(messageData);
        }

        // Emit message to receiver and sender
        io.to(data.receiverId).emit('receiveMessage', messageData);
        io.to(user.id).emit('receiveMessage', { ...messageData, status: 'Delivered' });

        // Update message status
        await db.update(chats)
          .set({ status: 'Delivered', deliveredAt: new Date() })
          .where(eq(chats.id, chatId));
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message status update
    socket.on('updateMessageStatus', async (data: { chatId: string; status: 'Read' | 'Deleted' }) => {
      try {
        const updateData = data.status === 'Read'
          ? { status: data.status, readAt: new Date() }
          : { status: data.status, deletedAt: new Date() };

        await db.update(chats)
          .set(updateData)
          .where(eq(chats.id, data.chatId));

        io.to(data.chatId).emit('messageStatusUpdated', { chatId: data.chatId, status: data.status });
      } catch (error) {
        console.error('Error updating message status:', error);
        socket.emit('error', { message: 'Failed to update message status' });
      }
    });

    // Handle admin viewing chats
    socket.on('adminViewChat', async (data: { chatId: string }) => {
      if (user.type !== 'admin') return socket.emit('error', { message: 'Unauthorized' });

      try {
        const chat = await db.select()
          .from(chats)
          .where(eq(chats.id, data.chatId))
          .limit(1);

        socket.emit('chatDetails', chat[0]);
      } catch (error) {
        console.error('Error fetching chat for admin:', error);
        socket.emit('error', { message: 'Failed to fetch chat' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${user.id} disconnected`);
    });
  });

  return io;
}