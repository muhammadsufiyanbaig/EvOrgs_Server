import { and, eq, sql } from 'drizzle-orm';
import * as cron from 'node-cron';
import { servicesAds, externalAds, adRequests } '../../../Schema';

// Function to activate scheduled ads
export const activateScheduledAds = async (db: any) => {
  try {
    const now = new Date();
    
    // Find ads that should be activated
    const adsToActivate = await db.select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.status, 'Scheduled'),
        sql`${servicesAds.adminStartDate} <= ${now}`
      ));

    for (const ad of adsToActivate) {
      await db.update(servicesAds)
        .set({
          status: 'Active',
          actualStartDate: now,
          updatedAt: now
        })
        .where(eq(servicesAds.id, ad.id));
    }

    console.log(`Activated ${adsToActivate.length} scheduled ads`);
  } catch (error) {
    console.error('Error activating scheduled ads:', error);
  }
};

// Function to expire ads
export const expireAds = async (db: any) => {
  try {
    const now = new Date();
    
    // Expire service ads
    const serviceAdsToExpire = await db.select()
      .from(servicesAds)
      .where(and(
        sql`${servicesAds.status} IN ('Active', 'Paused')`,
        sql`${servicesAds.adminEndDate} <= ${now}`
      ));

    for (const ad of serviceAdsToExpire) {
      await db.update(servicesAds)
        .set({
          status: 'Expired',
          actualEndDate: now,
          updatedAt: now
        })
        .where(eq(servicesAds.id, ad.id));
    }

    // Expire external ads
    const externalAdsToExpire = await db.select()
      .from(externalAds)
      .where(and(
        eq(externalAds.status, 'Active'),
        sql`${externalAds.endDate} IS NOT NULL`,
        sql`${externalAds.endDate} <= ${now}`
      ));

    for (const ad of externalAdsToExpire) {
      await db.update(externalAds)
        .set({
          status: 'Expired',
          updatedAt: now
        })
        .where(eq(externalAds.id, ad.id));
    }

    console.log(`Expired ${serviceAdsToExpire.length} service ads and ${externalAdsToExpire.length} external ads`);
  } catch (error) {
    console.error('Error expiring ads:', error);
  }
};

// Function to clean up old data
export const cleanupOldData = async (db: any) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Delete old rejected ad requests
    await db.delete(adRequests)
      .where(and(
        eq(adRequests.status, 'Rejected'),
        sql`${adRequests.updatedAt} < ${sixMonthsAgo}`
      ));

    // Archive old expired ads (you might want to move to archive table instead)
    const oldExpiredAds = await db.select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.status, 'Expired'),
        sql`${servicesAds.actualEndDate} < ${sixMonthsAgo}`
      ));

    console.log(`Found ${oldExpiredAds.length} old expired ads for cleanup`);
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
};

// Setup cron jobs
export const setupAdCronJobs = (db: any) => {
  // Check for ads to activate every minute
  cron.schedule('* * * * *', () => {
    activateScheduledAds(db);
  });

  // Check for ads to expire every hour
  cron.schedule('0 * * * *', () => {
    expireAds(db);
  });

  // Cleanup old data weekly (every Sunday at 2 AM)
  cron.schedule('0 2 * * 0', () => {
    cleanupOldData(db);
  });

  console.log('Ad management cron jobs initialized');
};