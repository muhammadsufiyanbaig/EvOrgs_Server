// src/Features/Vouchers/Resolvers/VoucherResolvers.ts
import { GraphQLError } from 'graphql';
import { VoucherService } from '../../Service';
import { VoucherModel } from '../../Model';
import { Context } from '../../../../GraphQL/Context';
import {
    CreateVoucherInput,
    UpdateVoucherInput,
    ValidateVoucherInput,
    ApplyVoucherInput,
    VoucherFilters,
    VoucherUsageFilters,
    Voucher,
    VoucherUsage,
    VoucherValidationResult
} from '../../Types';

// Helper function to check if user is admin
const isAdmin = (context: Context): boolean => {
    return !!context.Admin;
};

// Helper function to get vendor ID from context
const getVendorId = (context: Context): string | undefined => {
    return context.vendor?.id;
};

// Helper function to get user ID from context
const getUserId = (context: Context): string | undefined => {
    return context.user?.id;
};

// Helper function to require authentication
const requireAuth = (context: Context, allowedTypes: ('user' | 'vendor' | 'admin')[] = ['user', 'vendor', 'admin']) => {
    const hasUser = allowedTypes.includes('user') && context.user;
    const hasVendor = allowedTypes.includes('vendor') && context.vendor;
    const hasAdmin = allowedTypes.includes('admin') && context.Admin;
    
    if (!hasUser && !hasVendor && !hasAdmin) {
        throw new GraphQLError('Authentication required', { 
            extensions: { code: 'UNAUTHENTICATED' } 
        });
    }
};

// Helper function to require vendor or admin access
const requireVendorOrAdmin = (context: Context) => {
    if (!context.vendor && !context.Admin) {
        throw new GraphQLError('Vendor or Admin access required', { 
            extensions: { code: 'FORBIDDEN' } 
        });
    }
};

// Map database enum values to GraphQL enum values
const mapDiscountType = (dbValue: string) => {
    switch (dbValue) {
        case 'Percentage': return 'PERCENTAGE';
        case 'Fixed Amount': return 'FIXED_AMOUNT';
        default: return dbValue;
    }
};

const mapApplicableFor = (dbValue: string) => {
    switch (dbValue) {
        case 'All Services': return 'ALL_SERVICES';
        case 'Specific Services': return 'SPECIFIC_SERVICES';
        default: return dbValue;
    }
};

const mapServiceType = (dbValue: string) => {
    return dbValue.toUpperCase();
};

