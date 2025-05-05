// utils/models/UserModel.ts
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../../../../Schema';
import {DrizzleDB} from '../../../../Config/db'
import { RegisterInput, UpdateProfileInput, User } from '../Types';

// UserModel class to handle user-related database operations
export class UserModel {

  constructor(private db: DrizzleDB) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0 ? result[0] as unknown as User : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result.length > 0 ? result[0] as unknown as User : null;
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0;
  }

  async create(input: RegisterInput, passwordHash: string): Promise<string> {
    const userId = uuidv4();
    const dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;

    const newUser = {
      id: userId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      address: input.address || null,
      fcmToken: [],
      passwordHash,
      profileImage: input.profileImage || null,
      dateOfBirth,
      gender: input.gender as "Male" | "Female" | "Others",
      createdAt: new Date(),
      isVerified: false,
    };

    await this.db.insert(users).values(newUser);
    return userId;
  }

  async setVerified(userId: string): Promise<void> {
    await this.db.update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId));
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updateData: any = {};

    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.phone) updateData.phone = input.phone;
    if (input.address) updateData.address = input.address;
    if (input.profileImage) updateData.profileImage = input.profileImage;
    if (input.dateOfBirth) updateData.dateOfBirth = new Date(input.dateOfBirth);
    if (input.gender) updateData.gender = input.gender;

    if (input.fcmToken) {
      const currentTokens = user.fcmToken || [];
      if (!currentTokens.includes(input.fcmToken)) {
        updateData.fcmToken = [...currentTokens, input.fcmToken];
      }
    }

    await this.db.update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    const updatedUser = await this.findById(userId);
    return updatedUser as User;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));
  }

  async updatePasswordByEmail(email: string, passwordHash: string): Promise<void> {
    await this.db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, email));
  }

  async delete(userId: string): Promise<void> {
    await this.db.delete(users)
      .where(eq(users.id, userId));
  }
}