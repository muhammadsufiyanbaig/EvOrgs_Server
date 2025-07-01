// ===================== GRAPHQL SCHEMA =====================

export const analyticsTypeDefs = `
  # Analytics Event Types
  type AnalyticsEvent {
    id: ID!
    eventType: String!
    userId: ID
    vendorId: ID
    objectId: ID
    objectType: String
    metadata: String
    ipAddress: String
    createdAt: String!
  }

  input CreateAnalyticsEventInput {
    eventType: String!
    objectId: ID
    objectType: String
    metadata: String
  }

  # Report Types
  type Report {
    id: ID!
    reportName: String!
    reportType: ReportType!
    generatedBy: ID
    dateRange: String
    parameters: String
    reportFormat: ReportFormat!
    reportUrl: String
    status: ReportStatus!
    isScheduled: Boolean!
    scheduleFrequency: ScheduleFrequency
    createdAt: String!
    updatedAt: String!
  }

  input CreateReportInput {
    reportName: String!
    reportType: ReportType!
    dateRange: String
    parameters: String
    reportFormat: ReportFormat
    isScheduled: Boolean
    scheduleFrequency: ScheduleFrequency
  }

  input ReportFilters {
    reportType: ReportType
    status: ReportStatus
    isScheduled: Boolean
    dateFrom: String
    dateTo: String
  }

  # Enums
  enum ReportType {
    System
    Vendor
    Revenue
    Booking
    Custom
  }

  enum ReportFormat {
    PDF
    CSV
    Excel
    JSON
  }

  enum ReportStatus {
    Generating
    Generated
    Failed
  }

  enum ScheduleFrequency {
    Daily
    Weekly
    Monthly
    Quarterly
  }

  # Analytics Statistics
  type AnalyticsStats {
    totalEvents: Int!
    eventsByType: [EventTypeCount!]!
    eventsByDate: [EventDateCount!]!
    topUsers: [UserEventCount!]!
    topVendors: [VendorEventCount!]!
  }

  type EventTypeCount {
    eventType: String!
    count: Int!
  }

  type EventDateCount {
    date: String!
    count: Int!
  }

  type UserEventCount {
    userId: ID!
    count: Int!
  }

  type VendorEventCount {
    vendorId: ID!
    count: Int!
  }

  # Queries
  extend type Query {
    # Analytics Events
    getAnalyticsEvents(limit: Int, offset: Int, eventType: String, dateFrom: String, dateTo: String): [AnalyticsEvent!]!
    getAnalyticsStats(dateFrom: String, dateTo: String): AnalyticsStats!
    
    # Reports
    getReports(filters: ReportFilters, limit: Int, offset: Int): [Report!]!
    getReport(id: ID!): Report
    getMyReports(limit: Int, offset: Int): [Report!]!
    getScheduledReports: [Report!]!
  }

  # Mutations
  extend type Mutation {
    # Analytics Events
    trackEvent(input: CreateAnalyticsEventInput!): AnalyticsEvent!
    
    # Reports
    createReport(input: CreateReportInput!): Report!
    updateReport(id: ID!, input: CreateReportInput!): Report!
    deleteReport(id: ID!): Boolean!
    generateReport(id: ID!): Report!
    downloadReport(id: ID!): String!
  }
`;