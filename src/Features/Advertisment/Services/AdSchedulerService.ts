import * as cron from 'node-cron';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq, and, lte, gte, sql } from 'drizzle-orm';
import { adSchedules, adTimeSlots, servicesAds, adExecutionLogs } from '../../../Schema';

export class AdSchedulerService {
  private db: PostgresJsDatabase;
  private isRunning: boolean = false;
  private cronJobs: Map<string, any> = new Map();

  constructor(db: PostgresJsDatabase) {
    this.db = db;
    this.initializeCronJobs();
  }

  /**
   * Initialize all cron jobs for ad scheduling
   */
  private initializeCronJobs() {
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
  public start() {
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
  public stop() {
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
  private async processScheduledAds() {
    try {
      const now = new Date();
      const currentTime = this.formatTime(now);
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentDate = now.toISOString().split('T')[0];

      // Find all scheduled ads that should run now
      const scheduledAds = await this.db
        .select({
          schedule: adSchedules,
          timeSlot: adTimeSlots,
          ad: servicesAds,
        })
        .from(adSchedules)
        .innerJoin(adTimeSlots, eq(adSchedules.timeSlotId, adTimeSlots.id))
        .innerJoin(servicesAds, eq(adSchedules.adId, servicesAds.id))
        .where(
          and(
            eq(adSchedules.status, 'Scheduled'),
            eq(adSchedules.scheduledDate, currentDate),
            lte(adTimeSlots.startTime, currentTime),
            gte(adTimeSlots.endTime, currentTime),
            sql`${adTimeSlots.daysOfWeek} @> ${JSON.stringify([currentDay])}`,
            eq(adTimeSlots.isActive, true),
            eq(servicesAds.status, 'Active')
          )
        );

      for (const { schedule, timeSlot, ad } of scheduledAds) {
        await this.executeAdSchedule(schedule, timeSlot, ad);
      }
    } catch (error) {
      console.error('Error processing scheduled ads:', error);
      await this.logError('SYSTEM', 'Failed to process scheduled ads', error);
    }
  }

  /**
   * Execute a specific ad schedule
   */
  private async executeAdSchedule(schedule: any, timeSlot: any, ad: any) {
    try {
      // Update schedule status to running
      await this.db
        .update(adSchedules)
        .set({
          status: 'Running',
          executedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(adSchedules.id, schedule.id));

      // Log the start of execution
      await this.logExecution(schedule.id, ad.id, 'START', 'SUCCESS', 'Ad execution started');

      // Simulate ad execution (in real implementation, this would:
      // - Update ad visibility in the system
      // - Send notifications
      // - Update analytics
      // - Integrate with ad serving platform)
      await this.runAdCampaign(ad, timeSlot);

      // Update schedule status to completed
      await this.db
        .update(adSchedules)
        .set({
          status: 'Completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(adSchedules.id, schedule.id));

      // Log successful completion
      await this.logExecution(schedule.id, ad.id, 'STOP', 'SUCCESS', 'Ad execution completed successfully');

      console.log(`Successfully executed ad schedule ${schedule.id} for ad ${ad.id}`);
    } catch (error) {
      await this.handleScheduleFailure(schedule, error);
    }
  }

  /**
   * Simulate running an ad campaign
   */
  private async runAdCampaign(ad: any, timeSlot: any) {
    // In a real implementation, this would:
    // 1. Make the ad visible on the platform
    // 2. Send push notifications to targeted users
    // 3. Update ad placement algorithms
    // 4. Start tracking impressions and clicks
    // 5. Integrate with external ad networks

    // For now, we'll simulate by updating the ad's impression count
    await this.db
      .update(servicesAds)
      .set({
        impressionCount: sql`${servicesAds.impressionCount} + ${Math.floor(Math.random() * 100)}`,
        updatedAt: new Date(),
      })
      .where(eq(servicesAds.id, ad.id));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Handle schedule execution failure
   */
  private async handleScheduleFailure(schedule: any, error: any) {
    const retryCount = schedule.retryCount + 1;
    const maxRetries = schedule.maxRetries || 3;

    try {
      if (retryCount <= maxRetries) {
        // Schedule for retry
        const nextRetry = new Date(Date.now() + retryCount * 5 * 60 * 1000); // Exponential backoff

        await this.db
          .update(adSchedules)
          .set({
            status: 'Failed',
            retryCount,
            nextRetry,
            failureReason: error.message,
            updatedAt: new Date(),
          })
          .where(eq(adSchedules.id, schedule.id));

        await this.logExecution(schedule.id, schedule.adId, 'ERROR', 'FAILED', 
          `Ad execution failed, scheduled for retry ${retryCount}/${maxRetries}`, 
          { error: error.message, retryCount });
      } else {
        // Max retries reached
        await this.db
          .update(adSchedules)
          .set({
            status: 'Failed',
            failureReason: `Max retries (${maxRetries}) reached. Last error: ${error.message}`,
            updatedAt: new Date(),
          })
          .where(eq(adSchedules.id, schedule.id));

        await this.logExecution(schedule.id, schedule.adId, 'ERROR', 'FAILED', 
          `Ad execution failed permanently after ${maxRetries} retries`, 
          { error: error.message, maxRetriesReached: true });
      }
    } catch (updateError) {
      console.error('Error updating failed schedule:', updateError);
    }
  }

  /**
   * Retry failed schedules that are ready for retry
   */
  private async retryFailedSchedules() {
    try {
      const now = new Date();

      const retrySchedules = await this.db
        .select({
          schedule: adSchedules,
          timeSlot: adTimeSlots,
          ad: servicesAds,
        })
        .from(adSchedules)
        .innerJoin(adTimeSlots, eq(adSchedules.timeSlotId, adTimeSlots.id))
        .innerJoin(servicesAds, eq(adSchedules.adId, servicesAds.id))
        .where(
          and(
            eq(adSchedules.status, 'Failed'),
            lte(adSchedules.nextRetry, now),
            sql`${adSchedules.retryCount} < ${adSchedules.maxRetries}`
          )
        );

      for (const { schedule, timeSlot, ad } of retrySchedules) {
        await this.logExecution(schedule.id, ad.id, 'RETRY', 'PENDING', 
          `Retrying ad execution (attempt ${(schedule.retryCount || 0) + 1})`);
        
        await this.executeAdSchedule(schedule, timeSlot, ad);
      }
    } catch (error) {
      console.error('Error retrying failed schedules:', error);
    }
  }

  /**
   * Clean up old completed and failed schedules
   */
  private async cleanupOldSchedules() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Delete old completed schedules
      await this.db
        .delete(adSchedules)
        .where(
          and(
            eq(adSchedules.status, 'Completed'),
            lte(adSchedules.completedAt, thirtyDaysAgo)
          )
        );

      // Delete old failed schedules (non-retryable)
      await this.db
        .delete(adSchedules)
        .where(
          and(
            eq(adSchedules.status, 'Failed'),
            sql`${adSchedules.retryCount} >= ${adSchedules.maxRetries}`,
            lte(adSchedules.updatedAt, thirtyDaysAgo)
          )
        );

      console.log('Cleaned up old ad schedules');
    } catch (error) {
      console.error('Error cleaning up old schedules:', error);
    }
  }

  /**
   * Create a new ad schedule
   */
  public async createSchedule(adId: string, timeSlotId: string, scheduledDate: string): Promise<any> {
    try {
      // Get time slot details
      const timeSlot = await this.db
        .select()
        .from(adTimeSlots)
        .where(eq(adTimeSlots.id, timeSlotId))
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
        status: 'Scheduled' as const,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.db
        .insert(adSchedules)
        .values(newSchedule)
        .returning();

      await this.logExecution(result[0].id, adId, 'START', 'SUCCESS', 'Schedule created');

      return result[0];
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled ad
   */
  public async cancelSchedule(scheduleId: string): Promise<void> {
    try {
      await this.db
        .update(adSchedules)
        .set({
          status: 'Cancelled',
          updatedAt: new Date(),
        })
        .where(eq(adSchedules.id, scheduleId));

      await this.logExecution(scheduleId, '', 'STOP', 'SUCCESS', 'Schedule cancelled');
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      throw error;
    }
  }

  /**
   * Log execution details
   */
  private async logExecution(
    scheduleId: string, 
    adId: string, 
    action: string, 
    status: string, 
    message: string,
    metadata?: any
  ) {
    try {
      await this.db.insert(adExecutionLogs).values({
        id: crypto.randomUUID(),
        scheduleId,
        adId,
        action: action as any,
        status: status as any,
        message,
        errorDetails: status === 'FAILED' ? metadata : null,
        performanceMetrics: status === 'SUCCESS' ? metadata : null,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error logging execution:', error);
    }
  }

  /**
   * Log system errors
   */
  private async logError(action: string, message: string, error: any) {
    await this.logExecution('', '', action, 'FAILED', message, { 
      error: error.message, 
      stack: error.stack 
    });
  }

  /**
   * Format time to HH:MM format
   */
  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }

  /**
   * Get scheduler status
   */
  public getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.cronJobs.keys()),
      uptime: this.isRunning ? process.uptime() : 0,
    };
  }

  /**
   * Get schedule statistics
   */
  public async getScheduleStats() {
    try {
      const stats = await this.db
        .select({
          status: adSchedules.status,
          count: sql<number>`count(*)`.as('count'),
        })
        .from(adSchedules)
        .groupBy(adSchedules.status);

      return stats.reduce((acc, stat) => {
        if (stat.status) {
          acc[stat.status] = Number(stat.count);
        }
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error getting schedule stats:', error);
      return {};
    }
  }
}
