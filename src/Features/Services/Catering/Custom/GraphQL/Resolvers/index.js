"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCateringResolvers = void 0;
const Service_1 = require("../../Service");
const Types_1 = require("../../Types");
exports.customCateringResolvers = {
    Query: {
        // Admin fetches all custom packages with filters
        adminGetAllCustomPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw Types_1.CustomGraphQLError.forbidden();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.getAllCustomPackagesForAdmin(filters);
        }),
        // User fetches their own custom packages
        getUserCustomPackages: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.getUserCustomPackages(context.user.id);
        }),
        // Vendor fetches their custom packages
        getVendorCustomPackages: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.getVendorCustomPackages(context.vendor.id);
        }),
        // Get a single custom package by ID
        getCustomPackageById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { packageId }, context) {
            var _b, _c;
            if (!context.user && !context.vendor) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.getCustomPackageById(packageId, (_b = context.user) === null || _b === void 0 ? void 0 : _b.id, (_c = context.vendor) === null || _c === void 0 ? void 0 : _c.id);
        }),
        // Search custom packages with various filters
        searchCustomPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.vendor) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.searchCustomPackages(context.vendor.id, filters);
        }),
    },
    Mutation: {
        // User creates a custom package request
        createCustomPackageRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.createCustomPackageRequest(context.user.id, input);
        }),
        // Vendor quotes a custom package
        quoteCustomPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.quoteCustomPackage(context.vendor.id, input);
        }),
        // User responds to a vendor's quote
        respondToCustomPackageQuote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw Types_1.CustomGraphQLError.unauthenticated();
            }
            const service = new Service_1.CustomPackageService(context.db);
            return yield service.respondToCustomPackageQuote(context.user.id, input);
        }),
    }
};
