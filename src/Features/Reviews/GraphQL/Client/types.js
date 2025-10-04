"use strict";
// TypeScript Types and Interfaces for Reviews System
// Complete type definitions for client-side operations
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SERVICE_ASPECTS = exports.DEFAULT_SORT_OPTIONS = exports.DEFAULT_PAGINATION = exports.DEFAULT_REVIEW_FILTERS = exports.REVIEW_CONSTANTS = void 0;
// ==================== CONSTANTS ====================
exports.REVIEW_CONSTANTS = {
    MIN_RATING: 1,
    MAX_RATING: 5,
    MIN_COMMENT_LENGTH: 10,
    MAX_COMMENT_LENGTH: 2000,
    MAX_RESPONSE_LENGTH: 1000,
    MAX_ATTACHMENTS: 5,
    RATING_LABELS: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    },
    SERVICE_TYPES: [
        'VENUE',
        'CATERING',
        'PHOTOGRAPHY',
        'FARMHOUSE',
        'BOOKING',
        'OTHER'
    ],
    MODERATION_STATUSES: [
        'PENDING',
        'APPROVED',
        'REJECTED',
        'FLAGGED',
        'UNDER_REVIEW'
    ],
    RESPONSE_TEMPLATES: [
        'THANK_YOU',
        'ADDRESS_CONCERNS',
        'APOLOGIZE',
        'CLARIFY',
        'INVITE_CONTACT',
        'CUSTOM'
    ]
};
// ==================== DEFAULT VALUES ====================
exports.DEFAULT_REVIEW_FILTERS = {
    rating: [],
    serviceType: [],
    isVerified: undefined,
    isPublished: true,
    moderationStatus: [],
    hasResponse: undefined
};
exports.DEFAULT_PAGINATION = {
    page: 1,
    limit: 10
};
exports.DEFAULT_SORT_OPTIONS = {
    field: 'createdAt',
    direction: 'desc'
};
exports.DEFAULT_SERVICE_ASPECTS = {
    venue: {
        location: 0,
        ambiance: 0,
        cleanliness: 0,
        facilities: 0,
        staff: 0,
        valueForMoney: 0
    }
};
