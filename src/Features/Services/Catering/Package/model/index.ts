// models/CateringPackageModel.ts
import { SQL, eq, and, ilike, like, count, desc, asc, gte, lte } from 'drizzle-orm';
import { cateringPackages } from '../../../../../Schema';
import { 
  CateringPackage, 
  CateringPackageInput, 
  CateringPackageUpdateInput, 
  SearchCateringPackagesInput,
  AdminCateringPackageFilters,
  CateringPackageListResponse
} from '../Types';
import { DrizzleDB } from '../../../../../Config/db';
import { randomUUID } from 'crypto';

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
    
    // ✅ FIX: Generate UUID for the id field
    const id = randomUUID();
    
    // Convert price from number to string as required by CateringPackage interface
    const dataToInsert = {
      id, // Add the generated UUID
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

  // Admin functionality to get all catering packages with filters and pagination
  async getAllPackagesForAdmin(filters: AdminCateringPackageFilters = {}): Promise<CateringPackageListResponse> {
    const {
      vendorId,
      packageName,
      isAvailable,
      minPrice,
      maxPrice,
      minGuests,
      maxGuests,
      serviceArea,
      amenities,
      dietaryOptions,
      page = 1,
      limit = 10,
      sortBy = 'created_at_desc'
    } = filters;

    const offset = (page - 1) * limit;
    
    // Build conditions array
    const conditions: SQL[] = [];
    
    if (vendorId) {
      conditions.push(eq(cateringPackages.vendorId, vendorId));
    }
    
    if (packageName) {
      conditions.push(ilike(cateringPackages.packageName, `%${packageName}%`));
    }
    
    if (isAvailable !== undefined) {
      conditions.push(eq(cateringPackages.isAvailable, isAvailable));
    }
    
    if (minPrice !== undefined) {
      conditions.push(gte(cateringPackages.price, minPrice.toString()));
    }
    
    if (maxPrice !== undefined) {
      conditions.push(lte(cateringPackages.price, maxPrice.toString()));
    }
    
    if (minGuests !== undefined) {
      conditions.push(gte(cateringPackages.minGuests, minGuests));
    }
    
    if (maxGuests !== undefined) {
      conditions.push(lte(cateringPackages.maxGuests, maxGuests));
    }
    
    if (serviceArea && serviceArea.length > 0) {
      for (const area of serviceArea) {
        conditions.push(like(cateringPackages.serviceArea, `%${area}%`));
      }
    }
    
    if (amenities && amenities.length > 0) {
      for (const amenity of amenities) {
        conditions.push(like(cateringPackages.amenities, `%${amenity}%`));
      }
    }
    
    if (dietaryOptions && dietaryOptions.length > 0) {
      for (const option of dietaryOptions) {
        conditions.push(like(cateringPackages.dietaryOptions, `%${option}%`));
      }
    }

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'name_asc':
        orderBy = asc(cateringPackages.packageName);
        break;
      case 'name_desc':
        orderBy = desc(cateringPackages.packageName);
        break;
      case 'price_asc':
        orderBy = asc(cateringPackages.price);
        break;
      case 'price_desc':
        orderBy = desc(cateringPackages.price);
        break;
      case 'guests_asc':
        orderBy = asc(cateringPackages.maxGuests);
        break;
      case 'guests_desc':
        orderBy = desc(cateringPackages.maxGuests);
        break;
      case 'created_at_asc':
        orderBy = asc(cateringPackages.createdAt);
        break;
      case 'created_at_desc':
      default:
        orderBy = desc(cateringPackages.createdAt);
        break;
    }

    // Get packages with pagination
    const packagesPromise = this.db.select()
      .from(cateringPackages)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountPromise = this.db.select({
      count: count()
    })
    .from(cateringPackages)
    .where(conditions.length ? and(...conditions) : undefined);

    // Execute both queries in parallel
    const [dbPackages, [{ count: total }]] = await Promise.all([packagesPromise, totalCountPromise]);

    // Convert database results to interface format
    const packages = dbPackages.map(pkg => mapToCateringPackage(pkg as DbCateringPackage));

    return {
      packages,
      total: Number(total),
      page,
      totalPages: Math.ceil(Number(total) / limit),
      hasNextPage: page < Math.ceil(Number(total) / limit),
      hasPreviousPage: page > 1
    };
  }

  // Admin functionality to update any package availability
  async updatePackageAvailabilityByAdmin(id: string, isAvailable: boolean): Promise<CateringPackage> {
    const dataToUpdate = {
      isAvailable,
      updatedAt: new Date()
    };

    const [updatedPackage] = await this.db
      .update(cateringPackages)
      .set(dataToUpdate)
      .where(eq(cateringPackages.id, id))
      .returning();

    return mapToCateringPackage(updatedPackage as DbCateringPackage);
  }

  // Admin functionality to delete any package
  async deletePackageByAdmin(id: string): Promise<boolean> {
    const result = await this.db
      .delete(cateringPackages)
      .where(eq(cateringPackages.id, id))
      .returning();

    return result.length > 0;
  }
}