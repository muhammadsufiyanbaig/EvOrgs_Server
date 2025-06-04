import { DrizzleDB } from '../../../../Config/db';
import { userPreferences } from '../../../../Schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { UserPreference, UserPreferenceInput } from '../../Types';

export class UserPreferenceService {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  // Get user preferences (create default if doesn't exist)
  async getUserPreferences(userId: string): Promise<UserPreference> {
    try {
      let preferences = await this.db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      if (preferences.length === 0) {
        // Create default preferences
        const defaultPrefs = {
          id: uuidv4(),
          userId,
          pushNotifications: true,
          emailNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.db.insert(userPreferences).values(defaultPrefs);
        return defaultPrefs;
      }

      return preferences[0] as UserPreference;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences');
    }
  }

  // Update user preferences
  async updateUserPreferences(userId: string, input: UserPreferenceInput): Promise<UserPreference> {
    try {
      // Ensure preferences exist first
      await this.getUserPreferences(userId);

      const updateData = {
        ...input,
        updatedAt: new Date(),
      };

      await this.db.update(userPreferences)
        .set(updateData)
        .where(eq(userPreferences.userId, userId));

      return await this.getUserPreferences(userId);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  // Reset to default preferences
  async resetUserPreferences(userId: string): Promise<UserPreference> {
    try {
      const defaultInput: UserPreferenceInput = {
        pushNotifications: true,
        emailNotifications: true,
      };

      return await this.updateUserPreferences(userId, defaultInput);
    } catch (error) {
      console.error('Error resetting user preferences:', error);
      throw new Error('Failed to reset user preferences');
    }
  }
}
