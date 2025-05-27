package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventService extends BaseService<CalendarEventDTO, Long> {

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
    List<CalendarEventDTO> getEventsByType(CalendarEventType eventType);
    List<CalendarEventDTO> getEventsByTypes(List<CalendarEventType> eventTypes);
    List<CalendarEventDTO> getEventsByStatus(CalendarEventStatus status);

    // Recurring events
    List<CalendarEventDTO> getRecurringEvents();
    List<CalendarEventDTO> getChildEvents(Long parentEventId);
    List<CalendarEventDTO> generateRecurringEvents(Long parentEventId, LocalDateTime until);

    // Approval workflow
    List<CalendarEventDTO> getPendingApprovalEvents();
    List<CalendarEventDTO> getPendingApprovalEventsForSchool(Long schoolId);
    CalendarEventDTO approveEvent(Long eventId, Long approverId, String approvalNotes);
    CalendarEventDTO rejectEvent(Long eventId, Long approverId, String rejectionNotes);

    // Time-based queries
    List<CalendarEventDTO> getUpcomingEvents();
    Page<CalendarEventDTO> getUpcomingEvents(Pageable pageable);
    List<CalendarEventDTO> getTodaysEvents();
    List<CalendarEventDTO> getThisWeeksEvents();

    // Course-related events
    List<CalendarEventDTO> getCourseEvents(Long courseId);
    List<CalendarEventDTO> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime);

    // Role-based events
    List<CalendarEventDTO> getEventsByTargetRole(UserRole role);

    // Public events
    List<CalendarEventDTO> getPublicEvents();

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
    CalendarEventDTO cancelEvent(Long eventId, String reason);
    CalendarEventDTO postponeEvent(Long eventId, LocalDateTime newStartTime, LocalDateTime newEndTime);
    CalendarEventDTO rescheduleEvent(Long eventId, LocalDateTime newStartTime, LocalDateTime newEndTime);

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
    void sendEventReminders(Long eventId);
    void sendEventNotifications(Long eventId, String notificationType);

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