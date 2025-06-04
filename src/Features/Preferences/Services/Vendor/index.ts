import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../../../Config/db';
import { vendorPreferences } from '../../../../Schema';
import { VendorPreference, VendorPreferenceInput } from '../../Types';
import { v4 as uuidv4 } from 'uuid';

export class VendorPreferenceService {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  // Get vendor preferences (create default if doesn't exist)
  async getVendorPreferences(vendorId: string): Promise<VendorPreference> {
    try {
      let preferences = await this.db.select()
        .from(vendorPreferences)
        .where(eq(vendorPreferences.vendorId, vendorId))
        .limit(1);

      if (preferences.length === 0) {
        // Create default preferences
        const defaultPrefs = {
          id: uuidv4(),
          vendorId,
          pushNotifications: true,
          emailNotifications: true,
          visibleInSearch: true,
          visibleReviews: true,
          workingHoursStart: '09:00',
          workingHoursEnd: '17:00',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.db.insert(vendorPreferences).values(defaultPrefs);
        return defaultPrefs;
      }

      return preferences[0] as VendorPreference;
    } catch (error) {
      console.error('Error getting vendor preferences:', error);
      throw new Error('Failed to get vendor preferences');
    }
  }

  // Update vendor preferences
  async updateVendorPreferences(vendorId: string, input: VendorPreferenceInput): Promise<VendorPreference> {
    try {
      // Ensure preferences exist first
      await this.getVendorPreferences(vendorId);

      // Validate working hours if provided
      if (input.workingHoursStart || input.workingHoursEnd) {
        this.validateWorkingHours(input.workingHoursStart, input.workingHoursEnd);
      }

      // Validate working days if provided
      if (input.workingDays) {
        this.validateWorkingDays(input.workingDays);
      }

      const updateData = {
        ...input,
        updatedAt: new Date(),
      };

      await this.db.update(vendorPreferences)
        .set(updateData)
        .where(eq(vendorPreferences.vendorId, vendorId));

      return await this.getVendorPreferences(vendorId);
    } catch (error) {
      console.error('Error updating vendor preferences:', error);
      throw new Error('Failed to update vendor preferences');
    }
  }

  // Reset to default preferences
  async resetVendorPreferences(vendorId: string): Promise<VendorPreference> {
    try {
      const defaultInput: VendorPreferenceInput = {
        pushNotifications: true,
        emailNotifications: true,
        visibleInSearch: true,
        visibleReviews: true,
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      };

      return await this.updateVendorPreferences(vendorId, defaultInput);
    } catch (error) {
      console.error('Error resetting vendor preferences:', error);
      throw new Error('Failed to reset vendor preferences');
    }
  }

  // Validation helpers
  private validateWorkingHours(start?: string, end?: string): void {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (start && !timeRegex.test(start)) {
      throw new Error('Invalid working hours start format. Use HH:MM format.');
    }
    
    if (end && !timeRegex.test(end)) {
      throw new Error('Invalid working hours end format. Use HH:MM format.');
    }

    if (start && end) {
      const startTime = new Date(`2000-01-01T${start}:00`);
      const endTime = new Date(`2000-01-01T${end}:00`);
      
      if (startTime >= endTime) {
        throw new Error('Working hours start must be before end time.');
      }
    }
  }

  private validateWorkingDays(days: string[]): void {
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const invalidDays = days.filter(day => !validDays.includes(day));
    
    if (invalidDays.length > 0) {
      throw new Error(`Invalid working days: ${invalidDays.join(', ')}`);
    }

    if (days.length === 0) {
      throw new Error('At least one working day must be selected.');
    }
  }
}
