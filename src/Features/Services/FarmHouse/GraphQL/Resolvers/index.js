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
exports.farmhouseResolvers = void 0;
// RESOLVER
// Features/Farmhouse/Resolver/FarmhouseResolver.ts
const Service_1 = require("../../Service");
exports.farmhouseResolvers = {
    Query: {
        // Get a farmhouse by its ID (public)
        farmhouse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.getFarmhouseById(id);
        }),
        // Get all farmhouses for admin (admin only - all farmhouses regardless of availability)
        adminAllFarmhouses: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.getAllFarmhousesForAdmin();
        }),
        // Get all farmhouses for a vendor (vendor-only)
        vendorFarmhouses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { isAvailable }, context) {
            // Check if vendor is authenticated
            if (!context.vendor) {
                throw new Error('Not authenticated as vendor');
            }
            const vendorId = context.vendor.id;
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.getVendorFarmhouses(vendorId, isAvailable);
        }),
        // Search for farmhouses based on filters (public)
        searchFarmhouses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.searchFarmhouses(input);
        }),
    },
    Mutation: {
        // Create a new farmhouse
        createFarmhouse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            // Check if vendor is authenticated
            if (!context.vendor) {
                throw new Error('Not authenticated as vendor');
            }
            const vendorId = context.vendor.id;
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.createFarmhouse(input, vendorId);
        }),
        // Update an existing farmhouse
        updateFarmhouse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            // Check if vendor is authenticated
            if (!context.vendor) {
                throw new Error('Not authenticated as vendor');
            }
            const vendorId = context.vendor.id;
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.updateFarmhouse(input, vendorId);
        }),
        // Delete a farmhouse
        deleteFarmhouse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            // Check if vendor is authenticated
            if (!context.vendor) {
                throw new Error('Not authenticated as vendor');
            }
            const vendorId = context.vendor.id;
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.deleteFarmhouse(input, vendorId);
        }),
        // Toggle farmhouse availability
        toggleFarmhouseAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            // Check if vendor is authenticated
            if (!context.vendor) {
                throw new Error('Not authenticated as vendor');
            }
            const vendorId = context.vendor.id;
            const farmhouseService = new Service_1.FarmhouseService(context.db);
            return farmhouseService.toggleFarmhouseAvailability(input, vendorId);
        })
    },
};
