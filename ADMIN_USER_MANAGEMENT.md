# Admin User & Vendor Management API

This document describes the GraphQL API endpoints available for administrators to manage both users and vendors in the EvOrgs system.

## Prerequisites

- Admin must be authenticated with a valid JWT token
- Admin role must be assigned to the user making the request

## User Management

### Available User Queries and Mutations

### 1. List All Users

**Query:** `adminListAllUsers`

**Description:** Retrieves a paginated list of all users in the system.

```graphql
query AdminListAllUsers($input: ListUsersInput) {
  adminListAllUsers(input: $input) {
    users {
      id
      firstName
      lastName
      email
      phone
      address
      profileImage
      dateOfBirth
      gender
      createdAt
      isVerified
    }
    total
    page
    limit
    totalPages
  }
}
```

### 2. Get User by ID

**Query:** `adminGetUserById`

```graphql
query AdminGetUserById($userId: ID!) {
  adminGetUserById(userId: $userId) {
    id
    firstName
    lastName
    email
    phone
    address
    fcmToken
    profileImage
    dateOfBirth
    gender
    createdAt
    isVerified
  }
}
```

### 3. Delete User

**Mutation:** `adminDeleteUser`

```graphql
mutation AdminDeleteUser($userId: ID!) {
  adminDeleteUser(userId: $userId)
}
```

## Vendor Management

### Available Vendor Queries and Mutations

### 1. List All Vendors

**Query:** `adminListAllVendors`

**Description:** Retrieves a paginated list of all vendors in the system with filtering options.

```graphql
query AdminListAllVendors($input: ListVendorsInput) {
  adminListAllVendors(input: $input) {
    vendors {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorProfileDescription
      vendorWebsite
      vendorSocialLinks
      profileImage
      bannerImage
      vendorType
      vendorStatus
      vendorTypeId
      rating
      reviewCount
      createdAt
      updatedAt
    }
    total
    page
    limit
    totalPages
  }
}
```

**Variables:**
```json
{
  "input": {
    "page": 1,
    "limit": 10,
    "search": "optional search term",
    "status": "Pending|Approved|Rejected",
    "vendorType": "FarmHouse|Venue|Catering|Photography"
  }
}
```

### 2. Get Vendor by ID

**Query:** `adminGetVendorById`

**Description:** Retrieves detailed information about a specific vendor.

```graphql
query AdminGetVendorById($vendorId: ID!) {
  adminGetVendorById(vendorId: $vendorId) {
    id
    vendorName
    vendorEmail
    vendorPhone
    fcmToken
    vendorAddress
    vendorProfileDescription
    vendorWebsite
    vendorSocialLinks
    profileImage
    bannerImage
    vendorType
    vendorStatus
    vendorTypeId
    rating
    reviewCount
    createdAt
    updatedAt
  }
}
```

### 3. Delete Vendor

**Mutation:** `adminDeleteVendor`

**Description:** Permanently deletes a vendor from the system.

```graphql
mutation AdminDeleteVendor($vendorId: ID!) {
  adminDeleteVendor(vendorId: $vendorId)
}
```

### 4. Update Vendor Status

**Mutation:** `adminUpdateVendorStatus`

**Description:** Updates the approval status of a vendor (Pending/Approved/Rejected).

```graphql
mutation AdminUpdateVendorStatus($input: UpdateVendorStatusInput!) {
  adminUpdateVendorStatus(input: $input)
}
```

**Variables:**
```json
{
  "input": {
    "vendorId": "vendor-uuid-here",
    "status": "Approved",
    "message": "Optional approval/rejection message"
  }
}
```

## Usage Examples

### Example 1: Get Pending Vendors

```javascript
const GET_PENDING_VENDORS = gql`
  query GetPendingVendors {
    adminListAllVendors(input: { status: Pending, page: 1, limit: 20 }) {
      vendors {
        id
        vendorName
        vendorEmail
        vendorType
        vendorStatus
        createdAt
      }
      total
      totalPages
    }
  }
`;
```

### Example 2: Search Vendors by Type

