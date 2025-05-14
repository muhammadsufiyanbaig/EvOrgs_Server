// src/Features/Photography/Services/customOrderService.ts
import { eq, and, like, between, desc, or, sql } from 'drizzle-orm';
import { DrizzleDB } from '../../../../../Config/db';
import { vendors, users, photographyCustomOrders } from '../../../../../Schema';
import { CreateCustomOrderInput, QuoteOrderInput, SearchOrdersInput } from '../Types';
import { v4 as uuidv4 } from 'uuid';
import { PhotographyCustomOrderModel } from '../model';
export class customPhotographyService {
  constructor(private db: DrizzleDB) {}

async createCustomOrder(input: CreateCustomOrderInput, userId: string) {
  try {
    const orderData = {
      id: uuidv4(),
      userId,
      vendorId: input.vendorId,
      orderDetails: input.orderDetails,
      eventDate: input.eventDate ? new Date(input.eventDate).toISOString() : null,
      eventDuration: input.eventDuration || null,
      price: '0.00', 
      status: 'Requested' as const,
    };

    // const [newOrder] = await this.db
    //   .insert(photographyCustomOrders)
    //   .values(orderData)
    //   .returning();
    const modalClass = new PhotographyCustomOrderModel(this.db);
    const insertedOrder = await modalClass.insertOrder(orderData);
    if (!insertedOrder) {
      throw new Error('Failed to create order');
    }
    return insertedOrder;
  } catch (error) {
    console.error('Error creating custom order:', error);
    throw new Error('Failed to create custom order');
  }
}



  // Get all orders for specific user
  async getUserOrders(userId: string) {
    try {
    const modalClass = new PhotographyCustomOrderModel(this.db);
    const usersOrder = await modalClass.findOrdersByUserId(userId);
    // const orders = await this.db
    if (!usersOrder) {
      throw new Error('Failed to get user order');
    }
    return usersOrder;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch user orders');
    }
  }

  // Get all orders for specific vendor
  async getVendorOrders(vendorId: string) {
    try {
      const modalClass = new PhotographyCustomOrderModel(this.db);
    const vendorsOrder = await modalClass.findOrdersByVendorId(vendorId);
    // const orders = await this.db
    if (!vendorsOrder) {
      throw new Error('Failed to get vendor order');
    }
    return vendorsOrder;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw new Error('Failed to fetch vendor orders');
    }
  }

  // Get order by ID (with authorization check)
  async getOrderById(orderId: string, userId?: string, vendorId?: string) {
    try {
     const modalClass = new PhotographyCustomOrderModel(this.db);
      const order = await modalClass.findOrderById(orderId);
      

      if (!order) {
        throw new Error('Order not found');
      }

      // Check that the user or vendor requesting the order is associated with it
      if (userId && order.userId !== userId && vendorId && order.vendorId !== vendorId) {
        throw new Error('Unauthorized to access this order');
      }

      return order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }

// Quote an order (vendor)
async quoteOrder(input: QuoteOrderInput, vendorId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const order = await modelClass.findQuotableOrder(input.orderId, vendorId);
    
    if (!order) {
      throw new Error('Order not found or cannot be quoted');
    }

    const updatedOrder = await modelClass.updateOrderPriceAndStatus(
      input.orderId,
      input.price.toString(),
      'Quoted'
    );

    return updatedOrder;
  } catch (error) {
    console.error('Error quoting order:', error);
    throw error;
  }
}

// Accept order quote (user)
async acceptOrderQuote(orderId: string, userId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const order = await modelClass.findOrderByIdAndUserWithStatus(
      orderId,
      userId,
      'Quoted'
    );

    if (!order) {
      throw new Error('Order not found or cannot be accepted');
    }

    const updatedOrder = await modelClass.updateOrderStatus(orderId, 'Accepted');
    return updatedOrder;
  } catch (error) {
    console.error('Error accepting order quote:', error);
    throw error;
  }
}

// Reject order quote (user)
async rejectOrderQuote(orderId: string, userId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const order = await modelClass.findOrderByIdAndUserWithStatus(
      orderId,
      userId,
      'Quoted'
    );

    if (!order) {
      throw new Error('Order not found or cannot be rejected');
    }

    const updatedOrder = await modelClass.updateOrderStatus(orderId, 'Rejected');
    return updatedOrder;
  } catch (error) {
    console.error('Error rejecting order quote:', error);
    throw error;
  }
}

// Search orders (for vendors)
async searchOrders(input: SearchOrdersInput, vendorId: string) {
  try {
    // Build all conditions first
    const conditions = [eq(photographyCustomOrders.vendorId, vendorId)];
    
    // Apply status filter if provided
    if (input.status) {
      conditions.push(eq(photographyCustomOrders.status, input.status));
    }

    // Apply date range filter if provided
    if (input.dateFrom && input.dateTo) {
      const fromDate = new Date(input.dateFrom);
      const toDate = new Date(input.dateTo);
      conditions.push(between(photographyCustomOrders.createdAt, fromDate, toDate));
    }

    // Apply search term if provided (search in order details)
    if (input.searchTerm) {
      conditions.push(like(photographyCustomOrders.orderDetails, `%${input.searchTerm}%`));
    }

    const modelClass = new PhotographyCustomOrderModel(this.db);
    const orders = await modelClass.searchOrdersWithConditions(conditions);
    return orders;
  } catch (error) {
    console.error('Error searching orders:', error);
    throw new Error('Failed to search orders');
  }
}

// Get user info for an order
async getUserForOrder(userId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const user = await modelClass.findUserById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user for order:', error);
    return null;
  }
}

// Get vendor info for an order
async getVendorForOrder(vendorId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const vendor = await modelClass.findVendorById(vendorId);
    return vendor;
  } catch (error) {
    console.error('Error fetching vendor for order:', error);
    return null;
  }
}
}