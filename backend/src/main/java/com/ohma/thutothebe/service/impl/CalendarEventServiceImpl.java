package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CalendarEventMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CalendarEventService;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CalendarEventServiceImpl extends BaseServiceImpl<CalendarEvent, CalendarEventDTO, Long> 
        implements CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final RegionRepository regionRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final CalendarEventMapper calendarEventMapper;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public CalendarEventServiceImpl(
            CalendarEventRepository calendarEventRepository,
            UserRepository userRepository,
            SchoolRepository schoolRepository,
            RegionRepository regionRepository,
            ClassRepository classRepository,
            CourseRepository courseRepository,
            CalendarEventMapper calendarEventMapper,
            RuleBasedAccessControlServiceImpl accessControlService) {
        super(calendarEventRepository);
        this.calendarEventRepository = calendarEventRepository;
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.regionRepository = regionRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.calendarEventMapper = calendarEventMapper;
        this.accessControlService = accessControlService;
    }

    @Override
    protected CalendarEvent mapToEntity(CalendarEventDTO dto) {
        CalendarEvent entity = calendarEventMapper.toEntity(dto);
        setEntityRelationships(entity, dto);
        return entity;
    }

    @Override
    protected CalendarEventDTO mapToDto(CalendarEvent entity) {
        return calendarEventMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CalendarEvent entity, CalendarEventDTO dto) {
        calendarEventMapper.updateEntityFromDto(dto, entity);
        setEntityRelationships(entity, dto);
    }

    @Override
    protected Long extractSchoolId(CalendarEvent entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(CalendarEvent entity) {
        return entity.getRegion() != null ? entity.getRegion().getId() : null;
    }
    
    @Override
    protected void validateBusinessRules(CalendarEvent entity, boolean isUpdate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                throw new SecurityException("Authentication required for calendar event operations");
            }
            
            // Validate title uniqueness within creator scope
            if (entity.getTitle() != null && entity.getCreatedBy() != null) {
                List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
                if (!accessibleSchoolIds.isEmpty()) {
                    boolean exists = calendarEventRepository.existsByTitleAndCreatorIdAndSchoolIdIn(
                        entity.getTitle(), entity.getCreatedBy().getId(), accessibleSchoolIds);
                    if (exists && !isUpdate) {
                        throw new IllegalArgumentException("Calendar event with title '" + entity.getTitle() + 
                            "' already exists for creator in accessible schools");
                    }
                }
            }
            
            // Validate cross-tenant references
            if (entity.getCourse() != null) {
                List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
                if (!accessibleSchoolIds.isEmpty()) {
                    boolean courseExists = calendarEventRepository.existsByCourseIdAndSchoolIdIn(entity.getCourse().getId(), accessibleSchoolIds);
                    if (!courseExists) {
                        throw new IllegalArgumentException("Course " + entity.getCourse().getId() + " not accessible in user's school scope");
                    }
                }
            }
            
            if (entity.getTargetClass() != null) {
                List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
                if (!accessibleSchoolIds.isEmpty()) {
                    boolean classExists = calendarEventRepository.existsByClassIdAndSchoolIdIn(entity.getTargetClass().getId(), accessibleSchoolIds);
                    if (!classExists) {
                        throw new IllegalArgumentException("Class " + entity.getTargetClass().getId() + " not accessible in user's school scope");
                    }
                }
            }
            
            if (entity.getCreatedBy() != null) {
                List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
                if (!accessibleSchoolIds.isEmpty()) {
                    boolean creatorExists = calendarEventRepository.existsByCreatorIdAndSchoolIdIn(entity.getCreatedBy().getId(), accessibleSchoolIds);
                    if (!creatorExists) {
                        throw new IllegalArgumentException("Creator " + entity.getCreatedBy().getId() + " not accessible in user's school scope");
                    }
                }
            }
            
        } catch (Exception e) {
            log.error("Error validating calendar event business rules: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Calendar event validation failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getAll() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("No current user found, returning empty list");
            return List.of();
        }
        return getCalendarEventsByAccessibleScopes(currentUserId);
    }

    // ==================== MISSING INTERFACE METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByCreatorAndDateRange(Long creatorId, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            // Use existing repository method with filtering
            return calendarEventRepository.findByCreatedBy(creatorId).stream()
                .filter(event -> event.getStartTime().isAfter(startDate) && event.getEndTime().isBefore(endDate))
                .filter(event -> event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId()))
                .map(calendarEventMapper::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting events by creator and date range: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getUpcomingEvents(LocalDateTime fromDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getUpcomingCalendarEventsByAccessibleScopes(fromDate, currentUserId);
        } catch (Exception e) {
            log.error("Error getting upcoming events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public List<CalendarEventDTO> generateRecurringInstances(Long parentEventId, LocalDateTime until) {
        return generateRecurringEvents(parentEventId, until);
    }

    @Override
    @Transactional
    public void markEventAsAttended(Long eventId, Long userId) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            // Add user to attendees if not already present
            if (!event.getAttendees().contains(user)) {
                event.getAttendees().add(user);
            }
            
            calendarEventRepository.save(event);
        } catch (Exception e) {
            log.error("Error marking event as attended: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to mark event as attended: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsForUser(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return getUserEventsForDateRange(userId, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getConflictingEvents(LocalDateTime startTime, LocalDateTime endTime, Long excludeEventId) {
        return findConflictingEvents(excludeEventId, null, startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsRequiringApproval() {
        return getPendingApprovalEvents();
    }

    @Override
    @Transactional
    public void archiveOldEvents(LocalDateTime cutoffDate) {
        try {
            // Use existing method to find events before cutoff date
            List<CalendarEvent> oldEvents = calendarEventRepository.findEventsBetweenDates(
                LocalDateTime.of(2000, 1, 1, 0, 0), cutoffDate);
            oldEvents.forEach(event -> event.setActive(false));
            calendarEventRepository.saveAll(oldEvents);
            log.info("Archived {} old events before {}", oldEvents.size(), cutoffDate);
        } catch (Exception e) {
            log.error("Error archiving old events: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to archive old events: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getAttendedEventsByUser(Long userId) {
        return getEventsByAttendee(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> searchEventsByTitle(String title) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return searchCalendarEventsByTitleAndAccessibleScopes(title, currentUserId);
        } catch (Exception e) {
            log.error("Error searching events by title: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public void deleteRecurringEventSeries(Long parentEventId) {
        try {
            CalendarEvent parentEvent = calendarEventRepository.findById(parentEventId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent event not found with id: " + parentEventId));
            
            List<CalendarEvent> childEvents = calendarEventRepository.findByParentEvent(parentEventId);
            childEvents.forEach(event -> event.setActive(false));
            parentEvent.setActive(false);
            
            calendarEventRepository.saveAll(childEvents);
            calendarEventRepository.save(parentEvent);
            
            log.info("Deleted recurring event series with parent id: {}", parentEventId);
        } catch (Exception e) {
            log.error("Error deleting recurring event series: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to delete recurring event series: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getRecentlyUpdatedEvents(int limit) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            // Use existing method and limit results - use createdAt since updatedAt may not exist
            return calendarEventRepository.findByActiveTrue().stream()
                .filter(event -> event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId()))
                .sorted((e1, e2) -> e2.getCreatedAt().compareTo(e1.getCreatedAt()))
                .limit(limit)
                .map(calendarEventMapper::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting recently updated events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasTimeConflict(LocalDateTime startTime, LocalDateTime endTime, Long excludeEventId) {
        return hasConflicts(excludeEventId, null, startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByApprovalStatus(String status) {
        try {
            CalendarEventStatus eventStatus = CalendarEventStatus.valueOf(status.toUpperCase());
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByStatusAndAccessibleScopes(eventStatus, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by approval status: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public CalendarEventDTO createRecurringEvent(CalendarEventDTO eventDTO, String recurrenceRule) {
        try {
            CalendarEventDTO createdEvent = create(eventDTO);
            
            // Update the created event to set recurrence
            CalendarEvent entity = calendarEventRepository.findById(createdEvent.id())
                .orElseThrow(() -> new ResourceNotFoundException("Created event not found"));
            
            entity.setRecurring(true);
            entity.setRecurrenceRule(recurrenceRule);
            
            CalendarEvent savedEvent = calendarEventRepository.save(entity);
            return mapToDto(savedEvent);
        } catch (Exception e) {
            log.error("Error creating recurring event: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to create recurring event: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsForUserByType(Long userId, CalendarEventType type) {
        try {
            List<CalendarEventDTO> userEvents = getUserEvents(userId);
            return userEvents.stream()
                .filter(event -> event.eventType() == type)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting events for user by type: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByRegion(Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByRegionIdAndAccessibleScopes(regionId, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by region: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getRecentlyCreatedEvents(int limit) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            // Use existing method and limit results
            return calendarEventRepository.findByActiveTrue().stream()
                .filter(event -> event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId()))
                .sorted((e1, e2) -> e2.getCreatedAt().compareTo(e1.getCreatedAt()))
                .limit(limit)
                .map(calendarEventMapper::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting recently created events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getNotAttendedEventsByUser(Long userId) {
        try {
            List<CalendarEventDTO> allUserEvents = getUserEvents(userId);
            List<CalendarEventDTO> attendedEvents = getEventsByAttendee(userId);
            
            return allUserEvents.stream()
                .filter(event -> !attendedEvents.contains(event))
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting not attended events by user: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public void markEventAsNotAttended(Long eventId, Long userId) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            // Remove user from attendees
            event.getAttendees().remove(user);
            
            calendarEventRepository.save(event);
        } catch (Exception e) {
            log.error("Error marking event as not attended: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to mark event as not attended: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByDateAndType(LocalDateTime date, CalendarEventType type) {
        try {
            LocalDateTime dayStart = date.truncatedTo(ChronoUnit.DAYS);
            LocalDateTime dayEnd = dayStart.plusDays(1).minusSeconds(1);
            
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<CalendarEventDTO> dateRangeEvents = getCalendarEventsByDateRangeAndAccessibleScopes(dayStart, dayEnd, currentUserId);
            return dateRangeEvents.stream()
                .filter(event -> event.eventType() == type)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting events by date and type: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<CalendarEventDTO> events = getCalendarEventsByDateRangeAndAccessibleScopes(startDate, endDate, currentUserId);
            
            // Return the events list instead of a Map
            return events;
        } catch (Exception e) {
            log.error("Error getting event statistics: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public void deleteRecurringEventInstance(Long eventId) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            event.setActive(false);
            calendarEventRepository.save(event);
            
            log.info("Deleted recurring event instance with id: {}", eventId);
        } catch (Exception e) {
            log.error("Error deleting recurring event instance: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to delete recurring event instance: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public CalendarEventDTO restoreArchivedEvent(Long eventId) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            event.setActive(true);
            CalendarEvent savedEvent = calendarEventRepository.save(event);
            
            log.info("Restored archived event with id: {}", eventId);
            return mapToDto(savedEvent);
        } catch (Exception e) {
            log.error("Error restoring archived event: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to restore archived event: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public CalendarEventDTO updateEventStatus(Long eventId, CalendarEventStatus status) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            event.setStatus(status);
            CalendarEvent savedEvent = calendarEventRepository.save(event);
            
            return mapToDto(savedEvent);
        } catch (Exception e) {
            log.error("Error updating event status: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to update event status: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void bulkDeleteEvents(List<Long> eventIds) {
        deleteBulkEvents(eventIds);
    }

    @Override
    @Transactional
    public void bulkUpdateEventStatus(List<Long> eventIds, CalendarEventStatus status) {
        updateBulkEventStatus(eventIds, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getOngoingEvents(LocalDateTime currentTime) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getOngoingCalendarEventsByAccessibleScopes(currentTime, currentUserId);
        } catch (Exception e) {
            log.error("Error getting ongoing events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsBySchool(Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by school: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByClass(Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByClassIdAndAccessibleScopes(classId, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by class: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByDateRangeAndAccessibleScopes(startDate, endDate, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by date range: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByCourse(Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByCourseIdAndAccessibleScopes(courseId, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by course: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public CalendarEventDTO duplicateEvent(Long eventId, LocalDateTime newStartTime) {
        try {
            CalendarEvent originalEvent = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
            
            CalendarEvent duplicatedEvent = createChildEvent(originalEvent, newStartTime, 
                newStartTime.plusMinutes(ChronoUnit.MINUTES.between(originalEvent.getStartTime(), originalEvent.getEndTime())));
            
            duplicatedEvent.setParentEvent(null); // Not a recurring child
            CalendarEvent savedEvent = calendarEventRepository.save(duplicatedEvent);
            
            return mapToDto(savedEvent);
        } catch (Exception e) {
            log.error("Error duplicating event: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to duplicate event: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getArchivedEvents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            // Use existing method to find inactive events
            return calendarEventRepository.findByActiveTrue().stream()
                .filter(event -> !event.isActive())
                .filter(event -> event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId()))
                .map(calendarEventMapper::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting archived events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getPopularEvents(int limit) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            // Use existing method and sort by attendee count
            return calendarEventRepository.findByActiveTrue().stream()
                .filter(event -> event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId()))
                .sorted((e1, e2) -> Integer.compare(e2.getAttendees().size(), e1.getAttendees().size()))
                .limit(limit)
                .map(calendarEventMapper::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting popular events: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByPriority(CalendarEventPriority priority) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByPriorityAndAccessibleScopes(priority, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by priority: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getEventsByCreator(Long creatorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return List.of();
            }
            
            return getCalendarEventsByCreatorIdAndAccessibleScopes(creatorId, currentUserId);
        } catch (Exception e) {
            log.error("Error getting events by creator: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional
    public CalendarEventDTO approveEvent(Long eventId, Long approverId) {
        return approveEvent(eventId, approverId, "Approved");
    }

    public CalendarEventDTO approveEvent(Long eventId, Long approverId, String approvalNotes) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + approverId));

        event.setStatus(CalendarEventStatus.SCHEDULED);
        event.setApprovedBy(approver);
        event.setApprovedAt(LocalDateTime.now());
        event.setApprovalNotes(approvalNotes);

        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return calendarEventRepository.findByActiveTrue().stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return calendarEventRepository.findByMultiScopeAccess(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds
            ).stream()
                    .map(calendarEventMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getActiveCalendarEventsByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return calendarEventRepository.findByActiveTrue().stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return calendarEventRepository.findByMultiScopeAccessAndActive(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    true
            ).stream()
                    .map(calendarEventMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting active calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsBySchoolIdAndAccessibleScopes(Long schoolId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (!accessibleSchoolIds.contains(schoolId)) {
                log.warn("User {} does not have access to school {}", currentUserId, schoolId);
                return List.of();
            }
            
            return calendarEventRepository.findBySchoolIdSecure(schoolId).stream()
                    .map(calendarEventMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by school and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByRegionIdAndAccessibleScopes(Long regionId, Long currentUserId) {
        try {
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            if (!accessibleRegionIds.contains(regionId)) {
                log.warn("User {} does not have access to region {}", currentUserId, regionId);
                return List.of();
            }
            
            return calendarEventRepository.findByRegionId(regionId).stream()
                    .map(calendarEventMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by region and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByTypeAndAccessibleScopes(CalendarEventType type, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return calendarEventRepository.findByEventType(type).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByEventTypeAndSchoolIdInAndActive(type, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByEventTypeAndRegionIdInAndActive(type, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by type and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByPriorityAndAccessibleScopes(CalendarEventPriority priority, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByPriorityAndSchoolIdInAndActive(priority, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByPriorityAndRegionIdInAndActive(priority, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by priority and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByStatusAndAccessibleScopes(CalendarEventStatus status, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByStatusAndSchoolIdInAndActive(status, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByStatusAndRegionIdInAndActive(status, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by status and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByCreatorIdAndAccessibleScopes(Long creatorId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByCreatorIdAndSchoolIdInAndActive(creatorId, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByCreatorIdAndRegionIdInAndActive(creatorId, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by creator and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByCourseIdAndSchoolIdInAndActive(courseId, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByCourseIdAndRegionIdInAndActive(courseId, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by course and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByClassIdAndAccessibleScopes(Long classId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByClassIdAndRegionIdInAndActive(classId, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by class and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarEventsByDateRangeAndAccessibleScopes(LocalDateTime startDate, LocalDateTime endDate, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByDateRangeAndSchoolIdInAndActive(startDate, endDate, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByDateRangeAndRegionIdInAndActive(startDate, endDate, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting calendar events by date range and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getUpcomingCalendarEventsByAccessibleScopes(LocalDateTime fromDate, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findUpcomingEventsBySchoolIdInAndActive(fromDate, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findUpcomingEventsByRegionIdInAndActive(fromDate, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting upcoming calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getOngoingCalendarEventsByAccessibleScopes(LocalDateTime currentTime, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findOngoingEventsBySchoolIdInAndActive(currentTime, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findOngoingEventsByRegionIdInAndActive(currentTime, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting ongoing calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> searchCalendarEventsByTitleAndAccessibleScopes(String title, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByTitleContainingAndSchoolIdInAndActive(title, accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findByTitleContainingAndRegionIdInAndActive(title, accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error searching calendar events by title and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getPublicCalendarEventsByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findPublicEventsBySchoolIdInAndActive(accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findPublicEventsByRegionIdInAndActive(accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting public calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getRecurringCalendarEventsByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            List<CalendarEventDTO> results = new ArrayList<>();
            
            if (!accessibleSchoolIds.isEmpty()) {
                results.addAll(calendarEventRepository.findRecurringEventsBySchoolIdInAndActive(accessibleSchoolIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                results.addAll(calendarEventRepository.findRecurringEventsByRegionIdInAndActive(accessibleRegionIds, true).stream()
                        .map(calendarEventMapper::toDto)
                        .collect(Collectors.toList()));
            }
            
            return results.stream().distinct().collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting recurring calendar events by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateCalendarEventAccess(Long eventId, Long currentUserId) {
        try {
            CalendarEvent event = calendarEventRepository.findById(eventId).orElse(null);
            if (event == null) {
                return false;
            }
            
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return true;
            }
            
            if (event.getSchool() != null && accessibleSchoolIds.contains(event.getSchool().getId())) {
                return true;
            }
            
            if (event.getRegion() != null && accessibleRegionIds.contains(event.getRegion().getId())) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            log.error("Error validating calendar event access for user {}: {}", currentUserId, e.getMessage(), e);
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateCalendarEventBusinessRules(CalendarEventDTO eventDTO, Long currentUserId) {
        try {
            CalendarEvent entity = calendarEventMapper.toEntity(eventDTO);
            validateBusinessRules(entity, false);
            return true;
        } catch (Exception e) {
            log.error("Error validating calendar event business rules from DTO: {}", e.getMessage(), e);
            return false;
        }
    }

    // Statistics methods with multi-tenant security
    @Override
    @Transactional(readOnly = true)
    public Long getCalendarEventCountByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            Long schoolCount = !accessibleSchoolIds.isEmpty() ? 
                calendarEventRepository.countBySchoolIdInAndActive(accessibleSchoolIds, true) : 0L;
            Long regionCount = !accessibleRegionIds.isEmpty() ? 
                calendarEventRepository.countByRegionIdInAndActive(accessibleRegionIds, true) : 0L;
            
            return schoolCount + regionCount;
        } catch (Exception e) {
            log.error("Error getting calendar event count by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCalendarEventCountByTypeAndAccessibleScopes(CalendarEventType type, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return calendarEventRepository.countByEventTypeAndSchoolIdInAndActive(type, accessibleSchoolIds, true);
        } catch (Exception e) {
            log.error("Error getting calendar event count by type and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCalendarEventCountByStatusAndAccessibleScopes(CalendarEventStatus status, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return calendarEventRepository.countByStatusAndSchoolIdInAndActive(status, accessibleSchoolIds, true);
        } catch (Exception e) {
            log.error("Error getting calendar event count by status and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCalendarEventCountByPriorityAndAccessibleScopes(CalendarEventPriority priority, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return calendarEventRepository.countByPriorityAndSchoolIdInAndActive(priority, accessibleSchoolIds, true);
        } catch (Exception e) {
            log.error("Error getting calendar event count by priority and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCalendarEventCountByCreatorIdAndAccessibleScopes(Long creatorId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return calendarEventRepository.countByCreatorIdAndSchoolIdInAndActive(creatorId, accessibleSchoolIds, true);
        } catch (Exception e) {
            log.error("Error getting calendar event count by creator and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUpcomingCalendarEventCountByAccessibleScopes(LocalDateTime fromDate, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return (long) calendarEventRepository.findUpcomingEventsBySchoolIdInAndActive(fromDate, accessibleSchoolIds, true).size();
        } catch (Exception e) {
            log.error("Error getting upcoming calendar event count by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getPublicCalendarEventCountByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            return calendarEventRepository.countPublicEventsBySchoolIdInAndActive(accessibleSchoolIds, true);
        } catch (Exception e) {
            log.error("Error getting public calendar event count by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return 0L;
        }
    }

    // ==================== EXISTING METHODS ====================

    private void setEntityRelationships(CalendarEvent entity, CalendarEventDTO dto) {
        // Set created by user
        if (dto.createdById() != null) {
            User createdBy = userRepository.findById(dto.createdById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.createdById()));
            entity.setCreatedBy(createdBy);
        }

        // Set school
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                    .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }

        // Set region
        if (dto.regionId() != null) {
            Region region = regionRepository.findById(dto.regionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }

        // Set target class
        if (dto.targetClassId() != null) {
            com.ohma.thutothebe.entity.Class targetClass = classRepository.findById(dto.targetClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + dto.targetClassId()));
            entity.setTargetClass(targetClass);
        }

        // Set course
        if (dto.courseId() != null) {
            Course course = courseRepository.findById(dto.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.courseId()));
            entity.setCourse(course);
        }

        // Set attendees
        if (dto.attendeeIds() != null && !dto.attendeeIds().isEmpty()) {
            Set<User> attendees = dto.attendeeIds().stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)))
                    .collect(Collectors.toSet());
            entity.setAttendees(attendees);
        }

        // Set organizers
        if (dto.organizerIds() != null && !dto.organizerIds().isEmpty()) {
            Set<User> organizers = dto.organizerIds().stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)))
                    .collect(Collectors.toSet());
            entity.setOrganizers(organizers);
        }

        // Set approved by user
        if (dto.approvedById() != null) {
            User approvedBy = userRepository.findById(dto.approvedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.approvedById()));
            entity.setApprovedBy(approvedBy);
        }

        // Set parent event
        if (dto.parentEventId() != null) {
            CalendarEvent parentEvent = calendarEventRepository.findById(dto.parentEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent event not found with id: " + dto.parentEventId()));
            entity.setParentEvent(parentEvent);
        }
    }

    // Date range queries
    @Override
    public List<CalendarEventDTO> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime) {
        List<CalendarEvent> events = calendarEventRepository.findEventsBetweenDates(startTime, endTime);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public Page<CalendarEventDTO> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable) {
        Page<CalendarEvent> events = calendarEventRepository.findEventsBetweenDates(startTime, endTime, pageable);
        return events.map(this::mapToDto);
    }

    // Scope-based queries
    @Override
    public List<CalendarEventDTO> getEventsByScope(CalendarEventScope scope) {
        List<CalendarEvent> events = calendarEventRepository.findByScope(scope);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getGlobalEvents() {
        List<CalendarEvent> events = calendarEventRepository.findGlobalEvents();
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsForRegion(Long regionId) {
        List<CalendarEvent> events = calendarEventRepository.findEventsForRegion(regionId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsForSchool(Long regionId, Long schoolId) {
        List<CalendarEvent> events = calendarEventRepository.findEventsForSchool(regionId, schoolId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsForClass(Long regionId, Long schoolId, Long classId) {
        List<CalendarEvent> events = calendarEventRepository.findEventsForClass(regionId, schoolId, classId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // User-specific queries
    @Override
    public List<CalendarEventDTO> getEventsByCreatedBy(Long userId) {
        List<CalendarEvent> events = calendarEventRepository.findByCreatedBy(userId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsByAttendee(Long userId) {
        List<CalendarEvent> events = calendarEventRepository.findByAttendee(userId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsByOrganizer(Long userId) {
        List<CalendarEvent> events = calendarEventRepository.findByOrganizer(userId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getUserEvents(Long userId) {
        List<CalendarEvent> events = calendarEventRepository.findUserEvents(userId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getUserEventsForDateRange(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<CalendarEvent> userEvents = calendarEventRepository.findUserEvents(userId);
        List<CalendarEvent> filteredEvents = userEvents.stream()
                .filter(event -> 
                    (event.getStartTime().isAfter(startTime) || event.getStartTime().isEqual(startTime)) &&
                    (event.getEndTime().isBefore(endTime) || event.getEndTime().isEqual(endTime)))
                .collect(Collectors.toList());
        return filteredEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Type and status queries
    @Override
    public List<CalendarEventDTO> getEventsByType(CalendarEventType eventType) {
        List<CalendarEvent> events = calendarEventRepository.findByActiveTrueAndEventType(eventType);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsByTypes(List<CalendarEventType> eventTypes) {
        List<CalendarEvent> events = calendarEventRepository.findByEventTypes(eventTypes);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getEventsByStatus(CalendarEventStatus status) {
        List<CalendarEvent> events = calendarEventRepository.findByActiveTrueAndStatus(status);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Recurring events
    @Override
    public List<CalendarEventDTO> getRecurringEvents() {
        List<CalendarEvent> events = calendarEventRepository.findRecurringEvents();
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getChildEvents(Long parentEventId) {
        List<CalendarEvent> events = calendarEventRepository.findByParentEvent(parentEventId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> generateRecurringEvents(Long parentEventId, LocalDateTime until) {
        CalendarEvent parentEvent = calendarEventRepository.findById(parentEventId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent event not found with id: " + parentEventId));

        if (!parentEvent.isRecurring() || parentEvent.getRecurrenceRule() == null) {
            throw new IllegalArgumentException("Event is not recurring or has no recurrence rule");
        }

        List<CalendarEvent> generatedEvents = new ArrayList<>();
        LocalDateTime currentStart = parentEvent.getStartTime();
        LocalDateTime currentEnd = parentEvent.getEndTime();
        long duration = ChronoUnit.MINUTES.between(currentStart, currentEnd);

        // Simple recurrence logic - can be enhanced for complex rules
        String recurrenceRule = parentEvent.getRecurrenceRule().toLowerCase();
        
        while (currentStart.isBefore(until)) {
            if (recurrenceRule.contains("daily")) {
                currentStart = currentStart.plusDays(1);
            } else if (recurrenceRule.contains("weekly")) {
                currentStart = currentStart.plusWeeks(1);
            } else if (recurrenceRule.contains("monthly")) {
                currentStart = currentStart.plusMonths(1);
            } else if (recurrenceRule.contains("yearly")) {
                currentStart = currentStart.plusYears(1);
            } else {
                break; // Unknown recurrence rule
            }

            currentEnd = currentStart.plusMinutes(duration);

            if (currentStart.isBefore(until)) {
                CalendarEvent childEvent = createChildEvent(parentEvent, currentStart, currentEnd);
                generatedEvents.add(calendarEventRepository.save(childEvent));
            }
        }

        return generatedEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private CalendarEvent createChildEvent(CalendarEvent parentEvent, LocalDateTime startTime, LocalDateTime endTime) {
        CalendarEvent childEvent = new CalendarEvent();
        childEvent.setTitle(parentEvent.getTitle());
        childEvent.setDescription(parentEvent.getDescription());
        childEvent.setStartTime(startTime);
        childEvent.setEndTime(endTime);
        childEvent.setLocation(parentEvent.getLocation());
        childEvent.setEventType(parentEvent.getEventType());
        childEvent.setPriority(parentEvent.getPriority());
        childEvent.setScope(parentEvent.getScope());
        childEvent.setAllDay(parentEvent.isAllDay());
        childEvent.setRecurring(false); // Child events are not recurring
        childEvent.setColor(parentEvent.getColor());
        childEvent.setStatus(CalendarEventStatus.SCHEDULED);
        childEvent.setCreatedBy(parentEvent.getCreatedBy());
        childEvent.setSchool(parentEvent.getSchool());
        childEvent.setRegion(parentEvent.getRegion());
        childEvent.setTargetClass(parentEvent.getTargetClass());
        childEvent.setCourse(parentEvent.getCourse());
        childEvent.setTargetRoles(new HashSet<>(parentEvent.getTargetRoles()));
        childEvent.setAttendees(new HashSet<>(parentEvent.getAttendees()));
        childEvent.setOrganizers(new HashSet<>(parentEvent.getOrganizers()));
        childEvent.setRequiresApproval(parentEvent.isRequiresApproval());
        childEvent.setMaxAttendees(parentEvent.getMaxAttendees());
        childEvent.setRegistrationRequired(parentEvent.isRegistrationRequired());
        childEvent.setRegistrationDeadline(parentEvent.getRegistrationDeadline());
        childEvent.setExternalLink(parentEvent.getExternalLink());
        childEvent.setMeetingLink(parentEvent.getMeetingLink());
        childEvent.setNotes(parentEvent.getNotes());
        childEvent.setPublic(parentEvent.isPublic());
        childEvent.setReminderMinutes(parentEvent.getReminderMinutes());
        childEvent.setActive(true);
        childEvent.setParentEvent(parentEvent);
        
        return childEvent;
    }

    // Approval workflow
    @Override
    public List<CalendarEventDTO> getPendingApprovalEvents() {
        List<CalendarEvent> events = calendarEventRepository.findPendingApprovalEvents();
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getPendingApprovalEventsForSchool(Long schoolId) {
        List<CalendarEvent> events = calendarEventRepository.findPendingApprovalEventsForSchool(schoolId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public CalendarEventDTO rejectEvent(Long eventId, Long approverId, String rejectionNotes) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + approverId));

        event.setStatus(CalendarEventStatus.CANCELLED);
        event.setApprovedBy(approver);
        event.setApprovedAt(LocalDateTime.now());
        event.setApprovalNotes(rejectionNotes);

        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    // Time-based queries
    public List<CalendarEventDTO> getUpcomingEvents() {
        List<CalendarEvent> events = calendarEventRepository.findUpcomingEvents(LocalDateTime.now());
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public Page<CalendarEventDTO> getUpcomingEvents(Pageable pageable) {
        Page<CalendarEvent> events = calendarEventRepository.findUpcomingEvents(LocalDateTime.now(), pageable);
        return events.map(this::mapToDto);
    }

    @Override
    public List<CalendarEventDTO> getTodaysEvents() {
        List<CalendarEvent> events = calendarEventRepository.findTodaysEvents(LocalDateTime.now());
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getThisWeeksEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.with(java.time.DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime weekEnd = weekStart.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        
        List<CalendarEvent> events = calendarEventRepository.findThisWeeksEvents(weekStart, weekEnd);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Course-related events
    @Override
    public List<CalendarEventDTO> getCourseEvents(Long courseId) {
        List<CalendarEvent> events = calendarEventRepository.findByCourse(courseId);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime) {
        List<CalendarEvent> events = calendarEventRepository.findCourseEventsBetweenDates(courseId, startTime, endTime);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Role-based events
    @Override
    public List<CalendarEventDTO> getEventsByTargetRole(UserRole role) {
        List<CalendarEvent> events = calendarEventRepository.findByTargetRole(role);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Public events
    @Override
    public List<CalendarEventDTO> getPublicEvents() {
        List<CalendarEvent> events = calendarEventRepository.findPublicEvents();
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Search functionality
    @Override
    public List<CalendarEventDTO> searchEvents(String searchTerm) {
        List<CalendarEvent> events = calendarEventRepository.searchEvents(searchTerm);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public Page<CalendarEventDTO> searchEvents(String searchTerm, Pageable pageable) {
        Page<CalendarEvent> events = calendarEventRepository.searchEvents(searchTerm, pageable);
        return events.map(this::mapToDto);
    }

    // Event management
    @Override
    public CalendarEventDTO addAttendee(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (event.getMaxAttendees() != null && event.getAttendees().size() >= event.getMaxAttendees()) {
            throw new IllegalStateException("Event has reached maximum attendee capacity");
        }

        event.getAttendees().add(user);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO removeAttendee(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getAttendees().remove(user);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO addOrganizer(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getOrganizers().add(user);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO removeOrganizer(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getOrganizers().remove(user);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    // Event status management
    @Override
    public CalendarEventDTO markAsOngoing(Long eventId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(CalendarEventStatus.ONGOING);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO markAsCompleted(Long eventId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(CalendarEventStatus.COMPLETED);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO cancelEvent(Long eventId, String reason) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(CalendarEventStatus.CANCELLED);
        event.setNotes(event.getNotes() != null ? event.getNotes() + "\nCancellation reason: " + reason : "Cancellation reason: " + reason);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    public CalendarEventDTO postponeEvent(Long eventId, LocalDateTime newStartTime, LocalDateTime newEndTime) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(CalendarEventStatus.POSTPONED);
        event.setStartTime(newStartTime);
        event.setEndTime(newEndTime);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    @Override
    public CalendarEventDTO rescheduleEvent(Long eventId, LocalDateTime newStartTime, LocalDateTime newEndTime) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(CalendarEventStatus.RESCHEDULED);
        event.setStartTime(newStartTime);
        event.setEndTime(newEndTime);
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return mapToDto(savedEvent);
    }

    // Statistics
    @Override
    public Long getEventCountBySchool(Long schoolId) {
        return calendarEventRepository.countEventsBySchool(schoolId);
    }

    @Override
    public Long getEventCountByType(CalendarEventType eventType) {
        return calendarEventRepository.countEventsByType(eventType);
    }

    @Override
    public List<Object[]> getEventCountByType() {
        return calendarEventRepository.getEventCountByType();
    }

    // Conflict detection
    @Override
    public List<CalendarEventDTO> findConflictingEvents(Long eventId, String location, LocalDateTime startTime, LocalDateTime endTime) {
        List<CalendarEvent> events = calendarEventRepository.findConflictingEvents(eventId, location, startTime, endTime);
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public boolean hasConflicts(Long eventId, String location, LocalDateTime startTime, LocalDateTime endTime) {
        List<CalendarEvent> conflicts = calendarEventRepository.findConflictingEvents(eventId, location, startTime, endTime);
        return !conflicts.isEmpty();
    }

    // Permission checks
    @Override
    public boolean canUserViewEvent(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return event.canUserView(user);
    }

    @Override
    public boolean canUserEditEvent(Long eventId, Long userId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return event.canUserEdit(user);
    }

    @Override
    public boolean canUserDeleteEvent(Long eventId, Long userId) {
        // Same logic as edit for now, can be customized
        return canUserEditEvent(eventId, userId);
    }

    // Bulk operations
    @Override
    public List<CalendarEventDTO> createBulkEvents(List<CalendarEventDTO> events) {
        List<CalendarEvent> entities = events.stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());
        
        List<CalendarEvent> savedEntities = calendarEventRepository.saveAll(entities);
        return savedEntities.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void deleteBulkEvents(List<Long> eventIds) {
        List<CalendarEvent> events = calendarEventRepository.findAllById(eventIds);
        events.forEach(event -> event.setActive(false));
        calendarEventRepository.saveAll(events);
    }

    @Override
    public List<CalendarEventDTO> updateBulkEventStatus(List<Long> eventIds, CalendarEventStatus status) {
        List<CalendarEvent> events = calendarEventRepository.findAllById(eventIds);
        events.forEach(event -> event.setStatus(status));
        List<CalendarEvent> savedEvents = calendarEventRepository.saveAll(events);
        return savedEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Calendar view helpers
    @Override
    public List<CalendarEventDTO> getEventsForCalendarView(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<CalendarEvent> allEvents = calendarEventRepository.findEventsBetweenDates(startDate, endDate);
        
        // Filter events based on user permissions
        List<CalendarEvent> visibleEvents = allEvents.stream()
                .filter(event -> event.canUserView(user))
                .collect(Collectors.toList());

        return visibleEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getMonthEvents(Long userId, int year, int month) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        return getEventsForCalendarView(userId, startDate, endDate);
    }

    @Override
    public List<CalendarEventDTO> getWeekEvents(Long userId, LocalDateTime weekStart) {
        LocalDateTime weekEnd = weekStart.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        return getEventsForCalendarView(userId, weekStart, weekEnd);
    }

    @Override
    public List<CalendarEventDTO> getDayEvents(Long userId, LocalDateTime date) {
        LocalDateTime dayStart = date.truncatedTo(ChronoUnit.DAYS);
        LocalDateTime dayEnd = dayStart.plusDays(1).minusSeconds(1);
        return getEventsForCalendarView(userId, dayStart, dayEnd);
    }

    // Notification and reminder helpers
    @Override
    public List<CalendarEventDTO> getEventsNeedingReminders(LocalDateTime reminderTime) {
        List<CalendarEvent> allEvents = calendarEventRepository.findByActiveTrue();
        
        List<CalendarEvent> eventsNeedingReminders = allEvents.stream()
                .filter(event -> event.getReminderMinutes() != null && event.getReminderMinutes() > 0)
                .filter(event -> {
                    LocalDateTime reminderDateTime = event.getStartTime().minusMinutes(event.getReminderMinutes());
                    return reminderDateTime.isBefore(reminderTime) || reminderDateTime.isEqual(reminderTime);
                })
                .collect(Collectors.toList());

        return eventsNeedingReminders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void sendEventReminders(Long eventId) {
        // Implementation would integrate with notification service
        log.info("Sending reminders for event with id: {}", eventId);
    }

    @Override
    public void sendEventNotifications(Long eventId, String notificationType) {
        // Implementation would integrate with notification service
        log.info("Sending {} notification for event with id: {}", notificationType, eventId);
    }

    // Academic calendar helpers
    @Override
    public List<CalendarEventDTO> getAcademicYearEvents(Integer academicYear) {
        LocalDateTime yearStart = LocalDateTime.of(academicYear, 1, 1, 0, 0);
        LocalDateTime yearEnd = LocalDateTime.of(academicYear, 12, 31, 23, 59, 59);
        
        List<CalendarEventType> academicTypes = Arrays.asList(
                CalendarEventType.ACADEMIC_TERM_START,
                CalendarEventType.ACADEMIC_TERM_END,
                CalendarEventType.SEMESTER_START,
                CalendarEventType.SEMESTER_END,
                CalendarEventType.ACADEMIC_YEAR_START,
                CalendarEventType.ACADEMIC_YEAR_END
        );
        
        List<CalendarEvent> events = calendarEventRepository.findByEventTypes(academicTypes);
        List<CalendarEvent> filteredEvents = events.stream()
                .filter(event -> event.getStartTime().getYear() == academicYear)
                .collect(Collectors.toList());

        return filteredEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getTermEvents(String term, Integer academicYear) {
        // This would need to be enhanced based on specific term definitions
        List<CalendarEvent> allEvents = calendarEventRepository.findByActiveTrue();
        
        List<CalendarEvent> termEvents = allEvents.stream()
                .filter(event -> event.getStartTime().getYear() == academicYear)
                .filter(event -> event.getTitle().toLowerCase().contains(term.toLowerCase()) ||
                               event.getDescription() != null && event.getDescription().toLowerCase().contains(term.toLowerCase()))
                .collect(Collectors.toList());

        return termEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getHolidayEvents(LocalDateTime startDate, LocalDateTime endDate) {
        List<CalendarEventType> holidayTypes = Arrays.asList(
                CalendarEventType.PUBLIC_HOLIDAY,
                CalendarEventType.SCHOOL_HOLIDAY,
                CalendarEventType.TERM_BREAK,
                CalendarEventType.SEMESTER_BREAK,
                CalendarEventType.STUDY_BREAK
        );
        
        List<CalendarEvent> events = calendarEventRepository.findByEventTypes(holidayTypes);
        List<CalendarEvent> filteredEvents = events.stream()
                .filter(event -> 
                    (event.getStartTime().isAfter(startDate) || event.getStartTime().isEqual(startDate)) &&
                    (event.getEndTime().isBefore(endDate) || event.getEndTime().isEqual(endDate)))
                .collect(Collectors.toList());

        return filteredEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CalendarEventDTO> getExamEvents(LocalDateTime startDate, LocalDateTime endDate) {
        List<CalendarEventType> examTypes = Arrays.asList(
                CalendarEventType.EXAM_PERIOD,
                CalendarEventType.MIDTERM_EXAM,
                CalendarEventType.FINAL_EXAM,
                CalendarEventType.ENTRANCE_EXAM,
                CalendarEventType.ASSESSMENT
        );
        
        List<CalendarEvent> events = calendarEventRepository.findByEventTypes(examTypes);
        List<CalendarEvent> filteredEvents = events.stream()
                .filter(event -> 
                    (event.getStartTime().isAfter(startDate) || event.getStartTime().isEqual(startDate)) &&
                    (event.getEndTime().isBefore(endDate) || event.getEndTime().isEqual(endDate)))
                .collect(Collectors.toList());

        return filteredEvents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Import/Export functionality
    @Override
    public void importEventsFromCalendar(String calendarData, Long userId) {
        // Implementation would parse calendar data (iCal, CSV, etc.) and create events
        log.info("Importing calendar data for user: {}", userId);
    }

    @Override
    public String exportEventsToCalendar(List<Long> eventIds) {
        // Implementation would generate calendar data (iCal format)
        log.info("Exporting events: {}", eventIds);
        return "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//School LMS//Calendar//EN\nEND:VCALENDAR";
    }

    @Override
    public String exportUserCalendar(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<CalendarEventDTO> events = getEventsForCalendarView(userId, startDate, endDate);
        List<Long> eventIds = events.stream().map(CalendarEventDTO::id).collect(Collectors.toList());
        return exportEventsToCalendar(eventIds);
    }
} 