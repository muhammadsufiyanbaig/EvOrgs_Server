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
exports.cateringPackageResolvers = void 0;
// resolvers/CateringPackageResolver.ts
const Service_1 = require("../../Service");
exports.cateringPackageResolvers = {
    Query: {
        cateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.getCateringPackageById(id, context.vendor.id);
        }),
        vendorCateringPackages: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.getVendorCateringPackages(context.vendor.id);
        }),
        searchCateringPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input, page = 1, limit = 10 }, context) {
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.searchCateringPackages(input, page, limit);
        }),
        // Admin Query: Get all catering packages with filters and pagination
        adminGetAllCateringPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.getAllPackagesForAdmin(filters);
        }),
        // Admin Query: Get a specific catering package by ID
        adminGetCateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.getPackageByIdForAdmin(id);
        }),
    },
    Mutation: {
        createCateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.createCateringPackage(input, context.vendor.id);
        }),
        updateCateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.updateCateringPackage(id, input, context.vendor.id);
        }),
        deleteCateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.deleteCateringPackage(id, context.vendor.id);
        }),
        toggleCateringPackageAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.vendor) {
                throw new Error('Authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.toggleCateringPackageAvailability(id, context.vendor.id);
        }),
        // Admin Mutation: Update catering package availability
        adminUpdateCateringPackageAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, isAvailable }, context) {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.updatePackageAvailabilityByAdmin(id, isAvailable);
        }),
        // Admin Mutation: Delete catering package
        adminDeleteCateringPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const service = new Service_1.CateringPackageService(context.db);
            return yield service.deletePackageByAdmin(id);
        }),
    },
};
