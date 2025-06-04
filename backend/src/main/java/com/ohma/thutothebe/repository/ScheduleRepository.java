package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Schedule;
import com.ohma.thutothebe.entity.ScheduleType;
import com.ohma.thutothebe.entity.ScheduleStatus;
import com.ohma.thutothebe.entity.DayOfWeek;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // ==================== EXISTING BASIC METHODS ====================
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "region", "createdBy", "teacher"})
    @Query("SELECT s FROM Schedule s WHERE s.active = true")
    List<Schedule> findByActiveTrue();
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "region", "createdBy", "teacher"})
    @Query("SELECT s FROM Schedule s WHERE s.createdBy.id = :userId")
    List<Schedule> findByCreatedById(@Param("userId") Long userId);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "region", "createdBy", "teacher"})
    @Query("SELECT s FROM Schedule s WHERE s.type = :type")
    List<Schedule> findByType(@Param("type") ScheduleType type);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "region", "createdBy", "teacher"})
    @Query("SELECT s FROM Schedule s WHERE s.status = :status")
    List<Schedule> findByStatus(@Param("status") ScheduleStatus status);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "region", "createdBy", "teacher"})
    @Query("SELECT s FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek")
    List<Schedule> findByDayOfWeek(@Param("dayOfWeek") DayOfWeek dayOfWeek);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.createdBy.id = :userId AND s.active = true")
    Long countByCreatedByIdAndActiveTrue(@Param("userId") Long userId);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Schedule s WHERE s.title = :title AND s.createdBy.id = :userId")
    boolean existsByTitleAndCreatedById(@Param("title") String title, @Param("userId") Long userId);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.school.id = :schoolId")
    List<Schedule> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.school.id = :schoolId AND s.active = :active")
    List<Schedule> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.school.id = :schoolId AND s.active = true")
    List<Schedule> findActiveSchedulesBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.region.id = :regionId")
    List<Schedule> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.region.id = :regionId AND s.active = :active")
    List<Schedule> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.region.id = :regionId AND s.active = true")
    List<Schedule> findActiveSchedulesByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.school.id IN :schoolIds")
    List<Schedule> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.region.id IN :regionIds")
    List<Schedule> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.school.id IN :schoolIds OR s.region.id IN :regionIds")
    List<Schedule> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                         @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE (s.school.id IN :schoolIds OR s.region.id IN :regionIds) AND s.active = :active")
    List<Schedule> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                  @Param("regionIds") List<Long> regionIds,
                                                  @Param("active") boolean active);
    
    // Schedule type filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.type = :type AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByTypeAndSchoolIdInAndActive(@Param("type") ScheduleType type,
                                                   @Param("schoolIds") List<Long> schoolIds,
                                                   @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.type = :type AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByTypeAndRegionIdInAndActive(@Param("type") ScheduleType type,
                                                   @Param("regionIds") List<Long> regionIds,
                                                   @Param("active") boolean active);
    
    // Status filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.status = :status AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByStatusAndSchoolIdInAndActive(@Param("status") ScheduleStatus status,
                                                     @Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.status = :status AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByStatusAndRegionIdInAndActive(@Param("status") ScheduleStatus status,
                                                     @Param("regionIds") List<Long> regionIds,
                                                     @Param("active") boolean active);
    
    // Day of week filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByDayOfWeekAndSchoolIdInAndActive(@Param("dayOfWeek") DayOfWeek dayOfWeek,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByDayOfWeekAndRegionIdInAndActive(@Param("dayOfWeek") DayOfWeek dayOfWeek,
                                                        @Param("regionIds") List<Long> regionIds,
                                                        @Param("active") boolean active);
    
    // Time range filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.startTime >= :startTime AND s.endTime <= :endTime AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByTimeRangeAndSchoolIdInAndActive(@Param("startTime") LocalTime startTime,
                                                        @Param("endTime") LocalTime endTime,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.startTime >= :startTime AND s.endTime <= :endTime AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByTimeRangeAndRegionIdInAndActive(@Param("startTime") LocalTime startTime,
                                                        @Param("endTime") LocalTime endTime,
                                                        @Param("regionIds") List<Long> regionIds,
                                                        @Param("active") boolean active);
    
    // Creator filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.createdBy.id = :creatorId AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByCreatorIdAndSchoolIdInAndActive(@Param("creatorId") Long creatorId,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.createdBy.id = :creatorId AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByCreatorIdAndRegionIdInAndActive(@Param("creatorId") Long creatorId,
                                                        @Param("regionIds") List<Long> regionIds,
                                                        @Param("active") boolean active);
    
    // Teacher filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.teacher.id = :teacherId AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId,
                                                        @Param("regionIds") List<Long> regionIds,
                                                        @Param("active") boolean active);
    
    // Course filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId,
                                                       @Param("schoolIds") List<Long> schoolIds,
                                                       @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByCourseIdAndRegionIdInAndActive(@Param("courseId") Long courseId,
                                                       @Param("regionIds") List<Long> regionIds,
                                                       @Param("active") boolean active);
    
    // Class filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id = :classId AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.classEntity.id = :classId AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByClassIdAndRegionIdInAndActive(@Param("classId") Long classId,
                                                      @Param("regionIds") List<Long> regionIds,
                                                      @Param("active") boolean active);
    
    // Title search with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')) AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findByTitleContainingAndSchoolIdInAndActive(@Param("title") String title,
                                                              @Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%')) AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findByTitleContainingAndRegionIdInAndActive(@Param("title") String title,
                                                              @Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    // Effective date filtering with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findCurrentSchedulesBySchoolIdInAndActive(@Param("currentDate") LocalDateTime currentDate,
                                                            @Param("schoolIds") List<Long> schoolIds,
                                                            @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.effectiveDate <= :currentDate AND (s.expiryDate IS NULL OR s.expiryDate >= :currentDate) AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findCurrentSchedulesByRegionIdInAndActive(@Param("currentDate") LocalDateTime currentDate,
                                                            @Param("regionIds") List<Long> regionIds,
                                                            @Param("active") boolean active);
    
    // Recurring schedules with multi-tenant security
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.isRecurring = true AND s.school.id IN :schoolIds AND s.active = :active")
    List<Schedule> findRecurringSchedulesBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"course", "classEntity", "school", "school.region", "region", "createdBy", "teacher", "scheduleHistories"})
    @Query("SELECT s FROM Schedule s WHERE s.isRecurring = true AND s.region.id IN :regionIds AND s.active = :active")
    List<Schedule> findRecurringSchedulesByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    // Business rule validation methods with multi-tenant security
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.title = :title AND s.createdBy.id = :creatorId AND s.school.id IN :schoolIds")
    boolean existsByTitleAndCreatorIdAndSchoolIdIn(@Param("title") String title,
                                                   @Param("creatorId") Long creatorId,
                                                   @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.course.id = :courseId AND s.school.id IN :schoolIds")
    boolean existsByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.classEntity.id = :classId AND s.school.id IN :schoolIds")
    boolean existsByClassIdAndSchoolIdIn(@Param("classId") Long classId,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.teacher.id = :teacherId AND s.school.id IN :schoolIds")
    boolean existsByTeacherIdAndSchoolIdIn(@Param("teacherId") Long teacherId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.createdBy.id = :creatorId AND s.school.id IN :schoolIds")
    boolean existsByCreatorIdAndSchoolIdIn(@Param("creatorId") Long creatorId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    // Time conflict validation with multi-tenant security
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.startTime < :endTime AND s.endTime > :startTime AND s.teacher.id = :teacherId AND s.school.id IN :schoolIds AND s.active = true")
    boolean existsTimeConflictForTeacher(@Param("dayOfWeek") DayOfWeek dayOfWeek,
                                        @Param("startTime") LocalTime startTime,
                                        @Param("endTime") LocalTime endTime,
                                        @Param("teacherId") Long teacherId,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.startTime < :endTime AND s.endTime > :startTime AND s.classEntity.id = :classId AND s.school.id IN :schoolIds AND s.active = true")
    boolean existsTimeConflictForClass(@Param("dayOfWeek") DayOfWeek dayOfWeek,
                                      @Param("startTime") LocalTime startTime,
                                      @Param("endTime") LocalTime endTime,
                                      @Param("classId") Long classId,
                                      @Param("schoolIds") List<Long> schoolIds);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.school.id IN :schoolIds AND s.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.region.id IN :regionIds AND s.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.type = :type AND s.school.id IN :schoolIds AND s.active = :active")
    Long countByTypeAndSchoolIdInAndActive(@Param("type") ScheduleType type,
                                          @Param("schoolIds") List<Long> schoolIds,
                                          @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.status = :status AND s.school.id IN :schoolIds AND s.active = :active")
    Long countByStatusAndSchoolIdInAndActive(@Param("status") ScheduleStatus status,
                                            @Param("schoolIds") List<Long> schoolIds,
                                            @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.dayOfWeek = :dayOfWeek AND s.school.id IN :schoolIds AND s.active = :active")
    Long countByDayOfWeekAndSchoolIdInAndActive(@Param("dayOfWeek") DayOfWeek dayOfWeek,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.isRecurring = true AND s.school.id IN :schoolIds AND s.active = :active")
    Long countRecurringSchedulesBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.teacher.id = :teacherId AND s.school.id IN :schoolIds AND s.active = :active")
    Long countByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.createdBy.id = :creatorId AND s.school.id IN :schoolIds AND s.active = :active")
    Long countByCreatorIdAndSchoolIdInAndActive(@Param("creatorId") Long creatorId,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
} 