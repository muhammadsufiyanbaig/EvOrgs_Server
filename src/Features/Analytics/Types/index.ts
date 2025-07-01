// ===================== TYPES & INTERFACES =====================

// Analytics Event Types
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  vendorId?: string;
  objectId?: string;
  objectType?: string;
  metadata?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface CreateAnalyticsEventInput {
  eventType: string;
  objectId?: string;
  objectType?: string;
  metadata?: string;
}

// Report Types
export interface Report {
  id: string;
  reportName: string;
  reportType: "System" | "Vendor" | "Revenue" | "Booking" | "Custom";
  generatedBy?: string;
  dateRange?: string;
  parameters?: string;
  reportFormat: "PDF" | "CSV" | "Excel" | "JSON";
  reportUrl?: string;
  status: "Generating" | "Generated" | "Failed";
  isScheduled: boolean;
  scheduleFrequency?: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportInput {
  reportName: string;
  reportType: "System" | "Vendor" | "Revenue" | "Booking" | "Custom";
  dateRange?: string;
  parameters?: string;
  reportFormat?: "PDF" | "CSV" | "Excel" | "JSON";
  isScheduled?: boolean;
  scheduleFrequency?: "Daily" | "Weekly" | "Monthly" | "Quarterly";
}

export interface ReportFilters {
  reportType?: "System" | "Vendor" | "Revenue" | "Booking" | "Custom";
  status?: "Generating" | "Generated" | "Failed";
  isScheduled?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
