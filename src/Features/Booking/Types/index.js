"use strict";
// src/Features/Booking/Types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitStatus = exports.PaymentStatus = exports.BookingStatus = exports.ServiceType = void 0;
// Service types enum
var ServiceType;
(function (ServiceType) {
    ServiceType["FARMHOUSE"] = "FarmHouse";
    ServiceType["VENUE"] = "Venue";
    ServiceType["CATERING"] = "Catering";
    ServiceType["PHOTOGRAPHY"] = "Photography";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
// Booking status enum
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "Pending";
    BookingStatus["CONFIRMED"] = "Confirmed";
    BookingStatus["COMPLETED"] = "Completed";
    BookingStatus["CANCELED"] = "Canceled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
// Payment status enum
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["AWAITING_ADVANCE"] = "Awaiting Advance";
    PaymentStatus["ADVANCE_PAID"] = "Advance Paid";
    PaymentStatus["PARTIALLY_PAID"] = "Partially Paid";
    PaymentStatus["FULLY_PAID"] = "Fully Paid";
    PaymentStatus["REFUNDED"] = "Refunded";
    PaymentStatus["CANCELED"] = "Canceled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
// Visit status enum
var VisitStatus;
(function (VisitStatus) {
    VisitStatus["NOT_REQUESTED"] = "Not Requested";
    VisitStatus["REQUESTED"] = "Requested";
    VisitStatus["SCHEDULED"] = "Scheduled";
    VisitStatus["COMPLETED"] = "Completed";
})(VisitStatus || (exports.VisitStatus = VisitStatus = {}));
