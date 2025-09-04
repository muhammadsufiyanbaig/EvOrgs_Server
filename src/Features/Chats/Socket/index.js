"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeChatSocket = initializeChatSocket;
const socket_io_1 = require("socket.io");
const db_1 = require("../../../Config/db");
const Schema_1 = require("../../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
const JWT_1 = require("../../../Config/auth/JWT");
const uuid_1 = require("uuid");
function initializeChatSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    // Socket middleware for authentication
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication error'));
        try {
            const decoded = (0, JWT_1.verifyToken)(token);
            if (decoded && typeof decoded !== 'string') {
                socket.data.user = { id: decoded.userId, type: decoded.type };
                next();
            }
            else {
                next(new Error('Invalid token'));
            }
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    }));
    io.on('connection', (socket) => {
        const { user } = socket.data;
        // Join user-specific room
        socket.join(user.id);
        // Handle new message
        socket.on('sendMessage', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = (0, uuid_1.v4)();
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
                    status: 'Sent',
                    sentAt: new Date(),
                };
                console.log('Sending message:', messageData);
                // Insert into appropriate table
                if (data.adId) {
                    yield db_1.db.insert(Schema_1.adInquiries).values({
                        id: (0, uuid_1.v4)(),
                        chatId,
                        userId: user.type === 'user' ? user.id : data.receiverId,
                        vendorId: user.type === 'vendor' ? user.id : data.receiverId,
                        adId: data.adId,
                        inquiryText: data.message,
                        status: 'Open',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
                else if (data.serviceType && data.serviceId && data.serviceType !== 'Advertisement') {
                    yield db_1.db.insert(Schema_1.serviceInquiries).values({
                        id: (0, uuid_1.v4)(),
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
                }
                else {
                    yield db_1.db.insert(Schema_1.chats).values(messageData);
                }
                // Emit message to receiver and sender
                io.to(data.receiverId).emit('receiveMessage', messageData);
                io.to(user.id).emit('receiveMessage', Object.assign(Object.assign({}, messageData), { status: 'Delivered' }));
                // Update message status
                yield db_1.db.update(Schema_1.chats)
                    .set({ status: 'Delivered', deliveredAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, chatId));
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        }));
        // Handle message status update
        socket.on('updateMessageStatus', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = data.status === 'Read'
                    ? { status: data.status, readAt: new Date() }
                    : { status: data.status, deletedAt: new Date() };
                yield db_1.db.update(Schema_1.chats)
                    .set(updateData)
                    .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, data.chatId));
                io.to(data.chatId).emit('messageStatusUpdated', { chatId: data.chatId, status: data.status });
            }
            catch (error) {
                console.error('Error updating message status:', error);
                socket.emit('error', { message: 'Failed to update message status' });
            }
        }));
        // Handle admin viewing chats
        socket.on('adminViewChat', (data) => __awaiter(this, void 0, void 0, function* () {
            if (user.type !== 'admin')
                return socket.emit('error', { message: 'Unauthorized' });
            try {
                const chat = yield db_1.db.select()
                    .from(Schema_1.chats)
                    .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, data.chatId))
                    .limit(1);
                socket.emit('chatDetails', chat[0]);
            }
            catch (error) {
                console.error('Error fetching chat for admin:', error);
                socket.emit('error', { message: 'Failed to fetch chat' });
            }
        }));
        socket.on('disconnect', () => {
            console.log(`User ${user.id} disconnected`);
        });
    });
    return io;
}
