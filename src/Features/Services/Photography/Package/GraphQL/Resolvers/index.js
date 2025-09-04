"use strict";
// src/Features/Photography/Resolvers.ts
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
exports.photographyResolvers = void 0;
const Service_1 = require("../../Service");
exports.photographyResolvers = {
    Query: {
        // Get a single photography package by ID
        photographPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { db } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getPackageById(id);
        }),
        // Get all photography packages for a vendor
        vendorPhotographPackages: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { db, vendor } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getVendorPackages(vendor);
        }),
        // Search photography packages by criteria
        searchPhotographPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { db } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.searchPackages(input);
        }),
        // ================ ADMIN QUERIES ================
        // Admin: Get all packages with filtering and pagination
        adminGetAllPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getAllPackagesForAdmin(filters || {}, Admin);
        }),
        // Admin: Get package by ID with vendor details
        adminGetPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getPackageWithVendorById(id, Admin);
        }),
        // Admin: Get package statistics
        adminGetPackageStatistics: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getPackageStatistics(Admin);
        }),
        // Admin: Get recent packages
        adminGetRecentPackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getRecentPackages(limit, Admin);
        }),
        // Admin: Get packages by availability status
        adminGetPackagesByAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { isAvailable }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getPackagesByAvailability(isAvailable, Admin);
        }),
        // Admin: Get high-value packages
        adminGetHighValuePackages: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { minPrice }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getHighValuePackages(minPrice, Admin);
        }),
        // Admin: Get packages by vendor
        adminGetPackagesByVendor: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.getPackagesByVendor(vendorId, Admin);
        })
    },
    Mutation: {
        // Create a new photography package
        createPhotographPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { db, vendor } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.createPackage(input, vendor);
        }),
        // Update an existing photography package
        updatePhotographPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const { db, vendor } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.updatePackage(id, input, vendor);
        }),
        // Delete a photography package
        deletePhotographPackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { db, vendor } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.deletePackage(id, vendor);
        }),
        // Toggle photography package availability
        togglePhotographPackageAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { db, vendor } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.togglePackageAvailability(id, vendor);
        }),
        // ================ ADMIN MUTATIONS ================
        // Admin: Update package status
        adminUpdatePackageStatus: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, isAvailable }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.updatePackageStatus(id, isAvailable, Admin);
        }),
        // Admin: Delete package
        adminDeletePackage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { db, Admin } = context;
            const photographyService = new Service_1.PhotographyService(db);
            return photographyService.adminDeletePackage(id, Admin);
        })
    }
};
