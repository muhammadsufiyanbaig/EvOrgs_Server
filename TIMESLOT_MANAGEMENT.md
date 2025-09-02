# Advertisement Time Slot Management System

## Overview

The Advertisement Time Slot Management System is a comprehensive solution that allows administrators to allocate specific time slots to vendor advertisements and automatically execute them using cron jobs. This system provides granular control over when advertisements are displayed, ensuring optimal ad placement and revenue optimization.

## Features

### 🕒 Time Slot Allocation
- **Flexible Time Slots**: Define start and end times for ad execution
- **Day-of-Week Scheduling**: Specify which days of the week ads should run
- **Priority System**: Set priority levels (1-5) for time slot conflicts
- **Availability Checking**: Real-time availability verification before scheduling

### 🤖 Automated Execution
- **Cron Job Integration**: Automated ad execution using node-cron
- **Retry Logic**: Automatic retry mechanism for failed executions
- **Execution Logging**: Detailed logs of all ad executions
- **Cleanup Jobs**: Automatic cleanup of old execution logs

### 📊 Schedule Management
- **Real-time Monitoring**: Live dashboard for upcoming and failed schedules
- **Bulk Operations**: Schedule multiple ads simultaneously
- **Pause/Resume**: Control ad schedule execution
- **Rescheduling**: Move ads to different time slots or dates

## Architecture

### Database Schema

#### 1. adTimeSlots Table
```sql
CREATE TABLE "adTimeSlots" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "adId" varchar(255) NOT NULL,
  "startTime" time NOT NULL,
  "endTime" time NOT NULL,
  "daysOfWeek" jsonb NOT NULL,  -- Array of numbers 0-6 (Sunday-Saturday)
  "priority" integer NOT NULL DEFAULT 3,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);
```

#### 2. adSchedules Table
```sql
CREATE TABLE "adSchedules" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "adId" varchar(255) NOT NULL,
  "timeSlotId" varchar(255) NOT NULL,
  "scheduledDate" date NOT NULL,
  "status" "ScheduleStatus" DEFAULT 'Scheduled',
  "executedAt" timestamp,
  "retryCount" integer DEFAULT 0,
  "maxRetries" integer DEFAULT 3,
  "nextRetry" timestamp,
  "failureReason" text,
  "metadata" jsonb,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);
```

#### 3. adExecutionLogs Table
```sql
CREATE TABLE "adExecutionLogs" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "scheduleId" varchar(255) NOT NULL,
  "executionTime" timestamp NOT NULL,
  "status" varchar(50) NOT NULL,
  "duration" integer,
  "impressions" integer DEFAULT 0,
  "clicks" integer DEFAULT 0,
  "errorMessage" text,
  "metadata" jsonb,
  "createdAt" timestamp DEFAULT now()
);
```

### GraphQL Schema

#### Types
```graphql
type TimeSlot {
  id: String!
  adId: String!
  startTime: String!
  endTime: String!
  daysOfWeek: [Int!]!
  priority: Int!
  createdAt: String!
  updatedAt: String!
}

type AdSchedule {
  id: String!
  adId: String!
  timeSlotId: String!
  scheduledDate: String!
  status: ScheduleStatus!
  executedAt: String
  retryCount: Int!
  maxRetries: Int!
  nextRetry: String
  failureReason: String
  metadata: JSON
  createdAt: String!
  updatedAt: String!
}

enum ScheduleStatus {
  Scheduled
  Running
  Completed
  Failed
  Cancelled
  Paused
}
```

#### Queries
```graphql
type Query {
  getAvailableTimeSlots(date: String!, adType: String): [TimeSlotAvailability!]!
  getAdSchedules(adId: String, status: ScheduleStatus, date: String): [AdScheduleInfo!]!
  getUpcomingSchedules(limit: Int): [AdSchedule!]!
  getFailedSchedules(limit: Int): [AdSchedule!]!
}
```

#### Mutations
```graphql
type Mutation {
  approveAdRequestWithTimeSlots(id: String!, input: ApproveAdRequestWithTimeSlotsInput!): ServiceAd!
  updateAdTimeSlots(adId: String!, timeSlots: [TimeSlotInput!]!): ServiceAd!
  scheduleAdRun(adId: String!, timeSlotId: String!, scheduledDate: String!): AdSchedule!
  cancelScheduledRun(scheduleId: String!): AdSchedule!
  rescheduleAdRun(scheduleId: String!, newDate: String!, newTimeSlotId: String): AdSchedule!
  retryFailedSchedule(scheduleId: String!): AdSchedule!
  pauseAdSchedule(adId: String!): ServiceAd!
  resumeAdSchedule(adId: String!): ServiceAd!
  bulkScheduleAds(adIds: [String!]!, timeSlots: [TimeSlotInput!]!, dateRange: String!): [AdSchedule!]!
}
```

