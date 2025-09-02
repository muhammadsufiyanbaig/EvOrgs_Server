# Admin Photography Custom Order Management

This module provides comprehensive admin functionality for managing photography custom orders across all vendors and users in the system.

## Overview

The admin functionality allows administrators to:
- View all photography custom orders with advanced filtering and pagination
- Search orders by various criteria (vendor, user, status, price, duration, event date, etc.)
- Update order status
- Delete orders
- Monitor high-value and long-duration orders
- Perform bulk operations
- Generate order statistics

## Features

### 1. **List All Orders**
- Paginated listing of all photography custom orders
- Advanced filtering options
- Multiple sorting criteria
- Real-time order counts

### 2. **Advanced Filtering**
- Filter by vendor ID
- Filter by user ID
- Filter by order status (Requested, Quoted, Accepted, Rejected)
- Price range filtering
- Event duration range filtering (in hours)
- Event date range filtering
- Search in order details (partial text matching)

### 3. **Sorting Options**
- Creation date (Oldest-Newest, Newest-Oldest)
- Price (Low-High, High-Low)
- Event date (Earliest-Latest, Latest-Earliest)
- Event duration (Shortest-Longest, Longest-Shortest)

### 4. **Order Management**
- Update order status
- Delete orders
- View detailed order information with user and vendor details

### 5. **Bulk Operations**
- Bulk status updates
- Bulk order deletion

### 6. **Analytics & Statistics**
- Order count by status
- Total order statistics
- Performance metrics

## API Structure

### GraphQL Queries

#### `adminGetAllCustomOrders`
Returns paginated list of photography custom orders with optional filtering.

**Input:**
```typescript
filters: AdminCustomOrderFilters {
  vendorId?: string
  userId?: string
  status?: 'Requested' | 'Quoted' | 'Accepted' | 'Rejected'
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  startDate?: string
  endDate?: string
  searchTerm?: string
  page?: number
  limit?: number
  sortBy?: string
}
```

**Response:**
```typescript
CustomOrderListResponse {
  orders: CustomOrder[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

#### `adminGetCustomOrder`
Returns detailed information for a specific order including user and vendor details.

**Input:**
```typescript
orderId: string
```

**Response:**
```typescript
CustomOrder {
  id: string
  vendorId: string
  userId: string
  orderDetails: string
  eventDate?: Date
  eventDuration?: number
  price?: number
  status: string
  createdAt: Date
  updatedAt: Date
  user?: User
  vendor?: Vendor
}
```

### GraphQL Mutations

#### `adminUpdateOrderStatus`
Updates the status of an order.

**Input:**
```typescript
orderId: string
status: 'Requested' | 'Quoted' | 'Accepted' | 'Rejected'
```

#### `adminDeleteOrder`
Deletes a photography custom order.

**Input:**
```typescript
orderId: string
```

## Usage Examples

### Basic Listing
```graphql
query GetAllOrders {
  adminGetAllCustomOrders {
    orders {
      id
      orderDetails
      vendorId
      userId
      price
      status
      eventDate
    }
    total
    totalPages
  }
}
```

### Advanced Filtering
```graphql
query FilteredOrders {
  adminGetAllCustomOrders(filters: {
    status: Requested
    minPrice: 500
    maxPrice: 3000
    minDuration: 4
    startDate: "2024-06-01"
    endDate: "2024-12-31"
    searchTerm: "wedding"
    sortBy: "price_desc"
    page: 1
    limit: 20
  }) {
    orders {
      id
      orderDetails
      price
      eventDuration
      eventDate
      status
    }
    total
    totalPages
    hasNextPage
  }
}
```

### Order Management
```graphql
mutation UpdateOrderStatus {
  adminUpdateOrderStatus(
    orderId: "order-id"
    status: Quoted
  ) {
    id
    status
    updatedAt
  }
}
```

## Filter Validation

The system includes comprehensive validation for all filter parameters:

1. **Price Range**: Non-negative values, min ≤ max
2. **Duration Range**: Non-negative values (in hours), min ≤ max
3. **Date Range**: Valid date strings, start ≤ end
4. **Pagination**: Page ≥ 1, Limit 1-100
5. **Text Search**: Case-insensitive partial matching in order details

## Security

- All admin operations require proper admin authentication
- Authorization checks prevent non-admin access
- Input validation prevents malformed requests
- Error handling provides meaningful feedback

## Performance Considerations

- Pagination prevents large data transfers
- Database indexes support efficient filtering
- Parallel query execution for count operations
- Optimized SQL generation through Drizzle ORM
- Type conversion handled properly for database compatibility

## Common Use Cases

### 1. **Dashboard Overview**
```typescript
// Get recent orders for dashboard
const recentOrders = await adminService.getRecentOrders(5);
```

### 2. **Order Management**
```typescript
// Get pending orders for review
const pendingOrders = await adminService.getPendingOrders();
```

### 3. **Financial Analysis**
```typescript
// Get accepted orders for revenue calculation
const acceptedOrders = await adminService.getAcceptedOrders();

