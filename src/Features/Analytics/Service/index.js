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
exports.AnalyticsService = void 0;
const Model_1 = require("../Model");
const uuid_1 = require("uuid");
class AnalyticsService {
    constructor(db) {
        this.model = new Model_1.AnalyticsModel(db);
    }
    getAnalyticsEvents(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            return this.model.getAnalyticsEvents(args);
        });
    }
    getAnalyticsStats(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            const { totalEventsResult, eventsByType, eventsByDate, topUsers, topVendors } = yield this.model.getAnalyticsStats(args);
            return {
                totalEvents: ((_a = totalEventsResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                eventsByType: eventsByType.map(e => ({ eventType: e.eventType, count: e.count })),
                eventsByDate: eventsByDate.map(e => ({ date: e.date, count: e.count })),
                topUsers: topUsers.filter(u => u.userId).map(u => ({ userId: u.userId, count: u.count })),
                topVendors: topVendors.filter(v => v.vendorId).map(v => ({ vendorId: v.vendorId, count: v.count }))
            };
        });
    }
    getReports(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            return this.model.getReports(args);
        });
    }
    getReport(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            return this.model.getReport(id);
        });
    }
    getMyReports(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            return this.model.getMyReports(context.Admin.id, args);
        });
    }
    getScheduledReports(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            return this.model.getScheduledReports();
        });
    }
    trackEvent(input, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const request = ((_a = info.variableValues) === null || _a === void 0 ? void 0 : _a.request) || {};
            const ipAddress = request.ip || ((_b = request.connection) === null || _b === void 0 ? void 0 : _b.remoteAddress);
            const eventData = {
                id: (0, uuid_1.v4)(),
                eventType: input.eventType,
                userId: (_c = context.user) === null || _c === void 0 ? void 0 : _c.id,
                vendorId: (_d = context.vendor) === null || _d === void 0 ? void 0 : _d.id,
                objectId: input.objectId,
                objectType: input.objectType,
                metadata: input.metadata,
                ipAddress,
                createdAt: new Date()
            };
            return this.model.trackEvent(eventData);
        });
    }
    createReport(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            const reportData = {
                id: (0, uuid_1.v4)(),
                reportName: input.reportName,
                reportType: input.reportType,
                generatedBy: context.Admin.id,
                dateRange: input.dateRange,
                parameters: input.parameters,
                reportFormat: input.reportFormat || 'PDF',
                status: 'Generating',
                isScheduled: input.isScheduled || false,
                scheduleFrequency: input.scheduleFrequency,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const newReport = yield this.model.createReport(reportData);
            // Optionally trigger async report generation
            // this.generateReportAsync(newReport.id);
            return newReport;
        });
    }
    updateReport(id, input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            const updateData = {
                reportName: input.reportName,
                reportType: input.reportType,
                dateRange: input.dateRange,
                parameters: input.parameters,
                reportFormat: input.reportFormat || 'PDF',
                isScheduled: input.isScheduled || false,
                scheduleFrequency: input.scheduleFrequency,
                updatedAt: new Date()
            };
            const updatedReport = yield this.model.updateReport(id, updateData);
            if (!updatedReport) {
                throw new Error('Report not found');
            }
            return updatedReport;
        });
    }
    deleteReport(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            const deletedReport = yield this.model.deleteReport(id);
            return deletedReport.length > 0;
        });
    }
    generateReport(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            yield this.model.updateReportStatus(id, 'Generating');
            try {
                // Implement report generation logic
                const reportUrl = `https://your-storage.com/reports/${id}.pdf`;
                const updatedReport = yield this.model.updateReportStatus(id, 'Generated');
                yield this.model.updateReportUrl(id, reportUrl);
                return updatedReport;
            }
            catch (error) {
                yield this.model.updateReportStatus(id, 'Failed');
                throw new Error('Report generation failed');
            }
        });
    }
    downloadReport(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new Error('Unauthorized: Admin access required');
            }
            const report = yield this.model.getReport(id);
            if (!report) {
                throw new Error('Report not found');
            }
            if (report.status !== 'Generated' || !report.reportUrl) {
                throw new Error('Report not available for download');
            }
            yield this.model.trackEvent({
                id: (0, uuid_1.v4)(),
                eventType: 'report_download',
                userId: context.Admin.id,
                objectId: id,
                objectType: 'report',
                createdAt: new Date()
            });
            return report.reportUrl;
        });
    }
}
exports.AnalyticsService = AnalyticsService;
