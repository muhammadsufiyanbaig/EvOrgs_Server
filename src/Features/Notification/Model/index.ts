import { eq, and, or, desc, asc, count, sql, inArray } from 'drizzle-orm';
import { notifications, notificationReadStatus, users, vendors, admin } from '../../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { CreateNotificationInput, Notification, FCMResponse, NotificationResponse, NotificationFilter, PaginationInput, NotificationContext } from '../Types';

export class NotificationModel {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getNotifications(
    filter: NotificationFilter | undefined,
    pagination: PaginationInput | undefined,
    context: NotificationContext
  ): Promise<NotificationResponse> {
    const { user, vendor, Admin } = context;
    const page = pagination?.page ?? 1;
    const limit = Math.min(pagination?.limit ?? 10, 100);
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];
    if (user) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Users'),
          and(
            eq(notifications.notificationType, 'User Personal'),
            eq(notifications.targetUserId, user.id)
          )
        )
      );
    } else if (vendor) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Vendors'),
          and(
            eq(notifications.notificationType, 'Vendor Personal'),
            eq(notifications.targetVendorId, vendor.id)
          )
        )
      );
    } else if (Admin) {
      whereConditions.push(eq(notifications.isActive, true));
    }

    if (filter) {
      if (filter.category) whereConditions.push(eq(notifications.category, filter.category as any));
      if (filter.priority) whereConditions.push(eq(notifications.priority, filter.priority));
      if (filter.dateFrom) whereConditions.push(sql`${notifications.createdAt} >= ${filter.dateFrom}`);
      if (filter.dateTo) whereConditions.push(sql`${notifications.createdAt} <= ${filter.dateTo}`);
    }

    const totalResult = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(and(...whereConditions));
    const total = totalResult[0]?.count ?? 0;

    const validSortColumns: Record<string, any> = {
      createdAt: notifications.createdAt,
      updatedAt: notifications.updatedAt,
      title: notifications.title,
      notificationType: notifications.notificationType,
      category: notifications.category,
      priority: notifications.priority,
      sentAt: notifications.sentAt,
    };

    const sortBy = pagination?.sortBy && validSortColumns[pagination.sortBy] ? pagination.sortBy : 'createdAt';
    const sortOrder = pagination?.sortOrder?.toUpperCase() === 'ASC' ? asc : desc;
    const orderByColumn = validSortColumns[sortBy];

    const notificationList = await this.db
      .select()
      .from(notifications)
      .where(and(...whereConditions))
      .orderBy(sortOrder(orderByColumn))
      .limit(limit)
      .offset(offset);

    const notificationIds = notificationList.map((n: any) => n.id);
    let readStatuses: any[] = [];
    if (notificationIds.length > 0) {
      readStatuses = await this.db
        .select()
        .from(notificationReadStatus)
        .where(
          and(
            inArray(notificationReadStatus.notificationId, notificationIds),
            user ? eq(notificationReadStatus.userId, user.id) :
            vendor ? eq(notificationReadStatus.vendorId, vendor.id) :
            Admin ? eq(notificationReadStatus.adminId, Admin.id) : sql`false`
          )
        );
    }

    const notificationsWithReadStatus = notificationList.map((notification: any) => ({
      ...notification,
      isRead: readStatuses.some((rs: any) => rs.notificationId === notification.id),
      readAt: readStatuses.find((rs: any) => rs.notificationId === notification.id)?.readAt
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      notifications: notificationsWithReadStatus,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async getAllNotifications(
    filter: NotificationFilter | undefined,
    pagination: PaginationInput | undefined
  ): Promise<NotificationResponse> {
    const page = pagination?.page || 1;
    const limit = Math.min(pagination?.limit || 10, 100);
    const offset = (page - 1) * limit;

    let whereConditions: any[] = [];
    if (filter) {
      if (filter.notificationType) whereConditions.push(eq(notifications.notificationType, filter.notificationType));
      if (filter.category) whereConditions.push(eq(notifications.category, filter.category as any));
      if (filter.priority) whereConditions.push(eq(notifications.priority, filter.priority));
      if (filter.isActive !== undefined) whereConditions.push(eq(notifications.isActive, filter.isActive));
      if (filter.createdBy) whereConditions.push(eq(notifications.createdBy, filter.createdBy));
      if (filter.dateFrom) whereConditions.push(sql`${notifications.createdAt} >= ${filter.dateFrom}`);
      if (filter.dateTo) whereConditions.push(sql`${notifications.createdAt} <= ${filter.dateTo}`);
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    const totalResult = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(whereClause);
    const total = totalResult[0]?.count || 0;

    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || 'DESC';
    const orderByFn = sortOrder === 'ASC' ? asc : desc;
    
    const validSortColumns: Record<string, any> = {
      createdAt: notifications.createdAt,
      updatedAt: notifications.updatedAt,
      title: notifications.title,
      notificationType: notifications.notificationType,
      category: notifications.category,
      priority: notifications.priority,
      sentAt: notifications.sentAt,
    };
    
    const orderByColumn = validSortColumns[sortBy] || notifications.createdAt;

    const notificationList = await this.db
      .select()
      .from(notifications)
      .where(whereClause)
      .orderBy(orderByFn(orderByColumn))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications: notificationList,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }

  async getNotification(id: string): Promise<Notification | null> {
    const notification = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);
    return notification[0] || null;
  }

  async getUnreadCount(context: NotificationContext): Promise<number> {
    const { user, vendor, Admin } = context;
    let whereConditions: any[] = [];

    if (user) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Users'),
          and(
            eq(notifications.notificationType, 'User Personal'),
            eq(notifications.targetUserId, user.id)
          )
        )
      );
    } else if (vendor) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Vendors'),
          and(
            eq(notifications.notificationType, 'Vendor Personal'),
            eq(notifications.targetVendorId, vendor.id)
          )
        )
      );
    } else if (Admin) {
      whereConditions.push(eq(notifications.isActive, true));
    }

    const accessibleNotifications = await this.db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(...whereConditions));

    if (accessibleNotifications.length === 0) return 0;

    const notificationIds = accessibleNotifications.map((n: any) => n.id);
    const readNotifications = await this.db
      .select({ notificationId: notificationReadStatus.notificationId })
      .from(notificationReadStatus)
      .where(
        and(
          inArray(notificationReadStatus.notificationId, notificationIds),
          user ? eq(notificationReadStatus.userId, user.id) :
          vendor ? eq(notificationReadStatus.vendorId, vendor.id) :
          Admin ? eq(notificationReadStatus.adminId, Admin.id) : sql`false`
        )
      );

    const readNotificationIds = readNotifications.map((rn: any) => rn.notificationId);
    return notificationIds.length - readNotificationIds.length;
  }

  async getNotificationStats(dateFrom: Date | undefined, dateTo: Date | undefined) {
    let whereConditions: any[] = [];
    if (dateFrom) whereConditions.push(sql`${notifications.createdAt} >= ${dateFrom}`);
    if (dateTo) whereConditions.push(sql`${notifications.createdAt} <= ${dateTo}`);
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const totalResult = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(whereClause);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayResult = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          sql`${notifications.createdAt} >= ${today}`,
          sql`${notifications.createdAt} < ${tomorrow}`,
          whereClause
        )
      );

    const categoryStats = await this.db
      .select({
        category: notifications.category,
        count: count()
      })
      .from(notifications)
      .where(whereClause)
      .groupBy(notifications.category);

    const typeStats = await this.db
      .select({
        type: notifications.notificationType,
        count: count()
      })
      .from(notifications)
      .where(whereClause)
      .groupBy(notifications.notificationType);

    return {
      totalNotifications: totalResult[0]?.count || 0,
      totalSentToday: todayResult[0]?.count || 0,
      totalReadToday: 0,
      totalUnread: 0,
      byCategory: categoryStats.map((stat: any) => ({
        category: stat.category,
        count: stat.count
      })),
      byType: typeStats.map((stat: any) => ({
        type: stat.type,
        count: stat.count
      }))
    };
  }

  async createNotification(input: CreateNotificationInput, adminId: string): Promise<Notification> {
    const notificationId = uuidv4();
    const now = new Date();
    const newNotification = await this.db
      .insert(notifications)
      .values({
        id: notificationId,
        notificationType: input.notificationType,
        targetUserId: input.targetUserId,
        targetVendorId: input.targetVendorId,
        title: input.title,
        message: input.message,
        category: input.category,
        data: input.data,
        linkTo: input.linkTo,
        relatedId: input.relatedId,
        relatedType: input.relatedType,
        priority: input.priority || 'medium',
        isActive: true,
        scheduledAt: input.scheduledAt,
        createdBy: adminId,
        createdAt: now,
        updatedAt: now,
        totalRecipients: 0,
        successfulSends: 0,
        failedSends: 0
      })
      .returning();
    return newNotification[0];
  }

  async getUser(id: string) {
    const userRecord = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return userRecord[0] || null;
  }

  async getVendor(id: string) {
    const vendorRecord = await this.db
      .select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1);
    return vendorRecord[0] || null;
  }

  async updateNotificationSendStatus(id: string, result: FCMResponse): Promise<void> {
    await this.db
      .update(notifications)
      .set({
        sentAt: new Date(),
        totalRecipients: result.successCount! + result.failureCount!,
        successfulSends: result.successCount,
        failedSends: result.failureCount,
        updatedAt: new Date()
      })
      .where(eq(notifications.id, id));
  }

  async markAsRead(notificationId: string, context: NotificationContext): Promise<boolean> {
    const { user, vendor, Admin } = context;
    const existingRead = await this.db
      .select()
      .from(notificationReadStatus)
      .where(
        and(
          eq(notificationReadStatus.notificationId, notificationId),
          user ? eq(notificationReadStatus.userId, user.id) :
          vendor ? eq(notificationReadStatus.vendorId, vendor.id) :
          Admin ? eq(notificationReadStatus.adminId, Admin.id) : sql`false`
        )
      )
      .limit(1);

    if (existingRead[0]) return true;

    const readAt = new Date();
    await this.db
      .insert(notificationReadStatus)
      .values({
        id: uuidv4(),
        notificationId,
        userId: user?.id,
        vendorId: vendor?.id,
        adminId: Admin?.id,
        readAt
      });
    return true;
  }

  async markMultipleAsRead(notificationIds: string[], context: NotificationContext): Promise<boolean> {
    const { user, vendor, Admin } = context;
    if (!notificationIds || notificationIds.length === 0) return true;

    const existingReads = await this.db
      .select({ notificationId: notificationReadStatus.notificationId })
      .from(notificationReadStatus)
      .where(
        and(
          inArray(notificationReadStatus.notificationId, notificationIds),
          user ? eq(notificationReadStatus.userId, user.id) :
          vendor ? eq(notificationReadStatus.vendorId, vendor.id) :
          Admin ? eq(notificationReadStatus.adminId, Admin.id) : sql`false`
        )
      );

    const alreadyReadIds = existingReads.map((er: any) => er.notificationId);
    const unreadIds = notificationIds.filter(id => !alreadyReadIds.includes(id));

    if (unreadIds.length === 0) return true;

    const readAt = new Date();
    const readStatusRecords = unreadIds.map(notificationId => ({
      id: uuidv4(),
      notificationId,
      userId: user?.id,
      vendorId: vendor?.id,
      adminId: Admin?.id,
      readAt
    }));

    await this.db
      .insert(notificationReadStatus)
      .values(readStatusRecords);
    return true;
  }

  async markAllAsRead(context: NotificationContext): Promise<boolean> {
    const { user, vendor, Admin } = context;
    let whereConditions: any[] = [];

    if (user) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Users'),
          and(
            eq(notifications.notificationType, 'User Personal'),
            eq(notifications.targetUserId, user.id)
          )
        )
      );
    } else if (vendor) {
      whereConditions.push(
        or(
          eq(notifications.notificationType, 'General'),
          eq(notifications.notificationType, 'All Vendors'),
          and(
            eq(notifications.notificationType, 'Vendor Personal'),
            eq(notifications.targetVendorId, vendor.id)
          )
        )
      );
    } else if (Admin) {
      whereConditions.push(eq(notifications.isActive, true));
    }

    const accessibleNotifications = await this.db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(...whereConditions));

    if (accessibleNotifications.length === 0) return true;

    const notificationIds = accessibleNotifications.map((n: any) => n.id);
    const existingReads = await this.db
      .select({ notificationId: notificationReadStatus.notificationId })
      .from(notificationReadStatus)
      .where(
        and(
          inArray(notificationReadStatus.notificationId, notificationIds),
          user ? eq(notificationReadStatus.userId, user.id) :
          vendor? eq(notificationReadStatus.vendorId, vendor.id) :
          Admin ? eq(notificationReadStatus.adminId, Admin.id) : sql`false`
        )
      );

    const alreadyReadIds = existingReads.map((er: any) => er.notificationId);
    const unreadIds = notificationIds.filter((id: any) => !alreadyReadIds.includes(id));

    if (unreadIds.length === 0) return true;

    const readAt = new Date();
    const readStatusRecords = unreadIds.map((notificationId: any) => ({
      id: uuidv4(),
      notificationId,
      userId: user?.id,
      vendorId: vendor?.id,
      adminId: Admin?.id,
      readAt
    }));

    await this.db
      .insert(notificationReadStatus)
      .values(readStatusRecords);
    return true;
  }

  async updateFCMToken(input: { userId?: string; vendorId?: string; token: string }, context: NotificationContext): Promise<boolean> {
    const { user, vendor } = context;
    if (user || input.userId) {
      const targetUserId = input.userId || user!.id;
      const userRecord = await this.db
        .select({ fcmToken: users.fcmToken })
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1);

      if (!userRecord[0]) return false;

      const currentTokens = userRecord[0].fcmToken || [];
      const updatedTokens = currentTokens.includes(input.token) 
        ? currentTokens 
        : [...currentTokens, input.token];

      await this.db
        .update(users)
        .set({ 
          fcmToken: updatedTokens.slice(-10),
          updatedAt: new Date()
        })
        .where(eq(users.id, targetUserId));
    }

    if (vendor || input.vendorId) {
      const targetVendorId = input.vendorId || vendor!.id;
      const vendorRecord = await this.db
        .select({ fcmToken: vendors.fcmToken })
        .from(vendors)
        .where(eq(vendors.id, targetVendorId))
        .limit(1);

      if (!vendorRecord[0]) return false;

      const currentTokens = vendorRecord[0].fcmToken || [];
      const updatedTokens = currentTokens.includes(input.token) 
        ? currentTokens 
        : [...currentTokens, input.token];

      await this.db
        .update(vendors)
        .set({ 
          fcmToken: updatedTokens.slice(-10),
          updatedAt: new Date()
        })
        .where(eq(vendors.id, targetVendorId));
    }
    return true;
  }

  async getTestNotificationTokens(targetUserId?: string, targetVendorId?: string): Promise<string[]> {
    let tokens: string[] = [];
    if (targetUserId) {
      const userRecord = await this.db
        .select({ fcmToken: users.fcmToken })
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1);
      if (userRecord[0]?.fcmToken) tokens.push(...userRecord[0].fcmToken);
    }
    if (targetVendorId) {
      const vendorRecord = await this.db
        .select({ fcmToken: vendors.fcmToken })
        .from(vendors)
        .where(eq(vendors.id, targetVendorId))
        .limit(1);
      if (vendorRecord[0]?.fcmToken) tokens.push(...vendorRecord[0].fcmToken);
    }
    return tokens;
  }

  async getTargetUser(parent: Notification) {
    if (!parent.targetUserId) return null;
    const userRecord = await this.db
      .select()
      .from(users)
      .where(eq(users.id, parent.targetUserId))
      .limit(1);
    return userRecord[0] || null;
  }

  async getTargetVendor(parent: Notification) {
    if (!parent.targetVendorId) return null;
    const vendorRecord = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, parent.targetVendorId))
      .limit(1);
    return vendorRecord[0] || null;
  }

  async getCreator(parent: Notification) {
    if (!parent.createdBy) return null;
    const adminRecord = await this.db
      .select()
      .from(admin)
      .where(eq(admin.id, parent.createdBy))
      .limit(1);
    return adminRecord[0] || null;
  }

  async getRecipientTokens(notification: Notification): Promise<string[]> {
    let tokens: string[] = [];
    switch (notification.notificationType) {
      case 'General':
        const allUsers = await this.db.select({ fcmToken: users.fcmToken }).from(users);
        const allVendors = await this.db.select({ fcmToken: vendors.fcmToken }).from(vendors);
        allUsers.forEach((user: any) => {
          if (user.fcmToken) tokens.push(...user.fcmToken);
        });
        allVendors.forEach((vendor: any) => {
          if (vendor.fcmToken) tokens.push(...vendor.fcmToken);
        });
        break;
      case 'All Users':
        const usersData = await this.db.select({ fcmToken: users.fcmToken }).from(users);
        usersData.forEach((user: any) => {
          if (user.fcmToken) tokens.push(...user.fcmToken);
        });
        break;
      case 'All Vendors':
        const vendorsData = await this.db.select({ fcmToken: vendors.fcmToken }).from(vendors);
        vendorsData.forEach((vendor: any) => {
          if (vendor.fcmToken) tokens.push(...vendor.fcmToken);
        });
        break;
      case 'User Personal':
        if (notification.targetUserId) {
          const userData = await this.db
            .select({ fcmToken: users.fcmToken })
            .from(users)
            .where(eq(users.id, notification.targetUserId))
            .limit(1);
          if (userData[0]?.fcmToken) tokens.push(...userData[0].fcmToken);
        }
        break;
      case 'Vendor Personal':
        if (notification.targetVendorId) {
          const vendorData = await this.db
            .select({ fcmToken: vendors.fcmToken })
            .from(vendors)
            .where(eq(vendors.id, notification.targetVendorId))
            .limit(1);
          if (vendorData[0]?.fcmToken) tokens.push(...vendorData[0].fcmToken);
        }
        break;
    }
    return [...new Set(tokens)];
  }
}