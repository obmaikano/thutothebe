# School & Region Monitoring Module - Quick Reference

## Overview
Quick reference guide for the School & Region Monitoring Module APIs and common usage patterns.

## Controllers Overview

| Controller | Base Path | Purpose |
|------------|-----------|---------|
| MonitoringAlertController | `/api/monitoring/alerts` | Alert management and notifications |
| SchoolMonitoringController | `/api/monitoring/schools` | School-level performance monitoring |
| RegionMonitoringController | `/api/monitoring/regions` | Regional and national statistics |
| UserActivityLogController | `/api/activity-logs` | User activity tracking and analytics |

## Common API Endpoints

### Monitoring Alerts

#### Essential Endpoints
```http
# Get all alerts
GET /api/monitoring/alerts

# Get alerts by school
GET /api/monitoring/alerts/school/{schoolId}

# Get alerts by severity
GET /api/monitoring/alerts/severity/{severity}

# Acknowledge alert
POST /api/monitoring/alerts/{alertId}/acknowledge?acknowledgedBy={username}

# Resolve alert
POST /api/monitoring/alerts/{alertId}/resolve?resolvedBy={username}&resolutionNotes={notes}

# Get unacknowledged critical alerts
GET /api/monitoring/alerts/unacknowledged/critical

# Get alert statistics
GET /api/monitoring/alerts/statistics/type?startDate={date}&endDate={date}
```

#### Alert Severities
- `LOW` - Minor issues requiring attention
- `MEDIUM` - Moderate issues requiring action
- `HIGH` - Serious issues requiring immediate attention
- `CRITICAL` - Critical issues requiring urgent action

#### Alert Types
- `ATTENDANCE_LOW` - Low attendance rates
- `PERFORMANCE_DECLINE` - Academic performance decline
- `SYSTEM_USAGE_LOW` - Low system usage
- `GRADING_DELAYED` - Delayed grading activities
- `COMPLIANCE_ISSUE` - Compliance violations
- `TECHNICAL_ISSUE` - Technical system issues
- `DATA_QUALITY_ISSUE` - Data quality problems

### School Monitoring

#### Essential Endpoints
```http
# Get latest school monitoring data
GET /api/monitoring/schools/school/{schoolId}

# Get school data for specific date
GET /api/monitoring/schools/school/{schoolId}/date/{date}

# Get schools with low attendance
GET /api/monitoring/schools/attendance/below-threshold?threshold={percentage}&date={date}

# Get schools with low compliance
GET /api/monitoring/schools/compliance/below-threshold?threshold={percentage}&date={date}

# Calculate compliance score
GET /api/monitoring/schools/compliance/school/{schoolId}?date={date}

# Generate monitoring data
POST /api/monitoring/schools/generate/school/{schoolId}?date={date}
```

#### Key Metrics
- **Attendance Rate**: Percentage of student attendance
- **System Usage**: Number of active users and sessions
- **Grading Performance**: Average grading turnaround time
- **Compliance Score**: Overall compliance percentage
- **Alert Count**: Number of active alerts

### Regional Monitoring

#### Essential Endpoints
```http
# Get latest regional data
GET /api/monitoring/regions/region/{regionId}

# Get national statistics
GET /api/monitoring/regions/national/compliance-score?date={date}
GET /api/monitoring/regions/national/attendance-rate?date={date}
GET /api/monitoring/regions/national/total-schools?date={date}

# Get top performing regions
GET /api/monitoring/regions/top-performing?threshold={percentage}&date={date}

# Get underperforming regions
GET /api/monitoring/regions/underperforming?threshold={percentage}&date={date}

# Generate regional data
POST /api/monitoring/regions/generate/region/{regionId}?date={date}
```

#### Regional Metrics
- **Average Attendance**: Regional average attendance rate
- **School Count**: Number of schools in region
- **Teacher Count**: Total teachers in region
- **Student Count**: Total students in region
- **Compliance Average**: Regional compliance average

### User Activity Logs

#### Essential Endpoints
```http
# Get user activity logs
GET /api/activity-logs/user/{userId}

# Get school activity logs
GET /api/activity-logs/school/{schoolId}

# Get activity statistics
GET /api/activity-logs/statistics/school/{schoolId}?startDate={date}&endDate={date}

# Count active users
GET /api/activity-logs/count/active-users/school/{schoolId}?startDate={date}&endDate={date}

# Get peak usage hours
GET /api/activity-logs/peak-usage-hours/school/{schoolId}?startDate={date}&endDate={date}

# Log user activity
POST /api/activity-logs/log-activity
```

#### Activity Types
- `LOGIN` - User login events
- `LOGOUT` - User logout events
- `PAGE_VIEW` - Page view tracking
- `FORM_SUBMISSION` - Form submissions
- `FILE_UPLOAD` - File upload activities
- `FILE_DOWNLOAD` - File download activities
- `SEARCH` - Search activities
- `ERROR` - Error events

## Common Usage Patterns

### 1. Daily Monitoring Dashboard
```http
# Get today's school monitoring data
GET /api/monitoring/schools/school/{schoolId}/date/{today}

# Get today's alerts for school
GET /api/monitoring/alerts/school/{schoolId}/date-range?startDate={today}&endDate={today}

# Get today's active users
GET /api/activity-logs/count/active-users/school/{schoolId}?startDate={today}&endDate={today}
```