## Usage Examples

### 1. Admin Approving Ad Request with Time Slots

```typescript
const approvalInput = {
  finalPrice: 500.00,
  adminStartDate: "2024-02-01",
  adminEndDate: "2024-02-28",
  adminNotes: "Approved with prime time slots",
  timeSlots: [
    {
      startTime: "09:00",
      endTime: "12:00",
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      priority: 1
    },
    {
      startTime: "18:00",
      endTime: "21:00",
      daysOfWeek: [6, 0], // Saturday and Sunday
      priority: 2
    }
  ]
};

const result = await client.mutate({
  mutation: APPROVE_AD_REQUEST_WITH_TIME_SLOTS,
  variables: {
    id: "ad-request-123",
    input: approvalInput
  }
});
```

### 2. Checking Time Slot Availability

```typescript
const { data } = await client.query({
  query: GET_AVAILABLE_TIME_SLOTS,
  variables: {
    date: "2024-02-15",
    adType: "BANNER"
  }
});

// Response shows available time slots and conflicts
data.getAvailableTimeSlots.forEach(slot => {
  console.log(`${slot.timeSlot}: ${slot.availability.isAvailable ? 'Available' : 'Conflicted'}`);
  if (!slot.availability.isAvailable) {
    console.log('Conflicts with:', slot.availability.conflictingAds);
  }
});
```

### 3. Scheduling a Specific Ad Run

```typescript
const schedule = await client.mutate({
  mutation: SCHEDULE_AD_RUN,
  variables: {
    adId: "ad-123",
    timeSlotId: "timeslot-456",
    scheduledDate: "2024-02-20"
  }
});

console.log('Ad scheduled for:', schedule.data.scheduleAdRun.scheduledDate);
```

### 4. Bulk Scheduling Multiple Ads

```typescript
const bulkResult = await client.mutate({
  mutation: BULK_SCHEDULE_ADS,
  variables: {
    adIds: ["ad-1", "ad-2", "ad-3"],
    timeSlots: [
      {
        startTime: "10:00",
        endTime: "14:00",
        daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
        priority: 1
      }
    ],
    dateRange: "2024-02-01,2024-02-28"
  }
});

console.log(`Scheduled ${bulkResult.data.bulkScheduleAds.length} ad runs`);
```

## Service Classes

### AdSchedulerService

The core service responsible for automated ad execution:

```typescript
class AdSchedulerService {
  constructor(database: DrizzleClient) {
    this.db = database;
    this.jobs = new Map();
  }

  start(): void {
    // Main cron job runs every minute
    this.mainJob = cron.schedule('* * * * *', () => {
      this.processScheduledAds();
    });

    // Cleanup job runs every hour
    this.cleanupJob = cron.schedule('0 * * * *', () => {
      this.cleanupOldLogs();
    });
  }

  async processScheduledAds(): Promise<void> {
    // Process all scheduled ads for current time
    const now = new Date();
    const schedules = await this.getSchedulesForExecution(now);
    
    for (const schedule of schedules) {
      await this.executeAd(schedule);
    }
  }
}
```

### Key Features:
- **Minute-by-minute Processing**: Checks for scheduled ads every minute
- **Retry Logic**: Automatically retries failed executions
- **Error Handling**: Comprehensive error logging and reporting
- **Performance Monitoring**: Tracks execution times and success rates

## Best Practices

### Time Slot Configuration

1. **Prime Time Slots**: Reserve high-priority slots for premium ads
   ```typescript
   const primeTimeSlots = [
     { startTime: "09:00", endTime: "12:00", priority: 1 },
     { startTime: "18:00", endTime: "21:00", priority: 1 }
   ];
   ```

2. **Day-of-Week Optimization**: Consider target audience activity patterns
   ```typescript
   const businessHours = [1, 2, 3, 4, 5]; // Monday to Friday
   const weekends = [6, 0]; // Saturday and Sunday
   ```

### Error Handling

1. **Graceful Degradation**: Handle failures without affecting other schedules
2. **Retry Strategy**: Exponential backoff for failed executions
3. **Monitoring**: Set up alerts for high failure rates

### Performance Optimization

