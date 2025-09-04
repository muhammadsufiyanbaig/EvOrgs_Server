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
exports.analyticsResolvers = void 0;
const Service_1 = require("../../Service");
exports.analyticsResolvers = {
    Query: {
        getAnalyticsEvents: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getAnalyticsEvents(args, context);
        }),
        getAnalyticsStats: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getAnalyticsStats(args, context);
        }),
        getReports: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getReports(args, context);
        }),
        getReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getReport(id, context);
        }),
        getMyReports: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getMyReports(args, context);
        }),
        getScheduledReports: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.AnalyticsService(context.db);
            return service.getScheduledReports(context);
        })
    },
    Mutation: {
        trackEvent: (_1, _a, context_1, info_1) => __awaiter(void 0, [_1, _a, context_1, info_1], void 0, function* (_, { input }, context, info) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.trackEvent(input, context, info);
        }),
        createReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.createReport(input, context);
        }),
        updateReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.updateReport(id, input, context);
        }),
        deleteReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.deleteReport(id, context);
        }),
        generateReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.generateReport(id, context);
        }),
        downloadReport: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.AnalyticsService(context.db);
            return service.downloadReport(id, context);
        })
    }
};
