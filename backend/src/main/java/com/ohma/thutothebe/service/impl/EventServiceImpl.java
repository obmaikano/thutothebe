package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Event;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.EventMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.EventRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.EventService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EventServiceImpl extends BaseServiceImpl<Event, EventDto, Long> implements EventService {

    private final EventRepository eventRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;

    @Autowired
    public EventServiceImpl(
            EventRepository eventRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EventMapper eventMapper) {
        super(eventRepository);
        this.eventRepository = eventRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.eventMapper = eventMapper;
    }

    @Override
    protected Event mapToEntity(EventDto dto) {
        return eventMapper.toEntity(dto);
    }

    @Override
    protected EventDto mapToDto(Event entity) {
        return eventMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Event entity, EventDto dto) {
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartTime(dto.startTime());
        entity.setEndTime(dto.endTime());
        entity.setLocation(dto.location());
        entity.setType(dto.type());
        entity.setRecurring(dto.isRecurring());
        entity.setRecurrenceRule(dto.recurrenceRule());
        entity.setAllDay(dto.isAllDay());
        entity.setColor(dto.color());
    }

    @Override
    @Transactional
    public EventDto create(EventDto eventDto) {
        log.info("Creating new event: {}", eventDto.title());
        
        Event event = eventMapper.toEntity(eventDto);
        
        if (eventDto.courseId() != null) {
            Course course = courseRepository.findById(eventDto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            event.setCourse(course);
        }
        
        User creator = userRepository.findById(eventDto.createdById())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        event.setCreatedBy(creator);
        
        Event savedEvent = eventRepository.save(event);
        return eventMapper.toDto(savedEvent);
    }

    @Override
    @Transactional
    public EventDto update(Long id, EventDto eventDto) {
        log.info("Updating event with id: {}", id);
        
        Event existingEvent = eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        Event updatedEvent = eventMapper.toEntity(eventDto);
        updatedEvent.setId(id);
        
        if (eventDto.courseId() != null) {
            Course course = courseRepository.findById(eventDto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            updatedEvent.setCourse(course);
        }
        
        User creator = userRepository.findById(eventDto.createdById())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        updatedEvent.setCreatedBy(creator);
        
        Event savedEvent = eventRepository.save(updatedEvent);
        return eventMapper.toDto(savedEvent);
    }

    @Override
    public List<EventDto> getEventsByCourseId(Long courseId) {
        log.info("Fetching events for course with id: {}", courseId);
        return eventRepository.findByCourseId(courseId).stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> getEventsByUserId(Long userId) {
        log.info("Fetching events for user with id: {}", userId);
        return eventRepository.findByUserId(userId).stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Fetching events between {} and {}", startTime, endTime);
        return eventRepository.findEventsBetweenDates(startTime, endTime).stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Fetching events for course {} between {} and {}", courseId, startTime, endTime);
        return eventRepository.findCourseEventsBetweenDates(courseId, startTime, endTime).stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> getAllRecurringEvents() {
        log.info("Fetching all recurring events");
        return eventRepository.findAllRecurringEvents().stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> generateRecurringEvents(Long eventId, LocalDateTime until) {
        log.info("Generating recurring events for event {} until {}", eventId, until);
        Event baseEvent = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
            
        if (!baseEvent.isRecurring()) {
            throw new IllegalArgumentException("Event is not recurring");
        }
        
        // TODO: Implement recurrence rule parsing and event generation
        // This would require a proper recurrence rule parser (e.g., using iCal4j)
        // For now, we'll return an empty list
        return List.of();
    }
} 