1. **Database Indexing**: Index frequently queried columns
   ```sql
   CREATE INDEX idx_ad_schedules_scheduled_date ON "adSchedules"("scheduledDate", "status");
   CREATE INDEX idx_time_slots_ad_id ON "adTimeSlots"("adId");
   ```

2. **Batch Processing**: Process multiple schedules efficiently
3. **Cache Management**: Cache frequently accessed time slot data

## Monitoring and Analytics

### Schedule Performance Metrics

- **Execution Success Rate**: Percentage of successfully executed schedules
- **Average Execution Time**: Time taken to process each schedule
- **Retry Rate**: Frequency of retry attempts
- **Peak Usage Times**: Most active scheduling periods

### Dashboard Queries

```typescript
// Get schedule statistics
const stats = await adModel.getScheduleStatistics(adId);
console.log(`Success Rate: ${stats.successRate}%`);
console.log(`Total Runs: ${stats.totalRuns}`);
console.log(`Failed Runs: ${stats.failedRuns}`);

// Get execution performance
const performance = await adModel.getAdPerformanceWithSchedule(adId);
console.log('Time Slots:', performance.timeSlots);
console.log('Schedules:', performance.schedules);
```

## API Endpoints

### REST API (Optional)
```
GET    /api/ads/:id/time-slots          # Get ad time slots
POST   /api/ads/:id/time-slots          # Create time slots
PUT    /api/ads/:id/time-slots/:slotId  # Update time slot
DELETE /api/ads/:id/time-slots/:slotId  # Delete time slot

GET    /api/schedules                   # List schedules
POST   /api/schedules                   # Create schedule
PUT    /api/schedules/:id               # Update schedule
DELETE /api/schedules/:id               # Cancel schedule

GET    /api/schedules/upcoming          # Get upcoming schedules
GET    /api/schedules/failed            # Get failed schedules
POST   /api/schedules/:id/retry         # Retry failed schedule
```

## Security Considerations

### Authentication & Authorization
- **Admin-only Operations**: Time slot management requires admin privileges
- **Vendor Restrictions**: Vendors can only view their own ad schedules
- **API Rate Limiting**: Prevent abuse of scheduling endpoints

### Data Validation
- **Time Format Validation**: Ensure proper HH:MM format
- **Date Range Validation**: Prevent scheduling in the past
- **Priority Range Validation**: Enforce 1-5 priority levels

### Audit Trail
- **Operation Logging**: Log all schedule modifications
- **User Tracking**: Record which admin performed operations
- **Change History**: Maintain history of schedule changes

## Troubleshooting

### Common Issues

1. **Cron Job Not Running**
   - Check if AdSchedulerService is initialized in server.ts
   - Verify node-cron dependency is installed
   - Check server logs for cron-related errors

2. **Schedule Conflicts**
   - Use availability checking before scheduling
   - Implement priority-based conflict resolution
   - Consider overlapping time slot warnings

3. **High Failure Rates**
   - Review execution logs for common errors
   - Check database connection stability
   - Monitor system resource usage

### Debug Queries

```sql
-- Check schedule status distribution
SELECT status, COUNT(*) FROM "adSchedules" GROUP BY status;

-- Find frequently failing ads
SELECT "adId", COUNT(*) as failure_count 
FROM "adSchedules" 
WHERE status = 'Failed' 
GROUP BY "adId" 
ORDER BY failure_count DESC;

-- Check execution performance
SELECT DATE("scheduledDate"), 
       COUNT(*) as total_schedules,
       SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as successful
FROM "adSchedules" 
WHERE "scheduledDate" >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE("scheduledDate")
ORDER BY DATE("scheduledDate");
```

## Future Enhancements

### Planned Features
- **AI-Powered Scheduling**: Optimal time slot recommendations
- **Real-time Analytics**: Live performance dashboards
- **A/B Testing**: Schedule variants for performance comparison
- **Geographic Targeting**: Location-based time slot optimization
- **Dynamic Pricing**: Time-based advertising rates

### Integration Opportunities
- **Calendar Systems**: Sync with external calendar applications
- **Email Notifications**: Alert vendors about schedule changes
- **Mobile Apps**: Push notifications for schedule updates
- **Third-party Analytics**: Integration with Google Analytics, etc.

## Conclusion

The Advertisement Time Slot Management System provides a robust foundation for automated advertisement scheduling and execution. With its comprehensive GraphQL API, automated cron job processing, and detailed analytics, it enables efficient management of advertising campaigns while providing transparency and control to both administrators and vendors.

For additional support or feature requests, please refer to the project repository or contact the development team.
