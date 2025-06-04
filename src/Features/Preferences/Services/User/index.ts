import { v4 as uuidv4 } from 'uuid';
import { DrizzleDB } from '../../../../Config/db';
import { UserPreference, UserPreferenceInput } from '../../Types';
import { UserPreferenceModel } from '../../Model/User';

export class UserPreferenceService {
  private db: DrizzleDB;
  private userPreferenceModel: UserPreferenceModel;

  constructor(db: DrizzleDB) {
    this.db = db;
    this.userPreferenceModel = new UserPreferenceModel();
  }

  // Get user preferences (create default if doesn't exist)
  async getUserPreferences(userId: string): Promise<UserPreference> {
    try {
      let preferences = await this.userPreferenceModel.findByUserId(this.db, userId);

      if (!preferences) {
        // Create default preferences
        const defaultPrefs = {
          id: uuidv4(),
          userId,
          pushNotifications: true,
          emailNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        preferences = await this.userPreferenceModel.create(this.db, defaultPrefs);
      }

      return preferences;
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

      await this.userPreferenceModel.updateByUserId(this.db, userId, updateData);

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

  // Private method to get default preferences structure
  private getDefaultPreferences(userId: string): Omit<UserPreference, 'id'> & { id: string } {
    return {
      id: uuidv4(),
      userId,
      pushNotifications: true,
      emailNotifications: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}