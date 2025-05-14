package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Query("SELECT e FROM Event e WHERE e.course.id = :courseId")
    List<Event> findByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT e FROM Event e WHERE e.createdBy.id = :userId")
    List<Event> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT e FROM Event e WHERE e.startTime >= :startTime AND e.endTime <= :endTime")
    List<Event> findEventsBetweenDates(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    @Query("SELECT e FROM Event e WHERE e.course.id = :courseId AND e.startTime >= :startTime AND e.endTime <= :endTime")
    List<Event> findCourseEventsBetweenDates(
        @Param("courseId") Long courseId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    @Query("SELECT e FROM Event e WHERE e.isRecurring = true")
    List<Event> findAllRecurringEvents();
} 