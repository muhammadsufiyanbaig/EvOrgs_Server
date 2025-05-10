// models/CateringPackageModel.ts
import { SQL, eq, and, ilike, like, count } from 'drizzle-orm';
import { cateringPackages } from '../../../../../Schema';
import { CateringPackage, CateringPackageInput, CateringPackageUpdateInput, SearchCateringPackagesInput } from '../Types';
import { DrizzleDB } from '../../../../../Config/db';

type SearchResult = {
  packages: CateringPackage[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Define a type that matches what comes from the database
type DbCateringPackage = {
  id: string;
  vendorId: string;
  packageName: string;
  serviceArea: string[];
  description: string;
  imageUrl: string[] | null;  // This is different from our interface
  price: string;
  minGuests: number;
  maxGuests: number;
  menuItems: string[] | null;
  dietaryOptions: string[];
  amenities: string[];
  isAvailable: boolean;
  reviewCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Helper function to convert database model to interface model
function mapToCateringPackage(dbPackage: DbCateringPackage): CateringPackage {
  return {
    ...dbPackage,
    // Convert imageUrl from string[] to string
    imageUrl: Array.isArray(dbPackage.imageUrl) 
      ? dbPackage.imageUrl[0] || null 
      : dbPackage.imageUrl,
    // Ensure dates aren't null
    createdAt: dbPackage.createdAt || new Date(),
    updatedAt: dbPackage.updatedAt || new Date()
  };
}

export class CateringPackageModel {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  async findById(id: string): Promise<CateringPackage | null> {
    const result = await this.db
      .select()
      .from(cateringPackages)
      .where(eq(cateringPackages.id, id))
      .limit(1);

    if (!result[0]) return null;
    return mapToCateringPackage(result[0] as DbCateringPackage);
  }

  async findByVendorId(vendorId: string): Promise<CateringPackage[]> {
    const results = await this.db
      .select()
      .from(cateringPackages)
      .where(eq(cateringPackages.vendorId, vendorId));

    return results.map(pkg => mapToCateringPackage(pkg as DbCateringPackage));
  }

  async search(
    conditions: SQL[],
    page: number = 1,
    limit: number = 10
  ): Promise<SearchResult> {
    const offset = (page - 1) * limit;
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const dbPackages = await this.db
      .select()
      .from(cateringPackages)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const packages = dbPackages.map(pkg => mapToCateringPackage(pkg as DbCateringPackage));

    const totalResult = await this.db
      .select({ count: count() })
      .from(cateringPackages)
      .where(whereClause);

    const totalCount = Number(totalResult[0]?.count ?? 0);

    return {
      packages,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async create(packageData: CateringPackageInput & { vendorId: string }): Promise<CateringPackage> {
    // Handle the imageUrl conversion if needed
    const imageUrl = packageData.imageUrl ? [packageData.imageUrl] : null;
    
    // Convert price from number to string as required by CateringPackage interface
    const dataToInsert = {
      ...packageData,
      imageUrl, // Convert string to string[] for DB
      price: packageData.price.toString(),
      menuItems: packageData.menuItems || null,
      dietaryOptions: packageData.dietaryOptions || [],
      amenities: packageData.amenities || [],
      isAvailable: true,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [newPackage] = await this.db
      .insert(cateringPackages)
      .values(dataToInsert as any)
      .returning();

    return mapToCateringPackage(newPackage as DbCateringPackage);
  }

  async update(id: string, packageData: CateringPackageUpdateInput): Promise<CateringPackage> {
    // Handle the imageUrl conversion if it exists
    const dataToUpdate: any = {
      ...packageData,
      updatedAt: new Date()
    };
    
    // Convert price to string if it exists
    if (packageData.price !== undefined) {
      dataToUpdate.price = packageData.price.toString();
    }
    
    // Convert imageUrl to array if it exists
    if (packageData.imageUrl !== undefined) {
      dataToUpdate.imageUrl = packageData.imageUrl ? [packageData.imageUrl] : null;
    }

    const [updatedPackage] = await this.db
      .update(cateringPackages)
      .set(dataToUpdate)
      .where(eq(cateringPackages.id, id))
      .returning();

    return mapToCateringPackage(updatedPackage as DbCateringPackage);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(cateringPackages)
      .where(eq(cateringPackages.id, id))
      .returning();

    return result.length > 0;
  }

  // Utility method to build search conditions
  buildSearchConditions(input: SearchCateringPackagesInput): SQL[] {
    const { packageName, amenities, serviceArea, menuItems } = input;
    const conditions: SQL[] = [];

    if (packageName) {
      conditions.push(ilike(cateringPackages.packageName, `%${packageName}%`));
    }

    if (amenities && amenities.length > 0) {
      // Handle array to string comparison for postgres JSONB or array fields
      for (const amenity of amenities) {
        conditions.push(like(cateringPackages.amenities, `%${amenity}%`));
      }
    }

    if (serviceArea && serviceArea.length > 0) {
      for (const area of serviceArea) {
        conditions.push(like(cateringPackages.serviceArea, `%${area}%`));
      }
    }

    if (menuItems && menuItems.length > 0) {
      for (const item of menuItems) {
        conditions.push(like(cateringPackages.menuItems, `%${item}%`));
      }
    }

    conditions.push(eq(cateringPackages.isAvailable, true));

    return conditions;
  }
}