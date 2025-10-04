# Client-Side Service Queries & Mutations

## Overview

This comprehensive client-side package provides GraphQL queries, mutations, TypeScript interfaces, and React hooks for all service types in the EvOrgs platform:

- **Catering Packages** - Complete catering service management
- **Photography Packages** - Photography service and portfolio management  
- **Venues** - Venue booking and management system
- **FarmHouses** - Farm house rental and booking system

## 📁 Project Structure

```
client-queries/
├── services/
│   ├── shared-types.ts          # Common types across all services
│   ├── catering-queries.ts      # Catering GraphQL operations
│   ├── photography-queries.ts   # Photography GraphQL operations
│   ├── venue-queries.ts         # Venue GraphQL operations
│   ├── farmhouse-queries.ts     # FarmHouse GraphQL operations
│   └── index.ts                 # Central exports
├── hooks/
│   ├── useCateringService.ts    # Catering React hooks
│   ├── usePhotographyService.ts # Photography React hooks (to be created)
│   ├── useVenueService.ts       # Venue React hooks (to be created)
│   └── useFarmHouseService.ts   # FarmHouse React hooks (to be created)
└── README.md                    # This documentation
```

## 🚀 Quick Start

### Prerequisites

```bash
npm install @apollo/client graphql react react-dom
# or
yarn add @apollo/client graphql react react-dom
```

### Apollo Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Your GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

## 📚 Service APIs

### 🍽️ Catering Services

#### Core Features
- **Package Management**: Create, update, delete catering packages
- **Menu Management**: Define menu items, dietary options, serving styles
- **Pricing**: Per-person pricing with minimum/maximum guest limits
- **Cuisine Types**: Pakistani, Indian, Chinese, Continental, Italian, etc.
- **Serving Styles**: Buffet, Plated Service, Family Style, Cocktail, Boxed Meals
- **Dietary Options**: Vegetarian, Vegan, Halal, Gluten-Free, etc.

#### Key Queries
```typescript
import { CateringQueries } from './client-queries/services';

// Get all catering packages with filters
const { data } = await client.query({
  query: CateringQueries.GET_CATERING_PACKAGES,
  variables: {
    filters: {
      cuisineType: ['Pakistani', 'Indian'],
      servingStyle: ['Buffet'],
      minPrice: 500,
      maxPrice: 2000,
      location: 'Karachi'
    },
    pagination: { page: 1, limit: 10 },
    sortBy: { field: 'rating', direction: 'DESC' }
  }
});

// Get single catering package
const { data } = await client.query({
  query: CateringQueries.GET_CATERING_PACKAGE,
  variables: { id: 'package_id' }
});
```

#### Key Mutations
```typescript
// Create catering package (vendor only)
const { data } = await client.mutate({
  mutation: CateringQueries.CREATE_CATERING_PACKAGE,
  variables: {
    input: {
      packageName: 'Wedding Special Menu',
      pricePerPerson: 1500,
      minPersons: 50,
      maxPersons: 300,
      menuItems: ['Biryani', 'Karahi', 'Naan', 'Raita'],
      servingStyle: 'Buffet',
      cuisineType: 'Pakistani',
      duration: 4,
      features: ['Live Cooking', 'Setup & Cleanup']
    }
  }
});

// Book catering package (user only)
const { data } = await client.mutate({
  mutation: CateringQueries.BOOK_CATERING_PACKAGE,
  variables: {
    input: {
      packageId: 'package_id',
      eventDate: '2025-12-25',
      eventTime: '19:00',
      guestCount: 150,
      specialRequests: 'Extra spicy food requested'
    }
  }
});
```

### 📸 Photography Services

#### Core Features
- **Package Management**: Photography service packages with detailed specifications
- **Portfolio Management**: Showcase previous work with categorized galleries
- **Shooting Styles**: Traditional, Candid, Documentary, Artistic, Fashion, Portrait
- **Package Types**: Wedding, Engagement, Birthday, Corporate, Fashion, Product
- **Delivery**: Specified number of edited/raw photos, video inclusion, timeframes
- **Equipment**: Professional equipment specifications
- **Quote System**: Custom quote requests and responses

