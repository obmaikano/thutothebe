package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CalendarEvent;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // Basic queries
    List<CalendarEvent> findByActiveTrue();
    
    List<CalendarEvent> findByActiveTrueOrderByStartTimeAsc();
    
    Page<CalendarEvent> findByActiveTrue(Pageable pageable);

    // Date range queries
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "((e.startTime >= :startTime AND e.startTime <= :endTime) OR " +
           "(e.endTime >= :startTime AND e.endTime <= :endTime) OR " +
           "(e.startTime <= :startTime AND e.endTime >= :endTime))")
    List<CalendarEvent> findEventsBetweenDates(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "((e.startTime >= :startTime AND e.startTime <= :endTime) OR " +
           "(e.endTime >= :startTime AND e.endTime <= :endTime) OR " +
           "(e.startTime <= :startTime AND e.endTime >= :endTime)) " +
           "ORDER BY e.startTime ASC")
    Page<CalendarEvent> findEventsBetweenDates(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        Pageable pageable
    );

    // Scope-based queries
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.scope = :scope")
    List<CalendarEvent> findByScope(@Param("scope") CalendarEventScope scope);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.scope = 'GLOBAL'")
    List<CalendarEvent> findGlobalEvents();

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(e.scope = 'GLOBAL' OR (e.scope = 'REGIONAL' AND e.region.id = :regionId))")
    List<CalendarEvent> findEventsForRegion(@Param("regionId") Long regionId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(e.scope = 'GLOBAL' OR " +
           "(e.scope = 'REGIONAL' AND e.region.id = :regionId) OR " +
           "(e.scope = 'SCHOOL' AND e.school.id = :schoolId))")
    List<CalendarEvent> findEventsForSchool(@Param("regionId") Long regionId, @Param("schoolId") Long schoolId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(e.scope = 'GLOBAL' OR " +
           "(e.scope = 'REGIONAL' AND e.region.id = :regionId) OR " +
           "(e.scope = 'SCHOOL' AND e.school.id = :schoolId) OR " +
           "(e.scope = 'CLASS' AND e.targetClass.id = :classId))")
    List<CalendarEvent> findEventsForClass(
        @Param("regionId") Long regionId, 
        @Param("schoolId") Long schoolId, 
        @Param("classId") Long classId
    );

    // User-specific queries
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.createdBy.id = :userId")
    List<CalendarEvent> findByCreatedBy(@Param("userId") Long userId);

    @Query("SELECT e FROM CalendarEvent e JOIN e.attendees a WHERE e.active = true AND a.id = :userId")
    List<CalendarEvent> findByAttendee(@Param("userId") Long userId);

    @Query("SELECT e FROM CalendarEvent e JOIN e.organizers o WHERE e.active = true AND o.id = :userId")
    List<CalendarEvent> findByOrganizer(@Param("userId") Long userId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(e.createdBy.id = :userId OR " +
           "EXISTS (SELECT 1 FROM e.attendees a WHERE a.id = :userId) OR " +
           "EXISTS (SELECT 1 FROM e.organizers o WHERE o.id = :userId))")
    List<CalendarEvent> findUserEvents(@Param("userId") Long userId);

    // Type and status queries
    List<CalendarEvent> findByActiveTrueAndEventType(CalendarEventType eventType);
    
    List<CalendarEvent> findByActiveTrueAndStatus(CalendarEventStatus status);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.eventType IN :eventTypes")
    List<CalendarEvent> findByEventTypes(@Param("eventTypes") List<CalendarEventType> eventTypes);

    // Recurring events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.isRecurring = true")
    List<CalendarEvent> findRecurringEvents();

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.parentEvent.id = :parentEventId")
    List<CalendarEvent> findByParentEvent(@Param("parentEventId") Long parentEventId);

    // Approval workflow
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.requiresApproval = true AND e.status = 'PENDING_APPROVAL'")
    List<CalendarEvent> findPendingApprovalEvents();

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.requiresApproval = true AND " +
           "e.status = 'PENDING_APPROVAL' AND e.school.id = :schoolId")
    List<CalendarEvent> findPendingApprovalEventsForSchool(@Param("schoolId") Long schoolId);

    // Upcoming events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.startTime > :now AND e.status = 'SCHEDULED' " +
           "ORDER BY e.startTime ASC")
    List<CalendarEvent> findUpcomingEvents(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.startTime > :now AND e.status = 'SCHEDULED' " +
           "ORDER BY e.startTime ASC")
    Page<CalendarEvent> findUpcomingEvents(@Param("now") LocalDateTime now, Pageable pageable);

    // Today's events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "DATE(e.startTime) = DATE(:today) ORDER BY e.startTime ASC")
    List<CalendarEvent> findTodaysEvents(@Param("today") LocalDateTime today);

    // This week's events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "e.startTime >= :weekStart AND e.startTime <= :weekEnd ORDER BY e.startTime ASC")
    List<CalendarEvent> findThisWeeksEvents(
        @Param("weekStart") LocalDateTime weekStart,
        @Param("weekEnd") LocalDateTime weekEnd
    );

    // Course-related events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.course.id = :courseId")
    List<CalendarEvent> findByCourse(@Param("courseId") Long courseId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.course.id = :courseId AND " +
           "((e.startTime >= :startTime AND e.startTime <= :endTime) OR " +
           "(e.endTime >= :startTime AND e.endTime <= :endTime) OR " +
           "(e.startTime <= :startTime AND e.endTime >= :endTime))")
    List<CalendarEvent> findCourseEventsBetweenDates(
        @Param("courseId") Long courseId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // Role-based events
    @Query("SELECT e FROM CalendarEvent e JOIN e.targetRoles tr WHERE e.active = true AND tr = :role")
    List<CalendarEvent> findByTargetRole(@Param("role") UserRole role);

    // Public events
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.isPublic = true")
    List<CalendarEvent> findPublicEvents();

    // Search functionality
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<CalendarEvent> searchEvents(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<CalendarEvent> searchEvents(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Statistics queries
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.active = true AND e.school.id = :schoolId")
    Long countEventsBySchool(@Param("schoolId") Long schoolId);

    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.active = true AND e.eventType = :eventType")
    Long countEventsByType(@Param("eventType") CalendarEventType eventType);

    @Query("SELECT e.eventType, COUNT(e) FROM CalendarEvent e WHERE e.active = true GROUP BY e.eventType")
    List<Object[]> getEventCountByType();

    // Conflict detection
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true AND e.id != :eventId AND " +
           "e.location = :location AND " +
           "((e.startTime >= :startTime AND e.startTime < :endTime) OR " +
           "(e.endTime > :startTime AND e.endTime <= :endTime) OR " +
           "(e.startTime <= :startTime AND e.endTime >= :endTime))")
    List<CalendarEvent> findConflictingEvents(
        @Param("eventId") Long eventId,
        @Param("location") String location,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
} 