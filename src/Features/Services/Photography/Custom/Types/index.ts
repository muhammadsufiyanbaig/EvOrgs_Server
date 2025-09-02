// src/Features/Photography/Types/index.ts
export interface CustomOrder {
  id: string;
  vendorId: string;
  userId: string;
  orderDetails: string;
  eventDate?: Date;
  eventDuration?: number;
  price?: number;
  status: 'Requested' | 'Quoted' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomOrderInput {
  eventDate?: string;
  eventDuration?: number;
  orderDetails: string;
  vendorId: string;
}

export interface QuoteOrderInput {
  orderId: string;
  price: number;
}

export interface SearchOrdersInput {
  status?: 'Requested' | 'Quoted' | 'Accepted' | 'Rejected';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface AdminCustomOrderFilters {
  vendorId?: string;
  userId?: string;
  status?: 'Requested' | 'Quoted' | 'Accepted' | 'Rejected';
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at_asc' | 'created_at_desc' | 'price_asc' | 'price_desc' | 'event_date_asc' | 'event_date_desc' | 'duration_asc' | 'duration_desc';
}

export interface CustomOrderListResponse {
  orders: CustomOrder[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}