// src/Features/Photography/Services/customOrderService.ts
import { eq, and, like, between, desc, or, sql } from 'drizzle-orm';
import { DrizzleDB } from '../../../../../Config/db';
import { vendors, users, photographyCustomOrders } from '../../../../../Schema';
import { CreateCustomOrderInput, QuoteOrderInput, SearchOrdersInput, AdminCustomOrderFilters, CustomOrderListResponse } from '../Types';
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

// Admin functionality - Get all orders with filters and pagination
async getAllOrdersForAdmin(filters: AdminCustomOrderFilters = {}): Promise<CustomOrderListResponse> {
  // Input validation
  if (filters.minPrice !== undefined && filters.minPrice < 0) {
    throw new Error('Minimum price cannot be negative');
  }

  if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
    throw new Error('Maximum price cannot be negative');
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
    throw new Error('Minimum price cannot be greater than maximum price');
  }

  if (filters.minDuration !== undefined && filters.minDuration < 0) {
    throw new Error('Minimum duration cannot be negative');
  }

  if (filters.maxDuration !== undefined && filters.maxDuration < 0) {
    throw new Error('Maximum duration cannot be negative');
  }

  if (filters.minDuration !== undefined && filters.maxDuration !== undefined && filters.minDuration > filters.maxDuration) {
    throw new Error('Minimum duration cannot be greater than maximum duration');
  }

  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }

  if (filters.page !== undefined && filters.page < 1) {
    throw new Error('Page number must be positive');
  }

  if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
    throw new Error('Limit must be between 1 and 100');
  }

  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    return await modelClass.getAllOrdersForAdmin(filters);
  } catch (error) {
    console.error('Error fetching all orders for admin:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Admin functionality - Get a specific order by ID (no ownership check)
async getOrderByIdForAdmin(orderId: string) {
  try {
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const order = await modelClass.findOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.error('Error fetching order by ID for admin:', error);
    throw error;
  }
}

// Admin functionality - Update order status
async updateOrderStatusByAdmin(orderId: string, status: "Rejected" | "Requested" | "Quoted" | "Accepted") {
  try {
    // Check if order exists
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const existingOrder = await modelClass.findOrderById(orderId);
    
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    return await modelClass.updateOrderStatusByAdmin(orderId, status);
  } catch (error) {
    console.error('Error updating order status by admin:', error);
    throw error;
  }
}

// Admin functionality - Delete order
async deleteOrderByAdmin(orderId: string): Promise<boolean> {
  try {
    // Check if order exists
    const modelClass = new PhotographyCustomOrderModel(this.db);
    const existingOrder = await modelClass.findOrderById(orderId);
    
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    return await modelClass.deleteOrderByAdmin(orderId);
  } catch (error) {
    console.error('Error deleting order by admin:', error);
    throw error;
  }
}
}