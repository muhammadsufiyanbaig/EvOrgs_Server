"use strict";
// ==================== ENUM TYPES ====================
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIORITY_LABELS = exports.SCHEDULE_STATUS_COLORS = exports.DAYS_OF_WEEK = exports.PaymentMethod = exports.PaymentStatus = exports.ExternalAdStatus = exports.ServiceAdStatus = exports.RequestStatus = exports.EntityType = exports.ScheduleStatus = exports.AdType = void 0;
var AdType;
(function (AdType) {
    AdType["Featured"] = "Featured";
    AdType["Sponsored"] = "Sponsored";
    AdType["Premium"] = "Premium";
})(AdType || (exports.AdType = AdType = {}));
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["SCHEDULED"] = "Scheduled";
    ScheduleStatus["RUNNING"] = "Running";
    ScheduleStatus["COMPLETED"] = "Completed";
    ScheduleStatus["FAILED"] = "Failed";
    ScheduleStatus["CANCELLED"] = "Cancelled";
    ScheduleStatus["PAUSED"] = "Paused";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
var EntityType;
(function (EntityType) {
    EntityType["Farmhouse"] = "Farmhouse";
    EntityType["Venue"] = "Venue";
    EntityType["PhotographyPackage"] = "PhotographyPackage";
    EntityType["CateringPackage"] = "CateringPackage";
})(EntityType || (exports.EntityType = EntityType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Pending"] = "Pending";
    RequestStatus["Approved"] = "Approved";
    RequestStatus["Rejected"] = "Rejected";
    RequestStatus["Under_Review"] = "Under_Review";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var ServiceAdStatus;
(function (ServiceAdStatus) {
    ServiceAdStatus["Scheduled"] = "Scheduled";
    ServiceAdStatus["Active"] = "Active";
    ServiceAdStatus["Paused"] = "Paused";
    ServiceAdStatus["Expired"] = "Expired";
    ServiceAdStatus["Cancelled"] = "Cancelled";
})(ServiceAdStatus || (exports.ServiceAdStatus = ServiceAdStatus = {}));
var ExternalAdStatus;
(function (ExternalAdStatus) {
    ExternalAdStatus["Active"] = "Active";
    ExternalAdStatus["Inactive"] = "Inactive";
    ExternalAdStatus["Expired"] = "Expired";
})(ExternalAdStatus || (exports.ExternalAdStatus = ExternalAdStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "Pending";
    PaymentStatus["Paid"] = "Paid";
    PaymentStatus["Failed"] = "Failed";
    PaymentStatus["Refunded"] = "Refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CreditCard"] = "CreditCard";
    PaymentMethod["DebitCard"] = "DebitCard";
    PaymentMethod["BankTransfer"] = "BankTransfer";
    PaymentMethod["MobilePayment"] = "MobilePayment";
    PaymentMethod["Other"] = "Other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// ==================== TIME SLOT CONSTANTS ====================
exports.DAYS_OF_WEEK = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
exports.SCHEDULE_STATUS_COLORS = {
    [ScheduleStatus.SCHEDULED]: '#3498db',
    [ScheduleStatus.RUNNING]: '#2ecc71',
    [ScheduleStatus.COMPLETED]: '#27ae60',
    [ScheduleStatus.FAILED]: '#e74c3c',
    [ScheduleStatus.CANCELLED]: '#95a5a6',
    [ScheduleStatus.PAUSED]: '#f39c12'
};
exports.PRIORITY_LABELS = {
    1: 'Highest', 2: 'High', 3: 'Medium', 4: 'Low', 5: 'Lowest'
};
