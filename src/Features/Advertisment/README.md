# Advertisement System - Client-Side Implementation Guide

## Overview

This comprehensive Advertisement system provides complete functionality for managing service ads, external ads, payments, and analytics with robust admin controls and vendor management capabilities.

## 🎯 **System Architecture**

### **Backend Components**
- **Model Layer**: Database operations with Drizzle ORM
- **Service Layer**: Business logic and validation
- **GraphQL Schema**: Complete type definitions and resolvers
- **Payment Integration**: Comprehensive payment tracking
- **Analytics Engine**: Real-time performance metrics

### **Client-Side Components**
- **GraphQL Queries**: 25+ optimized queries for all user types
- **GraphQL Mutations**: 20+ mutations for complete CRUD operations
- **TypeScript Types**: 100+ type definitions for complete type safety
- **React Hooks**: 30+ custom hooks for easy integration
- **Form Validation**: Built-in validation helpers

## 🚀 **Features Overview**

### **🔧 Core Functionality**

#### **1. Ad Request Management**
- **Vendor Requests**: Create, update, cancel ad requests
- **Admin Review**: Approve, reject, review with notes
- **Status Tracking**: Pending, approved, rejected, under review
- **Bulk Operations**: Mass approve/reject requests

#### **2. Service Ad Management** 
- **Ad Lifecycle**: Activate, pause, resume, expire, cancel
- **Duration Control**: Extend ad duration
- **Performance Tracking**: Impressions, clicks, conversions
- **Targeting**: Audience targeting capabilities

#### **3. External Ad Management**
- **Third-party Ads**: Create and manage external advertisements
- **Revenue Generation**: Direct monetization through external advertisers
- **Click Tracking**: Monitor external ad performance
- **Admin Controls**: Complete management interface

#### **4. Payment System**
- **Payment Tracking**: Complete payment lifecycle management
- **Multiple Methods**: Credit card, bank transfer, mobile payments
- **Invoice Management**: Automated invoice generation
- **Revenue Analytics**: Detailed financial reporting

#### **5. Analytics & Reporting**
- **Performance Metrics**: CTR, conversion rates, ROI
- **Revenue Analytics**: Daily, monthly, yearly reports
- **Top Performers**: Best performing ads identification
- **Dashboard Statistics**: Real-time overview

## 📊 **User Roles & Permissions**

### **🔑 Public Users**
```typescript
// View active ads
const { data: ads } = useActiveAds({ adType: 'Featured' });

// Get homepage ads
const { data: homeAds } = useHomePageAds();

// Track ad interactions
const handleAdClick = useHandleAdClick();
```

### **🏪 Vendors**
```typescript
// Manage ad requests
const [createRequest] = useCreateAdRequest();
const { data: myRequests } = useMyAdRequests();

// View payments
const { data: payments } = useMyPayments();

// Dashboard overview
const { data: dashboard } = useVendorAdDashboard();
```

### **👑 Administrators**
```typescript
// Review ad requests
const [approveRequest] = useApproveAdRequest();
const { data: pendingRequests } = usePendingAdRequests();

// Manage service ads
const [pauseAd] = usePauseServiceAd();
const [resumeAd] = useResumeServiceAd();

// Analytics
const { data: stats } = useDashboardStats();
const { data: revenue } = useRevenueAnalytics();
```

## 🎨 **Frontend Integration Examples**

### **1. Public Ad Display Component**
```typescript
import { useFeaturedAds, useTrackAdImpression, useHandleAdClick } from '../hooks';

function FeaturedAdsCarousel() {
  const { data: ads, loading, error } = useFeaturedAds();
  const handleClick = useHandleAdClick();

  if (loading) return <AdSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="ads-carousel">
      {ads?.getFeaturedAds.map(ad => (
        <AdCard
          key={ad.id}
          ad={ad}
          onClick={() => handleClick(ad.id, false, `/services/${ad.entityId}`)}
          onImpression={() => useTrackAdImpression(ad.id, false)}
        />
      ))}
    </div>
  );
}
```

### **2. Vendor Ad Management Dashboard**
```typescript
import { useVendorAdDashboard, useCreateAdRequest } from '../hooks';

function VendorAdDashboard() {
  const { data: dashboard, loading } = useVendorAdDashboard();
  const [createRequest, { loading: creating }] = useCreateAdRequest();

  const handleCreateRequest = async (formData: CreateAdRequestInput) => {
    try {
      await createRequest({ variables: { input: formData } });
      toast.success('Ad request created successfully!');
    } catch (error) {
      toast.error('Failed to create ad request');
    }
  };

  return (
    <div className="vendor-dashboard">
      <StatsCards dashboard={dashboard} />
      <AdRequestsTable requests={dashboard?.myAdRequests} />
      <ActiveAdsGrid ads={dashboard?.myActiveAds} />
      <PaymentHistory payments={dashboard?.myPayments} />
      
      <CreateAdRequestModal 
        onSubmit={handleCreateRequest}
        loading={creating}
      />
    </div>
  );
}
```

