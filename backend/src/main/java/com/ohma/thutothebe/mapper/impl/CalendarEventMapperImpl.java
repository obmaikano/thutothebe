package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.CalendarEvent;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.mapper.CalendarEventMapper;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CalendarEventMapperImpl implements CalendarEventMapper {

    @Override
    public CalendarEventDTO toDto(CalendarEvent entity) {
        if (entity == null) {
            return null;
        }

        return new CalendarEventDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getStartTime(),
            entity.getEndTime(),
            entity.getLocation(),
            entity.getEventType(),
            entity.getPriority(),
            entity.getScope(),
            entity.isAllDay(),
            entity.isRecurring(),
            entity.getRecurrenceRule(),
            entity.getRecurrenceEndDate(),
            entity.getColor(),
            entity.getStatus(),
            entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null,
            entity.getCreatedBy() != null ? 
                entity.getCreatedBy().getFirstName() + " " + entity.getCreatedBy().getLastName() : null,
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getTargetClass() != null ? entity.getTargetClass().getId() : null,
            entity.getTargetClass() != null ? entity.getTargetClass().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getTargetRoles() != null ? new HashSet<>(entity.getTargetRoles()) : new HashSet<>(),
            entity.getAttendees() != null ? 
                entity.getAttendees().stream().map(User::getId).collect(Collectors.toSet()) : new HashSet<>(),
            entity.getAttendees() != null ? 
                entity.getAttendees().stream()
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .collect(Collectors.toSet()) : new HashSet<>(),
            entity.getOrganizers() != null ? 
                entity.getOrganizers().stream().map(User::getId).collect(Collectors.toSet()) : new HashSet<>(),
            entity.getOrganizers() != null ? 
                entity.getOrganizers().stream()
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .collect(Collectors.toSet()) : new HashSet<>(),
            entity.isRequiresApproval(),
            entity.getApprovedBy() != null ? entity.getApprovedBy().getId() : null,
            entity.getApprovedBy() != null ? 
                entity.getApprovedBy().getFirstName() + " " + entity.getApprovedBy().getLastName() : null,
            entity.getApprovedAt(),
            entity.getApprovalNotes(),
            entity.getMaxAttendees(),
            entity.isRegistrationRequired(),
            entity.getRegistrationDeadline(),
            entity.getExternalLink(),
            entity.getMeetingLink(),
            entity.getNotes(),
            entity.isPublic(),
            entity.getReminderMinutes(),
            entity.isActive(),
            entity.getParentEvent() != null ? entity.getParentEvent().getId() : null,
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CalendarEvent toEntity(CalendarEventDTO dto) {
        if (dto == null) {
            return null;
        }

        CalendarEvent entity = new CalendarEvent();
        updateEntityFromDto(dto, entity);
        entity.setId(dto.id());
        
        return entity;
    }

    @Override
    public void updateEntityFromDto(CalendarEventDTO dto, CalendarEvent entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartTime(dto.startTime());
        entity.setEndTime(dto.endTime());
        entity.setLocation(dto.location());
        entity.setEventType(dto.eventType());
        entity.setPriority(dto.priority());
        entity.setScope(dto.scope());
        entity.setAllDay(dto.isAllDay());
        entity.setRecurring(dto.isRecurring());
        entity.setRecurrenceRule(dto.recurrenceRule());
        entity.setRecurrenceEndDate(dto.recurrenceEndDate());
        entity.setColor(dto.color());
        entity.setStatus(dto.status());
        entity.setRequiresApproval(dto.requiresApproval());
        entity.setApprovalNotes(dto.approvalNotes());
        entity.setMaxAttendees(dto.maxAttendees());
        entity.setRegistrationRequired(dto.registrationRequired());
        entity.setRegistrationDeadline(dto.registrationDeadline());
        entity.setExternalLink(dto.externalLink());
        entity.setMeetingLink(dto.meetingLink());
        entity.setNotes(dto.notes());
        entity.setPublic(dto.isPublic());
        entity.setReminderMinutes(dto.reminderMinutes());
        entity.setActive(dto.active());

        // Set target roles
        if (dto.targetRoles() != null) {
            entity.setTargetRoles(new HashSet<>(dto.targetRoles()));
        } else {
            entity.setTargetRoles(new HashSet<>());
        }

        // Note: Relationships (createdBy, school, region, targetClass, course, attendees, organizers, etc.)
        // should be set in the service layer where we have access to the repositories
        // to fetch the actual entities by their IDs
    }

    /**
     * Helper method to create a basic entity with relationships set to null
     * Used when we only need the basic fields without fetching related entities
     */
    public CalendarEvent toEntityWithoutRelationships(CalendarEventDTO dto) {
        if (dto == null) {
            return null;
        }

        CalendarEvent entity = new CalendarEvent();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartTime(dto.startTime());
        entity.setEndTime(dto.endTime());
        entity.setLocation(dto.location());
        entity.setEventType(dto.eventType());
        entity.setPriority(dto.priority());
        entity.setScope(dto.scope());
        entity.setAllDay(dto.isAllDay());
        entity.setRecurring(dto.isRecurring());
        entity.setRecurrenceRule(dto.recurrenceRule());
        entity.setRecurrenceEndDate(dto.recurrenceEndDate());
        entity.setColor(dto.color());
        entity.setStatus(dto.status());
        entity.setRequiresApproval(dto.requiresApproval());
        entity.setApprovalNotes(dto.approvalNotes());
        entity.setMaxAttendees(dto.maxAttendees());
        entity.setRegistrationRequired(dto.registrationRequired());
        entity.setRegistrationDeadline(dto.registrationDeadline());
        entity.setExternalLink(dto.externalLink());
        entity.setMeetingLink(dto.meetingLink());
        entity.setNotes(dto.notes());
        entity.setPublic(dto.isPublic());
        entity.setReminderMinutes(dto.reminderMinutes());
        entity.setActive(dto.active());

        // Set target roles
        if (dto.targetRoles() != null) {
            entity.setTargetRoles(new HashSet<>(dto.targetRoles()));
        }

        return entity;
    }
} 