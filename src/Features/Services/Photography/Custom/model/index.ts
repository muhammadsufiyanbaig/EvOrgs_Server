// src/Features/Photography/Models/PhotographyCustomOrderModel.ts
import { eq, and, like, between, desc, asc, or, sql, gte, lte, count, ilike } from 'drizzle-orm';
import { DrizzleDB } from '../../../../../Config/db';
import { vendors, users, photographyCustomOrders } from '../../../../../Schema';
import { AdminCustomOrderFilters, CustomOrderListResponse, CustomOrder } from '../Types';
import { v4 as uuidv4 } from 'uuid';

// Database result type
type DbCustomOrder = {
  id: string;
  vendorId: string;
  userId: string;
  orderDetails: string;
  eventDate: string | null;
  eventDuration: number | null;
  price: string;
  status: "Rejected" | "Requested" | "Quoted" | "Accepted" | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Helper function to convert database result to interface
function mapToCustomOrder(dbOrder: DbCustomOrder): CustomOrder {
  return {
    id: dbOrder.id,
    vendorId: dbOrder.vendorId,
    userId: dbOrder.userId,
    orderDetails: dbOrder.orderDetails,
    eventDate: dbOrder.eventDate ? new Date(dbOrder.eventDate) : undefined,
    eventDuration: dbOrder.eventDuration || undefined,
    price: parseFloat(dbOrder.price),
    status: dbOrder.status || 'Requested',
    createdAt: dbOrder.createdAt || new Date(),
    updatedAt: dbOrder.updatedAt || new Date()
  };
}

export class PhotographyCustomOrderModel {
  constructor(private db: DrizzleDB) {}


  async insertOrder(orderData: any) {
    const [newOrder] = await this.db
      .insert(photographyCustomOrders)
      .values(orderData)
      .returning();
    
    return newOrder;
  }

  async findOrdersByUserId(userId: string) {
    const orders = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(eq(photographyCustomOrders.userId, userId))
      .orderBy(desc(photographyCustomOrders.createdAt));
    
    return orders;
  }

  async findOrdersByVendorId(vendorId: string) {
    const orders = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(eq(photographyCustomOrders.vendorId, vendorId))
      .orderBy(desc(photographyCustomOrders.createdAt));
    
    return orders;
  }


  async findOrderById(orderId: string) {
    const [order] = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(eq(photographyCustomOrders.id, orderId))
      .limit(1);
    
    return order;
  }

  async findQuotableOrder(orderId: string, vendorId: string) {
    const [order] = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(
        and(
          eq(photographyCustomOrders.id, orderId),
          eq(photographyCustomOrders.vendorId, vendorId),
          eq(photographyCustomOrders.status, 'Requested')
        )
      )
      .limit(1);
    
    return order;
  }

  async findOrderByIdAndUserWithStatus(
    orderId: string, 
    userId: string, 
    status: "Rejected" | "Requested" | "Quoted" | "Accepted"
  ) {
    const [order] = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(
        and(
          eq(photographyCustomOrders.id, orderId),
          eq(photographyCustomOrders.userId, userId),
          eq(photographyCustomOrders.status, status)
        )
      )
      .limit(1);
    
    return order;
  }

  /**
   * Update an order's price and status
   */
  async updateOrderPriceAndStatus(orderId: string, price: string, status: "Rejected" | "Requested" | "Quoted" | "Accepted") {
    const [updatedOrder] = await this.db
      .update(photographyCustomOrders)
      .set({
        price: price,
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(photographyCustomOrders.id, orderId))
      .returning();
    
    return updatedOrder;
  }

  async updateOrderStatus(orderId: string, status: "Rejected" | "Requested" | "Quoted" | "Accepted") {
    const [updatedOrder] = await this.db
      .update(photographyCustomOrders)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(photographyCustomOrders.id, orderId))
      .returning();
    
    return updatedOrder;
  }

  async searchOrdersWithConditions(conditions: any[]) {
    const orders = await this.db
      .select()
      .from(photographyCustomOrders)
      .where(and(...conditions))
      .orderBy(desc(photographyCustomOrders.createdAt));
    
    return orders;
  }

  async findUserById(userId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return user;
  }

  async findVendorById(vendorId: string) {
    const [vendor] = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);
    
    return vendor;
  }

  // Admin functionality - Get all orders with filters and pagination
  async getAllOrdersForAdmin(filters: AdminCustomOrderFilters = {}): Promise<CustomOrderListResponse> {
    const {
      vendorId,
      userId,
      status,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      startDate,
      endDate,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy = 'created_at_desc'
    } = filters;

    const offset = (page - 1) * limit;
    
    // Build conditions array
    const conditions: any[] = [];
    
    if (vendorId) {
      conditions.push(eq(photographyCustomOrders.vendorId, vendorId));
    }
    
    if (userId) {
      conditions.push(eq(photographyCustomOrders.userId, userId));
    }
    
    if (status) {
      conditions.push(eq(photographyCustomOrders.status, status));
    }
    
    if (minPrice !== undefined) {
      conditions.push(gte(photographyCustomOrders.price, minPrice.toString()));
    }
    
    if (maxPrice !== undefined) {
      conditions.push(lte(photographyCustomOrders.price, maxPrice.toString()));
    }
    
    if (minDuration !== undefined) {
      conditions.push(gte(photographyCustomOrders.eventDuration, minDuration));
    }
    
    if (maxDuration !== undefined) {
      conditions.push(lte(photographyCustomOrders.eventDuration, maxDuration));
    }
    
    if (startDate) {
      const start = new Date(startDate);
      conditions.push(gte(photographyCustomOrders.eventDate, start.toISOString().split('T')[0]));
    }
    
    if (endDate) {
      const end = new Date(endDate);
      conditions.push(lte(photographyCustomOrders.eventDate, end.toISOString().split('T')[0]));
    }
    
    if (searchTerm) {
      conditions.push(ilike(photographyCustomOrders.orderDetails, `%${searchTerm}%`));
    }

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'price_asc':
        orderBy = asc(photographyCustomOrders.price);
        break;
      case 'price_desc':
        orderBy = desc(photographyCustomOrders.price);
        break;
      case 'event_date_asc':
        orderBy = asc(photographyCustomOrders.eventDate);
        break;
      case 'event_date_desc':
        orderBy = desc(photographyCustomOrders.eventDate);
        break;
      case 'duration_asc':
        orderBy = asc(photographyCustomOrders.eventDuration);
        break;
      case 'duration_desc':
        orderBy = desc(photographyCustomOrders.eventDuration);
        break;
      case 'created_at_asc':
        orderBy = asc(photographyCustomOrders.createdAt);
        break;
      case 'created_at_desc':
      default:
        orderBy = desc(photographyCustomOrders.createdAt);
        break;
    }

    // Get orders with pagination
    const ordersPromise = this.db.select()
      .from(photographyCustomOrders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountPromise = this.db.select({
      count: sql<number>`cast(count(*) as integer)`
    })
    .from(photographyCustomOrders)
    .where(conditions.length ? and(...conditions) : undefined);

    // Execute both queries in parallel
    const [dbOrders, [{ count: total }]] = await Promise.all([ordersPromise, totalCountPromise]);

    // Convert database results to interface format
    const orders = dbOrders.map(order => mapToCustomOrder(order as DbCustomOrder));

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    };
  }

  // Admin functionality - Update order status
  async updateOrderStatusByAdmin(orderId: string, status: "Rejected" | "Requested" | "Quoted" | "Accepted"): Promise<any> {
    const [updatedOrder] = await this.db
      .update(photographyCustomOrders)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(photographyCustomOrders.id, orderId))
      .returning();
    
    return updatedOrder;
  }

  // Admin functionality - Delete order
  async deleteOrderByAdmin(orderId: string): Promise<boolean> {
    const result = await this.db
      .delete(photographyCustomOrders)
      .where(eq(photographyCustomOrders.id, orderId))
      .returning();

    return result.length > 0;
  }
}