#### Key Queries
```typescript
import { PhotographyQueries } from './client-queries/services';

// Get photography packages with filters
const { data } = await client.query({
  query: PhotographyQueries.GET_PHOTOGRAPHY_PACKAGES,
  variables: {
    filters: {
      packageType: ['Wedding', 'Engagement'],
      shootingStyle: ['Candid', 'Traditional'],
      includesVideo: true,
      minPrice: 20000,
      maxPrice: 100000
    }
  }
});

// Get photographer portfolio
const { data } = await client.query({
  query: PhotographyQueries.GET_PHOTOGRAPHER_PORTFOLIO,
  variables: { vendorId: 'photographer_id' }
});
```

#### Key Mutations
```typescript
// Create photography package
const { data } = await client.mutate({
  mutation: PhotographyQueries.CREATE_PHOTOGRAPHY_PACKAGE,
  variables: {
    input: {
      packageName: 'Premium Wedding Photography',
      price: 75000,
      duration: 8,
      shootingStyle: ['Candid', 'Traditional', 'Artistic'],
      packageType: 'Wedding',
      numberOfPhotographers: 2,
      numberOfEditedPhotos: 500,
      numberOfRawPhotos: 2000,
      includesVideo: true,
      videoDuration: 180,
      deliveryTimeframe: 30
    }
  }
});

// Request custom quote
const { data } = await client.mutate({
  mutation: PhotographyQueries.REQUEST_PHOTOGRAPHY_QUOTE,
  variables: {
    input: {
      vendorId: 'photographer_id',
      eventType: 'Wedding',
      eventDate: '2025-12-25',
      eventLocation: 'Karachi',
      duration: 10,
      requirements: 'Need drone shots and same-day highlights reel',
      budget: 80000
    }
  }
});
```

### 🏛️ Venue Services

#### Core Features
- **Venue Management**: Comprehensive venue information and amenities
- **Capacity Management**: Guest capacity with flexible pricing options
- **Location Services**: GPS coordinates, city-based search, radius filtering
- **Amenities**: WiFi, Parking, A/C, Kitchen, Bar, Dance Floor, Sound System, etc.
- **Pricing Models**: Per hour, per day, or per event pricing
- **Availability Management**: Real-time availability checking and booking
- **Accessibility**: Wheelchair access, hearing loops, service animals
- **Policies**: Alcohol, smoking, pet, decoration, and cancellation policies

#### Key Queries
```typescript
import { VenueQueries } from './client-queries/services';

// Get venues with comprehensive filters
const { data } = await client.query({
  query: VenueQueries.GET_VENUES,
  variables: {
    filters: {
      venueType: ['BanquetHall', 'WeddingVenue'],
      city: ['Karachi', 'Lahore'],
      minCapacity: 100,
      maxCapacity: 500,
      amenities: ['Parking', 'AirConditioning', 'SoundSystem'],
      indoorOutdoor: ['Indoor', 'Both'],
      alcoholPolicy: ['Allowed'],
      minPricePerEvent: 50000,
      maxPricePerEvent: 200000
    }
  }
});

// Get venue availability
const { data } = await client.query({
  query: VenueQueries.GET_VENUE_AVAILABILITY,
  variables: {
    venueId: 'venue_id',
    startDate: '2025-12-20',
    endDate: '2025-12-30'
  }
});
```

#### Key Mutations
```typescript
// Create venue
const { data } = await client.mutate({
  mutation: VenueQueries.CREATE_VENUE,
  variables: {
    input: {
      venueName: 'Grand Ballroom Karachi',
      venueType: 'BanquetHall',
      capacity: 300,
      location: 'Karachi',
      address: 'DHA Phase 5, Karachi',
      city: 'Karachi',
      pricePerEvent: 150000,
      minimumBookingHours: 4,
      availableAmenities: [
        'Parking', 'AirConditioning', 'SoundSystem', 
        'DanceFloor', 'Stage', 'Kitchen'
      ],
      indoorOutdoor: 'Indoor',
      alcoholPolicy: 'Allowed',
      petPolicy: 'NotAllowed'
    }
  }
});

// Book venue
const { data } = await client.mutate({
  mutation: VenueQueries.BOOK_VENUE,
  variables: {
    input: {
      venueId: 'venue_id',
      eventDate: '2025-12-25',
      startTime: '18:00',
      endTime: '23:00',
      eventType: 'Wedding',
      guestCount: 250,
      setupRequired: true,
      cateringRequired: false
    }
  }
});
```