### **3. Admin Review Interface**
```typescript
import { 
  usePendingAdRequests, 
  useApproveAdRequest, 
  useRejectAdRequest,
  useBulkAdOperations 
} from '../hooks';

function AdminReviewPanel() {
  const { data: requests, loading } = usePendingAdRequests();
  const [approveRequest] = useApproveAdRequest();
  const [rejectRequest] = useRejectAdRequest();
  const { selectedIds, toggleSelection, clearSelection } = useBulkAdOperations();

  const handleApprove = async (id: string, approvalData: ApproveAdRequestInput) => {
    try {
      await approveRequest({ variables: { id, input: approvalData } });
      toast.success('Ad request approved!');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id: string, notes: string) => {
    try {
      await rejectRequest({ variables: { id, adminNotes: notes } });
      toast.success('Ad request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  return (
    <div className="admin-review-panel">
      <BulkActions 
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
      />
      
      <RequestsTable
        requests={requests?.getPendingAdRequests}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
      />
    </div>
  );
}
```

### **4. Analytics Dashboard**
```typescript
import { 
  useDashboardStats, 
  useRevenueAnalytics, 
  useTopPerformingAds,
  useAdAnalyticsWithCache 
} from '../hooks';

function AnalyticsDashboard() {
  const { data: stats } = useDashboardStats();
  const { data: revenue } = useRevenueAnalytics({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  const { data: topAds } = useTopPerformingAds({ limit: 10 });

  return (
    <div className="analytics-dashboard">
      <StatsOverview stats={stats?.getDashboardStats} />
      
      <RevenueChart 
        data={revenue?.getRevenueAnalytics.dailyRevenue}
        totalRevenue={revenue?.getRevenueAnalytics.totalRevenue}
      />
      
      <TopPerformersTable ads={topAds?.getTopPerformingAds} />
      
      <PerformanceMetrics />
    </div>
  );
}
```

## 🔧 **Advanced Usage Patterns**

### **1. Real-time Ad Tracking**
```typescript
function AdCard({ ad }: { ad: ServiceAd }) {
  const [recordImpression] = useRecordImpression();
  const [recordClick] = useRecordClick();
  const [recordConversion] = useRecordConversion();

  // Auto-track impression on mount
  useEffect(() => {
    recordImpression({ 
      variables: { adId: ad.id, isExternal: false } 
    });
  }, [ad.id]);

  const handleClick = async () => {
    await recordClick({ 
      variables: { adId: ad.id, isExternal: false } 
    });
    
    // Navigate to service page
    router.push(`/services/${ad.entityId}`);
  };

  const handleBooking = async () => {
    await recordConversion({ 
      variables: { adId: ad.id } 
    });
    
    // Handle booking flow
    startBookingProcess(ad.entityId);
  };

  return (
    <div className="ad-card" onClick={handleClick}>
      <img src={ad.adImage} alt={ad.adTitle} />
      <h3>{ad.adTitle}</h3>
      <p>{ad.adDescription}</p>
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
}
```

### **2. Form Validation with Custom Hook**
```typescript
function CreateAdRequestForm() {
  const [formData, setFormData] = useState<CreateAdRequestInput>({
    adType: AdType.Featured,
    entityType: EntityType.Venue,
    entityId: '',
    adTitle: '',
    requestedPrice: 0,
    requestedStartDate: '',
    requestedEndDate: '',
  });

  const { validateAdRequest } = useAdFormValidation();
  const [createRequest, { loading }] = useCreateAdRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateAdRequest(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    try {
      await createRequest({ variables: { input: formData } });
      toast.success('Ad request submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit ad request');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with validation */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
```

### **3. Bulk Operations Interface**
```typescript
function BulkAdManagement() {
  const { data: requests } = useAllAdRequests();
  const { 
    selectedIds, 
    toggleSelection, 
    selectAll, 
    clearSelection 
  } = useBulkAdOperations();
  
  const [bulkApprove] = useBulkApproveAdRequests();
  const [bulkReject] = useBulkRejectAdRequests();

  const handleBulkApprove = async () => {
    const approvalData = {
      finalPrice: 100,
      adminStartDate: new Date().toISOString(),
      adminEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      await bulkApprove({
        variables: { ids: selectedIds, input: approvalData }
      });
      toast.success(`Approved ${selectedIds.length} requests`);
      clearSelection();
    } catch (error) {
      toast.error('Bulk approval failed');
    }
  };

  return (
    <div className="bulk-management">
      <div className="bulk-actions">
        <button onClick={() => selectAll(requests?.map(r => r.id) || [])}>
          Select All
        </button>
        <button onClick={clearSelection}>Clear Selection</button>
        <button 
          onClick={handleBulkApprove}
          disabled={selectedIds.length === 0}
        >
          Approve Selected ({selectedIds.length})
        </button>
      </div>

      <RequestsList 
        requests={requests}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
      />
    </div>
  );
}
```

