# Event to CalendarEvent Migration Guide

## Overview

This document outlines the migration strategy from the legacy Event module to the comprehensive School Calendar module using CalendarEvent entities. The migration maintains backward compatibility while providing enhanced calendar functionality.

## Migration Architecture

### 1. Migration Components

#### EventMigrationService
- **Purpose**: Handles the migration of Event entities to CalendarEvent entities
- **Location**: `com.ohma.thutothebe.service.EventMigrationService`
- **Implementation**: `com.ohma.thutothebe.service.impl.EventMigrationServiceImpl`

#### EventCompatibilityService
- **Purpose**: Provides backward compatibility for existing Event API endpoints
- **Location**: `com.ohma.thutothebe.service.EventCompatibilityService`
- **Implementation**: `com.ohma.thutothebe.service.impl.EventCompatibilityServiceImpl`

#### EventMigrationController
- **Purpose**: Exposes migration operations via REST API
- **Location**: `com.ohma.thutothebe.controller.EventMigrationController`
- **Endpoints**: `/api/event-migration/*`

### 2. Migration Strategy

#### Phase 1: Data Migration
1. **Automatic Migration**: Use `EventMigrationService.migrateAllEvents()` to migrate all existing events
2. **Selective Migration**: Use `EventMigrationService.migrateEvent(Long eventId)` for specific events
3. **Validation**: Use `EventMigrationService.validateMigration()` to verify migration success

#### Phase 2: API Compatibility
1. **Backward Compatibility**: Existing Event API endpoints continue to work
2. **Transparent Routing**: EventController now uses EventCompatibilityService
3. **Data Mapping**: Automatic conversion between EventDto and CalendarEventDTO

#### Phase 3: Frontend Integration
1. **Gradual Migration**: Frontend can gradually adopt new CalendarEvent APIs
2. **Feature Enhancement**: New calendar features available through CalendarEvent APIs
3. **Legacy Support**: Existing Event-based frontend code continues to work

## Data Mapping

### Event to CalendarEvent Field Mapping

| Event Field | CalendarEvent Field | Mapping Logic |
|-------------|-------------------|---------------|
| `id` | `id` | Direct mapping |
| `title` | `title` | Direct mapping |
| `description` | `description` | Direct mapping |
| `startTime` | `startTime` | Direct mapping |
| `endTime` | `endTime` | Direct mapping |
| `location` | `location` | Direct mapping |
| `type` | `eventType` | Type conversion (see below) |
| `recurring` | `isRecurring` | Direct mapping |
| `recurrenceRule` | `recurrenceRule` | Direct mapping |
| `allDay` | `isAllDay` | Direct mapping |
| `color` | `color` | Direct mapping |
| `createdBy` | `createdById` | Extract ID |
| `course` | `courseId` | Extract ID |
| N/A | `priority` | Default: MEDIUM |
| N/A | `scope` | Derived from course |
| N/A | `status` | Default: SCHEDULED |
| N/A | `schoolId` | Derived from course.class.school |
| N/A | `regionId` | Derived from course.class.school.region |
| N/A | `targetClassId` | Derived from course.class |
| N/A | `notes` | Migration tracking |

### Event Type Mapping

| EventType | CalendarEventType |
|-----------|------------------|
| `COURSE_EVENT` | `CLASS_SESSION` |
| `ASSIGNMENT_DUE` | `ASSESSMENT` |
| `QUIZ` | `ASSESSMENT` |
| `EXAM` | `EXAM_PERIOD` |
| `MEETING` | `STAFF_MEETING` |
| `HOLIDAY` | `PUBLIC_HOLIDAY` |
| `CUSTOM` | `CUSTOM` |

### Scope Determination

| Condition | CalendarEventScope |
|-----------|-------------------|
| Event has course | `COURSE` |
| Event has no course | `SCHOOL` |

## API Endpoints

### Migration Management

#### Check Migration Status
```http
GET /api/event-migration/status
```
**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Migration status retrieved",
  "data": {
    "migrationNeeded": true,
    "unmigratedEventCount": 25,
    "message": "Migration needed: 25 events to migrate"
  }
}
```

#### Migrate All Events
```http
POST /api/event-migration/migrate-all
```
**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Successfully migrated 25 events to CalendarEvent entities",
  "data": [
    {
      "id": 1,
      "title": "Math Class",
      "eventType": "CLASS_SESSION",
      "scope": "COURSE",
      "notes": "MIGRATED_FROM_EVENT_ID_1"
    }
  ]
}
```