### 🏡 FarmHouse Services

#### Core Features
- **Property Management**: Detailed farmhouse specifications and amenities
- **Accommodation**: Room count, bathroom count, guest capacity
- **Pricing**: Per night, per day pricing with weekend/holiday surcharges
- **Stay Management**: Minimum stay requirements, check-in/out times
- **Activities**: Outdoor (horse riding, fishing, hiking) and indoor activities
- **Amenities**: Full kitchen, pool, jacuzzi, fireplace, garden, BBQ area
- **Dining Options**: Self-catering, farm-to-table, organic meals
- **Accessibility**: Wheelchair access, safety features
- **Policies**: Pet-friendly options, smoking policies

#### Key Queries
```typescript
import { FarmHouseQueries } from './client-queries/services';

// Get farmhouses with filters
const { data } = await client.query({
  query: FarmHouseQueries.GET_FARMHOUSES,
  variables: {
    filters: {
      farmHouseType: ['LuxuryVilla', 'ModernFarmHouse'],
      city: ['Islamabad', 'Murree'],
      minCapacity: 8,
      maxCapacity: 20,
      amenities: ['Pool', 'Fireplace', 'FullKitchen', 'Garden'],
      outdoorActivities: ['HorseRiding', 'Fishing', 'Hiking'],
      petPolicy: ['PetsWelcome'],
      minPricePerNight: 10000,
      maxPricePerNight: 50000
    }
  }
});

// Get farmhouse availability
const { data } = await client.query({
  query: FarmHouseQueries.GET_FARMHOUSE_AVAILABILITY,
  variables: {
    farmHouseId: 'farmhouse_id',
    startDate: '2025-12-20',
    endDate: '2025-12-30'
  }
});
```

#### Key Mutations
```typescript
// Create farmhouse
const { data } = await client.mutate({
  mutation: FarmHouseQueries.CREATE_FARMHOUSE,
  variables: {
    input: {
      farmHouseName: 'Mountain View Luxury Villa',
      farmHouseType: 'LuxuryVilla',
      capacity: 12,
      numberOfRooms: 5,
      numberOfBathrooms: 4,
      location: 'Murree Hills',
      address: 'Mall Road, Murree',
      city: 'Murree',
      perNightPrice: 25000,
      minimumStayNights: 2,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      amenities: [
        'FullKitchen', 'Fireplace', 'Pool', 'Garden', 
        'Barbecue', 'Parking', 'WiFi'
      ],
      outdoorActivities: ['Hiking', 'Fishing', 'Cycling'],
      petPolicy: 'PetsWelcome'
    }
  }
});

// Book farmhouse
const { data } = await client.mutate({
  mutation: FarmHouseQueries.BOOK_FARMHOUSE,
  variables: {
    input: {
      farmHouseId: 'farmhouse_id',
      checkInDate: '2025-12-25',
      checkOutDate: '2025-12-27',
      guestCount: 10,
      purpose: 'Family Vacation',
      specialRequests: 'Need baby crib and high chair'
    }
  }
});
```

## 🔄 Common Operations

### Search & Filtering

All services support comprehensive search and filtering:

```typescript
// Location-based search
const nearbyServices = await client.query({
  query: VenueQueries.GET_VENUES_BY_COORDINATES,
  variables: {
    latitude: 24.8607,
    longitude: 67.0011,
    radius: 10, // 10km radius
    filters: { venueType: ['WeddingVenue'] }
  }
});

// Text search
const searchResults = await client.query({
  query: CateringQueries.SEARCH_CATERING_PACKAGES,
  variables: {
    searchTerm: 'wedding catering',
    filters: { cuisineType: ['Pakistani'] }
  }
});
```

