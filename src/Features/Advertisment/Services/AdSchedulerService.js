"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AdSchedulerService = void 0;
const cron = __importStar(require("node-cron"));
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
class AdSchedulerService {
    constructor(db) {
        this.isRunning = false;
        this.cronJobs = new Map();
        this.db = db;
        this.initializeCronJobs();
    }
    /**
     * Initialize all cron jobs for ad scheduling
     */
    initializeCronJobs() {
        // Run every minute to check for scheduled ads
        const mainJob = cron.schedule('* * * * *', () => {
            this.processScheduledAds();
        });
        // Cleanup completed and old schedules daily at midnight
        const cleanupJob = cron.schedule('0 0 * * *', () => {
            this.cleanupOldSchedules();
        });
        // Retry failed schedules every 5 minutes
        const retryJob = cron.schedule('*/5 * * * *', () => {
            this.retryFailedSchedules();
        });
        this.cronJobs.set('main', mainJob);
        this.cronJobs.set('cleanup', cleanupJob);
        this.cronJobs.set('retry', retryJob);
    }
    /**
     * Start the ad scheduler service
     */
    start() {
        if (this.isRunning) {
            console.log('Ad Scheduler is already running');
            return;
        }
        this.cronJobs.forEach((job, name) => {
            job.start();
            console.log(`Started cron job: ${name}`);
        });
        this.isRunning = true;
        console.log('Ad Scheduler Service started successfully');
    }
    /**
     * Stop the ad scheduler service
     */
    stop() {
        if (!this.isRunning) {
            console.log('Ad Scheduler is not running');
            return;
        }
        this.cronJobs.forEach((job, name) => {
            job.stop();
            console.log(`Stopped cron job: ${name}`);
        });
        this.isRunning = false;
        console.log('Ad Scheduler Service stopped');
    }
    /**
     * Process ads that are scheduled to run now
     */
    processScheduledAds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const currentTime = this.formatTime(now);
                const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
                const currentDate = now.toISOString().split('T')[0];
                // Find all scheduled ads that should run now
                const scheduledAds = yield this.db
                    .select({
                    schedule: Schema_1.adSchedules,
                    timeSlot: Schema_1.adTimeSlots,
                    ad: Schema_1.servicesAds,
                })
                    .from(Schema_1.adSchedules)
                    .innerJoin(Schema_1.adTimeSlots, (0, drizzle_orm_1.eq)(Schema_1.adSchedules.timeSlotId, Schema_1.adTimeSlots.id))
                    .innerJoin(Schema_1.servicesAds, (0, drizzle_orm_1.eq)(Schema_1.adSchedules.adId, Schema_1.servicesAds.id))
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, 'Scheduled'), (0, drizzle_orm_1.eq)(Schema_1.adSchedules.scheduledDate, currentDate), (0, drizzle_orm_1.lte)(Schema_1.adTimeSlots.startTime, currentTime), (0, drizzle_orm_1.gte)(Schema_1.adTimeSlots.endTime, currentTime), (0, drizzle_orm_1.sql) `${Schema_1.adTimeSlots.daysOfWeek} @> ${JSON.stringify([currentDay])}`, (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.isActive, true), (0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active')));
                for (const { schedule, timeSlot, ad } of scheduledAds) {
                    yield this.executeAdSchedule(schedule, timeSlot, ad);
                }
            }
            catch (error) {
                console.error('Error processing scheduled ads:', error);
                yield this.logError('SYSTEM', 'Failed to process scheduled ads', error);
            }
        });
    }
    /**
     * Execute a specific ad schedule
     */
    executeAdSchedule(schedule, timeSlot, ad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update schedule status to running
                yield this.db
                    .update(Schema_1.adSchedules)
                    .set({
                    status: 'Running',
                    executedAt: new Date(),
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, schedule.id));
                // Log the start of execution
                yield this.logExecution(schedule.id, ad.id, 'START', 'SUCCESS', 'Ad execution started');
                // Simulate ad execution (in real implementation, this would:
                // - Update ad visibility in the system
                // - Send notifications
                // - Update analytics
                // - Integrate with ad serving platform)
                yield this.runAdCampaign(ad, timeSlot);
                // Update schedule status to completed
                yield this.db
                    .update(Schema_1.adSchedules)
                    .set({
                    status: 'Completed',
                    completedAt: new Date(),
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, schedule.id));
                // Log successful completion
                yield this.logExecution(schedule.id, ad.id, 'STOP', 'SUCCESS', 'Ad execution completed successfully');
                console.log(`Successfully executed ad schedule ${schedule.id} for ad ${ad.id}`);
            }
            catch (error) {
                yield this.handleScheduleFailure(schedule, error);
            }
        });
    }
    /**
     * Simulate running an ad campaign
     */
    runAdCampaign(ad, timeSlot) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real implementation, this would:
            // 1. Make the ad visible on the platform
            // 2. Send push notifications to targeted users
            // 3. Update ad placement algorithms
            // 4. Start tracking impressions and clicks
            // 5. Integrate with external ad networks
            // For now, we'll simulate by updating the ad's impression count
            yield this.db
                .update(Schema_1.servicesAds)
                .set({
                impressionCount: (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.impressionCount} + ${Math.floor(Math.random() * 100)}`,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, ad.id));
            // Simulate processing time
            yield new Promise(resolve => setTimeout(resolve, 1000));
        });
    }
    /**
     * Handle schedule execution failure
     */
    handleScheduleFailure(schedule, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const retryCount = schedule.retryCount + 1;
            const maxRetries = schedule.maxRetries || 3;
            try {
                if (retryCount <= maxRetries) {
                    // Schedule for retry
                    const nextRetry = new Date(Date.now() + retryCount * 5 * 60 * 1000); // Exponential backoff
                    yield this.db
                        .update(Schema_1.adSchedules)
                        .set({
                        status: 'Failed',
                        retryCount,
                        nextRetry,
                        failureReason: error.message,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, schedule.id));
                    yield this.logExecution(schedule.id, schedule.adId, 'ERROR', 'FAILED', `Ad execution failed, scheduled for retry ${retryCount}/${maxRetries}`, { error: error.message, retryCount });
                }
                else {
                    // Max retries reached
                    yield this.db
                        .update(Schema_1.adSchedules)
                        .set({
                        status: 'Failed',
                        failureReason: `Max retries (${maxRetries}) reached. Last error: ${error.message}`,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, schedule.id));
                    yield this.logExecution(schedule.id, schedule.adId, 'ERROR', 'FAILED', `Ad execution failed permanently after ${maxRetries} retries`, { error: error.message, maxRetriesReached: true });
                }
            }
            catch (updateError) {
                console.error('Error updating failed schedule:', updateError);
            }
        });
    }
    /**
     * Retry failed schedules that are ready for retry
     */
    retryFailedSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const retrySchedules = yield this.db
                    .select({
                    schedule: Schema_1.adSchedules,
                    timeSlot: Schema_1.adTimeSlots,
                    ad: Schema_1.servicesAds,
                })
                    .from(Schema_1.adSchedules)
                    .innerJoin(Schema_1.adTimeSlots, (0, drizzle_orm_1.eq)(Schema_1.adSchedules.timeSlotId, Schema_1.adTimeSlots.id))
                    .innerJoin(Schema_1.servicesAds, (0, drizzle_orm_1.eq)(Schema_1.adSchedules.adId, Schema_1.servicesAds.id))
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, 'Failed'), (0, drizzle_orm_1.lte)(Schema_1.adSchedules.nextRetry, now), (0, drizzle_orm_1.sql) `${Schema_1.adSchedules.retryCount} < ${Schema_1.adSchedules.maxRetries}`));
                for (const { schedule, timeSlot, ad } of retrySchedules) {
                    yield this.logExecution(schedule.id, ad.id, 'RETRY', 'PENDING', `Retrying ad execution (attempt ${(schedule.retryCount || 0) + 1})`);
                    yield this.executeAdSchedule(schedule, timeSlot, ad);
                }
            }
            catch (error) {
                console.error('Error retrying failed schedules:', error);
            }
        });
    }
    /**
     * Clean up old completed and failed schedules
     */
    cleanupOldSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                // Delete old completed schedules
                yield this.db
                    .delete(Schema_1.adSchedules)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, 'Completed'), (0, drizzle_orm_1.lte)(Schema_1.adSchedules.completedAt, thirtyDaysAgo)));
                // Delete old failed schedules (non-retryable)
                yield this.db
                    .delete(Schema_1.adSchedules)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, 'Failed'), (0, drizzle_orm_1.sql) `${Schema_1.adSchedules.retryCount} >= ${Schema_1.adSchedules.maxRetries}`, (0, drizzle_orm_1.lte)(Schema_1.adSchedules.updatedAt, thirtyDaysAgo)));
                console.log('Cleaned up old ad schedules');
            }
            catch (error) {
                console.error('Error cleaning up old schedules:', error);
            }
        });
    }
    /**
     * Create a new ad schedule
     */
    createSchedule(adId, timeSlotId, scheduledDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get time slot details
                const timeSlot = yield this.db
                    .select()
                    .from(Schema_1.adTimeSlots)
                    .where((0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.id, timeSlotId))
                    .limit(1);
                if (!timeSlot.length) {
                    throw new Error('Time slot not found');
                }
                const slot = timeSlot[0];
                const scheduleDateTime = new Date(`${scheduledDate}T${slot.startTime}:00`);
                const newSchedule = {
                    id: crypto.randomUUID(),
                    adId,
                    timeSlotId,
                    scheduledDate,
                    scheduledDateTime: scheduleDateTime,
                    status: 'Scheduled',
                    retryCount: 0,
                    maxRetries: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const result = yield this.db
                    .insert(Schema_1.adSchedules)
                    .values(newSchedule)
                    .returning();
                yield this.logExecution(result[0].id, adId, 'START', 'SUCCESS', 'Schedule created');
                return result[0];
            }
            catch (error) {
                console.error('Error creating schedule:', error);
                throw error;
            }
        });
    }
    /**
     * Cancel a scheduled ad
     */
    cancelSchedule(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .update(Schema_1.adSchedules)
                    .set({
                    status: 'Cancelled',
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, scheduleId));
                yield this.logExecution(scheduleId, '', 'STOP', 'SUCCESS', 'Schedule cancelled');
            }
            catch (error) {
                console.error('Error cancelling schedule:', error);
                throw error;
            }
        });
    }
    /**
     * Log execution details
     */
    logExecution(scheduleId, adId, action, status, message, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.insert(Schema_1.adExecutionLogs).values({
                    id: crypto.randomUUID(),
                    scheduleId,
                    adId,
                    action: action,
                    status: status,
                    message,
                    errorDetails: status === 'FAILED' ? metadata : null,
                    performanceMetrics: status === 'SUCCESS' ? metadata : null,
                    createdAt: new Date(),
                });
            }
            catch (error) {
                console.error('Error logging execution:', error);
            }
        });
    }
    /**
     * Log system errors
     */
    logError(action, message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logExecution('', '', action, 'FAILED', message, {
                error: error.message,
                stack: error.stack
            });
        });
    }
    /**
     * Format time to HH:MM format
     */
    formatTime(date) {
        return date.toTimeString().substring(0, 5);
    }
    /**
     * Get scheduler status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            activeJobs: Array.from(this.cronJobs.keys()),
            uptime: this.isRunning ? process.uptime() : 0,
        };
    }
    /**
     * Get schedule statistics
     */
    getScheduleStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.db
                    .select({
                    status: Schema_1.adSchedules.status,
                    count: (0, drizzle_orm_1.sql) `count(*)`.as('count'),
                })
                    .from(Schema_1.adSchedules)
                    .groupBy(Schema_1.adSchedules.status);
                return stats.reduce((acc, stat) => {
                    if (stat.status) {
                        acc[stat.status] = Number(stat.count);
                    }
                    return acc;
                }, {});
            }
            catch (error) {
                console.error('Error getting schedule stats:', error);
                return {};
            }
        });
    }
}
exports.AdSchedulerService = AdSchedulerService;
