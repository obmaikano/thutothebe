package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.repository.CalendarEventRepository;
import com.ohma.thutothebe.repository.EventRepository;
import com.ohma.thutothebe.service.CalendarEventService;
import com.ohma.thutothebe.service.EventMigrationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EventMigrationServiceImpl implements EventMigrationService {

    private final EventRepository eventRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final CalendarEventService calendarEventService;

    @Autowired
    public EventMigrationServiceImpl(
            EventRepository eventRepository,
            CalendarEventRepository calendarEventRepository,
            CalendarEventService calendarEventService) {
        this.eventRepository = eventRepository;
        this.calendarEventRepository = calendarEventRepository;
        this.calendarEventService = calendarEventService;
    }

    @Override
    @Transactional
    public List<CalendarEventDTO> migrateAllEvents() {
        log.info("Starting migration of all Event entities to CalendarEvent entities");
        
        List<Event> events = eventRepository.findAll();
        List<CalendarEventDTO> migratedEvents = new ArrayList<>();
        
        for (Event event : events) {
            try {
                CalendarEventDTO migratedEvent = migrateEvent(event.getId());
                migratedEvents.add(migratedEvent);
                log.debug("Successfully migrated event: {} (ID: {})", event.getTitle(), event.getId());
            } catch (Exception e) {
                log.error("Failed to migrate event: {} (ID: {}). Error: {}", 
                    event.getTitle(), event.getId(), e.getMessage(), e);
            }
        }
        
        log.info("Migration completed. Migrated {} out of {} events", 
            migratedEvents.size(), events.size());
        
        return migratedEvents;
    }

    @Override
    @Transactional
    public CalendarEventDTO migrateEvent(Long eventId) {
        log.info("Migrating event with ID: {}", eventId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        // Check if already migrated
        if (isEventAlreadyMigrated(event)) {
            log.warn("Event {} (ID: {}) has already been migrated", event.getTitle(), eventId);
            return findMigratedEvent(event);
        }
        
        CalendarEventDTO calendarEventDTO = mapEventToCalendarEventDTO(event);
        CalendarEventDTO createdEvent = calendarEventService.create(calendarEventDTO);
        
        // Mark original event as migrated by setting a flag or soft delete
        markEventAsMigrated(event);
        
        log.info("Successfully migrated event: {} (ID: {}) to CalendarEvent (ID: {})", 
            event.getTitle(), eventId, createdEvent.id());
        
        return createdEvent;
    }

    @Override
    public boolean isMigrationNeeded() {
        long unmigratedCount = getUnmigratedEventCount();
        log.info("Migration needed check: {} unmigrated events found", unmigratedCount);
        return unmigratedCount > 0;
    }

    @Override
    public long getUnmigratedEventCount() {
        // Count events that haven't been migrated (assuming we add a migrated flag)
        return eventRepository.count();
    }

    @Override
    public boolean validateMigration() {
        log.info("Validating migration results");
        
        long originalEventCount = eventRepository.count();
        long migratedEventCount = calendarEventRepository.count();
        
        boolean isValid = migratedEventCount >= originalEventCount;
        
        if (isValid) {
            log.info("Migration validation successful: {} original events, {} calendar events", 
                originalEventCount, migratedEventCount);
        } else {
            log.error("Migration validation failed: {} original events, {} calendar events", 
                originalEventCount, migratedEventCount);
        }
        
        return isValid;
    }

    @Override
    @Transactional
    public void rollbackMigration() {
        log.warn("Rolling back migration - this will delete all CalendarEvent entities created from Event migration");
        
        // This is a destructive operation - use with caution
        List<CalendarEvent> migratedEvents = calendarEventRepository.findAll().stream()
                .filter(event -> event.getNotes() != null && event.getNotes().contains("MIGRATED_FROM_EVENT"))
                .collect(Collectors.toList());
        
        calendarEventRepository.deleteAll(migratedEvents);
        
        log.info("Rollback completed. Deleted {} migrated CalendarEvent entities", migratedEvents.size());
    }

    private CalendarEventDTO mapEventToCalendarEventDTO(Event event) {
        CalendarEventType mappedType = mapEventTypeToCalendarEventType(event.getType());
        CalendarEventScope scope = determineEventScope(event);
        
        return new CalendarEventDTO(
            null, // ID will be generated
            event.getTitle(),
            event.getDescription(),
            event.getStartTime(),
            event.getEndTime(),
            event.getLocation(),
            mappedType,
            CalendarEventPriority.MEDIUM, // Default priority
            scope,
            event.isAllDay(),
            event.isRecurring(),
            event.getRecurrenceRule(),
            null, // recurrenceEndDate
            event.getColor() != null ? event.getColor() : "#3B82F6", // Default color
            CalendarEventStatus.SCHEDULED, // Default status
            event.getCreatedBy().getId(),
            event.getCreatedBy().getFirstName() + " " + event.getCreatedBy().getLastName(),
            event.getCourse() != null && event.getCourse().getClassEntity() != null && 
                event.getCourse().getClassEntity().getSchool() != null ? 
                event.getCourse().getClassEntity().getSchool().getId() : null,
            event.getCourse() != null && event.getCourse().getClassEntity() != null && 
                event.getCourse().getClassEntity().getSchool() != null ? 
                event.getCourse().getClassEntity().getSchool().getName() : null,
            event.getCourse() != null && event.getCourse().getClassEntity() != null && 
                event.getCourse().getClassEntity().getSchool() != null && 
                event.getCourse().getClassEntity().getSchool().getRegion() != null ? 
                event.getCourse().getClassEntity().getSchool().getRegion().getId() : null,
            event.getCourse() != null && event.getCourse().getClassEntity() != null && 
                event.getCourse().getClassEntity().getSchool() != null && 
                event.getCourse().getClassEntity().getSchool().getRegion() != null ? 
                event.getCourse().getClassEntity().getSchool().getRegion().getName() : null,
            event.getCourse() != null && event.getCourse().getClassEntity() != null ? 
                event.getCourse().getClassEntity().getId() : null, // targetClassId
            event.getCourse() != null && event.getCourse().getClassEntity() != null ? 
                event.getCourse().getClassEntity().getName() : null, // targetClassName
            event.getCourse() != null ? event.getCourse().getId() : null,
            event.getCourse() != null ? event.getCourse().getName() : null,
            null, // targetRoles - will be set based on course
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
            "MIGRATED_FROM_EVENT_ID_" + event.getId(), // notes to track migration
            true, // isPublic
            null, // reminderMinutes
            true, // active
            null, // parentEventId
            event.getCreatedAt(),
            event.getModifiedAt()
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

    private CalendarEventScope determineEventScope(Event event) {
        if (event.getCourse() != null) {
            return CalendarEventScope.COURSE;
        }
        // Default to school scope if no course is associated
        return CalendarEventScope.SCHOOL;
    }

    private boolean isEventAlreadyMigrated(Event event) {
        // Check if there's already a CalendarEvent with migration notes referencing this event
        return calendarEventRepository.findAll().stream()
                .anyMatch(calendarEvent -> 
                    calendarEvent.getNotes() != null && 
                    calendarEvent.getNotes().contains("MIGRATED_FROM_EVENT_ID_" + event.getId()));
    }

    private CalendarEventDTO findMigratedEvent(Event event) {
        CalendarEvent migratedEvent = calendarEventRepository.findAll().stream()
                .filter(calendarEvent -> 
                    calendarEvent.getNotes() != null && 
                    calendarEvent.getNotes().contains("MIGRATED_FROM_EVENT_ID_" + event.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Migrated event not found"));
        
        return calendarEventService.getById(migratedEvent.getId());
    }

    private void markEventAsMigrated(Event event) {
        // For now, we'll keep the original events but could add a migrated flag
        // This allows for rollback and validation
        log.debug("Event {} (ID: {}) marked as migrated", event.getTitle(), event.getId());
    }
} 