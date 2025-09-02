"use strict";
// TypeScript Types for Chat GraphQL Client-side Implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceType = exports.MessageType = exports.AdInquiryStatus = exports.ServiceInquiryStatus = exports.ChatStatus = void 0;
// ===================== ENUM TYPES =====================
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["Sent"] = "Sent";
    ChatStatus["Delivered"] = "Delivered";
    ChatStatus["Read"] = "Read";
    ChatStatus["Deleted"] = "Deleted";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
var ServiceInquiryStatus;
(function (ServiceInquiryStatus) {
    ServiceInquiryStatus["Open"] = "Open";
    ServiceInquiryStatus["Answered"] = "Answered";
    ServiceInquiryStatus["Converted"] = "Converted";
    ServiceInquiryStatus["Closed"] = "Closed";
})(ServiceInquiryStatus || (exports.ServiceInquiryStatus = ServiceInquiryStatus = {}));
var AdInquiryStatus;
(function (AdInquiryStatus) {
    AdInquiryStatus["Open"] = "Open";
    AdInquiryStatus["Answered"] = "Answered";
    AdInquiryStatus["Converted"] = "Converted";
    AdInquiryStatus["Closed"] = "Closed";
})(AdInquiryStatus || (exports.AdInquiryStatus = AdInquiryStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["Text"] = "Text";
    MessageType["Image"] = "Image";
    MessageType["Video"] = "Video";
    MessageType["File"] = "File";
    MessageType["Location"] = "Location";
})(MessageType || (exports.MessageType = MessageType = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["Venue"] = "Venue";
    ServiceType["Farmhouse"] = "Farmhouse";
    ServiceType["CateringPackage"] = "CateringPackage";
    ServiceType["PhotographyPackage"] = "PhotographyPackage";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
