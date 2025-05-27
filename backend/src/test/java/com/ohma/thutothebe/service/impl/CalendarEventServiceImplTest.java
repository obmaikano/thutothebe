package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CalendarEventMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CalendarEventServiceImplTest {

    @Mock
    private CalendarEventRepository calendarEventRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private SchoolRepository schoolRepository;
    
    @Mock
    private RegionRepository regionRepository;
    
    @Mock
    private ClassRepository classRepository;
    
    @Mock
    private CourseRepository courseRepository;
    
    @Mock
    private CalendarEventMapper calendarEventMapper;

    @InjectMocks
    private CalendarEventServiceImpl calendarEventService;

    private CalendarEvent testEvent;
    private CalendarEventDTO testEventDTO;
    private User testUser;
    private School testSchool;
    private Region testRegion;

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(UserRole.TEACHER);

        testRegion = new Region();
        testRegion.setId(1L);
        testRegion.setName("Test Region");

        testSchool = new School();
        testSchool.setId(1L);
        testSchool.setName("Test School");
        testSchool.setRegion(testRegion);

        testEvent = new CalendarEvent();
        testEvent.setId(1L);
        testEvent.setTitle("Test Event");
        testEvent.setDescription("Test Description");
        testEvent.setStartTime(LocalDateTime.now().plusDays(1));
        testEvent.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        testEvent.setLocation("Test Location");
        testEvent.setEventType(CalendarEventType.CLASS_SESSION);
        testEvent.setPriority(CalendarEventPriority.MEDIUM);
        testEvent.setScope(CalendarEventScope.SCHOOL);
        testEvent.setStatus(CalendarEventStatus.SCHEDULED);
        testEvent.setCreatedBy(testUser);
        testEvent.setSchool(testSchool);
        testEvent.setActive(true);

        testEventDTO = new CalendarEventDTO(
            1L, "Test Event", "Test Description",
            LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(2),
            "Test Location", CalendarEventType.CLASS_SESSION, CalendarEventPriority.MEDIUM,
            CalendarEventScope.SCHOOL, false, false, null, null, "#3B82F6",
            CalendarEventStatus.SCHEDULED, 1L, "John Doe", 1L, "Test School",
            1L, "Test Region", null, null, null, null,
            new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(),
            false, null, null, null, null, null, false, null,
            null, null, null, true, null, true, null,
            LocalDateTime.now(), LocalDateTime.now()
        );
    }

    @Test
    void testCreate_Success() {
        // Arrange
        when(calendarEventMapper.toEntity(testEventDTO)).thenReturn(testEvent);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(testSchool));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(testRegion));
        when(calendarEventRepository.save(any(CalendarEvent.class))).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.create(testEventDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testEventDTO.title(), result.title());
        verify(calendarEventRepository).save(any(CalendarEvent.class));
        verify(calendarEventMapper).toDto(testEvent);
    }

    @Test
    void testCreate_UserNotFound() {
        // Arrange
        when(calendarEventMapper.toEntity(testEventDTO)).thenReturn(testEvent);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            calendarEventService.create(testEventDTO);
        });
    }

    @Test
    void testGetById_Success() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testEventDTO.title(), result.title());
        verify(calendarEventRepository).findById(1L);
    }

    @Test
    void testGetById_NotFound() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            calendarEventService.getById(1L);
        });
    }

    @Test
    void testUpdate_Success() {
        // Arrange
        CalendarEventDTO updatedDTO = new CalendarEventDTO(
            1L, "Updated Event", "Updated Description",
            testEventDTO.startTime(), testEventDTO.endTime(),
            testEventDTO.location(), testEventDTO.eventType(), testEventDTO.priority(),
            testEventDTO.scope(), testEventDTO.isAllDay(), testEventDTO.isRecurring(),
            testEventDTO.recurrenceRule(), testEventDTO.recurrenceEndDate(), testEventDTO.color(),
            testEventDTO.status(), testEventDTO.createdById(), testEventDTO.createdByName(),
            testEventDTO.schoolId(), testEventDTO.schoolName(), testEventDTO.regionId(),
            testEventDTO.regionName(), testEventDTO.targetClassId(), testEventDTO.targetClassName(),
            testEventDTO.courseId(), testEventDTO.courseName(), testEventDTO.targetRoles(),
            testEventDTO.attendeeIds(), testEventDTO.attendeeNames(), testEventDTO.organizerIds(),
            testEventDTO.organizerNames(), testEventDTO.requiresApproval(), testEventDTO.approvedById(),
            testEventDTO.approvedByName(), testEventDTO.approvedAt(), testEventDTO.approvalNotes(),
            testEventDTO.maxAttendees(), testEventDTO.registrationRequired(), testEventDTO.registrationDeadline(),
            testEventDTO.externalLink(), testEventDTO.meetingLink(), testEventDTO.notes(),
            testEventDTO.isPublic(), testEventDTO.reminderMinutes(), testEventDTO.active(),
            testEventDTO.parentEventId(), testEventDTO.createdAt(), testEventDTO.modifiedAt()
        );

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(testSchool));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(testRegion));
        when(calendarEventRepository.save(any(CalendarEvent.class))).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(updatedDTO);

        // Act
        CalendarEventDTO result = calendarEventService.update(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Event", result.title());
        verify(calendarEventMapper).updateEntityFromDto(updatedDTO, testEvent);
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testDelete_Success() {
        // Arrange
        when(calendarEventRepository.existsById(1L)).thenReturn(true);

        // Act
        calendarEventService.delete(1L);

        // Assert
        verify(calendarEventRepository).deleteById(1L);
    }

    @Test
    void testDelete_NotFound() {
        // Arrange
        when(calendarEventRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            calendarEventService.delete(1L);
        });
    }

    @Test
    void testGetEventsBetweenDates_Success() {
        // Arrange
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = LocalDateTime.now().plusDays(7);
        List<CalendarEvent> events = Arrays.asList(testEvent);
        
        when(calendarEventRepository.findEventsBetweenDates(startTime, endTime)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsBetweenDates(startTime, endTime);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testEventDTO.title(), result.get(0).title());
        verify(calendarEventRepository).findEventsBetweenDates(startTime, endTime);
    }

    @Test
    void testGetEventsBetweenDatesWithPagination_Success() {
        // Arrange
        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = LocalDateTime.now().plusDays(7);
        Pageable pageable = PageRequest.of(0, 10);
        Page<CalendarEvent> eventPage = new PageImpl<>(Arrays.asList(testEvent));
        
        when(calendarEventRepository.findEventsBetweenDates(startTime, endTime, pageable)).thenReturn(eventPage);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        Page<CalendarEventDTO> result = calendarEventService.getEventsBetweenDates(startTime, endTime, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testEventDTO.title(), result.getContent().get(0).title());
    }

    @Test
    void testGetEventsByScope_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByScope(CalendarEventScope.SCHOOL)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByScope(CalendarEventScope.SCHOOL);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CalendarEventScope.SCHOOL, result.get(0).scope());
    }

    @Test
    void testGetGlobalEvents_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findGlobalEvents()).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getGlobalEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findGlobalEvents();
    }

    @Test
    void testGetEventsForRegion_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findEventsForRegion(1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsForRegion(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findEventsForRegion(1L);
    }

    @Test
    void testGetEventsForSchool_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findEventsForSchool(1L, 1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsForSchool(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findEventsForSchool(1L, 1L);
    }

    @Test
    void testGetUserEvents_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findUserEvents(1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getUserEvents(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findUserEvents(1L);
    }

    @Test
    void testGetEventsByCreatedBy_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByCreatedBy(1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByCreatedBy(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByCreatedBy(1L);
    }

    @Test
    void testGetEventsByAttendee_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByAttendee(1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByAttendee(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByAttendee(1L);
    }

    @Test
    void testGetEventsByOrganizer_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByOrganizer(1L)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByOrganizer(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByOrganizer(1L);
    }

    @Test
    void testGetEventsByType_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByActiveTrueAndEventType(CalendarEventType.CLASS_SESSION)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByType(CalendarEventType.CLASS_SESSION);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CalendarEventType.CLASS_SESSION, result.get(0).eventType());
    }

    @Test
    void testGetEventsByStatus_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findByActiveTrueAndStatus(CalendarEventStatus.SCHEDULED)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsByStatus(CalendarEventStatus.SCHEDULED);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CalendarEventStatus.SCHEDULED, result.get(0).status());
    }

    @Test
    void testGetUpcomingEvents_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findUpcomingEvents(any(LocalDateTime.class))).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getUpcomingEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findUpcomingEvents(any(LocalDateTime.class));
    }

    @Test
    void testGetTodaysEvents_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findTodaysEvents(any(LocalDateTime.class))).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getTodaysEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findTodaysEvents(any(LocalDateTime.class));
    }

    @Test
    void testGetThisWeeksEvents_Success() {
        // Arrange
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.findThisWeeksEvents(any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getThisWeeksEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findThisWeeksEvents(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    void testSearchEvents_Success() {
        // Arrange
        String searchTerm = "test";
        List<CalendarEvent> events = Arrays.asList(testEvent);
        when(calendarEventRepository.searchEvents(searchTerm)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.searchEvents(searchTerm);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).searchEvents(searchTerm);
    }

    @Test
    void testAddAttendee_Success() {
        // Arrange
        User attendee = new User();
        attendee.setId(2L);
        attendee.setFirstName("Jane");
        attendee.setLastName("Smith");

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(attendee));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.addAttendee(1L, 2L);

        // Assert
        assertNotNull(result);
        assertTrue(testEvent.getAttendees().contains(attendee));
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testAddAttendee_EventNotFound() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            calendarEventService.addAttendee(1L, 2L);
        });
    }

    @Test
    void testAddAttendee_UserNotFound() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            calendarEventService.addAttendee(1L, 2L);
        });
    }

    @Test
    void testAddAttendee_MaxCapacityReached() {
        // Arrange
        testEvent.setMaxAttendees(1);
        testEvent.getAttendees().add(testUser); // Already at capacity

        User newAttendee = new User();
        newAttendee.setId(2L);

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newAttendee));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            calendarEventService.addAttendee(1L, 2L);
        });
    }

    @Test
    void testRemoveAttendee_Success() {
        // Arrange
        User attendee = new User();
        attendee.setId(2L);
        testEvent.getAttendees().add(attendee);

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(attendee));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.removeAttendee(1L, 2L);

        // Assert
        assertNotNull(result);
        assertFalse(testEvent.getAttendees().contains(attendee));
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testAddOrganizer_Success() {
        // Arrange
        User organizer = new User();
        organizer.setId(2L);

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(organizer));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.addOrganizer(1L, 2L);

        // Assert
        assertNotNull(result);
        assertTrue(testEvent.getOrganizers().contains(organizer));
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testRemoveOrganizer_Success() {
        // Arrange
        User organizer = new User();
        organizer.setId(2L);
        testEvent.getOrganizers().add(organizer);

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(organizer));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.removeOrganizer(1L, 2L);

        // Assert
        assertNotNull(result);
        assertFalse(testEvent.getOrganizers().contains(organizer));
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testMarkAsOngoing_Success() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.markAsOngoing(1L);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.ONGOING, testEvent.getStatus());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testMarkAsCompleted_Success() {
        // Arrange
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.markAsCompleted(1L);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.COMPLETED, testEvent.getStatus());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testCancelEvent_Success() {
        // Arrange
        String reason = "Weather conditions";
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.cancelEvent(1L, reason);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.CANCELLED, testEvent.getStatus());
        assertTrue(testEvent.getNotes().contains(reason));
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testPostponeEvent_Success() {
        // Arrange
        LocalDateTime newStartTime = LocalDateTime.now().plusDays(2);
        LocalDateTime newEndTime = newStartTime.plusHours(2);
        
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.postponeEvent(1L, newStartTime, newEndTime);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.POSTPONED, testEvent.getStatus());
        assertEquals(newStartTime, testEvent.getStartTime());
        assertEquals(newEndTime, testEvent.getEndTime());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testRescheduleEvent_Success() {
        // Arrange
        LocalDateTime newStartTime = LocalDateTime.now().plusDays(3);
        LocalDateTime newEndTime = newStartTime.plusHours(2);
        
        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.rescheduleEvent(1L, newStartTime, newEndTime);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.RESCHEDULED, testEvent.getStatus());
        assertEquals(newStartTime, testEvent.getStartTime());
        assertEquals(newEndTime, testEvent.getEndTime());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testApproveEvent_Success() {
        // Arrange
        User approver = new User();
        approver.setId(2L);
        approver.setFirstName("Admin");
        approver.setLastName("User");
        
        testEvent.setStatus(CalendarEventStatus.PENDING_APPROVAL);
        String approvalNotes = "Event approved";

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(approver));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.approveEvent(1L, 2L, approvalNotes);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.SCHEDULED, testEvent.getStatus());
        assertEquals(approver, testEvent.getApprovedBy());
        assertEquals(approvalNotes, testEvent.getApprovalNotes());
        assertNotNull(testEvent.getApprovedAt());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testRejectEvent_Success() {
        // Arrange
        User approver = new User();
        approver.setId(2L);
        
        testEvent.setStatus(CalendarEventStatus.PENDING_APPROVAL);
        String rejectionNotes = "Event rejected due to conflicts";

        when(calendarEventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(userRepository.findById(2L)).thenReturn(Optional.of(approver));
        when(calendarEventRepository.save(testEvent)).thenReturn(testEvent);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        CalendarEventDTO result = calendarEventService.rejectEvent(1L, 2L, rejectionNotes);

        // Assert
        assertNotNull(result);
        assertEquals(CalendarEventStatus.CANCELLED, testEvent.getStatus());
        assertEquals(approver, testEvent.getApprovedBy());
        assertEquals(rejectionNotes, testEvent.getApprovalNotes());
        assertNotNull(testEvent.getApprovedAt());
        verify(calendarEventRepository).save(testEvent);
    }

    @Test
    void testGetPendingApprovalEvents_Success() {
        // Arrange
        testEvent.setStatus(CalendarEventStatus.PENDING_APPROVAL);
        List<CalendarEvent> events = Arrays.asList(testEvent);
        
        when(calendarEventRepository.findPendingApprovalEvents()).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getPendingApprovalEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findPendingApprovalEvents();
    }

    @Test
    void testGetEventCountBySchool_Success() {
        // Arrange
        when(calendarEventRepository.countEventsBySchool(1L)).thenReturn(5L);

        // Act
        Long result = calendarEventService.getEventCountBySchool(1L);

        // Assert
        assertEquals(5L, result);
        verify(calendarEventRepository).countEventsBySchool(1L);
    }

    @Test
    void testGetEventCountByType_Success() {
        // Arrange
        when(calendarEventRepository.countEventsByType(CalendarEventType.CLASS_SESSION)).thenReturn(3L);

        // Act
        Long result = calendarEventService.getEventCountByType(CalendarEventType.CLASS_SESSION);

        // Assert
        assertEquals(3L, result);
        verify(calendarEventRepository).countEventsByType(CalendarEventType.CLASS_SESSION);
    }

    @Test
    void testFindConflictingEvents_Success() {
        // Arrange
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusHours(2);
        String location = "Room 101";
        List<CalendarEvent> conflicts = Arrays.asList(testEvent);

        when(calendarEventRepository.findConflictingEvents(1L, location, startTime, endTime)).thenReturn(conflicts);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.findConflictingEvents(1L, location, startTime, endTime);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findConflictingEvents(1L, location, startTime, endTime);
    }

    @Test
    void testHasConflicts_True() {
        // Arrange
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusHours(2);
        String location = "Room 101";
        List<CalendarEvent> conflicts = Arrays.asList(testEvent);

        when(calendarEventRepository.findConflictingEvents(1L, location, startTime, endTime)).thenReturn(conflicts);

        // Act
        boolean result = calendarEventService.hasConflicts(1L, location, startTime, endTime);

        // Assert
        assertTrue(result);
    }

    @Test
    void testHasConflicts_False() {
        // Arrange
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusHours(2);
        String location = "Room 101";

        when(calendarEventRepository.findConflictingEvents(1L, location, startTime, endTime)).thenReturn(Collections.emptyList());

        // Act
        boolean result = calendarEventService.hasConflicts(1L, location, startTime, endTime);

        // Assert
        assertFalse(result);
    }

    @Test
    void testCreateBulkEvents_Success() {
        // Arrange
        List<CalendarEventDTO> eventDTOs = Arrays.asList(testEventDTO);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventMapper.toEntity(testEventDTO)).thenReturn(testEvent);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(testSchool));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(testRegion));
        when(calendarEventRepository.saveAll(anyList())).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.createBulkEvents(eventDTOs);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).saveAll(anyList());
    }

    @Test
    void testDeleteBulkEvents_Success() {
        // Arrange
        List<Long> eventIds = Arrays.asList(1L, 2L);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventRepository.findAllById(eventIds)).thenReturn(events);
        when(calendarEventRepository.saveAll(events)).thenReturn(events);

        // Act
        calendarEventService.deleteBulkEvents(eventIds);

        // Assert
        assertFalse(testEvent.isActive());
        verify(calendarEventRepository).saveAll(events);
    }

    @Test
    void testGetEventsForCalendarView_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(calendarEventRepository.findEventsBetweenDates(startDate, endDate)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsForCalendarView(1L, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findEventsBetweenDates(startDate, endDate);
    }

    @Test
    void testGetMonthEvents_Success() {
        // Arrange
        int year = 2024;
        int month = 3;
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(calendarEventRepository.findEventsBetweenDates(any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getMonthEvents(1L, year, month);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findEventsBetweenDates(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    void testGetEventsNeedingReminders_Success() {
        // Arrange
        LocalDateTime reminderTime = LocalDateTime.now();
        testEvent.setReminderMinutes(30);
        testEvent.setStartTime(reminderTime.plusMinutes(30));
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventRepository.findByActiveTrue()).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getEventsNeedingReminders(reminderTime);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByActiveTrue();
    }

    @Test
    void testGetAcademicYearEvents_Success() {
        // Arrange
        Integer academicYear = 2024;
        testEvent.setEventType(CalendarEventType.ACADEMIC_TERM_START);
        testEvent.setStartTime(LocalDateTime.of(2024, 3, 1, 9, 0));
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventRepository.findByEventTypes(anyList())).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getAcademicYearEvents(academicYear);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByEventTypes(anyList());
    }

    @Test
    void testGetHolidayEvents_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(30);
        testEvent.setEventType(CalendarEventType.PUBLIC_HOLIDAY);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventRepository.findByEventTypes(anyList())).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getHolidayEvents(startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByEventTypes(anyList());
    }

    @Test
    void testGetExamEvents_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(30);
        testEvent.setEventType(CalendarEventType.FINAL_EXAM);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(calendarEventRepository.findByEventTypes(anyList())).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        List<CalendarEventDTO> result = calendarEventService.getExamEvents(startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calendarEventRepository).findByEventTypes(anyList());
    }

    @Test
    void testExportEventsToCalendar_Success() {
        // Arrange
        List<Long> eventIds = Arrays.asList(1L, 2L);

        // Act
        String result = calendarEventService.exportEventsToCalendar(eventIds);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("BEGIN:VCALENDAR"));
        assertTrue(result.contains("END:VCALENDAR"));
    }

    @Test
    void testExportUserCalendar_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        List<CalendarEvent> events = Arrays.asList(testEvent);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(calendarEventRepository.findEventsBetweenDates(startDate, endDate)).thenReturn(events);
        when(calendarEventMapper.toDto(testEvent)).thenReturn(testEventDTO);

        // Act
        String result = calendarEventService.exportUserCalendar(1L, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("BEGIN:VCALENDAR"));
    }
} 