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
exports.venueResolver = void 0;
const Service_1 = require("../../Service");
exports.venueResolver = {
    Query: {
        // Get a specific venue by ID
        venue: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.getVenueById(id);
        }),
        // Get venues belonging to the authenticated vendor
        vendorVenues: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new Error('Vendor authentication required');
            }
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.getVenuesByVendorId(context.vendor.id);
        }),
        // Get all venues for admin - admin only with full details
        adminAllVenues: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Admin authentication required');
            }
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.getAllVenuesForAdmin();
        }),
        // Search venues with filters
        searchVenues: (_, filters, context) => __awaiter(void 0, void 0, void 0, function* () {
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.searchVenues(filters);
        }),
    },
    Mutation: {
        // Create a new venue - vendor only
        createVenue: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new Error('Vendor authentication required');
            }
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.createVenue(context.vendor.id, input);
        }),
        // Update an existing venue
        updateVenue: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (context.vendor) {
                const venueService = new Service_1.VenueService(context.db);
                return yield venueService.updateVenue(context.vendor.id, input);
            }
            if (context.Admin) {
                const venueService = new Service_1.VenueService(context.db);
                return yield venueService.adminUpdateVenue(input);
            }
            throw new Error('Vendor or admin authentication required');
        }),
        // Delete a venue
        deleteVenue: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (context.vendor) {
                const venueService = new Service_1.VenueService(context.db);
                return yield venueService.deleteVenue(context.vendor.id, id);
            }
            if (context.Admin) {
                const venueService = new Service_1.VenueService(context.db);
                return yield venueService.adminDeleteVenue(id);
            }
            throw new Error('Vendor or admin authentication required');
        }),
        // Toggle venue availability
        toggleVenueAvailability: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, isAvailable }, context) {
            if (!context.vendor) {
                throw new Error('Vendor authentication required');
            }
            const venueService = new Service_1.VenueService(context.db);
            return yield venueService.toggleVenueAvailability(context.vendor.id, id, isAvailable);
        }),
    },
};
