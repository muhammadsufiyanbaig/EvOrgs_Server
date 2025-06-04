import { DrizzleDB } from '../../../../Config/db';
import { userPreferences } from '../../../../Schema';
import { eq } from 'drizzle-orm';
import { UserPreference } from '../../Types';

export class UserPreferenceModel {
  // Find user preferences by userId
  async findByUserId(db: DrizzleDB, userId: string): Promise<UserPreference | null> {
    try {
      const preferences = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      return preferences.length > 0 ? preferences[0] as UserPreference : null;
    } catch (error) {
      console.error('Error finding user preferences:', error);
      throw new Error('Database error while finding user preferences');
    }
  }

  // Create new user preferences
  async create(db: DrizzleDB, preferenceData: Omit<UserPreference, 'id'> & { id: string }): Promise<UserPreference> {
    try {
      await db.insert(userPreferences).values(preferenceData);
      return preferenceData as UserPreference;
    } catch (error) {
      console.error('Error creating user preferences:', error);
      throw new Error('Database error while creating user preferences');
    }
  }

  // Update user preferences
  async updateByUserId(db: DrizzleDB, userId: string, updateData: Partial<UserPreference>): Promise<void> {
    try {
      await db.update(userPreferences)
        .set(updateData)
        .where(eq(userPreferences.userId, userId));
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Database error while updating user preferences');
    }
  }
}