### Reviews & Ratings

```typescript
// Add review
await client.mutate({
  mutation: CateringQueries.ADD_CATERING_PACKAGE_REVIEW,
  variables: {
    input: {
      packageId: 'package_id',
      rating: 5,
      comment: 'Excellent food and service!'
    }
  }
});
```

### File Uploads

```typescript
// Upload images
await client.mutate({
  mutation: VenueQueries.UPLOAD_VENUE_IMAGES,
  variables: {
    venueId: 'venue_id',
    images: fileArray
  }
});
```

## 📱 React Hooks Usage

```typescript
// Using catering service hooks
import { useCateringPackages, useCateringService } from './hooks/useCateringService';

const CateringList = () => {
  const { packages, loading, error, updateFilters } = useCateringPackages({
    cuisineType: ['Pakistani'],
    location: 'Karachi'
  });

  const { book } = useCateringService();

  const handleBook = async (packageId: string) => {
    try {
      await book({
        packageId,
        eventDate: '2025-12-25',
        eventTime: '19:00',
        guestCount: 150
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.packageName}</h3>
          <p>Price: Rs. {pkg.pricePerPerson} per person</p>
          <button onClick={() => handleBook(pkg.id)}>
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Advanced Features

### Multi-Service Search

```typescript
// Search across all service types
const universalSearch = async (searchTerm: string, location: string) => {
  const [catering, photography, venues, farmhouses] = await Promise.all([
    client.query({
      query: CateringQueries.SEARCH_CATERING_PACKAGES,
      variables: { searchTerm, filters: { location } }
    }),
    client.query({
      query: PhotographyQueries.SEARCH_PHOTOGRAPHY_PACKAGES,
      variables: { searchTerm, filters: { location } }
    }),
    client.query({
      query: VenueQueries.SEARCH_VENUES,
      variables: { searchTerm, filters: { location } }
    }),
    client.query({
      query: FarmHouseQueries.SEARCH_FARMHOUSES,
      variables: { searchTerm, filters: { location } }
    })
  ]);

  return {
    catering: catering.data.searchCateringPackages.packages,
    photography: photography.data.searchPhotographyPackages.packages,
    venues: venues.data.searchVenues.venues,
    farmhouses: farmhouses.data.searchFarmHouses.farmHouses
  };
};
```

### Real-time Availability

```typescript
// Check real-time availability across services
const checkAvailability = async (date: string, location: string) => {
  // Check venue availability
  const venueAvailability = await client.query({
    query: VenueQueries.GET_VENUES_BY_LOCATION,
    variables: {
      location,
      filters: { 
        availabilityStatus: ['Available'] 
      }
    }
  });

  // Check farmhouse availability
  const farmhouseAvailability = await client.query({
    query: FarmHouseQueries.GET_FARMHOUSES_BY_LOCATION,
    variables: {
      location,
      filters: { 
        availabilityStatus: ['Available'],
        checkInDate: date,
        checkOutDate: date
      }
    }
  });

  return {
    venues: venueAvailability.data.venuesByLocation.venues,
    farmhouses: farmhouseAvailability.data.farmHousesByLocation.farmHouses
  };
};
```

## 🔒 Permission System

- **Users**: Can browse, book services, add reviews
- **Vendors**: Can manage their services, respond to bookings, update availability
- **Admins**: Can manage all services and users

## 📊 Analytics & Insights

Track service performance, booking patterns, and user preferences with built-in analytics support.

## 🔮 Future Enhancements

- **AI-powered Recommendations**: Smart service suggestions based on user preferences
- **Dynamic Pricing**: Real-time pricing based on demand and availability
- **Integration APIs**: Third-party calendar and payment gateway integrations
- **Mobile SDK**: React Native hooks and components
- **Offline Support**: Cached data for offline browsing

This comprehensive service system provides everything needed to build a complete event planning and booking platform with professional-grade features and scalability.