## 📱 **Mobile Optimization**

### **React Native Integration**
```typescript
// Same hooks work in React Native
import { useFeaturedAds, useHandleAdClick } from '../hooks';

function MobileAdBanner() {
  const { data: ads } = useFeaturedAds();
  const handleClick = useHandleAdClick();

  return (
    <ScrollView horizontal>
      {ads?.getFeaturedAds.map(ad => (
        <TouchableOpacity
          key={ad.id}
          onPress={() => handleClick(ad.id, false)}
        >
          <Image source={{ uri: ad.adImage }} />
          <Text>{ad.adTitle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

## 🔐 **Security & Best Practices**

### **1. Role-based Access Control**
```typescript
function useAdminOnlyQueries() {
  const { user } = useAuth();
  
  const { data: adminStats } = useDashboardStats({
    skip: user?.role !== 'admin'
  });
  
  return { adminStats: user?.role === 'admin' ? adminStats : null };
}
```

### **2. Error Handling**
```typescript
function AdRequestForm() {
  const [createRequest, { loading, error }] = useCreateAdRequest();

  const handleSubmit = async (data: CreateAdRequestInput) => {
    try {
      await createRequest({ variables: { input: data } });
    } catch (err) {
      if (err.networkError) {
        toast.error('Network error. Please check your connection.');
      } else if (err.graphQLErrors?.length) {
        toast.error(err.graphQLErrors[0].message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };
}
```

### **3. Optimistic Updates**
```typescript
const [updateRequest] = useUpdateAdRequest({
  optimisticResponse: {
    updateAdRequest: {
      ...currentRequest,
      ...updateData,
    }
  },
  update: (cache, { data }) => {
    // Update cache immediately
    cache.writeQuery({
      query: GET_MY_AD_REQUESTS,
      data: {
        getMyAdRequests: updatedRequests
      }
    });
  }
});
```

## 📈 **Performance Optimization**

### **1. Query Optimization**
```typescript
// Use fragments to avoid over-fetching
const AD_SUMMARY_FRAGMENT = gql`
  fragment AdSummary on ServiceAd {
    id
    adTitle
    adType
    status
    impressionCount
    clickCount
  }
`;

// Pagination for large datasets
const { data, fetchMore } = useAllServiceAds({
  variables: { limit: 20, offset: 0 }
});
```

### **2. Caching Strategy**
```typescript
// Cache policy for frequently accessed data
const { data } = useFeaturedAds({
  fetchPolicy: 'cache-first',
  nextFetchPolicy: 'cache-and-network'
});
```

## 🚀 **Production Deployment**

### **Environment Configuration**
```env
# GraphQL Endpoint
REACT_APP_GRAPHQL_URI=https://api.yourapp.com/graphql

# Ad Tracking
REACT_APP_ENABLE_AD_TRACKING=true
REACT_APP_AD_REFRESH_INTERVAL=300000

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXXXXX-X
```

### **Docker Setup**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 **Next Steps**

1. **Install Dependencies**:
   ```bash
   npm install @apollo/client graphql react @types/react
   ```

2. **Configure Apollo Client**:
   ```typescript
   import { ApolloClient, InMemoryCache } from '@apollo/client';
   
   const client = new ApolloClient({
     uri: process.env.REACT_APP_GRAPHQL_URI,
     cache: new InMemoryCache(),
   });
   ```

3. **Import and Use Hooks**:
   ```typescript
   import { useFeaturedAds, useCreateAdRequest } from './Advertisement/hooks';
   ```

4. **Build Your UI**: Use the provided hooks to build your advertisement interface

5. **Deploy**: Follow the production deployment guide

## 📞 **Support & Customization**

The Advertisement system is fully documented and ready for production use with:
- ✅ Complete type safety
- ✅ Comprehensive error handling  
- ✅ Real-time tracking capabilities
- ✅ Admin dashboard functionality
- ✅ Mobile-optimized components
- ✅ Performance optimizations
- ✅ Security best practices

For additional customization or support, refer to the inline code documentation and TypeScript interfaces for detailed API specifications.
