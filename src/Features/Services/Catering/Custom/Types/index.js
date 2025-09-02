"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomGraphQLError = exports.CustomPackageStatus = void 0;
// Enum for package status
var CustomPackageStatus;
(function (CustomPackageStatus) {
    CustomPackageStatus["Requested"] = "Requested";
    CustomPackageStatus["Quoted"] = "Quoted";
    CustomPackageStatus["Accepted"] = "Accepted";
    CustomPackageStatus["Rejected"] = "Rejected";
})(CustomPackageStatus || (exports.CustomPackageStatus = CustomPackageStatus = {}));
// Custom Error Class
class CustomGraphQLError extends Error {
    constructor(message, extensions) {
        super(message);
        this.extensions = extensions;
        this.name = 'CustomGraphQLError';
    }
    static unauthenticated(message = 'Authentication required') {
        return new CustomGraphQLError(message, {
            code: 'UNAUTHENTICATED'
        });
    }
    static notFound(message = 'Resource not found') {
        return new CustomGraphQLError(message, {
            code: 'NOT_FOUND'
        });
    }
    static forbidden(message = 'Not authorized') {
        return new CustomGraphQLError(message, {
            code: 'FORBIDDEN'
        });
    }
}
exports.CustomGraphQLError = CustomGraphQLError;
