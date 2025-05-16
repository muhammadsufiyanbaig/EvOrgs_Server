import { sql, eq, and } from 'drizzle-orm';
import { cateringCustomPackages } from '../../../../../Schema';
import { CustomPackageStatus } from '../Types';

export class CustomPackageModel {
    constructor(private db: any) { }

    // User custom packages
    async getUserCustomPackages(userId: string) {
        return await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.userId, userId));
    }

    // Vendor custom packages
    async getVendorCustomPackages(vendorId: string) {
        return await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.vendorId, vendorId));
    }

    // Get a single custom package by ID
    async getCustomPackageById(packageId: string) {
        const [customPackage] = await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.id, packageId))
            .limit(1);

        return customPackage;
    }

    // Search custom packages with various filters
    async searchCustomPackages(vendorId: string, filters: any) {
        const whereConditions: any[] = [eq(cateringCustomPackages.vendorId, vendorId)];

        // Status filter
        if (filters?.status) {
            whereConditions.push(eq(cateringCustomPackages.status, filters.status));
        }

        // Guest count filters
        if (filters?.minGuestCount) {
            whereConditions.push(sql`guest_count >= ${filters.minGuestCount}`);
        }
        if (filters?.maxGuestCount) {
            whereConditions.push(sql`guest_count <= ${filters.maxGuestCount}`);
        }

        // Date range filters
        if (filters?.startDate) {
            whereConditions.push(sql`event_date >= ${filters.startDate}`);
        }
        if (filters?.endDate) {
            whereConditions.push(sql`event_date <= ${filters.endDate}`);
        }

        return await this.db
            .select()
            .from(cateringCustomPackages)
            .where(and(...whereConditions));
    }

    // Create a new custom package
    async createCustomPackage(packageData: any) {
        const [newPackage] = await this.db
            .insert(cateringCustomPackages)
            .values(packageData)
            .returning();

        return newPackage;
    }

    // Update a custom package
    async updateCustomPackage(packageId: string, updateData: any) {
        const [updatedPackage] = await this.db
            .update(cateringCustomPackages)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(cateringCustomPackages.id, packageId))
            .returning();

        return updatedPackage;
    }

    // Check if a package exists with specific conditions
    async findPackageWithConditions(conditions: Record<string, any>) {
        const whereConditions = Object.entries(conditions)
            .filter(([key]) => key in cateringCustomPackages)
            .map(([key, value]) => {
                const column = (cateringCustomPackages as Record<string, any>)[key];
                return eq(column, value);
            });

        const [existingPackage] = await this.db
            .select()
            .from(cateringCustomPackages)
            .where(and(...whereConditions))
            .limit(1);

        return existingPackage;
    }

}