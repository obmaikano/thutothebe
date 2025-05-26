package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Schedule;
import com.ohma.thutothebe.entity.ScheduleStatus;
import com.ohma.thutothebe.entity.DayOfWeek;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // Basic queries
    List<Schedule> findByActiveTrue();
    
    List<Schedule> findByStatus(ScheduleStatus status);
    
    List<Schedule> findByDayOfWeek(DayOfWeek dayOfWeek);
    
    // School-based queries
    @Query("SELECT s FROM Schedule s WHERE s.school.id = :schoolId AND s.active = true")
    List<Schedule> findBySchoolIdAndActive(@Param("schoolId") Long schoolId);
    
    @Query("SELECT s FROM Schedule s WHERE s.school.id = :schoolId AND s.status = :status")
    List<Schedule> findBySchoolIdAndStatus(@Param("schoolId") Long schoolId, @Param("status") ScheduleStatus status);
    
    // Region-based queries
    @Query("SELECT s FROM Schedule s WHERE s.region.id = :regionId AND s.active = true")
    List<Schedule> findByRegionIdAndActive(@Param("regionId") Long regionId);
    
    // Class-based queries
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id = :classId AND s.active = true")
    List<Schedule> findByClassIdAndActive(@Param("classId") Long classId);
    
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id = :classId AND s.dayOfWeek = :dayOfWeek AND s.active = true ORDER BY s.startTime")
    List<Schedule> findByClassIdAndDayOfWeekAndActive(@Param("classId") Long classId, @Param("dayOfWeek") DayOfWeek dayOfWeek);
    
    // Course-based queries
    @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND s.active = true")
    List<Schedule> findByCourseIdAndActive(@Param("courseId") Long courseId);
    
    // Teacher-based queries
    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.active = true")
    List<Schedule> findByTeacherIdAndActive(@Param("teacherId") Long teacherId);
    
    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.dayOfWeek = :dayOfWeek AND s.active = true ORDER BY s.startTime")
    List<Schedule> findByTeacherIdAndDayOfWeekAndActive(@Param("teacherId") Long teacherId, @Param("dayOfWeek") DayOfWeek dayOfWeek);
    
    // Creator-based queries
    @Query("SELECT s FROM Schedule s WHERE s.createdBy.id = :createdById AND s.active = true")
    List<Schedule> findByCreatedByIdAndActive(@Param("createdById") Long createdById);
    
    // Time-based queries
    @Query("SELECT s FROM Schedule s WHERE s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND s.active = true")
    List<Schedule> findActiveSchedulesForDate(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT s FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND s.active = true ORDER BY s.startTime")
    List<Schedule> findActiveSchedulesForDayOfWeek(@Param("dayOfWeek") DayOfWeek dayOfWeek, @Param("currentDate") LocalDateTime currentDate);
    
    // Time conflict queries
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id = :classId AND s.dayOfWeek = :dayOfWeek AND " +
           "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
           "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
           "(s.startTime >= :startTime AND s.endTime <= :endTime)) AND " +
           "s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND " +
           "s.active = true AND (:excludeId IS NULL OR s.id != :excludeId)")
    List<Schedule> findConflictingSchedulesForClass(
        @Param("classId") Long classId,
        @Param("dayOfWeek") DayOfWeek dayOfWeek,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("currentDate") LocalDateTime currentDate,
        @Param("excludeId") Long excludeId
    );
    
    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.dayOfWeek = :dayOfWeek AND " +
           "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
           "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
           "(s.startTime >= :startTime AND s.endTime <= :endTime)) AND " +
           "s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND " +
           "s.active = true AND (:excludeId IS NULL OR s.id != :excludeId)")
    List<Schedule> findConflictingSchedulesForTeacher(
        @Param("teacherId") Long teacherId,
        @Param("dayOfWeek") DayOfWeek dayOfWeek,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("currentDate") LocalDateTime currentDate,
        @Param("excludeId") Long excludeId
    );
    
    // Role-based access queries for security
    @Query("SELECT s FROM Schedule s WHERE " +
           "(:userRole = 'SUPER_ADMIN' OR :userRole = 'MINISTRY_EXECUTIVE' OR :userRole = 'MINISTRY_STAFF') OR " +
           "(:userRole = 'DIRECTOR' AND (:userRegionId IS NULL OR s.region.id = :userRegionId)) OR " +
           "(:userRole = 'REGIONAL_ADMIN' AND s.region.id = :userRegionId) OR " +
           "(:userRole = 'REGIONAL_OFFICER' AND s.region.id = :userRegionId) OR " +
           "(:userRole = 'SCHOOL_ADMIN' AND s.school.id = :userSchoolId) OR " +
           "(:userRole = 'SCHOOL_HEAD' AND s.school.id = :userSchoolId) OR " +
           "(:userRole = 'DEPARTMENT_HEAD' AND s.school.id = :userSchoolId) OR " +
           "(:userRole = 'SENIOR_TEACHER' AND s.school.id = :userSchoolId) OR " +
           "(:userRole = 'TEACHER' AND (s.teacher.id = :userId OR s.createdBy.id = :userId)) OR " +
           "(:userRole = 'STUDENT' AND s.classEntity.id IN (SELECT st.studentClass.id FROM Student st WHERE st.user.id = :userId)) OR " +
           "(:userRole = 'PARENT' AND s.classEntity.id IN (SELECT st.studentClass.id FROM Student st WHERE st.user.parent.id = :userId))")
    Page<Schedule> findSchedulesForUser(
        @Param("userRole") UserRole userRole,
        @Param("userId") Long userId,
        @Param("userRegionId") Long userRegionId,
        @Param("userSchoolId") Long userSchoolId,
        Pageable pageable
    );
    
    // Student schedule queries
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id IN " +
           "(SELECT st.studentClass.id FROM Student st WHERE st.id = :studentId) AND " +
           "s.active = true ORDER BY s.dayOfWeek, s.startTime")
    List<Schedule> findSchedulesForStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id IN " +
           "(SELECT st.studentClass.id FROM Student st WHERE st.id = :studentId) AND " +
           "s.dayOfWeek = :dayOfWeek AND s.active = true ORDER BY s.startTime")
    List<Schedule> findSchedulesForStudentByDay(@Param("studentId") Long studentId, @Param("dayOfWeek") DayOfWeek dayOfWeek);
    
    // Parent schedule queries
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id IN " +
           "(SELECT st.studentClass.id FROM Student st WHERE st.user.parent.id = :parentId) AND " +
           "s.active = true ORDER BY s.dayOfWeek, s.startTime")
    List<Schedule> findSchedulesForParent(@Param("parentId") Long parentId);
    
    // Version and history queries
    @Query("SELECT s FROM Schedule s WHERE s.parentScheduleId = :parentId ORDER BY s.scheduleVersion DESC")
    List<Schedule> findVersionHistory(@Param("parentId") Long parentId);
    
    @Query("SELECT s FROM Schedule s WHERE s.parentScheduleId = :parentId AND s.scheduleVersion = :version")
    Schedule findByParentIdAndVersion(@Param("parentId") Long parentId, @Param("version") Integer version);
} 