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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherResolvers = void 0;
// src/Features/Vouchers/Resolvers/VoucherResolvers.ts
const graphql_1 = require("graphql");
const Service_1 = require("../../Service");
const Model_1 = require("../../Model");
// Helper function to check if user is admin
const isAdmin = (context) => {
    return !!context.Admin;
};
// Helper function to get vendor ID from context
const getVendorId = (context) => {
    var _a;
    return (_a = context.vendor) === null || _a === void 0 ? void 0 : _a.id;
};
// Helper function to get user ID from context
const getUserId = (context) => {
    var _a;
    return (_a = context.user) === null || _a === void 0 ? void 0 : _a.id;
};
// Helper function to require authentication
const requireAuth = (context, allowedTypes = ['user', 'vendor', 'admin']) => {
    const hasUser = allowedTypes.includes('user') && context.user;
    const hasVendor = allowedTypes.includes('vendor') && context.vendor;
    const hasAdmin = allowedTypes.includes('admin') && context.Admin;
    if (!hasUser && !hasVendor && !hasAdmin) {
        throw new graphql_1.GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
};
// Helper function to require vendor or admin access
const requireVendorOrAdmin = (context) => {
    if (!context.vendor && !context.Admin) {
        throw new graphql_1.GraphQLError('Vendor or Admin access required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
};
// Map database enum values to GraphQL enum values
const mapDiscountType = (dbValue) => {
    switch (dbValue) {
        case 'Percentage': return 'PERCENTAGE';
        case 'Fixed Amount': return 'FIXED_AMOUNT';
        default: return dbValue;
    }
};
const mapApplicableFor = (dbValue) => {
    switch (dbValue) {
        case 'All Services': return 'ALL_SERVICES';
        case 'Specific Services': return 'SPECIFIC_SERVICES';
        default: return dbValue;
    }
};
const mapServiceType = (dbValue) => {
    return dbValue.toUpperCase();
};
exports.voucherResolvers = {
    Query: {
        // Get all vouchers with optional filters
        getVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            requireVendorOrAdmin(context);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            const vendorId = getVendorId(context);
            return yield voucherService.getVouchers(filters, vendorId, isAdmin(context));
        }),
        // Get single voucher by ID
        getVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            requireVendorOrAdmin(context);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            const vendorId = getVendorId(context);
            return yield voucherService.getVoucher(id, vendorId, isAdmin(context));
        }),
        // Get voucher by coupon code (public for validation)
        getVoucherByCouponCode: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { couponCode, vendorId }, context) {
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.getVoucherByCouponCode(couponCode, vendorId);
        }),
        // Validate voucher without applying it
        validateVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            const userId = getUserId(context);
            return yield voucherService.validateVoucher(input, userId);
        }),
        // Get voucher usage records
        getVoucherUsage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            requireVendorOrAdmin(context);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            const vendorId = getVendorId(context);
            return yield voucherService.getVoucherUsage(filters, vendorId, isAdmin(context));
        }),
        // Get user's voucher usage history
        getUserVoucherUsage: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { voucherId }, context) {
            requireAuth(context, ['user']);
            const userId = getUserId(context);
            if (!userId) {
                throw new graphql_1.GraphQLError('User authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.getUserVoucherUsage(userId, voucherId);
        }),
        // Get voucher statistics
        getVoucherStatistics: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId, dateFrom, dateTo }, context) {
            requireVendorOrAdmin(context);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            const currentVendorId = isAdmin(context) ? vendorId : getVendorId(context);
            return yield voucherService.getVoucherStatistics(currentVendorId, dateFrom, dateTo, isAdmin(context));
        }),
        // ========== ADMIN-ONLY QUERIES ==========
        adminGetAllVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters, pagination }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminGetAllVouchers(filters, pagination);
        }),
        adminGetVoucherAnalytics: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { dateFrom, dateTo }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminGetVoucherAnalytics(dateFrom, dateTo);
        }),
        adminGetExpiredVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { daysOld }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminGetExpiredVouchers(daysOld);
        }),
        adminGetVoucherTrends: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { period, groupBy }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminGetVoucherTrends(period, groupBy);
        }),
    },
    Mutation: {
        // Create new voucher
        createVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            requireAuth(context, ['vendor']);
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.createVoucher(input, vendorId);
        }),
        // Update existing voucher
        updateVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            requireAuth(context, ['vendor']);
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.updateVoucher(input, vendorId);
        }),
        // Delete voucher
        deleteVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            requireAuth(context, ['vendor']);
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.deleteVoucher(id, vendorId);
        }),
        // Toggle voucher active status
        toggleVoucherStatus: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            requireAuth(context, ['vendor']);
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.toggleVoucherStatus(id, vendorId);
        }),
        // Apply voucher to a booking/order
        applyVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            requireAuth(context, ['user']);
            const userId = getUserId(context);
            if (!userId) {
                throw new graphql_1.GraphQLError('User authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.applyVoucher(input, userId);
        }),
        // Admin-only: Deactivate voucher
        deactivateVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.deactivateVoucher(id);
        }),
        // ========== ADMIN-ONLY MUTATIONS ==========
        adminCreateVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId, input }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminCreateVoucher(vendorId, input);
        }),
        adminUpdateVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminUpdateVoucher(input);
        }),
        adminForceDeleteVoucher: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, reason }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminForceDeleteVoucher(id, reason);
        }),
        adminSuspendVendorVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId, reason, duration }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminSuspendVendorVouchers(vendorId, reason, duration);
        }),
        adminRestoreVendorVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminRestoreVendorVouchers(vendorId);
        }),
        adminOverrideVoucherLimits: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { voucherId, newLimits }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminOverrideVoucherLimits(voucherId, newLimits);
        }),
        adminCleanupExpiredVouchers: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { daysOld }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminCleanupExpiredVouchers(daysOld);
        }),
        adminRecalculateVoucherStatistics: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminRecalculateVoucherStatistics(vendorId);
        }),
        adminCreateSystemPromotion: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            requireAuth(context, ['admin']);
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.adminCreateSystemPromotion(input);
        }),
    },
    // Subscription resolvers for real-time updates
    Subscription: {
        voucherUsed: {
            // This would typically use a pub/sub system like Redis or GraphQL subscriptions
            subscribe: function (_1, _a, context_1) {
                return __asyncGenerator(this, arguments, function* (_, { vendorId }, context) {
                    requireVendorOrAdmin(context);
                    // Implementation would depend on your pub/sub setup
                    // Example with async generator:
                    // const pubsub = context.pubsub;
                    // const channel = `VOUCHER_USED_${vendorId}`;
                    // return pubsub.asyncIterator(channel);
                    // Placeholder implementation
                    yield yield __await({ voucherUsed: null });
                });
            }
        },
        voucherCreated: {
            subscribe: function (_1, _a, context_1) {
                return __asyncGenerator(this, arguments, function* (_, { vendorId }, context) {
                    requireVendorOrAdmin(context);
                    // Similar implementation as above
                    yield yield __await({ voucherCreated: null });
                });
            }
        },
        voucherUpdated: {
            subscribe: function (_1, _a, context_1) {
                return __asyncGenerator(this, arguments, function* (_, { vendorId }, context) {
                    requireVendorOrAdmin(context);
                    // Similar implementation as above
                    yield yield __await({ voucherUpdated: null });
                });
            }
        }
    },
    // Field resolvers for nested data and type transformations
    Voucher: {
        // Convert string amounts back to numbers for GraphQL response
        discountValue: (parent) => {
            return parseFloat(parent.discountValue.toString());
        },
        maxDiscountAmount: (parent) => {
            return parent.maxDiscountAmount ? parseFloat(parent.maxDiscountAmount.toString()) : null;
        },
        minOrderValue: (parent) => {
            return parent.minOrderValue ? parseFloat(parent.minOrderValue.toString()) : null;
        },
        // Map database enum values to GraphQL enum values
        discountType: (parent) => {
            return mapDiscountType(parent.discountType);
        },
        applicableFor: (parent) => {
            return mapApplicableFor(parent.applicableFor);
        },
        serviceTypes: (parent) => {
            var _a;
            return ((_a = parent.serviceTypes) === null || _a === void 0 ? void 0 : _a.map(mapServiceType)) || [];
        }
    },
    VoucherUsage: {
        // Convert string amounts back to numbers
        originalAmount: (parent) => {
            return parseFloat(parent.originalAmount.toString());
        },
        discountAmount: (parent) => {
            return parseFloat(parent.discountAmount.toString());
        },
        finalAmount: (parent) => {
            return parseFloat(parent.finalAmount.toString());
        },
        serviceType: (parent) => {
            return mapServiceType(parent.serviceType);
        },
        // Resolve voucher details for usage record
        voucher: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.getVoucherForUsage(parent.voucherId);
        }),
        // Resolve user details for usage record
        user: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            // Only allow vendors/admins to see user details, or the user themselves
            const currentUserId = getUserId(context);
            const isAuthorized = isAdmin(context) ||
                context.vendor ||
                (currentUserId && currentUserId === parent.userId);
            if (!isAuthorized) {
                return null; // Don't expose user details to unauthorized users
            }
            const voucherModel = new Model_1.VoucherModel(context.db);
            const voucherService = new Service_1.VoucherService(voucherModel);
            return yield voucherService.getUserForUsage(parent.userId);
        })
    },
    VoucherValidationResult: {
        // Convert amounts to numbers if voucher validation is successful
        discountAmount: (parent) => {
            return parent.discountAmount || null;
        },
        finalAmount: (parent) => {
            return parent.finalAmount || null;
        }
    },
    VoucherStatistics: {
        // Ensure numeric fields are properly typed
        totalVouchers: (parent) => parent.totalVouchers || 0,
        activeVouchers: (parent) => parent.activeVouchers || 0,
        totalUsage: (parent) => parent.totalUsage || 0,
        totalDiscountGiven: (parent) => parseFloat(parent.totalDiscountGiven) || 0,
        topPerformingVouchers: (parent) => parent.topPerformingVouchers || []
    },
    // Enum resolvers to ensure proper mapping
    DiscountType: {
        PERCENTAGE: 'Percentage',
        FIXED_AMOUNT: 'Fixed Amount'
    },
    ApplicableFor: {
        ALL_SERVICES: 'All Services',
        SPECIFIC_SERVICES: 'Specific Services'
    },
    ServiceType: {
        FARMHOUSE: 'farmhouse',
        VENUE: 'venue',
        CATERING: 'catering',
        PHOTOGRAPHY: 'photography'
    }
};
