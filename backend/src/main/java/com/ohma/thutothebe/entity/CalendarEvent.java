package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "calendar_events")
@EqualsAndHashCode(callSuper = true)
public class CalendarEvent extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(length = 200)
    private String location;

    @NotNull(message = "Event type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private CalendarEventType eventType;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarEventPriority priority = CalendarEventPriority.MEDIUM;

    @NotNull(message = "Scope is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarEventScope scope;

    @Column(name = "is_all_day", nullable = false)
    private boolean isAllDay = false;

    @Column(name = "is_recurring", nullable = false)
    private boolean isRecurring = false;

    @Column(name = "recurrence_rule", length = 500)
    private String recurrenceRule;

    @Column(name = "recurrence_end_date")
    private LocalDateTime recurrenceEndDate;

    @Column(length = 7)
    private String color = "#3B82F6";

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarEventStatus status = CalendarEventStatus.SCHEDULED;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class targetClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    // Target roles for the event
    @ElementCollection(targetClass = UserRole.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "calendar_event_target_roles", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "target_role")
    private Set<UserRole> targetRoles = new HashSet<>();

    // Event attendees
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "calendar_event_attendees",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> attendees = new HashSet<>();

    // Event organizers
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "calendar_event_organizers",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> organizers = new HashSet<>();

    @Column(name = "requires_approval", nullable = false)
    private boolean requiresApproval = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approval_notes", columnDefinition = "TEXT")
    private String approvalNotes;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "registration_required", nullable = false)
    private boolean registrationRequired = false;

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    @Column(name = "external_link", length = 500)
    private String externalLink;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;

    @Column(name = "reminder_minutes")
    private Integer reminderMinutes;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    // Parent event for recurring events
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_event_id")
    private CalendarEvent parentEvent;

    @OneToMany(mappedBy = "parentEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CalendarEvent> childEvents = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (priority == null) {
            priority = CalendarEventPriority.MEDIUM;
        }
        if (status == null) {
            status = CalendarEventStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
    }

    // Helper methods
    public boolean isMultiDay() {
        return !startTime.toLocalDate().equals(endTime.toLocalDate());
    }

    public boolean isUpcoming() {
        return startTime.isAfter(LocalDateTime.now());
    }

    public boolean isOngoing() {
        LocalDateTime now = LocalDateTime.now();
        return startTime.isBefore(now) && endTime.isAfter(now);
    }

    public boolean isPast() {
        return endTime.isBefore(LocalDateTime.now());
    }

    public boolean canUserView(User user) {
        if (!isPublic && !attendees.contains(user) && !organizers.contains(user) && !createdBy.equals(user)) {
            return false;
        }

        // Check scope-based permissions
        switch (scope) {
            case GLOBAL:
                return true;
            case REGIONAL:
                return region != null && user.getRegion() != null && region.equals(user.getRegion());
            case SCHOOL:
                return school != null && user.getSchool() != null && school.equals(user.getSchool());
            case CLASS:
                return targetClass != null && user.getRole() == UserRole.STUDENT; // Additional logic needed
            case COURSE:
                return course != null; // Additional logic needed for course enrollment
            case PERSONAL:
                return attendees.contains(user) || organizers.contains(user) || createdBy.equals(user);
            default:
                return false;
        }
    }

    public boolean canUserEdit(User user) {
        return organizers.contains(user) || createdBy.equals(user) || hasEditPermission(user);
    }

    private boolean hasEditPermission(User user) {
        // Check role-based edit permissions
        switch (user.getRole()) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
                return true;
            case REGIONAL_ADMIN:
                return scope == CalendarEventScope.REGIONAL && 
                       region != null && user.getRegion() != null && region.equals(user.getRegion());
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                return (scope == CalendarEventScope.SCHOOL || scope == CalendarEventScope.CLASS) &&
                       school != null && user.getSchool() != null && school.equals(user.getSchool());
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
            case TEACHER:
                return scope == CalendarEventScope.CLASS || scope == CalendarEventScope.COURSE;
            default:
                return false;
        }
    }
} 