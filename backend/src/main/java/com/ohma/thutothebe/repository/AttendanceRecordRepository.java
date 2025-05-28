package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AttendanceRecord;
import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    // Basic queries
    List<AttendanceRecord> findByActiveTrue();
    
    Page<AttendanceRecord> findByActiveTrue(Pageable pageable);

    // Student-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndActive(@Param("studentId") Long studentId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentIdAndDate(@Param("studentId") Long studentId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndDateRange(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndAcademicYear(@Param("studentId") Long studentId, @Param("academicYear") Integer academicYear);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findByStudentIdAndAcademicYearAndTerm(@Param("studentId") Long studentId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Class-based queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.active = true ORDER BY ar.attendanceDate DESC, ar.student.firstName")
    List<AttendanceRecord> findByClassIdAndActive(@Param("classId") Long classId);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate = :date AND ar.active = true ORDER BY ar.student.firstName")
    List<AttendanceRecord> findByClassIdAndDate(@Param("classId") Long classId, @Param("date") LocalDate date);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC, ar.student.firstName")
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

    // Duplicate check queries
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.attendanceDate = :date AND ar.attendanceType = :type AND (:courseId IS NULL OR ar.course.id = :courseId) AND (:periodNumber IS NULL OR ar.periodNumber = :periodNumber) AND ar.active = true")
    Optional<AttendanceRecord> findExistingAttendance(@Param("studentId") Long studentId, @Param("date") LocalDate date, @Param("type") AttendanceType type, @Param("courseId") Long courseId, @Param("periodNumber") Integer periodNumber);

    // Statistics queries
    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.attendanceStatus = :status AND ar.academicYear = :academicYear AND ar.active = true")
    Long countByStudentIdAndStatusAndAcademicYear(@Param("studentId") Long studentId, @Param("status") AttendanceStatus status, @Param("academicYear") Integer academicYear);

    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.student.id = :studentId AND ar.attendanceStatus = :status AND ar.academicYear = :academicYear AND ar.term = :term AND ar.active = true")
    Long countByStudentIdAndStatusAndAcademicYearAndTerm(@Param("studentId") Long studentId, @Param("status") AttendanceStatus status, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    @Query("SELECT COUNT(ar) FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceDate = :date AND ar.attendanceStatus = :status AND ar.active = true")
    Long countByClassIdAndDateAndStatus(@Param("classId") Long classId, @Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    // Low attendance queries
    @Query("SELECT ar.student.id, COUNT(ar) as absentCount FROM AttendanceRecord ar WHERE ar.classEntity.id = :classId AND ar.attendanceStatus IN ('ABSENT_EXCUSED', 'ABSENT_UNEXCUSED') AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true GROUP BY ar.student.id HAVING COUNT(ar) >= :threshold")
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

    // Bulk operations support
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.student.id IN :studentIds AND ar.attendanceDate = :date AND ar.active = true")
    List<AttendanceRecord> findByStudentIdsAndDate(@Param("studentIds") List<Long> studentIds, @Param("date") LocalDate date);

    // School-based queries for reporting
    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.school.id = :schoolId AND ar.attendanceDate BETWEEN :startDate AND :endDate AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findBySchoolIdAndDateRange(@Param("schoolId") Long schoolId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.classEntity.school.id = :schoolId AND ar.academicYear = :academicYear AND ar.active = true ORDER BY ar.attendanceDate DESC")
    List<AttendanceRecord> findBySchoolIdAndAcademicYear(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear);
} 