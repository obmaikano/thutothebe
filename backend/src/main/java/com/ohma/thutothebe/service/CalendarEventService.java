package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.CalendarEventPriority;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventService extends BaseService<CalendarEventDTO, Long> {

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Core multi-tenant methods
    List<CalendarEventDTO> getCalendarEventsByAccessibleScopes(Long currentUserId);
    List<CalendarEventDTO> getActiveCalendarEventsByAccessibleScopes(Long currentUserId);
    List<CalendarEventDTO> getCalendarEventsBySchoolIdAndAccessibleScopes(Long schoolId, Long currentUserId);
    List<CalendarEventDTO> getCalendarEventsByRegionIdAndAccessibleScopes(Long regionId, Long currentUserId);
    
    // Event type filtering with multi-tenant security
    List<CalendarEventDTO> getCalendarEventsByTypeAndAccessibleScopes(CalendarEventType type, Long currentUserId);
    List<CalendarEventDTO> getCalendarEventsByPriorityAndAccessibleScopes(CalendarEventPriority priority, Long currentUserId);
    List<CalendarEventDTO> getCalendarEventsByStatusAndAccessibleScopes(CalendarEventStatus status, Long currentUserId);
    
    // Creator filtering with multi-tenant security
    List<CalendarEventDTO> getCalendarEventsByCreatorIdAndAccessibleScopes(Long creatorId, Long currentUserId);
    
    // Course/Class filtering with multi-tenant security
    List<CalendarEventDTO> getCalendarEventsByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    List<CalendarEventDTO> getCalendarEventsByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    // Date range filtering with multi-tenant security
    List<CalendarEventDTO> getCalendarEventsByDateRangeAndAccessibleScopes(LocalDateTime startDate, LocalDateTime endDate, Long currentUserId);
    List<CalendarEventDTO> getUpcomingCalendarEventsByAccessibleScopes(LocalDateTime fromDate, Long currentUserId);
    List<CalendarEventDTO> getOngoingCalendarEventsByAccessibleScopes(LocalDateTime currentTime, Long currentUserId);
    
    // Title search with multi-tenant security
    List<CalendarEventDTO> searchCalendarEventsByTitleAndAccessibleScopes(String title, Long currentUserId);
    
    // Public events with multi-tenant security
    List<CalendarEventDTO> getPublicCalendarEventsByAccessibleScopes(Long currentUserId);
    
    // Recurring events with multi-tenant security
    List<CalendarEventDTO> getRecurringCalendarEventsByAccessibleScopes(Long currentUserId);
    
    // Validation methods with multi-tenant security
    boolean validateCalendarEventAccess(Long eventId, Long currentUserId);
    boolean validateCalendarEventBusinessRules(CalendarEventDTO eventDTO, Long currentUserId);
    
    // Statistics methods with multi-tenant security
    Long getCalendarEventCountByAccessibleScopes(Long currentUserId);
    Long getCalendarEventCountByTypeAndAccessibleScopes(CalendarEventType type, Long currentUserId);
    Long getCalendarEventCountByStatusAndAccessibleScopes(CalendarEventStatus status, Long currentUserId);
    Long getCalendarEventCountByPriorityAndAccessibleScopes(CalendarEventPriority priority, Long currentUserId);
    Long getCalendarEventCountByCreatorIdAndAccessibleScopes(Long creatorId, Long currentUserId);
    Long getUpcomingCalendarEventCountByAccessibleScopes(LocalDateTime fromDate, Long currentUserId);
    Long getPublicCalendarEventCountByAccessibleScopes(Long currentUserId);

    // ==================== EXISTING METHODS ====================

    List<CalendarEventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<CalendarEventDTO> getEventsByType(CalendarEventType type);
    
    List<CalendarEventDTO> getEventsByCreator(Long creatorId);
    
    List<CalendarEventDTO> getEventsBySchool(Long schoolId);
    
    List<CalendarEventDTO> getEventsByRegion(Long regionId);
    
    List<CalendarEventDTO> getEventsByCourse(Long courseId);
    
    List<CalendarEventDTO> getEventsByClass(Long classId);
    
    List<CalendarEventDTO> getUpcomingEvents(LocalDateTime fromDate);
    
    List<CalendarEventDTO> getOngoingEvents(LocalDateTime currentTime);
    
    List<CalendarEventDTO> getEventsByPriority(CalendarEventPriority priority);
    
    List<CalendarEventDTO> getEventsByStatus(CalendarEventStatus status);
    
    List<CalendarEventDTO> getPublicEvents();
    
    List<CalendarEventDTO> getRecurringEvents();
    
    List<CalendarEventDTO> searchEventsByTitle(String title);
    
    CalendarEventDTO createRecurringEvent(CalendarEventDTO eventDTO, String recurrencePattern);
    
    List<CalendarEventDTO> generateRecurringInstances(Long parentEventId, LocalDateTime endDate);
    
    CalendarEventDTO updateEventStatus(Long eventId, CalendarEventStatus status);
    
    CalendarEventDTO cancelEvent(Long eventId, String reason);
    
    CalendarEventDTO rescheduleEvent(Long eventId, LocalDateTime newStartTime, LocalDateTime newEndTime);
    
    void deleteRecurringEventSeries(Long parentEventId);
    
    void deleteRecurringEventInstance(Long instanceId);
    
    List<CalendarEventDTO> getConflictingEvents(LocalDateTime startTime, LocalDateTime endTime, Long excludeEventId);
    
    boolean hasTimeConflict(LocalDateTime startTime, LocalDateTime endTime, Long excludeEventId);
    
    List<CalendarEventDTO> getEventsForUser(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<CalendarEventDTO> getEventsForUserByType(Long userId, CalendarEventType type);
    
    void markEventAsAttended(Long eventId, Long userId);
    
    void markEventAsNotAttended(Long eventId, Long userId);
    
    List<CalendarEventDTO> getAttendedEventsByUser(Long userId);
    
    List<CalendarEventDTO> getNotAttendedEventsByUser(Long userId);
    
    void sendEventReminders(Long eventId);
    
    void sendEventNotifications(Long eventId, String message);
    
    CalendarEventDTO duplicateEvent(Long eventId, LocalDateTime newStartTime);
    
    List<CalendarEventDTO> getEventsByDateAndType(LocalDateTime date, CalendarEventType type);
    
    List<CalendarEventDTO> getEventsByCreatorAndDateRange(Long creatorId, LocalDateTime startDate, LocalDateTime endDate);
    
    void bulkUpdateEventStatus(List<Long> eventIds, CalendarEventStatus status);
    
    void bulkDeleteEvents(List<Long> eventIds);
    
    List<CalendarEventDTO> getEventsRequiringApproval();
    
    CalendarEventDTO approveEvent(Long eventId, Long approverId);
    
    CalendarEventDTO rejectEvent(Long eventId, Long approverId, String reason);
    
    List<CalendarEventDTO> getEventsByApprovalStatus(String approvalStatus);
    
    void archiveOldEvents(LocalDateTime cutoffDate);
    
    List<CalendarEventDTO> getArchivedEvents();
    
    CalendarEventDTO restoreArchivedEvent(Long eventId);
    
    List<CalendarEventDTO> getEventStatistics(LocalDateTime startDate, LocalDateTime endDate);
    
    List<CalendarEventDTO> getPopularEvents(int limit);
    
    List<CalendarEventDTO> getRecentlyCreatedEvents(int limit);
    
    List<CalendarEventDTO> getRecentlyUpdatedEvents(int limit);

    // Date range queries
    List<CalendarEventDTO> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime);
    Page<CalendarEventDTO> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    // Scope-based queries
    List<CalendarEventDTO> getEventsByScope(CalendarEventScope scope);
    List<CalendarEventDTO> getGlobalEvents();
    List<CalendarEventDTO> getEventsForRegion(Long regionId);
    List<CalendarEventDTO> getEventsForSchool(Long regionId, Long schoolId);
    List<CalendarEventDTO> getEventsForClass(Long regionId, Long schoolId, Long classId);

    // User-specific queries
    List<CalendarEventDTO> getEventsByCreatedBy(Long userId);
    List<CalendarEventDTO> getEventsByAttendee(Long userId);
    List<CalendarEventDTO> getEventsByOrganizer(Long userId);
    List<CalendarEventDTO> getUserEvents(Long userId);
    List<CalendarEventDTO> getUserEventsForDateRange(Long userId, LocalDateTime startTime, LocalDateTime endTime);

    // Type and status queries
    List<CalendarEventDTO> getEventsByTypes(List<CalendarEventType> eventTypes);

    // Recurring events
    List<CalendarEventDTO> getChildEvents(Long parentEventId);
    List<CalendarEventDTO> generateRecurringEvents(Long parentEventId, LocalDateTime until);

    // Approval workflow
    List<CalendarEventDTO> getPendingApprovalEvents();
    List<CalendarEventDTO> getPendingApprovalEventsForSchool(Long schoolId);

    // Time-based queries
    Page<CalendarEventDTO> getUpcomingEvents(Pageable pageable);
    List<CalendarEventDTO> getTodaysEvents();
    List<CalendarEventDTO> getThisWeeksEvents();

    // Course-related events
    List<CalendarEventDTO> getCourseEvents(Long courseId);
    List<CalendarEventDTO> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime);

    // Role-based events
    List<CalendarEventDTO> getEventsByTargetRole(UserRole role);

    // Search functionality
    List<CalendarEventDTO> searchEvents(String searchTerm);
    Page<CalendarEventDTO> searchEvents(String searchTerm, Pageable pageable);

    // Event management
    CalendarEventDTO addAttendee(Long eventId, Long userId);
    CalendarEventDTO removeAttendee(Long eventId, Long userId);
    CalendarEventDTO addOrganizer(Long eventId, Long userId);
    CalendarEventDTO removeOrganizer(Long eventId, Long userId);

    // Event status management
    CalendarEventDTO markAsOngoing(Long eventId);
    CalendarEventDTO markAsCompleted(Long eventId);

    // Statistics
    Long getEventCountBySchool(Long schoolId);
    Long getEventCountByType(CalendarEventType eventType);
    List<Object[]> getEventCountByType();

    // Conflict detection
    List<CalendarEventDTO> findConflictingEvents(Long eventId, String location, LocalDateTime startTime, LocalDateTime endTime);
    boolean hasConflicts(Long eventId, String location, LocalDateTime startTime, LocalDateTime endTime);

    // Permission checks
    boolean canUserViewEvent(Long eventId, Long userId);
    boolean canUserEditEvent(Long eventId, Long userId);
    boolean canUserDeleteEvent(Long eventId, Long userId);

    // Bulk operations
    List<CalendarEventDTO> createBulkEvents(List<CalendarEventDTO> events);
    void deleteBulkEvents(List<Long> eventIds);
    List<CalendarEventDTO> updateBulkEventStatus(List<Long> eventIds, CalendarEventStatus status);

    // Calendar view helpers
    List<CalendarEventDTO> getEventsForCalendarView(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<CalendarEventDTO> getMonthEvents(Long userId, int year, int month);
    List<CalendarEventDTO> getWeekEvents(Long userId, LocalDateTime weekStart);
    List<CalendarEventDTO> getDayEvents(Long userId, LocalDateTime date);

    // Notification and reminder helpers
    List<CalendarEventDTO> getEventsNeedingReminders(LocalDateTime reminderTime);

    // Academic calendar helpers
    List<CalendarEventDTO> getAcademicYearEvents(Integer academicYear);
    List<CalendarEventDTO> getTermEvents(String term, Integer academicYear);
    List<CalendarEventDTO> getHolidayEvents(LocalDateTime startDate, LocalDateTime endDate);
    List<CalendarEventDTO> getExamEvents(LocalDateTime startDate, LocalDateTime endDate);

    // Import/Export functionality
    void importEventsFromCalendar(String calendarData, Long userId);
    String exportEventsToCalendar(List<Long> eventIds);
    String exportUserCalendar(Long userId, LocalDateTime startDate, LocalDateTime endDate);
} 