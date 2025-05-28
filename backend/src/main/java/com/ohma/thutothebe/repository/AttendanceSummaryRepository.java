package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AttendanceSummary;
import com.ohma.thutothebe.entity.AttendanceSummary.AttendanceSummaryType;
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
public interface AttendanceSummaryRepository extends JpaRepository<AttendanceSummary, Long> {

    // Basic queries
    List<AttendanceSummary> findByActiveTrue();
    
    Page<AttendanceSummary> findByActiveTrue(Pageable pageable);

    // Student User-based queries (for students with user accounts)
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id = :studentUserId AND as.active = true ORDER BY as.academicYear DESC, as.term")
    List<AttendanceSummary> findByStudentIdAndActive(@Param("studentUserId") Long studentUserId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id = :studentUserId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.term")
    List<AttendanceSummary> findByStudentIdAndAcademicYear(@Param("studentUserId") Long studentUserId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id = :studentUserId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentIdAndAcademicYearAndTerm(@Param("studentUserId") Long studentUserId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Student Entity-based queries (for all students, including those without user accounts)
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id = :studentEntityId AND as.active = true ORDER BY as.academicYear DESC, as.term")
    List<AttendanceSummary> findByStudentEntityIdAndActive(@Param("studentEntityId") Long studentEntityId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id = :studentEntityId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.term")
    List<AttendanceSummary> findByStudentEntityIdAndAcademicYear(@Param("studentEntityId") Long studentEntityId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id = :studentEntityId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentEntityIdAndAcademicYearAndTerm(@Param("studentEntityId") Long studentEntityId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Class-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByClassIdAndActive(@Param("classId") Long classId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByClassIdAndAcademicYear(@Param("classId") Long classId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByClassIdAndAcademicYearAndTerm(@Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Course-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByCourseIdAndActive(@Param("courseId") Long courseId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByCourseIdAndAcademicYear(@Param("courseId") Long courseId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByCourseIdAndAcademicYearAndTerm(@Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Subject-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.subject.id = :subjectId AND as.active = true ORDER BY as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findBySubjectIdAndActive(@Param("subjectId") Long subjectId);

    // Summary type queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.summaryType = :summaryType AND as.active = true ORDER BY as.academicYear DESC, as.term")
    List<AttendanceSummary> findBySummaryTypeAndActive(@Param("summaryType") AttendanceSummaryType summaryType);

    // Specific summary queries - Updated to use studentUser for backward compatibility
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id = :studentUserId AND as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentAndClassAndAcademicYearAndTermAndType(@Param("studentUserId") Long studentUserId, @Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id = :studentUserId AND as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentAndCourseAndAcademicYearAndTermAndType(@Param("studentUserId") Long studentUserId, @Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

    // New methods for student entity-based specific queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id = :studentEntityId AND as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentEntityAndClassAndAcademicYearAndTermAndType(@Param("studentEntityId") Long studentEntityId, @Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id = :studentEntityId AND as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentEntityAndCourseAndAcademicYearAndTermAndType(@Param("studentEntityId") Long studentEntityId, @Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

    // Low attendance queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.attendancePercentage < :threshold AND as.active = true ORDER BY as.attendancePercentage ASC")
    List<AttendanceSummary> findByAttendancePercentageLessThan(@Param("threshold") Double threshold);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.attendancePercentage < :threshold AND as.active = true ORDER BY as.attendancePercentage ASC")
    List<AttendanceSummary> findByClassIdAndAttendancePercentageLessThan(@Param("classId") Long classId, @Param("threshold") Double threshold);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.school.id = :schoolId AND as.attendancePercentage < :threshold AND as.active = true ORDER BY as.attendancePercentage ASC")
    List<AttendanceSummary> findBySchoolIdAndAttendancePercentageLessThan(@Param("schoolId") Long schoolId, @Param("threshold") Double threshold);

    // Statistics queries
    @Query("SELECT AVG(as.attendancePercentage) FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    Double getAverageAttendancePercentageByClassAndAcademicYearAndTerm(@Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    @Query("SELECT AVG(as.attendancePercentage) FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    Double getAverageAttendancePercentageByCourseAndAcademicYearAndTerm(@Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    @Query("SELECT COUNT(as) FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.attendancePercentage >= :threshold AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    Long countStudentsWithGoodAttendance(@Param("classId") Long classId, @Param("threshold") Double threshold, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    @Query("SELECT COUNT(as) FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.attendancePercentage < :threshold AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    Long countStudentsWithPoorAttendance(@Param("classId") Long classId, @Param("threshold") Double threshold, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Date range queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.lastCalculatedDate BETWEEN :startDate AND :endDate AND as.active = true ORDER BY as.lastCalculatedDate DESC")
    List<AttendanceSummary> findByLastCalculatedDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.periodFrom >= :fromDate AND as.periodTo <= :toDate AND as.active = true ORDER BY as.periodFrom")
    List<AttendanceSummary> findByPeriodRange(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);

    // School-based queries for reporting
    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.school.id = :schoolId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.classEntity.name, as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findBySchoolIdAndAcademicYear(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.school.id = :schoolId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.classEntity.name, as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findBySchoolIdAndAcademicYearAndTerm(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Outdated summaries for recalculation
    @Query("SELECT as FROM AttendanceSummary as WHERE as.lastCalculatedDate < :cutoffDate AND as.active = true")
    List<AttendanceSummary> findOutdatedSummaries(@Param("cutoffDate") LocalDate cutoffDate);

    // Bulk operations support - Updated to use studentUser for backward compatibility
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentUser.id IN :studentUserIds AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentIdsAndAcademicYearAndTerm(@Param("studentUserIds") List<Long> studentUserIds, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // New method for student entity bulk operations
    @Query("SELECT as FROM AttendanceSummary as WHERE as.studentEntity.id IN :studentEntityIds AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentEntityIdsAndAcademicYearAndTerm(@Param("studentEntityIds") List<Long> studentEntityIds, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Academic year queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.academicYear = :academicYear AND as.active = true ORDER BY as.classEntity.name, as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByAcademicYearAndActive(@Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.classEntity.name, as.studentEntity.firstName, as.studentEntity.lastName")
    List<AttendanceSummary> findByAcademicYearAndTermAndActive(@Param("academicYear") Integer academicYear, @Param("term") Term term);
} 