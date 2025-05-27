package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.repository.CalendarEventRepository;
import com.ohma.thutothebe.service.CalendarEventService;
import com.ohma.thutothebe.service.EventCompatibilityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EventCompatibilityServiceImpl implements EventCompatibilityService {

    private final CalendarEventService calendarEventService;
    private final CalendarEventRepository calendarEventRepository;

    @Autowired
    public EventCompatibilityServiceImpl(
            CalendarEventService calendarEventService,
            CalendarEventRepository calendarEventRepository) {
        this.calendarEventService = calendarEventService;
        this.calendarEventRepository = calendarEventRepository;
    }

    @Override
    @Transactional
    public EventDto create(EventDto eventDto) {
        log.info("Creating event through compatibility layer: {}", eventDto.title());
        
        // Convert EventDto to CalendarEventDTO
        CalendarEventDTO calendarEventDTO = mapEventDtoToCalendarEventDTO(eventDto);
        
        // Create using CalendarEventService
        CalendarEventDTO createdCalendarEvent = calendarEventService.create(calendarEventDTO);
        
        // Convert back to EventDto
        return mapCalendarEventDTOToEventDto(createdCalendarEvent);
    }

    @Override
    @Transactional
    public EventDto update(Long id, EventDto eventDto) {
        log.info("Updating event through compatibility layer: {}", id);
        
        // Find the corresponding CalendarEvent
        CalendarEventDTO existingCalendarEvent = findCalendarEventByCompatibilityId(id);
        
        // Convert EventDto to CalendarEventDTO
        CalendarEventDTO calendarEventDTO = mapEventDtoToCalendarEventDTO(eventDto);
        
        // Update using CalendarEventService
        CalendarEventDTO updatedCalendarEvent = calendarEventService.update(existingCalendarEvent.id(), calendarEventDTO);
        
        // Convert back to EventDto
        return mapCalendarEventDTOToEventDto(updatedCalendarEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public EventDto getById(Long id) {
        log.debug("Getting event by ID through compatibility layer: {}", id);
        
        CalendarEventDTO calendarEvent = findCalendarEventByCompatibilityId(id);
        return mapCalendarEventDTOToEventDto(calendarEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public EventDto findById(Long id) {
        log.debug("Finding event by ID through compatibility layer: {}", id);
        
        CalendarEventDTO calendarEvent = findCalendarEventByCompatibilityId(id);
        return mapCalendarEventDTOToEventDto(calendarEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getAll() {
        log.debug("Getting all events through compatibility layer");
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getAll();
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventDto> getAll(Pageable pageable) {
        log.debug("Getting all events with pagination through compatibility layer");
        
        Page<CalendarEventDTO> calendarEvents = calendarEventService.getAll(pageable);
        List<EventDto> compatibleEvents = calendarEvents.getContent().stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(compatibleEvents, pageable, calendarEvents.getTotalElements());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting event through compatibility layer: {}", id);
        
        CalendarEventDTO calendarEvent = findCalendarEventByCompatibilityId(id);
        calendarEventService.delete(calendarEvent.id());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getEventsByCourseId(Long courseId) {
        log.debug("Getting events by course ID through compatibility layer: {}", courseId);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getEventsBetweenDates(
            LocalDateTime.now().minusYears(1), LocalDateTime.now().plusYears(1));
        
        return calendarEvents.stream()
                .filter(event -> event.courseId() != null && event.courseId().equals(courseId))
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getEventsByUserId(Long userId) {
        log.debug("Getting events by user ID through compatibility layer: {}", userId);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getUserEvents(userId);
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime) {
        log.debug("Getting events between dates through compatibility layer: {} to {}", startTime, endTime);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getEventsBetweenDates(startTime, endTime);
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime) {
        log.debug("Getting course events between dates through compatibility layer: course {} from {} to {}", 
            courseId, startTime, endTime);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getEventsBetweenDates(startTime, endTime);
        return calendarEvents.stream()
                .filter(event -> event.courseId() != null && event.courseId().equals(courseId))
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getAllRecurringEvents() {
        log.debug("Getting all recurring events through compatibility layer");
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getRecurringEvents();
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<EventDto> generateRecurringEvents(Long eventId, LocalDateTime until) {
        log.info("Generating recurring events through compatibility layer: event {} until {}", eventId, until);
        
        CalendarEventDTO calendarEvent = findCalendarEventByCompatibilityId(eventId);
        List<CalendarEventDTO> generatedEvents = calendarEventService.generateRecurringEvents(calendarEvent.id(), until);
        
        return generatedEvents.stream()
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getStudentEvents(Long studentId) {
        log.debug("Getting student events through compatibility layer: {}", studentId);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getUserEvents(studentId);
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDto> getStudentEventsBetweenDates(Long studentId, LocalDateTime startTime, LocalDateTime endTime) {
        log.debug("Getting student events between dates through compatibility layer: student {} from {} to {}", 
            studentId, startTime, endTime);
        
        List<CalendarEventDTO> calendarEvents = calendarEventService.getEventsForCalendarView(studentId, startTime, endTime);
        return calendarEvents.stream()
                .filter(this::isCompatibleEvent)
                .map(this::mapCalendarEventDTOToEventDto)
                .collect(Collectors.toList());
    }

    // Helper methods

    private CalendarEventDTO mapEventDtoToCalendarEventDTO(EventDto eventDto) {
        return new CalendarEventDTO(
            eventDto.id(),
            eventDto.title(),
            eventDto.description(),
            eventDto.startTime(),
            eventDto.endTime(),
            eventDto.location(),
            mapEventTypeToCalendarEventType(eventDto.type()),
            CalendarEventPriority.MEDIUM, // Default priority
            CalendarEventScope.COURSE, // Default scope for course events
            eventDto.isAllDay(),
            eventDto.isRecurring(),
            eventDto.recurrenceRule(),
            null, // recurrenceEndDate
            eventDto.color(),
            CalendarEventStatus.SCHEDULED, // Default status
            eventDto.createdById(),
            null, // createdByName - will be set by service
            null, // schoolId - will be determined from course
            null, // schoolName
            null, // regionId
            null, // regionName
            null, // targetClassId
            null, // targetClassName
            eventDto.courseId(),
            null, // courseName
            null, // targetRoles
            null, // attendeeIds
            null, // attendeeNames
            null, // organizerIds
            null, // organizerNames
            false, // requiresApproval
            null, // approvedById
            null, // approvedByName
            null, // approvedAt
            null, // approvalNotes
            null, // maxAttendees
            false, // registrationRequired
            null, // registrationDeadline
            null, // externalLink
            null, // meetingLink
            "COMPATIBILITY_EVENT", // notes to identify compatibility events
            true, // isPublic
            null, // reminderMinutes
            true, // active
            null, // parentEventId
            null, // createdAt
            null  // modifiedAt
        );
    }

    private EventDto mapCalendarEventDTOToEventDto(CalendarEventDTO calendarEventDTO) {
        return new EventDto(
            calendarEventDTO.id(),
            calendarEventDTO.title(),
            calendarEventDTO.description(),
            calendarEventDTO.startTime(),
            calendarEventDTO.endTime(),
            calendarEventDTO.location(),
            mapCalendarEventTypeToEventType(calendarEventDTO.eventType()),
            calendarEventDTO.courseId(),
            calendarEventDTO.createdById(),
            calendarEventDTO.isRecurring(),
            calendarEventDTO.recurrenceRule(),
            calendarEventDTO.isAllDay(),
            calendarEventDTO.color()
        );
    }

    private CalendarEventType mapEventTypeToCalendarEventType(EventType eventType) {
        switch (eventType) {
            case COURSE_EVENT:
                return CalendarEventType.CLASS_SESSION;
            case ASSIGNMENT_DUE:
                return CalendarEventType.ASSESSMENT;
            case QUIZ:
                return CalendarEventType.ASSESSMENT;
            case EXAM:
                return CalendarEventType.EXAM_PERIOD;
            case MEETING:
                return CalendarEventType.STAFF_MEETING;
            case HOLIDAY:
                return CalendarEventType.PUBLIC_HOLIDAY;
            case CUSTOM:
                return CalendarEventType.CUSTOM;
            default:
                return CalendarEventType.GENERAL;
        }
    }

    private EventType mapCalendarEventTypeToEventType(CalendarEventType calendarEventType) {
        switch (calendarEventType) {
            case CLASS_SESSION:
            case LECTURE:
            case TUTORIAL:
            case PRACTICAL_SESSION:
            case LAB_SESSION:
                return EventType.COURSE_EVENT;
            case ASSESSMENT:
                return EventType.ASSIGNMENT_DUE;
            case EXAM_PERIOD:
            case MIDTERM_EXAM:
            case FINAL_EXAM:
                return EventType.EXAM;
            case STAFF_MEETING:
            case PARENT_MEETING:
            case BOARD_MEETING:
                return EventType.MEETING;
            case PUBLIC_HOLIDAY:
            case SCHOOL_HOLIDAY:
                return EventType.HOLIDAY;
            case CUSTOM:
                return EventType.CUSTOM;
            default:
                return EventType.CUSTOM;
        }
    }

    private CalendarEventDTO findCalendarEventByCompatibilityId(Long eventId) {
        // For now, we assume direct ID mapping
        // In a real migration, you might need to maintain a mapping table
        CalendarEventDTO calendarEvent = calendarEventService.getById(eventId);
        if (calendarEvent == null) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return calendarEvent;
    }

    private boolean isCompatibleEvent(CalendarEventDTO calendarEvent) {
        // Filter events that should be visible through the compatibility layer
        // For example, only course-related events or events with specific notes
        return calendarEvent.courseId() != null || 
               (calendarEvent.notes() != null && calendarEvent.notes().contains("COMPATIBILITY_EVENT")) ||
               (calendarEvent.notes() != null && calendarEvent.notes().contains("MIGRATED_FROM_EVENT"));
    }
} 