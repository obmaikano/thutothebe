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

    // Student-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id = :studentId AND as.active = true ORDER BY as.academicYear DESC, as.term")
    List<AttendanceSummary> findByStudentIdAndActive(@Param("studentId") Long studentId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id = :studentId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.term")
    List<AttendanceSummary> findByStudentIdAndAcademicYear(@Param("studentId") Long studentId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id = :studentId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentIdAndAcademicYearAndTerm(@Param("studentId") Long studentId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Class-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByClassIdAndActive(@Param("classId") Long classId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByClassIdAndAcademicYear(@Param("classId") Long classId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByClassIdAndAcademicYearAndTerm(@Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Course-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByCourseIdAndActive(@Param("courseId") Long courseId);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByCourseIdAndAcademicYear(@Param("courseId") Long courseId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByCourseIdAndAcademicYearAndTerm(@Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Subject-based queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.subject.id = :subjectId AND as.active = true ORDER BY as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findBySubjectIdAndActive(@Param("subjectId") Long subjectId);

    // Summary type queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.summaryType = :summaryType AND as.active = true ORDER BY as.academicYear DESC, as.term")
    List<AttendanceSummary> findBySummaryTypeAndActive(@Param("summaryType") AttendanceSummaryType summaryType);

    // Specific summary queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id = :studentId AND as.classEntity.id = :classId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentAndClassAndAcademicYearAndTermAndType(@Param("studentId") Long studentId, @Param("classId") Long classId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id = :studentId AND as.course.id = :courseId AND as.academicYear = :academicYear AND as.term = :term AND as.summaryType = :summaryType AND as.active = true")
    Optional<AttendanceSummary> findByStudentAndCourseAndAcademicYearAndTermAndType(@Param("studentId") Long studentId, @Param("courseId") Long courseId, @Param("academicYear") Integer academicYear, @Param("term") Term term, @Param("summaryType") AttendanceSummaryType summaryType);

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
    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.school.id = :schoolId AND as.academicYear = :academicYear AND as.active = true ORDER BY as.classEntity.name, as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findBySchoolIdAndAcademicYear(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.classEntity.school.id = :schoolId AND as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.classEntity.name, as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findBySchoolIdAndAcademicYearAndTerm(@Param("schoolId") Long schoolId, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Outdated summaries for recalculation
    @Query("SELECT as FROM AttendanceSummary as WHERE as.lastCalculatedDate < :cutoffDate AND as.active = true")
    List<AttendanceSummary> findOutdatedSummaries(@Param("cutoffDate") LocalDate cutoffDate);

    // Bulk operations support
    @Query("SELECT as FROM AttendanceSummary as WHERE as.student.id IN :studentIds AND as.academicYear = :academicYear AND as.term = :term AND as.active = true")
    List<AttendanceSummary> findByStudentIdsAndAcademicYearAndTerm(@Param("studentIds") List<Long> studentIds, @Param("academicYear") Integer academicYear, @Param("term") Term term);

    // Academic year queries
    @Query("SELECT as FROM AttendanceSummary as WHERE as.academicYear = :academicYear AND as.active = true ORDER BY as.classEntity.name, as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByAcademicYearAndActive(@Param("academicYear") Integer academicYear);

    @Query("SELECT as FROM AttendanceSummary as WHERE as.academicYear = :academicYear AND as.term = :term AND as.active = true ORDER BY as.classEntity.name, as.student.firstName, as.student.lastName")
    List<AttendanceSummary> findByAcademicYearAndTermAndActive(@Param("academicYear") Integer academicYear, @Param("term") Term term);
} 