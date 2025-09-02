# Vendor Management API for Vendors

This document describes the GraphQL API endpoints available for **approved vendors** to manage other vendors and users in the EvOrgs system.

## Prerequisites

- Vendor must be authenticated with a valid JWT token
- Vendor must have "Approved" status to access management features
- Only approved vendors can manage other vendors and users

## Security Model

### Access Control
- ✅ **Authentication Required:** All operations require vendor JWT token
- ✅ **Status-based Authorization:** Only approved vendors can access management features
- ✅ **Self-Management Restriction:** Vendors cannot change their own status
- ✅ **User Verification:** Vendors can verify users but not delete them

## Vendor Management Features

### 1. List All Vendors

**Query:** `vendorListAllVendors`

**Description:** Approved vendors can view and manage other vendors with pagination and filtering.

```graphql
query VendorListAllVendors($input: ListVendorsInput) {
  vendorListAllVendors(input: $input) {
    vendors {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorType
      vendorStatus
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

### 2. Get Vendor Details

**Query:** `vendorGetVendorById`

```graphql
query VendorGetVendorById($vendorId: ID!) {
  vendorGetVendorById(vendorId: $vendorId) {
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
    rating
    reviewCount
    createdAt
    updatedAt
  }
}
```

### 3. Update Vendor Status

**Mutation:** `vendorUpdateVendorStatus`

**Description:** Approved vendors can approve or reject other vendors (but not themselves).

```graphql
mutation VendorUpdateVendorStatus($input: VendorUpdateStatusInput!) {
  vendorUpdateVendorStatus(input: $input)
}
```

**Variables:**
```json
{
  "input": {
    "vendorId": "vendor-uuid-here",
    "status": "Approved",
    "message": "Welcome to our vendor network!"
  }
}
```

## User Management Features

### 1. List All Users

**Query:** `vendorListAllUsers`

**Description:** Approved vendors can view all users with pagination and search.

```graphql
query VendorListAllUsers($input: ListUsersInput) {
  vendorListAllUsers(input: $input) {
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

**Variables:**
```json
{
  "input": {
    "page": 1,
    "limit": 10,
    "search": "optional search term"
  }
}
```

### 2. Get User Details

**Query:** `vendorGetUserById`

```graphql
query VendorGetUserById($userId: ID!) {
  vendorGetUserById(userId: $userId) {
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

### 3. Verify User

**Mutation:** `vendorVerifyUser`

**Description:** Approved vendors can verify users (set isVerified to true).

```graphql
mutation VendorVerifyUser($userId: ID!) {
  vendorVerifyUser(userId: $userId)
}
```

## Usage Examples

### Example 1: Approve a Pending Vendor

```javascript
const APPROVE_VENDOR = gql`
  mutation ApproveVendor($vendorId: ID!) {
    vendorUpdateVendorStatus(input: { 
      vendorId: $vendorId, 
      status: Approved,
      message: "Your vendor profile meets our standards. Welcome!"
    })
  }
`;

// Usage
const { mutate } = useMutation(APPROVE_VENDOR);
await mutate({ 
  variables: { vendorId: "vendor-123" }
});
```

### Example 2: View Pending Vendors for Approval

```javascript
const GET_PENDING_VENDORS = gql`
  query GetPendingVendors {
    vendorListAllVendors(input: { status: Pending, page: 1, limit: 20 }) {
      vendors {
        id
        vendorName
        vendorEmail
        vendorType
        createdAt
      }
      total
    }
  }
`;
```

### Example 3: Verify an Unverified User

```javascript
const VERIFY_USER = gql`
  mutation VerifyUser($userId: ID!) {
    vendorVerifyUser(userId: $userId)
  }
`;

// Usage
const { mutate } = useMutation(VERIFY_USER);
await mutate({ 
  variables: { userId: "user-456" }
});
```

### Example 4: Search for Users to Verify

```javascript
const SEARCH_UNVERIFIED_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    vendorListAllUsers(input: { search: $searchTerm, page: 1, limit: 15 }) {
      users {
        id
        firstName
        lastName
        email
        isVerified
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
  total: number;              // Total number of vendors
  page: number;               // Current page number
  limit: number;              // Items per page
  totalPages: number;         // Total number of pages
}
```

### UserListResponse
```typescript
{
  users: User[];              // Array of user objects
  total: number;              // Total number of users
  page: number;               // Current page number
  limit: number;              // Items per page
  totalPages: number;         // Total number of pages
}
```

## Authorization Rules

### What Vendors CAN Do:
- ✅ View all vendors and users
- ✅ Search vendors and users
- ✅ Approve/reject other vendors
- ✅ Verify users (mark as verified)
- ✅ View detailed vendor and user information

### What Vendors CANNOT Do:
- ❌ Change their own vendor status
- ❌ Delete other vendors or users
- ❌ Access admin-only functions
- ❌ Modify user/vendor personal information
- ❌ Access functionality if not approved

## Error Handling

### Common Errors:

1. **UNAUTHENTICATED** - Vendor not logged in
2. **FORBIDDEN** - Vendor not approved or trying to modify own status
3. **NOT_FOUND** - Requested vendor/user doesn't exist
4. **BAD_USER_INPUT** - Invalid input or user already verified

### Example Error Response:
```json
{
  "errors": [
    {
      "message": "Unauthorized: Only approved vendors can access vendor management",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

## Implementation Details

The vendor management functionality is implemented in:

1. **VendorService** (`src/Features/Auth/Vendor/Service/index.ts`): Business logic
2. **VendorTypeDefs** (`src/Features/Auth/Vendor/GraphQL/TypeDefs/index.ts`): GraphQL schema
3. **VendorResolvers** (`src/Features/Auth/Vendor/GraphQL/Resolver/index.ts`): GraphQL resolvers
4. **VendorModel** (`src/Features/Auth/Vendor/model/index.ts`): Database operations
5. **UserModel** (`src/Features/Auth/User/model/index.ts`): User database operations

## Security Considerations

- All vendor management operations require approved vendor status
- Vendors cannot escalate their own privileges
- User verification is limited to status change only
- All operations are logged and traceable
- Rate limiting should be implemented for management operations

## Best Practices

1. **Approval Workflow:** Use status messages to communicate reasons for approval/rejection
2. **User Verification:** Verify users only after proper validation
3. **Search Optimization:** Use specific search terms for better performance
4. **Pagination:** Always use reasonable page limits (10-50 items)
5. **Error Handling:** Implement proper error handling for all operations

## Testing

Test these endpoints using GraphQL Playground or any GraphQL client with vendor JWT token:

```
Authorization: Bearer <vendor-jwt-token>
```

Make sure the vendor has "Approved" status before testing management operations.
