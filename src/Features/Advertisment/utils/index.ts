import { AdRequest, ServiceAd, ExternalAd, AdPayment } from '../Types';
import { activateScheduledAds, expireAds, cleanupOldData } from '../CronJob';

// Function to calculate pricing based on ad type and duration
export const calculateAdPricing = (adType: string, duration: number, basePrice?: number): number => {
  const basePrices = {
    'Featured': 50,
    'Sponsored': 30,
    'Premium': 100
  };

  const base = basePrice || basePrices[adType as keyof typeof basePrices] || 30;
  
  // Discount for longer durations
  let multiplier = 1;
  if (duration >= 30) multiplier = 0.8; // 20% discount for 30+ days
  else if (duration >= 14) multiplier = 0.9; // 10% discount for 14+ days
  
  return Math.round(base * duration * multiplier);
};

// Function to validate ad dates
export const validateAdDates = (startDate: string, endDate: string): { isValid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start < now) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (duration > 365) {
    return { isValid: false, error: 'Ad duration cannot exceed 365 days' };
  }

  if (duration < 1) {
    return { isValid: false, error: 'Ad duration must be at least 1 day' };
  }

  return { isValid: true };
};

// Function to get ad performance metrics
export const getAdPerformanceMetrics = (impressions: number, clicks: number, conversions: number) => {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
  
  return {
    ctr: parseFloat(ctr.toFixed(2)),
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    performanceGrade: getPerformanceGrade(ctr, conversionRate)
  };
};

// Function to grade ad performance
const getPerformanceGrade = (ctr: number, conversionRate: number): 'Excellent' | 'Good' | 'Average' | 'Poor' => {
  if (ctr >= 3 && conversionRate >= 5) return 'Excellent';
  if (ctr >= 2 && conversionRate >= 3) return 'Good';
  if (ctr >= 1 && conversionRate >= 1) return 'Average';
  return 'Poor';
};

// Re-export imported types and functions
export {
  AdRequest,
  ServiceAd,
  ExternalAd,
  AdPayment,
  activateScheduledAds,
  expireAds,
  cleanupOldData
};