export const voucherResolvers = {
    Query: {
        // Get all vouchers with optional filters
        getVouchers: async (
            _: any, 
            { filters }: { filters?: VoucherFilters }, 
            context: Context
        ): Promise<Voucher[]> => {
            requireVendorOrAdmin(context);
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            const vendorId = getVendorId(context);
            
            return await voucherService.getVouchers(
                filters, 
                vendorId, 
                isAdmin(context)
            );
        },

        // Get single voucher by ID
        getVoucher: async (
            _: any, 
            { id }: { id: string }, 
            context: Context
        ): Promise<Voucher | null> => {
            requireVendorOrAdmin(context);
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            const vendorId = getVendorId(context);
            
            return await voucherService.getVoucher(
                id, 
                vendorId, 
                isAdmin(context)
            );
        },

        // Get voucher by coupon code (public for validation)
        getVoucherByCouponCode: async (
            _: any, 
            { couponCode, vendorId }: { couponCode: string; vendorId: string }, 
            context: Context
        ): Promise<Voucher | null> => {
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.getVoucherByCouponCode(couponCode, vendorId);
        },

        // Validate voucher without applying it
        validateVoucher: async (
            _: any, 
            { input }: { input: ValidateVoucherInput }, 
            context: Context
        ): Promise<VoucherValidationResult> => {
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            const userId = getUserId(context);
            
            return await voucherService.validateVoucher(input, userId);
        },

        // Get voucher usage records
        getVoucherUsage: async (
            _: any, 
            { filters }: { filters?: VoucherUsageFilters }, 
            context: Context
        ): Promise<VoucherUsage[]> => {
            requireVendorOrAdmin(context);
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            const vendorId = getVendorId(context);
            
            return await voucherService.getVoucherUsage(
                filters, 
                vendorId, 
                isAdmin(context)
            );
        },

        // Get user's voucher usage history
        getUserVoucherUsage: async (
            _: any, 
            { voucherId }: { voucherId?: string }, 
            context: Context
        ): Promise<VoucherUsage[]> => {
            requireAuth(context, ['user']);
            
            const userId = getUserId(context);
            if (!userId) {
                throw new GraphQLError('User authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.getUserVoucherUsage(userId, voucherId);
        },

        // Get voucher statistics
        getVoucherStatistics: async (
            _: any, 
            { vendorId, dateFrom, dateTo }: { 
                vendorId?: string; 
                dateFrom?: string; 
                dateTo?: string; 
            }, 
            context: Context
        ): Promise<any> => {
            requireVendorOrAdmin(context);
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            // If not admin, use vendor's own ID
            const targetVendorId = isAdmin(context) ? vendorId : getVendorId(context);
            
            const stats = await voucherService.getVoucherStatistics(
                targetVendorId, 
                dateFrom, 
                dateTo, 
                isAdmin(context)
            );

            // Add empty topPerformingVouchers array as defined in schema
            return {
                ...stats,
                topPerformingVouchers: [] // This could be implemented with additional queries
            };
        }
    },

    Mutation: {
        // Create new voucher
        createVoucher: async (
            _: any, 
            { input }: { input: CreateVoucherInput }, 
            context: Context
        ): Promise<Voucher> => {
            requireAuth(context, ['vendor']);
            
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new GraphQLError('Vendor authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.createVoucher(input, vendorId);
        },

        // Update existing voucher
        updateVoucher: async (
            _: any, 
            { input }: { input: UpdateVoucherInput }, 
            context: Context
        ): Promise<Voucher> => {
            requireAuth(context, ['vendor']);
            
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new GraphQLError('Vendor authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.updateVoucher(input, vendorId);
        },

        // Delete voucher
        deleteVoucher: async (
            _: any, 
            { id }: { id: string }, 
            context: Context
        ): Promise<boolean> => {
            requireAuth(context, ['vendor']);
            
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new GraphQLError('Vendor authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.deleteVoucher(id, vendorId);
        },

        // Toggle voucher active status
        toggleVoucherStatus: async (
            _: any, 
            { id }: { id: string }, 
            context: Context
        ): Promise<Voucher> => {
            requireAuth(context, ['vendor']);
            
            const vendorId = getVendorId(context);
            if (!vendorId) {
                throw new GraphQLError('Vendor authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.toggleVoucherStatus(id, vendorId);
        },

        // Apply voucher to a booking/order
        applyVoucher: async (
            _: any, 
            { input }: { input: ApplyVoucherInput }, 
            context: Context
        ): Promise<VoucherUsage> => {
            requireAuth(context, ['user']);
            
            const userId = getUserId(context);
            if (!userId) {
                throw new GraphQLError('User authentication required', { 
                    extensions: { code: 'UNAUTHENTICATED' } 
                });
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.applyVoucher(input, userId);
        },

        // Admin-only: Deactivate voucher
        deactivateVoucher: async (
            _: any, 
            { id }: { id: string }, 
            context: Context
        ): Promise<Voucher> => {
            requireAuth(context, ['admin']);
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.deactivateVoucher(id);
        }
    },

    // Subscription resolvers for real-time updates
    Subscription: {
        voucherUsed: {
            // This would typically use a pub/sub system like Redis or GraphQL subscriptions
            subscribe: async function* (
                _: any,
                { vendorId }: { vendorId: string },
                context: Context
            ) {
                requireVendorOrAdmin(context);
                
                // Implementation would depend on your pub/sub setup
                // Example with async generator:
                // const pubsub = context.pubsub;
                // const channel = `VOUCHER_USED_${vendorId}`;
                // return pubsub.asyncIterator(channel);
                
                // Placeholder implementation
                yield { voucherUsed: null };
            }
        },

        voucherCreated: {
            subscribe: async function* (
                _: any,
                { vendorId }: { vendorId: string },
                context: Context
            ) {
                requireVendorOrAdmin(context);
                // Similar implementation as above
                yield { voucherCreated: null };
            }
        },

        voucherUpdated: {
            subscribe: async function* (
                _: any,
                { vendorId }: { vendorId: string },
                context: Context
            ) {
                requireVendorOrAdmin(context);
                // Similar implementation as above
                yield { voucherUpdated: null };
            }
        }
    },

    // Field resolvers for nested data and type transformations
    Voucher: {
        // Convert string amounts back to numbers for GraphQL response
        discountValue: (parent: Voucher) => {
            return parseFloat(parent.discountValue.toString());
        },
        
        maxDiscountAmount: (parent: Voucher) => {
            return parent.maxDiscountAmount ? parseFloat(parent.maxDiscountAmount.toString()) : null;
        },
        
        minOrderValue: (parent: Voucher) => {
            return parent.minOrderValue ? parseFloat(parent.minOrderValue.toString()) : null;
        },

        // Map database enum values to GraphQL enum values
        discountType: (parent: Voucher) => {
            return mapDiscountType(parent.discountType);
        },

        applicableFor: (parent: Voucher) => {
            return mapApplicableFor(parent.applicableFor);
        },

        serviceTypes: (parent: Voucher) => {
            return parent.serviceTypes?.map(mapServiceType) || [];
        }
    },

    VoucherUsage: {
        // Convert string amounts back to numbers
        originalAmount: (parent: VoucherUsage) => {
            return parseFloat(parent.originalAmount.toString());
        },

        discountAmount: (parent: VoucherUsage) => {
            return parseFloat(parent.discountAmount.toString());
        },

        finalAmount: (parent: VoucherUsage) => {
            return parseFloat(parent.finalAmount.toString());
        },

        serviceType: (parent: VoucherUsage) => {
            return mapServiceType(parent.serviceType);
        },

        // Resolve voucher details for usage record
        voucher: async (
            parent: VoucherUsage, 
            _: any, 
            context: Context
        ): Promise<Voucher | null> => {
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.getVoucherForUsage(parent.voucherId);
        },

        // Resolve user details for usage record
        user: async (
            parent: VoucherUsage, 
            _: any, 
            context: Context
        ): Promise<any> => {
            // Only allow vendors/admins to see user details, or the user themselves
            const currentUserId = getUserId(context);
            const isAuthorized = isAdmin(context) || 
                                context.vendor || 
                                (currentUserId && currentUserId === parent.userId);
            
            if (!isAuthorized) {
                return null; // Don't expose user details to unauthorized users
            }
            
            const voucherModel = new VoucherModel(context.db);
            const voucherService = new VoucherService(voucherModel);
            
            return await voucherService.getUserForUsage(parent.userId);
        }
    },

    VoucherValidationResult: {
        // Convert amounts to numbers if voucher validation is successful
        discountAmount: (parent: VoucherValidationResult) => {
            return parent.discountAmount || null;
        },

        finalAmount: (parent: VoucherValidationResult) => {
            return parent.finalAmount || null;
        }
    },

    VoucherStatistics: {
        // Ensure numeric fields are properly typed
        totalVouchers: (parent: any) => parent.totalVouchers || 0,
        activeVouchers: (parent: any) => parent.activeVouchers || 0,
        totalUsage: (parent: any) => parent.totalUsage || 0,
        totalDiscountGiven: (parent: any) => parseFloat(parent.totalDiscountGiven) || 0,
        topPerformingVouchers: (parent: any) => parent.topPerformingVouchers || []
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