### 2. Weekly Performance Report
```http
# Get week's monitoring data
GET /api/monitoring/schools/school/{schoolId}/date-range?startDate={weekStart}&endDate={weekEnd}

# Get week's alert statistics
GET /api/monitoring/alerts/statistics/severity?startDate={weekStart}&endDate={weekEnd}

# Get week's activity statistics
GET /api/activity-logs/statistics/school/{schoolId}?startDate={weekStart}&endDate={weekEnd}
```

### 3. Regional Comparison
```http
# Get all regions for comparison
GET /api/monitoring/regions/date/{date}

# Get top performing regions
GET /api/monitoring/regions/top-performing?threshold=80&date={date}

# Get national averages
GET /api/monitoring/regions/national/compliance-score?date={date}
GET /api/monitoring/regions/national/attendance-rate?date={date}
```

### 4. Alert Management Workflow
```http
# 1. Get unacknowledged alerts
GET /api/monitoring/alerts/acknowledged?acknowledged=false

# 2. Acknowledge alert
POST /api/monitoring/alerts/{alertId}/acknowledge?acknowledgedBy={username}

# 3. Resolve alert
POST /api/monitoring/alerts/{alertId}/resolve?resolvedBy={username}&resolutionNotes={notes}

# 4. Get resolution statistics
GET /api/monitoring/alerts/statistics/type?startDate={date}&endDate={date}
```

## Request/Response Examples

### Get School Monitoring Data
```http
GET /api/monitoring/schools/school/123/date/2024-01-15

Response:
{
  "status": "SUCCESS",
  "message": "School monitoring data retrieved successfully",
  "data": {
    "id": 456,
    "schoolId": 123,
    "monitoringDate": "2024-01-15",
    "attendanceRate": 95.5,
    "totalStudents": 500,
    "presentStudents": 478,
    "systemUsageCount": 245,
    "averageGradingTime": 2.5,
    "complianceScore": 88.0,
    "alertCount": 2
  }
}
```

### Create Alert
```http
POST /api/monitoring/alerts/create
Content-Type: application/x-www-form-urlencoded

alertType=ATTENDANCE_LOW&severity=HIGH&scope=SCHOOL&scopeId=123&title=Low Attendance Alert&description=Attendance below threshold

Response:
{
  "status": "SUCCESS",
  "message": "Alert created successfully",
  "data": {
    "id": 789,
    "alertType": "ATTENDANCE_LOW",
    "severity": "HIGH",
    "scope": "SCHOOL",
    "scopeId": 123,
    "title": "Low Attendance Alert",
    "acknowledged": false,
    "resolved": false,
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

### Log User Activity
```http
POST /api/activity-logs/log-activity
Content-Type: application/x-www-form-urlencoded

userId=456&activityType=PAGE_VIEW&moduleName=Attendance&featureName=Daily Report&actionPerformed=View Report&sessionId=sess123&ipAddress=192.168.1.100&userAgent=Mozilla/5.0

Response:
{
  "status": "SUCCESS",
  "message": "User activity logged successfully",
  "data": {
    "id": 1001,
    "userId": 456,
    "activityType": "PAGE_VIEW",
    "moduleName": "Attendance",
    "featureName": "Daily Report",
    "actionPerformed": "View Report",
    "activityTimestamp": "2024-01-15T10:35:00",
    "success": true
  }
}
```

## Error Handling

### Common Error Responses
```json
{
  "status": "ERROR",
  "message": "School not found with ID: 999",
  "data": null
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Security and Permissions

### Role-based Access
| Role | Alerts | School Monitoring | Regional Monitoring | Activity Logs |
|------|--------|------------------|-------------------|---------------|
| ADMIN | Full Access | Full Access | Full Access | Full Access |
| REGIONAL_ADMIN | Regional Only | Regional Schools | Regional Only | Regional Only |
| SCHOOL_ADMIN | School Only | School Only | Read Only | School Only |
| TEACHER | Read Only | Limited | Read Only | Own Data |
| STUDENT | None | None | None | Own Data |

### Authentication
All endpoints require authentication via JWT token:
```http
Authorization: Bearer {jwt_token}
```

## Performance Tips

### Pagination
Use pagination for large datasets:
```http
GET /api/monitoring/alerts?page=0&size=20&sort=createdAt,desc
```

### Date Filtering
Always use date ranges for better performance:
```http
GET /api/activity-logs/date-range?startDate=2024-01-01&endDate=2024-01-31
```

### Caching
Frequently accessed data is cached. Use appropriate cache headers:
```http
Cache-Control: max-age=300
```

## Monitoring Best Practices

1. **Regular Data Generation**: Schedule daily monitoring data generation
2. **Alert Thresholds**: Configure appropriate alert thresholds for your environment
3. **Performance Monitoring**: Monitor API response times and system performance
4. **Data Retention**: Implement appropriate data retention policies
5. **Security Auditing**: Regularly audit user activity logs for security

## Support and Troubleshooting

### Common Issues
- **Performance**: Use pagination and date filtering
- **Permissions**: Verify user roles and permissions
- **Data Quality**: Check data generation schedules
- **Alerts**: Review alert thresholds and configurations

### Logging
Check application logs for detailed error information:
```bash
tail -f logs/application.log | grep "MonitoringAlert\|SchoolMonitoring\|RegionMonitoring\|UserActivityLog"
``` 