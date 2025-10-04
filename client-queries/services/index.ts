// Central export file for all service queries and mutations

// Shared Types
export * from './shared-types';

// Namespace imports to avoid conflicts
import * as CateringQueries from './catering-queries';
import * as PhotographyQueries from './photography-queries';
import * as VenueQueries from './venue-queries';
import * as FarmHouseQueries from './farmhouse-queries';

// Export namespaced modules
export { CateringQueries, PhotographyQueries, VenueQueries, FarmHouseQueries };

// Re-export specific commonly used items with prefixes to avoid conflicts
export {
  // Catering
  GET_CATERING_PACKAGES,
  GET_CATERING_PACKAGE,
  CREATE_CATERING_PACKAGE,
  UPDATE_CATERING_PACKAGE,
  DELETE_CATERING_PACKAGE,
  BOOK_CATERING_PACKAGE,
} from './catering-queries';

export {
  // Photography
  GET_PHOTOGRAPHY_PACKAGES,
  GET_PHOTOGRAPHY_PACKAGE,
  CREATE_PHOTOGRAPHY_PACKAGE,
  UPDATE_PHOTOGRAPHY_PACKAGE,
  DELETE_PHOTOGRAPHY_PACKAGE,
  BOOK_PHOTOGRAPHY_PACKAGE,
} from './photography-queries';

export {
  // Venue
  GET_VENUES,
  GET_VENUE,
  CREATE_VENUE,
  UPDATE_VENUE,
  DELETE_VENUE,
  BOOK_VENUE,
} from './venue-queries';

export {
  // FarmHouse
  GET_FARMHOUSES,
  GET_FARMHOUSE,
  CREATE_FARMHOUSE,
  UPDATE_FARMHOUSE,
  DELETE_FARMHOUSE,
  BOOK_FARMHOUSE,
} from './farmhouse-queries';

// Type aliases for commonly used types
export type CateringPackageType = CateringQueries.CateringPackage;
export type PhotographyPackageType = PhotographyQueries.PhotographyPackage;
export type VenueType = VenueQueries.Venue;
export type FarmHouseType = FarmHouseQueries.FarmHouse;

export type CateringFilters = CateringQueries.CateringPackageFiltersInput;
export type PhotographyFilters = PhotographyQueries.PhotographyPackageFiltersInput;
export type VenueFilters = VenueQueries.VenueFiltersInput;
export type FarmHouseFilters = FarmHouseQueries.FarmHouseFiltersInput;
