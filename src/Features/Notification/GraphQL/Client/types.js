"use strict";
// TypeScript types for Notification System Client-Side GraphQL Operations
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortOrder = exports.RelatedType = exports.NotificationPriority = exports.NotificationCategory = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["General"] = "General";
    NotificationType["All_Vendors"] = "All_Vendors";
    NotificationType["Vendor_Personal"] = "Vendor_Personal";
    NotificationType["All_Users"] = "All_Users";
    NotificationType["User_Personal"] = "User_Personal";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["Booking"] = "Booking";
    NotificationCategory["Payment"] = "Payment";
    NotificationCategory["System"] = "System";
    NotificationCategory["Chat"] = "Chat";
    NotificationCategory["Promotion"] = "Promotion";
    NotificationCategory["General"] = "General";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["low"] = "low";
    NotificationPriority["medium"] = "medium";
    NotificationPriority["high"] = "high";
    NotificationPriority["urgent"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var RelatedType;
(function (RelatedType) {
    RelatedType["Booking"] = "Booking";
    RelatedType["Payment"] = "Payment";
    RelatedType["Chat"] = "Chat";
    RelatedType["Review"] = "Review";
    RelatedType["User"] = "User";
    RelatedType["Vendor"] = "Vendor";
})(RelatedType || (exports.RelatedType = RelatedType = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
