package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.repository.CalendarEventRepository;
import com.ohma.thutothebe.repository.EventRepository;
import com.ohma.thutothebe.service.CalendarEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventMigrationServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CalendarEventRepository calendarEventRepository;

    @Mock
    private CalendarEventService calendarEventService;

    @InjectMocks
    private EventMigrationServiceImpl eventMigrationService;

    private Event testEvent;
    private CalendarEventDTO testCalendarEventDTO;
    private User testUser;
    private Course testCourse;
    private com.ohma.thutothebe.entity.Class testClass;
    private School testSchool;
    private Region testRegion;

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        testRegion = new Region();
        testRegion.setId(1L);
        testRegion.setName("Test Region");

        testSchool = new School();
        testSchool.setId(1L);
        testSchool.setName("Test School");
        testSchool.setRegion(testRegion);

        testClass = new com.ohma.thutothebe.entity.Class();
        testClass.setId(1L);
        testClass.setName("Test Class");
        testClass.setSchool(testSchool);

        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setName("Test Course");
        testCourse.setClassEntity(testClass);

        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setTitle("Test Event");
        testEvent.setDescription("Test Description");
        testEvent.setStartTime(LocalDateTime.now());
        testEvent.setEndTime(LocalDateTime.now().plusHours(1));
        testEvent.setLocation("Test Location");
        testEvent.setType(EventType.COURSE_EVENT);
        testEvent.setRecurring(false);
        testEvent.setAllDay(false);
        testEvent.setColor("#3B82F6");
        testEvent.setCreatedBy(testUser);
        testEvent.setCourse(testCourse);
        testEvent.setCreatedAt(LocalDateTime.now());
        testEvent.setModifiedAt(LocalDateTime.now());

        testCalendarEventDTO = new CalendarEventDTO(
            1L,
            "Test Event",
            "Test Description",
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(1),
            "Test Location",
            CalendarEventType.CLASS_SESSION,
            CalendarEventPriority.MEDIUM,
            CalendarEventScope.COURSE,
            false,
            false,
            null,
            null,
            "#3B82F6",
            CalendarEventStatus.SCHEDULED,
            1L,
            "John Doe",
            1L,
            "Test School",
            1L,
            "Test Region",
            1L,
            "Test Class",
            1L,
            "Test Course",
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null,
            "MIGRATED_FROM_EVENT_ID_1",
            true,
            null,
            true,
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    @Test
    void testMigrateEvent_Success() {
        // Arrange
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList());
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenReturn(testCalendarEventDTO);

        // Act
        CalendarEventDTO result = eventMigrationService.migrateEvent(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Event", result.title());
        assertEquals(CalendarEventType.CLASS_SESSION, result.eventType());
        assertEquals(CalendarEventScope.COURSE, result.scope());
        assertTrue(result.notes().contains("MIGRATED_FROM_EVENT_ID_1"));

        verify(eventRepository).findById(1L);
        verify(calendarEventService).create(any(CalendarEventDTO.class));
    }

    @Test
    void testMigrateEvent_EventNotFound() {
        // Arrange
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            eventMigrationService.migrateEvent(1L);
        });

        verify(eventRepository).findById(1L);
        verify(calendarEventService, never()).create(any(CalendarEventDTO.class));
    }

    @Test
    void testMigrateEvent_AlreadyMigrated() {
        // Arrange
        CalendarEvent existingMigratedEvent = new CalendarEvent();
        existingMigratedEvent.setId(2L);
        existingMigratedEvent.setNotes("MIGRATED_FROM_EVENT_ID_1");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList(existingMigratedEvent));
        when(calendarEventService.getById(2L)).thenReturn(testCalendarEventDTO);

        // Act
        CalendarEventDTO result = eventMigrationService.migrateEvent(1L);

        // Assert
        assertNotNull(result);
        verify(eventRepository).findById(1L);
        verify(calendarEventService, never()).create(any(CalendarEventDTO.class));
        verify(calendarEventService).getById(2L);
    }

    @Test
    void testMigrateAllEvents_Success() {
        // Arrange
        Event event2 = new Event();
        event2.setId(2L);
        event2.setTitle("Test Event 2");
        event2.setDescription("Test Description 2");
        event2.setStartTime(LocalDateTime.now());
        event2.setEndTime(LocalDateTime.now().plusHours(1));
        event2.setType(EventType.EXAM);
        event2.setCreatedBy(testUser);
        event2.setCourse(testCourse);
        event2.setCreatedAt(LocalDateTime.now());
        event2.setModifiedAt(LocalDateTime.now());

        List<Event> events = Arrays.asList(testEvent, event2);

        when(eventRepository.findAll()).thenReturn(events);
        when(eventRepository.findById(anyLong())).thenReturn(Optional.of(testEvent), Optional.of(event2));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList());
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenReturn(testCalendarEventDTO);

        // Act
        List<CalendarEventDTO> result = eventMigrationService.migrateAllEvents();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        verify(eventRepository).findAll();
        verify(calendarEventService, times(2)).create(any(CalendarEventDTO.class));
    }

    @Test
    void testIsMigrationNeeded_True() {
        // Arrange
        when(eventRepository.count()).thenReturn(5L);

        // Act
        boolean result = eventMigrationService.isMigrationNeeded();

        // Assert
        assertTrue(result);
        verify(eventRepository).count();
    }

    @Test
    void testIsMigrationNeeded_False() {
        // Arrange
        when(eventRepository.count()).thenReturn(0L);

        // Act
        boolean result = eventMigrationService.isMigrationNeeded();

        // Assert
        assertFalse(result);
        verify(eventRepository).count();
    }

    @Test
    void testGetUnmigratedEventCount() {
        // Arrange
        when(eventRepository.count()).thenReturn(10L);

        // Act
        long result = eventMigrationService.getUnmigratedEventCount();

        // Assert
        assertEquals(10L, result);
        verify(eventRepository).count();
    }

    @Test
    void testValidateMigration_Success() {
        // Arrange
        when(eventRepository.count()).thenReturn(5L);
        when(calendarEventRepository.count()).thenReturn(10L);

        // Act
        boolean result = eventMigrationService.validateMigration();

        // Assert
        assertTrue(result);
        verify(eventRepository).count();
        verify(calendarEventRepository).count();
    }

    @Test
    void testValidateMigration_Failure() {
        // Arrange
        when(eventRepository.count()).thenReturn(10L);
        when(calendarEventRepository.count()).thenReturn(5L);

        // Act
        boolean result = eventMigrationService.validateMigration();

        // Assert
        assertFalse(result);
        verify(eventRepository).count();
        verify(calendarEventRepository).count();
    }

    @Test
    void testRollbackMigration() {
        // Arrange
        CalendarEvent migratedEvent1 = new CalendarEvent();
        migratedEvent1.setId(1L);
        migratedEvent1.setNotes("MIGRATED_FROM_EVENT_ID_1");

        CalendarEvent migratedEvent2 = new CalendarEvent();
        migratedEvent2.setId(2L);
        migratedEvent2.setNotes("MIGRATED_FROM_EVENT_ID_2");

        CalendarEvent regularEvent = new CalendarEvent();
        regularEvent.setId(3L);
        regularEvent.setNotes("Regular event");

        List<CalendarEvent> allEvents = Arrays.asList(migratedEvent1, migratedEvent2, regularEvent);
        when(calendarEventRepository.findAll()).thenReturn(allEvents);

        // Act
        eventMigrationService.rollbackMigration();

        // Assert
        verify(calendarEventRepository).findAll();
        verify(calendarEventRepository).deleteAll(Arrays.asList(migratedEvent1, migratedEvent2));
    }

    @Test
    void testEventTypeMapping() {
        // Test all event type mappings
        testEvent.setType(EventType.COURSE_EVENT);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList());
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertEquals(CalendarEventType.CLASS_SESSION, dto.eventType());
            return testCalendarEventDTO;
        });

        eventMigrationService.migrateEvent(1L);

        // Test other mappings
        testEvent.setType(EventType.ASSIGNMENT_DUE);
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertEquals(CalendarEventType.ASSESSMENT, dto.eventType());
            return testCalendarEventDTO;
        });

        eventMigrationService.migrateEvent(1L);

        testEvent.setType(EventType.EXAM);
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertEquals(CalendarEventType.EXAM_PERIOD, dto.eventType());
            return testCalendarEventDTO;
        });

        eventMigrationService.migrateEvent(1L);
    }

    @Test
    void testScopeMapping() {
        // Test scope mapping for course events
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList());
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertEquals(CalendarEventScope.COURSE, dto.scope());
            return testCalendarEventDTO;
        });

        eventMigrationService.migrateEvent(1L);

        // Test scope mapping for events without course
        testEvent.setCourse(null);
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertEquals(CalendarEventScope.SCHOOL, dto.scope());
            return testCalendarEventDTO;
        });

        eventMigrationService.migrateEvent(1L);
    }

    @Test
    void testMigrationWithMissingRelationships() {
        // Test migration when course has no class or school
        Course courseWithoutClass = new Course();
        courseWithoutClass.setId(1L);
        courseWithoutClass.setName("Test Course");
        courseWithoutClass.setClassEntity(null);

        testEvent.setCourse(courseWithoutClass);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));
        when(calendarEventRepository.findAll()).thenReturn(Arrays.asList());
        when(calendarEventService.create(any(CalendarEventDTO.class))).thenAnswer(invocation -> {
            CalendarEventDTO dto = invocation.getArgument(0);
            assertNull(dto.schoolId());
            assertNull(dto.regionId());
            assertNull(dto.targetClassId());
            return testCalendarEventDTO;
        });

        CalendarEventDTO result = eventMigrationService.migrateEvent(1L);
        assertNotNull(result);
    }
} 