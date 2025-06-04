package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AttendanceRecord;
import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    // Basic queries
    @EntityGraph(attributePaths = {"studentEntity", "studentUser", "classEntity", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.active = true")
    List<AttendanceRecord> findByActiveTrue();
    
    Page<AttendanceRecord> findByActiveTrue(Pageable pageable);

    // Student User-based queries (for students with user accounts)
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndActive(@Param("studentUserId") Long studentUserId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentIdAndDate(@Param("studentUserId") Long studentUserId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndDateRange(@Param("studentUserId") Long studentUserId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndAcademicYear(@Param("studentUserId") Long studentUserId, @Param("academicYear") Integer academicYear);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndAcademicYearAndTerm(@Param("studentUserId") Long studentUserId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Student Entity-based queries (for all students, including those without user accounts)
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentEntityIdAndActive(@Param("studentEntityId") Long studentEntityId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentEntityIdAndDate(@Param("studentEntityId") Long studentEntityId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentEntityIdAndDateRange(@Param("studentEntityId") Long studentEntityId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentEntityIdAndAcademicYear(@Param("studentEntityId") Long studentEntityId, @Param("academicYear") Integer academicYear);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentEntityIdAndAcademicYearAndTerm(@Param("studentEntityId") Long studentEntityId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Class-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.active = true ORDER BY ar.attendanceDate DESC, ar.studentEntity.firstName")
    List<AttendanceRecord> findByClassIdAndActive(@Param("classId") Long classId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate = :date AND ar.active = true ORDER BY ar.studentEntity.firstName")
    List<AttendanceRecord> findByClassIdAndDate(@Param("classId") Long classId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC, ar.studentEntity.firstName")
    List<AttendanceRecord> findByClassIdAndDateRange(@Param("classId") Long classId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Course-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.course.id = :courseId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByCourseIdAndActive(@Param("courseId") Long courseId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.course.id = :courseId AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByCourseIdAndDate(@Param("courseId") Long courseId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.course.id = :courseId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByCourseIdAndDateRange(@Param("courseId") Long courseId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Subject-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.subject.id = :subjectId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findBySubjectIdAndActive(@Param("subjectId") Long subjectId);

    // Teacher-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.markedBy.id = :teacherId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByMarkedByIdAndActive(@Param("teacherId") Long teacherId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.markedBy.id = :teacherId AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByMarkedByIdAndDate(@Param("teacherId") Long teacherId, @Param("date") LocalDate date);

    // Status-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.attendanceStatus = :status AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByAttendanceStatusAndActive(@Param("status") AttendanceStatus status);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceStatus = :status AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByClassIdAndStatusAndDate(@Param("classId") Long classId, @Param("status") AttendanceStatus status, @Param("date") LocalDate date);

    // Type-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.attendanceType = :type AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByAttendanceTypeAndActive(@Param("type") AttendanceType type);

    // Period-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate = :date AND ar.attendanceType = :type AND ar.periodNumber = :periodNumber AND ar.active = true")
    List<AttendanceRecord> findByClassIdAndDateAndTypeAndPeriod(@Param("classId") Long classId, @Param("date") LocalDate date, @Param("type") AttendanceType type, @Param("periodNumber") Integer periodNumber);

    // Duplicate check queries - Updated to use studentEntity for comprehensive checking
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id = :studentEntityId AND ar.attendanceDate = :date AND ar.attendanceType = :type AND (:courseId IS NULL OR ar.course.id = :courseId) AND (:periodNumber IS NULL OR ar.periodNumber = :periodNumber) AND ar.active = true")
    Optional<AttendanceRecord> findExistingAttendanceByStudentEntity(@Param("studentEntityId") Long studentEntityId, @Param("date") LocalDate date, @Param("type") AttendanceType type, @Param("courseId") Long courseId, @Param("periodNumber") Integer periodNumber);

    // Legacy method for backward compatibility
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.attendanceDate = :date AND ar.attendanceType = :type AND (:courseId IS NULL OR ar.course.id = :courseId) AND (:periodNumber IS NULL OR ar.periodNumber = :periodNumber) AND ar.active = true")
    Optional<AttendanceRecord> findExistingAttendance(@Param("studentUserId") Long studentUserId, @Param("date") LocalDate date, @Param("type") AttendanceType type, @Param("courseId") Long courseId, @Param("periodNumber") Integer periodNumber);

    // Statistics queries - Updated to use studentUser for backward compatibility
    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.attendanceStatus = :status AND ar.academicYear = :academicYear AND ar.active = true")
    Long countByStudentIdAndStatusAndAcademicYear(@Param("studentUserId") Long studentUserId, @Param("status") AttendanceStatus status, @Param("academicYear") Integer academicYear);

    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.studentUser.id = :studentUserId AND ar.attendanceStatus = :status AND ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true")
    Long countByStudentIdAndStatusAndAcademicYearAndTerm(@Param("studentUserId") Long studentUserId, @Param("status") AttendanceStatus status, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate = :date AND ar.attendanceStatus = :status AND ar.active = true")
    Long countByClassIdAndDateAndStatus(@Param("classId") Long classId, @Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    // Low attendance queries - Updated to use studentEntity for comprehensive tracking
    @Query("SELECT ar.studentEntity.id, COUNT(ar) as absentCount FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceStatus IN ('ABSENT_EXCUSED', 'ABSENT_UNEXCUSED') AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true GROUP BY ar.studentEntity.id HAVING COUNT(ar) >= :threshold")
    List<Object[]> findStudentsWithLowAttendance(@Param("classId") Long classId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("threshold") Long threshold);

    // Modified records queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.isModified = true AND ar.active = true ORDER BY ar.modifiedAt DESC")
    List<AttendanceRecord> findModifiedRecords();

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.isModified = true AND ar.modifiedBy.id = :userId AND ar.active = true ORDER BY ar.modifiedAt DESC")
    List<AttendanceRecord> findModifiedRecordsByUser(@Param("userId") Long userId);

    // Academic year and term queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByAcademicYearAndActive(@Param("academicYear") Integer academicYear);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByAcademicYearAndTermAndActive(@Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Bulk operations support - Updated to use studentUser for backward compatibility
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentUser.id IN :studentUserIds AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentIdsAndDate(@Param("studentUserIds") List<Long> studentUserIds, @Param("date") LocalDate date);

    // New method for student entity bulk operations
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.studentEntity.id IN :studentEntityIds AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentEntityIdsAndDate(@Param("studentEntityIds") List<Long> studentEntityIds, @Param("date") LocalDate date);

    // School-based queries for reporting
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.school.id = :schoolId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findBySchoolIdAndDateRange(@Param("schoolId") Long schoolId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.school.id = :schoolId AND ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findBySchoolIdAndAcademicYear(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.id = :schoolId")
    List<AttendanceRecord> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.id = :schoolId AND a.active = :active")
    List<AttendanceRecord> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.id = :schoolId AND a.active = true")
    List<AttendanceRecord> findActiveAttendanceBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.region.id = :regionId")
    List<AttendanceRecord> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.region.id = :regionId AND a.active = :active")
    List<AttendanceRecord> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.region.id = :regionId AND a.active = true")
    List<AttendanceRecord> findActiveAttendanceByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.id IN :schoolIds")
    List<AttendanceRecord> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.region.id IN :regionIds")
    List<AttendanceRecord> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.school.id IN :schoolIds OR a.classEntity.school.region.id IN :regionIds")
    List<AttendanceRecord> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                                 @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE (a.classEntity.school.id IN :schoolIds OR a.classEntity.school.region.id IN :regionIds) AND a.active = :active")
    List<AttendanceRecord> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                          @Param("regionIds") List<Long> regionIds,
                                                          @Param("active") boolean active);
    
    // Student filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.studentEntity.id = :studentId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                                                @Param("schoolIds") List<Long> schoolIds,
                                                                @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.studentEntity.id = :studentId AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByStudentIdAndRegionIdInAndActive(@Param("studentId") Long studentId,
                                                                @Param("regionIds") List<Long> regionIds,
                                                                @Param("active") boolean active);
    
    // Attendance status filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceStatus = :status AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByAttendanceStatusAndSchoolIdInAndActive(@Param("status") AttendanceStatus status,
                                                                       @Param("schoolIds") List<Long> schoolIds,
                                                                       @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceStatus = :status AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByAttendanceStatusAndRegionIdInAndActive(@Param("status") AttendanceStatus status,
                                                                       @Param("regionIds") List<Long> regionIds,
                                                                       @Param("active") boolean active);
    
    // Attendance type filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceType = :type AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByAttendanceTypeAndSchoolIdInAndActive(@Param("type") AttendanceType type,
                                                                     @Param("schoolIds") List<Long> schoolIds,
                                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceType = :type AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByAttendanceTypeAndRegionIdInAndActive(@Param("type") AttendanceType type,
                                                                     @Param("regionIds") List<Long> regionIds,
                                                                     @Param("active") boolean active);
    
    // Date range filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceDate >= :startDate AND a.attendanceDate <= :endDate AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByDateRangeAndSchoolIdInAndActive(@Param("startDate") LocalDate startDate,
                                                                @Param("endDate") LocalDate endDate,
                                                                @Param("schoolIds") List<Long> schoolIds,
                                                                @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.attendanceDate >= :startDate AND a.attendanceDate <= :endDate AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByDateRangeAndRegionIdInAndActive(@Param("startDate") LocalDate startDate,
                                                                @Param("endDate") LocalDate endDate,
                                                                @Param("regionIds") List<Long> regionIds,
                                                                @Param("active") boolean active);
    
    // Course filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.course.id = :courseId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId,
                                                               @Param("schoolIds") List<Long> schoolIds,
                                                               @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.course.id = :courseId AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByCourseIdAndRegionIdInAndActive(@Param("courseId") Long courseId,
                                                               @Param("regionIds") List<Long> regionIds,
                                                               @Param("active") boolean active);
    
    // Class filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.id = :classId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId,
                                                              @Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.classEntity.id = :classId AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByClassIdAndRegionIdInAndActive(@Param("classId") Long classId,
                                                              @Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    // Subject filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.subject.id = :subjectId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId,
                                                                @Param("schoolIds") List<Long> schoolIds,
                                                                @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.subject.id = :subjectId AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId,
                                                                @Param("regionIds") List<Long> regionIds,
                                                                @Param("active") boolean active);
    
    // Marked by filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.markedBy.id = :markedById AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByMarkedByIdAndSchoolIdInAndActive(@Param("markedById") Long markedById,
                                                                 @Param("schoolIds") List<Long> schoolIds,
                                                                 @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.markedBy.id = :markedById AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByMarkedByIdAndRegionIdInAndActive(@Param("markedById") Long markedById,
                                                                 @Param("regionIds") List<Long> regionIds,
                                                                 @Param("active") boolean active);
    
    // Academic year and term filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.academicYear = :academicYear AND a.term = :term AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findByAcademicYearAndTermAndSchoolIdInAndActive(@Param("academicYear") Integer academicYear,
                                                                          @Param("term") Term term,
                                                                          @Param("schoolIds") List<Long> schoolIds,
                                                                          @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.academicYear = :academicYear AND a.term = :term AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findByAcademicYearAndTermAndRegionIdInAndActive(@Param("academicYear") Integer academicYear,
                                                                          @Param("term") Term term,
                                                                          @Param("regionIds") List<Long> regionIds,
                                                                          @Param("active") boolean active);
    
    // Modified records filtering with multi-tenant security
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.isModified = true AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<AttendanceRecord> findModifiedAttendanceBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"studentEntity", "studentEntity.school", "studentUser", "classEntity", "classEntity.school", "classEntity.school.region", "course", "subject", "markedBy", "modifiedBy"})
    @Query("SELECT a FROM AttendanceRecord a WHERE a.isModified = true AND a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<AttendanceRecord> findModifiedAttendanceByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                                      @Param("active") boolean active);
    
    // Business rule validation methods with multi-tenant security
    @Query("SELECT COUNT(a) > 0 FROM AttendanceRecord a WHERE a.studentEntity.id = :studentId AND a.attendanceDate = :date AND a.course.id = :courseId AND a.classEntity.school.id IN :schoolIds")
    boolean existsByStudentIdAndDateAndCourseIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                                            @Param("date") LocalDate date,
                                                            @Param("courseId") Long courseId,
                                                            @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(a) > 0 FROM AttendanceRecord a WHERE a.studentEntity.id = :studentId AND a.attendanceDate = :date AND a.periodNumber = :periodNumber AND a.classEntity.school.id IN :schoolIds")
    boolean existsByStudentIdAndDateAndPeriodAndSchoolIdIn(@Param("studentId") Long studentId,
                                                          @Param("date") LocalDate date,
                                                          @Param("periodNumber") Integer periodNumber,
                                                          @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(a) > 0 FROM AttendanceRecord a WHERE a.course.id = :courseId AND a.classEntity.school.id IN :schoolIds")
    boolean existsByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(a) > 0 FROM AttendanceRecord a WHERE a.classEntity.id = :classId AND a.classEntity.school.id IN :schoolIds")
    boolean existsByClassIdAndSchoolIdIn(@Param("classId") Long classId,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(a) > 0 FROM AttendanceRecord a WHERE a.subject.id = :subjectId AND a.classEntity.school.id IN :schoolIds")
    boolean existsBySubjectIdAndSchoolIdIn(@Param("subjectId") Long subjectId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.classEntity.school.region.id IN :regionIds AND a.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceStatus = :status AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countByAttendanceStatusAndSchoolIdInAndActive(@Param("status") AttendanceStatus status,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceType = :type AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countByAttendanceTypeAndSchoolIdInAndActive(@Param("type") AttendanceType type,
                                                    @Param("schoolIds") List<Long> schoolIds,
                                                    @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.studentEntity.id = :studentId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceDate >= :startDate AND a.attendanceDate <= :endDate AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countByDateRangeAndSchoolIdInAndActive(@Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate,
                                               @Param("schoolIds") List<Long> schoolIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.isModified = true AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countModifiedAttendanceBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.markedBy.id = :markedById AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countByMarkedByIdAndSchoolIdInAndActive(@Param("markedById") Long markedById,
                                                @Param("schoolIds") List<Long> schoolIds,
                                                @Param("active") boolean active);
    
    // Attendance rate calculations with multi-tenant security
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceStatus = 'PRESENT' AND a.studentEntity.id = :studentId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countPresentByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceStatus = 'ABSENT' AND a.studentEntity.id = :studentId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countAbsentByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                                     @Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.attendanceStatus = 'LATE' AND a.studentEntity.id = :studentId AND a.classEntity.school.id IN :schoolIds AND a.active = :active")
    Long countLateByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                                   @Param("schoolIds") List<Long> schoolIds,
                                                   @Param("active") boolean active);
} 