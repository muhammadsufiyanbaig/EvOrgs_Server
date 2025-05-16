// src/Features/Photography/Models/PhotographyCustomOrderModel.ts
import { eq, and, like, between, desc, or, sql } from 'drizzle-orm';
import { DrizzleDB } from '../../../../../Config/db';
import { vendors, users, photographyCustomOrders } from '../../../../../Schema';
import { v4 as uuidv4 } from 'uuid';

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
}