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