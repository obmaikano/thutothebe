package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CalendarEvent;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventPriority;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // Basic queries
    @EntityGraph(attributePaths = {"createdBy", "school", "region", "targetClass", "course", "attendees", "organizers"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.active = true")
    List<CalendarEvent> findByActiveTrue();
    
    @EntityGraph(attributePaths = {"createdBy", "school", "region", "targetClass", "course", "attendees", "organizers"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.createdBy.id = :userId")
    List<CalendarEvent> findByCreatedById(@Param("userId") Long userId);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "region", "targetClass", "course", "attendees", "organizers"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.eventType = :type")
    List<CalendarEvent> findByEventType(@Param("type") CalendarEventType type);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "region", "targetClass", "course", "attendees", "organizers"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.status = :status")
    List<CalendarEvent> findByStatus(@Param("status") CalendarEventStatus status);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.createdBy.id = :userId AND e.active = true")
    Long countByCreatedByIdAndActiveTrue(@Param("userId") Long userId);
    
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM CalendarEvent e WHERE e.title = :title AND e.createdBy.id = :userId")
    boolean existsByTitleAndCreatedById(@Param("title") String title, @Param("userId") Long userId);

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

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.school.id = :schoolId")
    List<CalendarEvent> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.school.id = :schoolId AND e.active = :active")
    List<CalendarEvent> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.school.id = :schoolId AND e.active = true")
    List<CalendarEvent> findActiveEventsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.region.id = :regionId")
    List<CalendarEvent> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.region.id = :regionId AND e.active = :active")
    List<CalendarEvent> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.region.id = :regionId AND e.active = true")
    List<CalendarEvent> findActiveEventsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.school.id IN :schoolIds")
    List<CalendarEvent> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.region.id IN :regionIds")
    List<CalendarEvent> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.school.id IN :schoolIds OR e.region.id IN :regionIds")
    List<CalendarEvent> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                              @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE (e.school.id IN :schoolIds OR e.region.id IN :regionIds) AND e.active = :active")
    List<CalendarEvent> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                       @Param("regionIds") List<Long> regionIds,
                                                       @Param("active") boolean active);
    
    // Event type filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.eventType = :type AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByEventTypeAndSchoolIdInAndActive(@Param("type") CalendarEventType type,
                                                             @Param("schoolIds") List<Long> schoolIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.eventType = :type AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByEventTypeAndRegionIdInAndActive(@Param("type") CalendarEventType type,
                                                             @Param("regionIds") List<Long> regionIds,
                                                             @Param("active") boolean active);
    
    // Priority filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.priority = :priority AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByPriorityAndSchoolIdInAndActive(@Param("priority") CalendarEventPriority priority,
                                                            @Param("schoolIds") List<Long> schoolIds,
                                                            @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.priority = :priority AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByPriorityAndRegionIdInAndActive(@Param("priority") CalendarEventPriority priority,
                                                            @Param("regionIds") List<Long> regionIds,
                                                            @Param("active") boolean active);
    
    // Status filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.status = :status AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByStatusAndSchoolIdInAndActive(@Param("status") CalendarEventStatus status,
                                                          @Param("schoolIds") List<Long> schoolIds,
                                                          @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.status = :status AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByStatusAndRegionIdInAndActive(@Param("status") CalendarEventStatus status,
                                                          @Param("regionIds") List<Long> regionIds,
                                                          @Param("active") boolean active);
    
    // Date range filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime >= :startDate AND e.endTime <= :endDate AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByDateRangeAndSchoolIdInAndActive(@Param("startDate") LocalDateTime startDate,
                                                             @Param("endDate") LocalDateTime endDate,
                                                             @Param("schoolIds") List<Long> schoolIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime >= :startDate AND e.endTime <= :endDate AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByDateRangeAndRegionIdInAndActive(@Param("startDate") LocalDateTime startDate,
                                                             @Param("endDate") LocalDateTime endDate,
                                                             @Param("regionIds") List<Long> regionIds,
                                                             @Param("active") boolean active);
    
    // Creator filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.createdBy.id = :creatorId AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByCreatorIdAndSchoolIdInAndActive(@Param("creatorId") Long creatorId,
                                                             @Param("schoolIds") List<Long> schoolIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.createdBy.id = :creatorId AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByCreatorIdAndRegionIdInAndActive(@Param("creatorId") Long creatorId,
                                                             @Param("regionIds") List<Long> regionIds,
                                                             @Param("active") boolean active);
    
    // Course filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.course.id = :courseId AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId,
                                                            @Param("schoolIds") List<Long> schoolIds,
                                                            @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.course.id = :courseId AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByCourseIdAndRegionIdInAndActive(@Param("courseId") Long courseId,
                                                            @Param("regionIds") List<Long> regionIds,
                                                            @Param("active") boolean active);
    
    // Class filtering with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.targetClass.id = :classId AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId,
                                                           @Param("schoolIds") List<Long> schoolIds,
                                                           @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.targetClass.id = :classId AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByClassIdAndRegionIdInAndActive(@Param("classId") Long classId,
                                                           @Param("regionIds") List<Long> regionIds,
                                                           @Param("active") boolean active);
    
    // Title search with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%')) AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findByTitleContainingAndSchoolIdInAndActive(@Param("title") String title,
                                                                   @Param("schoolIds") List<Long> schoolIds,
                                                                   @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%')) AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findByTitleContainingAndRegionIdInAndActive(@Param("title") String title,
                                                                   @Param("regionIds") List<Long> regionIds,
                                                                   @Param("active") boolean active);
    
    // Upcoming events with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime > :currentTime AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findUpcomingEventsBySchoolIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                               @Param("schoolIds") List<Long> schoolIds,
                                                               @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime > :currentTime AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findUpcomingEventsByRegionIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                               @Param("regionIds") List<Long> regionIds,
                                                               @Param("active") boolean active);
    
    // Ongoing events with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime <= :currentTime AND e.endTime >= :currentTime AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findOngoingEventsBySchoolIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                              @Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.startTime <= :currentTime AND e.endTime >= :currentTime AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findOngoingEventsByRegionIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                              @Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    // Public events with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.isPublic = true AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findPublicEventsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.isPublic = true AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findPublicEventsByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                             @Param("active") boolean active);
    
    // Recurring events with multi-tenant security
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.isRecurring = true AND e.school.id IN :schoolIds AND e.active = :active")
    List<CalendarEvent> findRecurringEventsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                                @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"createdBy", "school", "school.region", "region", "targetClass", "course", "attendees", "organizers", "approvedBy", "parentEvent"})
    @Query("SELECT e FROM CalendarEvent e WHERE e.isRecurring = true AND e.region.id IN :regionIds AND e.active = :active")
    List<CalendarEvent> findRecurringEventsByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                                @Param("active") boolean active);
    
    // Business rule validation methods with multi-tenant security
    @Query("SELECT COUNT(e) > 0 FROM CalendarEvent e WHERE e.title = :title AND e.createdBy.id = :creatorId AND e.school.id IN :schoolIds")
    boolean existsByTitleAndCreatorIdAndSchoolIdIn(@Param("title") String title,
                                                   @Param("creatorId") Long creatorId,
                                                   @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(e) > 0 FROM CalendarEvent e WHERE e.course.id = :courseId AND e.school.id IN :schoolIds")
    boolean existsByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(e) > 0 FROM CalendarEvent e WHERE e.targetClass.id = :classId AND e.school.id IN :schoolIds")
    boolean existsByClassIdAndSchoolIdIn(@Param("classId") Long classId,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(e) > 0 FROM CalendarEvent e WHERE e.createdBy.id = :creatorId AND e.school.id IN :schoolIds")
    boolean existsByCreatorIdAndSchoolIdIn(@Param("creatorId") Long creatorId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.school.id IN :schoolIds AND e.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.region.id IN :regionIds AND e.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.eventType = :type AND e.school.id IN :schoolIds AND e.active = :active")
    Long countByEventTypeAndSchoolIdInAndActive(@Param("type") CalendarEventType type,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.status = :status AND e.school.id IN :schoolIds AND e.active = :active")
    Long countByStatusAndSchoolIdInAndActive(@Param("status") CalendarEventStatus status,
                                            @Param("schoolIds") List<Long> schoolIds,
                                            @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.priority = :priority AND e.school.id IN :schoolIds AND e.active = :active")
    Long countByPriorityAndSchoolIdInAndActive(@Param("priority") CalendarEventPriority priority,
                                              @Param("schoolIds") List<Long> schoolIds,
                                              @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.isPublic = true AND e.school.id IN :schoolIds AND e.active = :active")
    Long countPublicEventsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.isRecurring = true AND e.school.id IN :schoolIds AND e.active = :active")
    Long countRecurringEventsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                  @Param("active") boolean active);
    
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.createdBy.id = :creatorId AND e.school.id IN :schoolIds AND e.active = :active")
    Long countByCreatorIdAndSchoolIdInAndActive(@Param("creatorId") Long creatorId,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
} 