```javascript
const GET_CATERING_VENDORS = gql`
  query GetCateringVendors {
    adminListAllVendors(input: { vendorType: Catering, page: 1, limit: 15 }) {
      vendors {
        id
        vendorName
        vendorEmail
        vendorStatus
        rating
        reviewCount
      }
      total
    }
  }
`;
```

### Example 3: Approve a Vendor

```javascript
const APPROVE_VENDOR = gql`
  mutation ApproveVendor($vendorId: ID!) {
    adminUpdateVendorStatus(input: { 
      vendorId: $vendorId, 
      status: Approved,
      message: "Your vendor profile has been approved!"
    })
  }
`;
```

### Example 4: Search Vendors by Name or Email

```javascript
const SEARCH_VENDORS = gql`
  query SearchVendors($searchTerm: String!) {
    adminListAllVendors(input: { search: $searchTerm, page: 1, limit: 20 }) {
      vendors {
        id
        vendorName
        vendorEmail
        vendorType
        vendorStatus
      }
      total
    }
  }
`;
```

## Response Formats

### VendorListResponse
```typescript
{
  vendors: Vendor[];          // Array of vendor objects
  total: number;              // Total number of vendors matching criteria
  page: number;               // Current page number
  limit: number;              // Number of items per page
  totalPages: number;         // Total number of pages
}
```

### Vendor Object
```typescript
{
  id: string;                 // Unique vendor identifier
  vendorName: string;         // Vendor's business name
  vendorEmail: string;        // Vendor's email address
  vendorPhone?: string;       // Vendor's phone number (optional)
  fcmToken: string[];         // Array of FCM tokens for push notifications
  vendorAddress?: string;     // Vendor's business address (optional)
  vendorProfileDescription?: string; // Vendor's business description (optional)
  vendorWebsite?: string;     // Vendor's website URL (optional)
  vendorSocialLinks: string[]; // Array of social media links
  profileImage?: string;      // URL to vendor's profile image (optional)
  bannerImage?: string;       // URL to vendor's banner image (optional)
  vendorType: VendorType;     // Type of vendor (FarmHouse, Venue, Catering, Photography)
  vendorStatus: VendorStatus; // Approval status (Pending, Approved, Rejected)
  vendorTypeId?: string;      // Associated type-specific ID (optional)
  rating?: number;            // Average rating (optional)
  reviewCount: number;        // Number of reviews received
  createdAt: string;          // Account creation timestamp
  updatedAt: string;          // Last update timestamp
}
```

### Filter Options

#### VendorStatus
- `Pending` - Newly registered vendors awaiting approval
- `Approved` - Verified and active vendors
- `Rejected` - Vendors that were denied approval

#### VendorType
- `FarmHouse` - Farm house rental services
- `Venue` - Event venue providers
- `Catering` - Catering service providers
- `Photography` - Photography service providers

## Error Handling

All admin management operations include proper error handling:

1. **Authentication Errors:** Returns error if admin is not authenticated
2. **Authorization Errors:** Returns error if user doesn't have admin role
3. **Not Found Errors:** Returns error if requested user/vendor doesn't exist
4. **Validation Errors:** Returns error for invalid input parameters

## Security Considerations

- All operations require admin authentication
- User/vendor passwords are never returned in responses
- Soft delete could be implemented instead of hard delete for audit purposes
- Rate limiting should be implemented to prevent abuse
- Vendor status changes should be logged for audit trails

## Implementation Details

The admin management functionality is implemented across several files:

1. **UserModel** (`src/Features/Auth/User/model/index.ts`): User database operations
2. **VendorModel** (`src/Features/Auth/Vendor/model/index.ts`): Vendor database operations
3. **AdminService** (`src/Features/Auth/Admin/Service/index.ts`): Business logic for both users and vendors
4. **AdminTypeDefs** (`src/Features/Auth/Admin/GraphQL/TypeDefs/index.ts`): GraphQL schema
5. **AdminResolver** (`src/Features/Auth/Admin/GraphQL/Resolver/index.ts`): GraphQL resolvers

## Testing

To test these endpoints, use GraphQL Playground, Postman, or any GraphQL client. Include the admin JWT token in the Authorization header:

```
Authorization: Bearer <admin-jwt-token>
```
