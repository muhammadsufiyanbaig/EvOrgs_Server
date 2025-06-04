export interface SupportTicket {
  id: string;
  userId?: string;
  vendorId?: string;
  subject: string;
  description: string;
  ticketType: "Account" | "Booking" | "Payment" | "Technical" | "Feature" | "Other";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  adminId?: string;
  userId?: string;
  vendorId?: string;
  responseText: string;
  attachments: string[];
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  ticketType: "Account" | "Booking" | "Payment" | "Technical" | "Feature" | "Other";
  attachments?: string[];
}

export interface UpdateTicketInput {
  id: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  status?: "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";
}

export interface CreateResponseInput {
  ticketId: string;
  responseText: string;
  attachments?: string[];
  isInternal?: boolean;
}