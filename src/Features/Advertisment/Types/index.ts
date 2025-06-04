export interface AdRequest {
  id: string;
  vendorId: string;
  adType: 'Featured' | 'Sponsored' | 'Premium';
  entityType: 'Farmhouse' | 'Venue' | 'Photography Package' | 'Catering Package';
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: string;
  requestedPrice: number;
  requestedStartDate: Date;
  requestedEndDate: Date;
  requestedDuration: number;
  targetAudience?: string[];
  vendorNotes?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under_Review';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceAd {
  id: string;
  requestId: string;
  vendorId: string;
  adType: 'Featured' | 'Sponsored' | 'Premium';
  entityType: 'Farmhouse' | 'Venue' | 'Photography Package' | 'Catering Package';
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: string;
  finalPrice: number;
  status: 'Scheduled' | 'Active' | 'Paused' | 'Expired' | 'Cancelled';
  adminStartDate: Date;
  adminEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  impressionCount: number;
  clickCount: number;
  conversionCount: number;
  targetAudience?: string[];
  scheduledBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExternalAd {
  id: string;
  advertiserName: string;
  advertiserEmail: string;
  advertiserPhone?: string;
  imageUrl: string;
  redirectUrl: string;
  adTitle: string;
  adDescription?: string;
  price: number;
  status: 'Active' | 'Inactive' | 'Expired';
  startDate?: Date;
  endDate?: Date;
  impressionCount: number;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdPayment {
  id: string;
  adId?: string;
  externalAdId?: string;
  vendorId?: string;
  amountPaid: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Mobile Payment' | 'Other';
  transactionId?: string;
  paidAt?: Date;
  invoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}