#### Migrate Specific Event
```http
POST /api/event-migration/migrate/{eventId}
```

#### Validate Migration
```http
POST /api/event-migration/validate
```

#### Rollback Migration (DESTRUCTIVE)
```http
DELETE /api/event-migration/rollback
```

### Legacy Event API (Compatibility Layer)

All existing Event API endpoints continue to work:

```http
GET /api/events
GET /api/events/{id}
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
GET /api/events/course/{courseId}
GET /api/events/user/{userId}
GET /api/events/date-range?startTime=...&endTime=...
```

## Migration Process

### Step 1: Pre-Migration Assessment

1. **Check Current State**:
   ```bash
   curl -X GET /api/event-migration/status
   ```

2. **Backup Data**: Ensure database backup is available

3. **Test Environment**: Run migration in test environment first

### Step 2: Execute Migration

1. **Run Migration**:
   ```bash
   curl -X POST /api/event-migration/migrate-all
   ```

2. **Validate Results**:
   ```bash
   curl -X POST /api/event-migration/validate
   ```

3. **Verify API Compatibility**:
   ```bash
   curl -X GET /api/events
   ```

### Step 3: Post-Migration Verification

1. **Test Legacy Endpoints**: Ensure all existing Event API calls work
2. **Test New Features**: Verify CalendarEvent functionality
3. **Monitor Performance**: Check for any performance impacts
4. **User Acceptance**: Validate with end users

## Rollback Strategy

If migration issues occur:

1. **Immediate Rollback**:
   ```bash
   curl -X DELETE /api/event-migration/rollback
   ```

2. **Database Restore**: Restore from pre-migration backup if needed

3. **Service Restart**: Restart application to clear any cached data

## Testing

### Unit Tests

Run migration service tests:
```bash
mvn test -Dtest=EventMigrationServiceImplTest
```

### Integration Tests

Test complete migration flow:
```bash
mvn test -Dtest=EventMigrationIntegrationTest
```

### API Tests

Test compatibility layer:
```bash
mvn test -Dtest=EventCompatibilityServiceImplTest
```

## Monitoring and Logging

### Key Log Messages

- **Migration Start**: `Starting migration of all Event entities to CalendarEvent entities`
- **Migration Success**: `Successfully migrated event: {title} (ID: {id}) to CalendarEvent (ID: {newId})`
- **Migration Error**: `Failed to migrate event: {title} (ID: {id}). Error: {error}`
- **Validation**: `Migration validation successful: {originalCount} original events, {migratedCount} calendar events`

### Metrics to Monitor

- Migration success rate
- API response times (before/after migration)
- Error rates on legacy endpoints
- Database query performance

## Troubleshooting

### Common Issues

1. **Missing Relationships**: Events without proper course/user relationships
   - **Solution**: Migration handles null relationships gracefully

2. **Duplicate Migrations**: Attempting to migrate already migrated events
   - **Solution**: Migration service checks for existing migrations

3. **Performance Impact**: Large datasets causing slow migration
   - **Solution**: Implement batch processing for large migrations

4. **API Compatibility**: Legacy endpoints not working as expected
   - **Solution**: Check EventCompatibilityService mapping logic

### Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `EVENT_NOT_FOUND` | Event ID doesn't exist | Verify event ID |
| `ALREADY_MIGRATED` | Event already migrated | Check migration status |
| `MIGRATION_FAILED` | General migration error | Check logs for details |
| `VALIDATION_FAILED` | Migration validation failed | Review migration results |

## Best Practices

1. **Backup First**: Always backup before migration
2. **Test Environment**: Run migration in test environment first
3. **Gradual Rollout**: Consider migrating in batches for large datasets
4. **Monitor Closely**: Watch logs and metrics during migration
5. **User Communication**: Inform users of any potential downtime
6. **Rollback Plan**: Have a clear rollback strategy ready

## Future Considerations

1. **Legacy Cleanup**: Plan to remove Event entities after successful migration
2. **Frontend Migration**: Gradually migrate frontend to use CalendarEvent APIs
3. **Feature Enhancement**: Leverage new CalendarEvent features
4. **Performance Optimization**: Optimize queries for CalendarEvent operations

## Support

For migration support:
- Check logs in `/logs/application.log`
- Review migration status via API endpoints
- Contact development team for complex issues
- Refer to CalendarEvent documentation for new features 