package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Event;
import com.ohma.thutothebe.entity.EventType;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.EventMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.EventRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventMapper eventMapper;

    @InjectMocks
    private EventServiceImpl eventService;

    private Event event;
    private EventDto eventDto;
    private Course course;
    private User user;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        course = new Course();
        course.setId(1L);
        
        user = new User();
        user.setId(1L);
        
        event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");
        event.setDescription("Test Description");
        event.setStartTime(now);
        event.setEndTime(now.plusHours(1));
        event.setLocation("Test Location");
        event.setType(EventType.COURSE_EVENT);
        event.setCourse(course);
        event.setCreatedBy(user);
        event.setRecurring(false);
        event.setAllDay(false);
        event.setColor("#000000");
        
        eventDto = new EventDto(
            1L,
            "Test Event",
            "Test Description",
            now,
            now.plusHours(1),
            "Test Location",
            EventType.COURSE_EVENT,
            1L,
            1L,
            false,
            null,
            false,
            "#000000"
        );
    }

    @Test
    void createEvent_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(eventMapper.toEntity(any(EventDto.class))).thenReturn(event);
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        EventDto result = eventService.create(eventDto);

        assertNotNull(result);
        assertEquals(eventDto.title(), result.title());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void createEvent_CourseNotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> eventService.create(eventDto));
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void updateEvent_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(eventMapper.toEntity(any(EventDto.class))).thenReturn(event);
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        EventDto result = eventService.update(1L, eventDto);

        assertNotNull(result);
        assertEquals(eventDto.title(), result.title());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void updateEvent_EventNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> eventService.update(1L, eventDto));
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void deleteEvent_Success() {
        doNothing().when(eventRepository).deleteById(1L);

        assertDoesNotThrow(() -> eventService.delete(1L));
        verify(eventRepository).deleteById(1L);
    }

    @Test
    void getEventById_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        EventDto result = eventService.getById(1L);

        assertNotNull(result);
        assertEquals(eventDto.title(), result.title());
    }

    @Test
    void getEventById_NotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> eventService.getById(1L));
    }

    @Test
    void getEventsByCourseId_Success() {
        when(eventRepository.findByCourseId(1L)).thenReturn(List.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        List<EventDto> results = eventService.getEventsByCourseId(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(eventDto.title(), results.get(0).title());
    }

    @Test
    void getEventsByUserId_Success() {
        when(eventRepository.findByUserId(1L)).thenReturn(List.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        List<EventDto> results = eventService.getEventsByUserId(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(eventDto.title(), results.get(0).title());
    }

    @Test
    void getEventsBetweenDates_Success() {
        LocalDateTime start = now;
        LocalDateTime end = now.plusDays(1);
        
        when(eventRepository.findEventsBetweenDates(start, end)).thenReturn(List.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        List<EventDto> results = eventService.getEventsBetweenDates(start, end);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(eventDto.title(), results.get(0).title());
    }

    @Test
    void getCourseEventsBetweenDates_Success() {
        LocalDateTime start = now;
        LocalDateTime end = now.plusDays(1);
        
        when(eventRepository.findCourseEventsBetweenDates(1L, start, end)).thenReturn(List.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        List<EventDto> results = eventService.getCourseEventsBetweenDates(1L, start, end);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(eventDto.title(), results.get(0).title());
    }

    @Test
    void getAllRecurringEvents_Success() {
        event.setRecurring(true);
        when(eventRepository.findAllRecurringEvents()).thenReturn(List.of(event));
        when(eventMapper.toDto(any(Event.class))).thenReturn(eventDto);

        List<EventDto> results = eventService.getAllRecurringEvents();

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(eventDto.title(), results.get(0).title());
    }

    @Test
    void generateRecurringEvents_NotRecurring() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        assertThrows(IllegalArgumentException.class, () -> eventService.generateRecurringEvents(1L, now.plusDays(7)));
    }

    @Test
    void generateRecurringEvents_EventNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> eventService.generateRecurringEvents(1L, now.plusDays(7)));
    }
} 