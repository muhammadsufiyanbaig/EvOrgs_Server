// src/services/VendorService.ts
import { eq } from 'drizzle-orm';
import { vendors } from '../../../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { DrizzleDB } from '../../../../Config/db';
import { VendorApprovalInput, VendorRegisterInput, VendorUpdateProfileInput } from '../Types';

export class VendorModel {

 constructor(private db: DrizzleDB) {}

  async findVendorById(id: string) {
    const vendorRecord = await this.db.select()
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1);
    
    return vendorRecord.length > 0 ? vendorRecord[0] : null;
  }

  async findVendorByEmail(email: string) {
    const vendorRecord = await this.db.select()
      .from(vendors)
      .where(eq(vendors.vendorEmail, email))
      .limit(1);
    
    return vendorRecord.length > 0 ? vendorRecord[0] : null;
  }

  async vendorExists(email: string): Promise<boolean> {
    const existingVendor = await this.db.select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.vendorEmail, email))
      .limit(1);
    
    return existingVendor.length > 0;
  }

  async createVendor(input: VendorRegisterInput, passwordHash: string) {
    const vendorId = uuidv4();
    const socialLinks = input.vendorSocialLinks || [];

    const newVendor = {
      id: vendorId,
      vendorName: input.vendorName,
      vendorEmail: input.vendorEmail,
      vendorPhone: input.vendorPhone || null,
      fcmToken: [],
      vendorAddress: input.vendorAddress || null,
      vendorProfileDescription: input.vendorProfileDescription || null,
      vendorWebsite: input.vendorWebsite || null,
      vendorSocialLinks: socialLinks,
      passwordHash,
      profileImage: input.profileImage || null,
      bannerImage: input.bannerImage || null,
      vendorType: input.vendorType,
      vendorStatus: 'Pending' as "Pending", 
      vendorTypeId: input.vendorTypeId || null,
      rating: null,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.insert(vendors).values(newVendor);
    return vendorId;
  }

  async updateVendorEmail(vendorId: string) {
    await this.db.update(vendors)
      .set({ updatedAt: new Date() })
      .where(eq(vendors.id, vendorId));
  }

  async updateVendorProfile(vendorId: string, input: VendorUpdateProfileInput, currentFcmTokens: string[] = []) {
    const updateData: any = {};

    if (input.vendorName) updateData.vendorName = input.vendorName;
    if (input.vendorPhone) updateData.vendorPhone = input.vendorPhone;
    if (input.vendorAddress) updateData.vendorAddress = input.vendorAddress;
    if (input.vendorProfileDescription) updateData.vendorProfileDescription = input.vendorProfileDescription;
    if (input.vendorWebsite) updateData.vendorWebsite = input.vendorWebsite;
    if (input.vendorSocialLinks) updateData.vendorSocialLinks = input.vendorSocialLinks;
    if (input.profileImage) updateData.profileImage = input.profileImage;
    if (input.bannerImage) updateData.bannerImage = input.bannerImage;
    if (input.vendorType) updateData.vendorType = input.vendorType;
    if (input.vendorTypeId) updateData.vendorTypeId = input.vendorTypeId;
    
    updateData.updatedAt = new Date();

    if (input.fcmToken && !currentFcmTokens.includes(input.fcmToken)) {
      updateData.fcmToken = [...currentFcmTokens, input.fcmToken];
    }

    await this.db.update(vendors)
      .set(updateData)
      .where(eq(vendors.id, vendorId));

    return this.findVendorById(vendorId);
  }

  async updatePassword(vendorId: string, newPasswordHash: string) {
    await this.db.update(vendors)
      .set({ 
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      })
      .where(eq(vendors.id, vendorId));
  }

  async updatePasswordByEmail(email: string, newPasswordHash: string) {
    await this.db.update(vendors)
      .set({ 
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      })
      .where(eq(vendors.vendorEmail, email));
  }

  async deleteVendor(vendorId: string) {
    await this.db.delete(vendors)
      .where(eq(vendors.id, vendorId));
  }

  async updateVendorApproval(input: VendorApprovalInput) {
    await this.db.update(vendors)
      .set({ 
        vendorStatus: input.status,
        updatedAt: new Date()
      })
      .where(eq(vendors.id, input.vendorId));

    return this.findVendorById(input.vendorId);
  }

  async getPendingVendors() {
    return this.db.select()
      .from(vendors)
      .where(eq(vendors.vendorStatus, 'Pending'));
  }

  async getApprovedVendors() {
    return this.db.select()
      .from(vendors)
      .where(eq(vendors.vendorStatus, 'Approved'));
  }
}