// Get high-value orders
const premiumOrders = await adminService.getHighValueOrders(5000);
```

### 4. **Vendor Performance**
```typescript
// Get all orders for a specific vendor
const vendorOrders = await adminService.getOrdersByVendor(vendorId);
```

### 5. **Event Planning**
```typescript
// Get upcoming events
const upcomingEvents = await adminService.getUpcomingEvents();

// Get long duration events
const longEvents = await adminService.getLongDurationEvents(8);
```

### 6. **Bulk Operations**
```typescript
// Update multiple order statuses
await adminService.bulkUpdateStatus(orderIds, 'Accepted');

// Delete multiple orders
const result = await adminService.bulkDelete(orderIds);
```

### 7. **Statistics & Analytics**
```typescript
// Get comprehensive order statistics
const stats = await adminService.getOrderStatistics();
```

## Error Handling

Common error scenarios and responses:

- **Authentication Required**: `Admin authentication required`
- **Order Not Found**: `Order not found`
- **Invalid Price Range**: `Minimum price cannot be greater than maximum price`
- **Invalid Duration Range**: `Minimum duration cannot be greater than maximum duration`
- **Invalid Date Range**: `Start date cannot be after end date`
- **Invalid Pagination**: `Page number must be positive`
- **Invalid Limit**: `Limit must be between 1 and 100`

## File Structure

```
src/Features/Services/Photography/Custom/
├── Types/
│   └── index.ts                 # Type definitions including admin types
├── model/
│   └── index.ts                 # Database model with admin methods
├── Service/
│   └── index.ts                 # Business logic with admin services
├── GraphQL/
│   ├── TypeDefs/
│   │   └── index.ts             # GraphQL schema with admin types
│   └── Resolvers/
│       └── index.ts             # GraphQL resolvers with admin resolvers
├── docs/
│   └── admin-queries.md         # Comprehensive query examples
├── examples/
│   └── admin-service.ts         # TypeScript service examples
└── README.md                    # This documentation
```

## Integration

To use the admin functionality in your application:

1. **Import the service**: Use `AdminPhotographyOrderService` class
2. **Setup Apollo Client**: Configure with proper admin authentication
3. **Use React Hook**: Utilize `useAdminPhotographyOrders` for React apps
4. **Handle Errors**: Implement proper error handling and user feedback

## Data Model

### Order Status Flow
```
Requested → Quoted → Accepted/Rejected
```

### Key Fields
- **orderDetails**: Text description of the photography requirements
- **eventDate**: Date of the photography event
- **eventDuration**: Duration in hours
- **price**: Quoted price from vendor
- **status**: Current order status

## Future Enhancements

Potential improvements for the admin functionality:

1. **Advanced Analytics**: Order trends, conversion rates, vendor performance metrics
2. **Automated Workflows**: Auto-assignment, status transitions
3. **Communication Logs**: Track messages between users and vendors
4. **Export Functionality**: CSV/Excel export for reporting
5. **Real-time Notifications**: WebSocket updates for order changes
6. **Order Templates**: Common photography package templates
7. **Rating & Review Integration**: Post-order feedback management
8. **Calendar Integration**: Event scheduling and conflict detection

## Testing

The admin functionality includes comprehensive validation and error handling. Recommended testing approach:

1. **Unit Tests**: Test individual service methods and validation logic
2. **Integration Tests**: Test GraphQL resolvers and database operations
3. **End-to-End Tests**: Test complete admin workflows
4. **Performance Tests**: Test with large datasets and concurrent operations
5. **Security Tests**: Verify authentication and authorization

## Monitoring & Logging

Consider implementing:

1. **Query Performance Monitoring**: Track slow queries and optimize
2. **Admin Action Logging**: Audit trail for all admin operations
3. **Error Tracking**: Monitor and alert on failures
4. **Usage Analytics**: Track admin feature usage patterns

## Conclusion

The admin photography custom order management system provides powerful tools for administrators to effectively manage and monitor all photography orders in the platform. With comprehensive filtering, sorting, bulk operations, and analytics capabilities, administrators can efficiently handle large volumes of orders while maintaining data integrity and providing excellent service oversight.
