import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../../../../Config/db';
import { vendorPreferences } from '../../../../Schema';
import { VendorPreference, VendorPreferenceInput } from '../../Types';

export class VendorPreferenceModel {
  // Find vendor preferences by vendorId
  async findByVendorId(db: DrizzleDB, vendorId: string): Promise<VendorPreference | null> {
    try {
      const preferences = await db.select()
        .from(vendorPreferences)
        .where(eq(vendorPreferences.vendorId, vendorId))
        .limit(1);

      return preferences.length > 0 ? (preferences[0] as VendorPreference) : null;
    } catch (error) {
      console.error('Error finding vendor preferences:', error);
      throw new Error('Failed to find vendor preferences');
    }
  }

  // Create new vendor preferences
  async create(db: DrizzleDB, preferenceData: VendorPreference): Promise<VendorPreference> {
    try {
      await db.insert(vendorPreferences).values(preferenceData);
      return preferenceData;
    } catch (error) {
      console.error('Error creating vendor preferences:', error);
      throw new Error('Failed to create vendor preferences');
    }
  }

  // Update vendor preferences
  async update(db: DrizzleDB, vendorId: string, updateData: Partial<VendorPreferenceInput> & { updatedAt: Date }): Promise<void> {
    try {
      await db.update(vendorPreferences)
        .set(updateData)
        .where(eq(vendorPreferences.vendorId, vendorId));
    } catch (error) {
      console.error('Error updating vendor preferences:', error);
      throw new Error('Failed to update vendor preferences');
    }
  }
}