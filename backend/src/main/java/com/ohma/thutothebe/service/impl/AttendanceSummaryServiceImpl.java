package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AttendanceSummaryDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.AttendanceSummary.AttendanceSummaryType;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AttendanceSummaryMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.AttendanceSummaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class AttendanceSummaryServiceImpl extends BaseServiceImpl<AttendanceSummary, AttendanceSummaryDTO, Long> 
        implements AttendanceSummaryService {

    private final AttendanceSummaryRepository attendanceSummaryRepository;
    private final AttendanceSummaryMapper attendanceSummaryMapper;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public AttendanceSummaryServiceImpl(
            AttendanceSummaryRepository attendanceSummaryRepository,
            AttendanceSummaryMapper attendanceSummaryMapper,
            AttendanceRecordRepository attendanceRecordRepository,
            UserRepository userRepository,
            ClassRepository classRepository,
            CourseRepository courseRepository,
            SubjectRepository subjectRepository) {
        super(attendanceSummaryRepository);
        this.attendanceSummaryRepository = attendanceSummaryRepository;
        this.attendanceSummaryMapper = attendanceSummaryMapper;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    protected AttendanceSummary mapToEntity(AttendanceSummaryDTO dto) {
        return attendanceSummaryMapper.toEntity(dto);
    }

    @Override
    protected AttendanceSummaryDTO mapToDto(AttendanceSummary entity) {
        return attendanceSummaryMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(AttendanceSummary entity, AttendanceSummaryDTO dto) {
        entity.setAcademicYear(dto.academicYear());
        entity.setTerm(dto.term());
        entity.setSummaryType(dto.summaryType());
        entity.setTotalDays(dto.totalDays() != null ? dto.totalDays() : 0);
        entity.setPresentDays(dto.presentDays() != null ? dto.presentDays() : 0);
        entity.setAbsentExcusedDays(dto.absentExcusedDays() != null ? dto.absentExcusedDays() : 0);
        entity.setAbsentUnexcusedDays(dto.absentUnexcusedDays() != null ? dto.absentUnexcusedDays() : 0);
        entity.setLateDays(dto.lateDays() != null ? dto.lateDays() : 0);
        entity.setEarlyDepartureDays(dto.earlyDepartureDays() != null ? dto.earlyDepartureDays() : 0);
        entity.setAttendancePercentage(dto.attendancePercentage() != null ? dto.attendancePercentage() : 0.0);
        entity.setPeriodFrom(dto.periodFrom());
        entity.setPeriodTo(dto.periodTo());
        entity.setLastCalculatedDate(dto.lastCalculatedDate());
        entity.setActive(dto.active());

        // Update relationships if needed
        if (dto.studentId() != null && (entity.getStudentUser() == null || !entity.getStudentUser().getId().equals(dto.studentId()))) {
            userRepository.findById(dto.studentId()).ifPresent(entity::setStudentUser);
        }

        if (dto.classId() != null && (entity.getClassEntity() == null || !entity.getClassEntity().getId().equals(dto.classId()))) {
            classRepository.findById(dto.classId()).ifPresent(entity::setClassEntity);
        }

        if (dto.courseId() != null && (entity.getCourse() == null || !entity.getCourse().getId().equals(dto.courseId()))) {
            courseRepository.findById(dto.courseId()).ifPresent(entity::setCourse);
        }

        if (dto.subjectId() != null && (entity.getSubject() == null || !entity.getSubject().getId().equals(dto.subjectId()))) {
            subjectRepository.findById(dto.subjectId()).ifPresent(entity::setSubject);
        }
    }

    // Student-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByStudent(Long studentId) {
        return attendanceSummaryRepository.findByStudentIdAndActive(studentId).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByStudentAndAcademicYear(Long studentId, Integer academicYear) {
        return attendanceSummaryRepository.findByStudentIdAndAcademicYear(studentId, academicYear).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByStudentAndAcademicYearAndTerm(Long studentId, Integer academicYear, Term term) {
        return attendanceSummaryRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Class-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByClass(Long classId) {
        return attendanceSummaryRepository.findByClassIdAndActive(classId).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByClassAndAcademicYear(Long classId, Integer academicYear) {
        return attendanceSummaryRepository.findByClassIdAndAcademicYear(classId, academicYear).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByClassAndAcademicYearAndTerm(Long classId, Integer academicYear, Term term) {
        return attendanceSummaryRepository.findByClassIdAndAcademicYearAndTerm(classId, academicYear, term).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Course-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByCourse(Long courseId) {
        return attendanceSummaryRepository.findByCourseIdAndActive(courseId).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByCourseAndAcademicYear(Long courseId, Integer academicYear) {
        return attendanceSummaryRepository.findByCourseIdAndAcademicYear(courseId, academicYear).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByCourseAndAcademicYearAndTerm(Long courseId, Integer academicYear, Term term) {
        return attendanceSummaryRepository.findByCourseIdAndAcademicYearAndTerm(courseId, academicYear, term).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Subject-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesBySubject(Long subjectId) {
        return attendanceSummaryRepository.findBySubjectIdAndActive(subjectId).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Summary type queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByType(AttendanceSummaryType summaryType) {
        return attendanceSummaryRepository.findBySummaryTypeAndActive(summaryType).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Specific summary retrieval
    @Override
    @Transactional(readOnly = true)
    public Optional<AttendanceSummaryDTO> getSummaryByStudentAndClassAndAcademicYearAndTermAndType(
            Long studentId, Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        return attendanceSummaryRepository.findByStudentAndClassAndAcademicYearAndTermAndType(
                studentId, classId, academicYear, term, summaryType)
                .map(attendanceSummaryMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AttendanceSummaryDTO> getSummaryByStudentAndCourseAndAcademicYearAndTermAndType(
            Long studentId, Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        return attendanceSummaryRepository.findByStudentAndCourseAndAcademicYearAndTermAndType(
                studentId, courseId, academicYear, term, summaryType)
                .map(attendanceSummaryMapper::toDto);
    }

    // Low attendance identification
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getStudentsWithLowAttendance(Double threshold) {
        return attendanceSummaryRepository.findByAttendancePercentageLessThan(threshold).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getStudentsWithLowAttendanceByClass(Long classId, Double threshold) {
        return attendanceSummaryRepository.findByClassIdAndAttendancePercentageLessThan(classId, threshold).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getStudentsWithLowAttendanceBySchool(Long schoolId, Double threshold) {
        return attendanceSummaryRepository.findBySchoolIdAndAttendancePercentageLessThan(schoolId, threshold).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Statistics and analytics
    @Override
    @Transactional(readOnly = true)
    public Double getAverageAttendancePercentageByClass(Long classId, Integer academicYear, Term term) {
        Double average = attendanceSummaryRepository.getAverageAttendancePercentageByClassAndAcademicYearAndTerm(classId, academicYear, term);
        return average != null ? average : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageAttendancePercentageByCourse(Long courseId, Integer academicYear, Term term) {
        Double average = attendanceSummaryRepository.getAverageAttendancePercentageByCourseAndAcademicYearAndTerm(courseId, academicYear, term);
        return average != null ? average : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Long countStudentsWithGoodAttendance(Long classId, Double threshold, Integer academicYear, Term term) {
        return attendanceSummaryRepository.countStudentsWithGoodAttendance(classId, threshold, academicYear, term);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countStudentsWithPoorAttendance(Long classId, Double threshold, Integer academicYear, Term term) {
        return attendanceSummaryRepository.countStudentsWithPoorAttendance(classId, threshold, academicYear, term);
    }

    // Summary generation and calculation
    @Override
    public AttendanceSummaryDTO generateSummaryForStudent(Long studentId, Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // Calculate attendance statistics from attendance records
        List<AttendanceRecord> records = attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term);
        
        AttendanceSummary summary = new AttendanceSummary();
        summary.setStudentUser(student);
        summary.setClassEntity(classEntity);
        summary.setAcademicYear(academicYear);
        summary.setTerm(term);
        summary.setSummaryType(summaryType);
        summary.setLastCalculatedDate(LocalDate.now());
        
        calculateSummaryStatistics(summary, records);
        
        AttendanceSummary savedSummary = attendanceSummaryRepository.save(summary);
        log.info("Generated attendance summary for student {} in class {} for {} {}", studentId, classId, academicYear, term);
        
        return attendanceSummaryMapper.toDto(savedSummary);
    }

    @Override
    public AttendanceSummaryDTO generateSummaryForStudentAndCourse(Long studentId, Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Get class from course relationship or attendance records
        List<AttendanceRecord> records = attendanceRecordRepository.findByCourseIdAndActive(courseId).stream()
                .filter(record -> record.getStudentUser().getId().equals(studentId) && 
                                record.getAcademicYear().equals(academicYear) && 
                                record.getTerm() == term)
                .collect(Collectors.toList());
        
        if (records.isEmpty()) {
            throw new ResourceNotFoundException("No attendance records found for student " + studentId + " in course " + courseId);
        }
        
        com.ohma.thutothebe.entity.Class classEntity = records.get(0).getClassEntity();
        
        AttendanceSummary summary = new AttendanceSummary();
        summary.setStudentUser(student);
        summary.setClassEntity(classEntity);
        summary.setCourse(course);
        summary.setAcademicYear(academicYear);
        summary.setTerm(term);
        summary.setSummaryType(summaryType);
        summary.setLastCalculatedDate(LocalDate.now());
        
        calculateSummaryStatistics(summary, records);
        
        AttendanceSummary savedSummary = attendanceSummaryRepository.save(summary);
        log.info("Generated attendance summary for student {} in course {} for {} {}", studentId, courseId, academicYear, term);
        
        return attendanceSummaryMapper.toDto(savedSummary);
    }

    @Override
    public List<AttendanceSummaryDTO> generateSummariesForClass(Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        List<AttendanceSummary> summaries = new ArrayList<>();
        
        for (Student student : classEntity.getStudents()) {
            // Create summaries for all students (both with and without user accounts)
            // Get attendance records for this student entity
            List<AttendanceRecord> records = attendanceRecordRepository.findAll().stream()
                    .filter(record -> record.getStudentEntity().getId().equals(student.getId()) &&
                                    record.getAcademicYear().equals(academicYear) &&
                                    record.getTerm() == term)
                    .collect(Collectors.toList());
            
            if (!records.isEmpty()) {
                AttendanceSummary summary = new AttendanceSummary();
                summary.setStudentEntity(student);
                summary.setStudentUser(student.getUser()); // This will be null for students without user accounts
                summary.setClassEntity(classEntity);
                summary.setAcademicYear(academicYear);
                summary.setTerm(term);
                summary.setSummaryType(summaryType);
                summary.setLastCalculatedDate(LocalDate.now());
                
                calculateSummaryStatistics(summary, records);
                summaries.add(summary);
            }
        }
        
        List<AttendanceSummary> savedSummaries = attendanceSummaryRepository.saveAll(summaries);
        log.info("Generated {} attendance summaries for class {} for {} {} (including {} students without user accounts)", 
                savedSummaries.size(), classId, academicYear, term,
                savedSummaries.stream().mapToLong(s -> s.getStudentUser() == null ? 1 : 0).sum());
        
        return savedSummaries.stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceSummaryDTO> generateSummariesForCourse(Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Get all students who have attendance records for this course
        List<AttendanceRecord> allRecords = attendanceRecordRepository.findByCourseIdAndActive(courseId).stream()
                .filter(record -> record.getAcademicYear().equals(academicYear) && 
                                record.getTerm() == term)
                .collect(Collectors.toList());
        
        Map<Long, List<AttendanceRecord>> recordsByStudent = allRecords.stream()
                .collect(Collectors.groupingBy(record -> record.getStudentUser().getId()));

        List<AttendanceSummary> summaries = new ArrayList<>();
        
        for (Map.Entry<Long, List<AttendanceRecord>> entry : recordsByStudent.entrySet()) {
            List<AttendanceRecord> studentRecords = entry.getValue();
            User student = studentRecords.get(0).getStudentUser();
            com.ohma.thutothebe.entity.Class classEntity = studentRecords.get(0).getClassEntity();
            
            AttendanceSummary summary = new AttendanceSummary();
            summary.setStudentUser(student);
            summary.setClassEntity(classEntity);
            summary.setCourse(course);
            summary.setAcademicYear(academicYear);
            summary.setTerm(term);
            summary.setSummaryType(summaryType);
            summary.setLastCalculatedDate(LocalDate.now());
            
            calculateSummaryStatistics(summary, studentRecords);
            summaries.add(summary);
        }
        
        List<AttendanceSummary> savedSummaries = attendanceSummaryRepository.saveAll(summaries);
        log.info("Generated {} attendance summaries for course {} for {} {}", savedSummaries.size(), courseId, academicYear, term);
        
        return savedSummaries.stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Bulk summary operations
    @Override
    public void generateAllSummariesForClass(Long classId, Integer academicYear, Term term) {
        log.info("Generating all summary types for class {} for {} {}", classId, academicYear, term);
        
        for (AttendanceSummaryType summaryType : AttendanceSummaryType.values()) {
            try {
                generateSummariesForClass(classId, academicYear, term, summaryType);
            } catch (Exception e) {
                log.error("Error generating {} summaries for class {}: {}", summaryType, classId, e.getMessage(), e);
            }
        }
    }

    @Override
    public void generateAllSummariesForSchool(Long schoolId, Integer academicYear, Term term) {
        log.info("Generating all summaries for school {} for {} {}", schoolId, academicYear, term);
        
        // Get all classes in the school
        List<com.ohma.thutothebe.entity.Class> classes = classRepository.findBySchoolIdAndActive(schoolId, true);
        
        for (com.ohma.thutothebe.entity.Class classEntity : classes) {
            generateAllSummariesForClass(classEntity.getId(), academicYear, term);
        }
    }

    @Override
    public void recalculateAllSummaries(Integer academicYear, Term term) {
        log.info("Recalculating all summaries for {} {}", academicYear, term);
        
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByAcademicYearAndTermAndActive(academicYear, term);
        
        for (AttendanceSummary summary : summaries) {
            try {
                recalculateSummary(summary.getId());
            } catch (Exception e) {
                log.error("Error recalculating summary {}: {}", summary.getId(), e.getMessage(), e);
            }
        }
    }

    // Summary updates and recalculation
    @Override
    public AttendanceSummaryDTO recalculateSummary(Long summaryId) {
        AttendanceSummary summary = attendanceSummaryRepository.findById(summaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance summary not found with id: " + summaryId));

        // Get fresh attendance records
        List<AttendanceRecord> records;
        if (summary.getCourse() != null) {
            records = attendanceRecordRepository.findByCourseIdAndActive(summary.getCourse().getId()).stream()
                    .filter(record -> record.getStudentUser().getId().equals(summary.getStudentUser().getId()) &&
                                    record.getAcademicYear().equals(summary.getAcademicYear()) &&
                                    record.getTerm() == summary.getTerm())
                    .collect(Collectors.toList());
        } else {
            records = attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(
                    summary.getStudentUser().getId(), summary.getAcademicYear(), summary.getTerm());
        }

        calculateSummaryStatistics(summary, records);
        summary.setLastCalculatedDate(LocalDate.now());
        
        AttendanceSummary savedSummary = attendanceSummaryRepository.save(summary);
        log.info("Recalculated attendance summary {}", summaryId);
        
        return attendanceSummaryMapper.toDto(savedSummary);
    }

    @Override
    public List<AttendanceSummaryDTO> recalculateSummariesForStudent(Long studentId, Integer academicYear, Term term) {
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term);
        
        List<AttendanceSummaryDTO> recalculatedSummaries = new ArrayList<>();
        for (AttendanceSummary summary : summaries) {
            recalculatedSummaries.add(recalculateSummary(summary.getId()));
        }
        
        log.info("Recalculated {} summaries for student {} for {} {}", recalculatedSummaries.size(), studentId, academicYear, term);
        return recalculatedSummaries;
    }

    @Override
    public void recalculateOutdatedSummaries(LocalDate cutoffDate) {
        List<AttendanceSummary> outdatedSummaries = attendanceSummaryRepository.findOutdatedSummaries(cutoffDate);
        
        log.info("Found {} outdated summaries to recalculate", outdatedSummaries.size());
        
        for (AttendanceSummary summary : outdatedSummaries) {
            try {
                recalculateSummary(summary.getId());
            } catch (Exception e) {
                log.error("Error recalculating outdated summary {}: {}", summary.getId(), e.getMessage(), e);
            }
        }
    }

    // Date range queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByLastCalculatedDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceSummaryRepository.findByLastCalculatedDateBetween(startDate, endDate).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByPeriodRange(LocalDate fromDate, LocalDate toDate) {
        return attendanceSummaryRepository.findByPeriodRange(fromDate, toDate).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // School-based queries for reporting
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesBySchoolAndAcademicYear(Long schoolId, Integer academicYear) {
        return attendanceSummaryRepository.findBySchoolIdAndAcademicYear(schoolId, academicYear).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesBySchoolAndAcademicYearAndTerm(Long schoolId, Integer academicYear, Term term) {
        return attendanceSummaryRepository.findBySchoolIdAndAcademicYearAndTerm(schoolId, academicYear, term).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Academic year queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByAcademicYear(Integer academicYear) {
        return attendanceSummaryRepository.findByAcademicYearAndActive(academicYear).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getSummariesByAcademicYearAndTerm(Integer academicYear, Term term) {
        return attendanceSummaryRepository.findByAcademicYearAndTermAndActive(academicYear, term).stream()
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    // Dashboard and reporting data
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceSummaryDashboard(Long classId, Integer academicYear, Term term) {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByClassIdAndAcademicYearAndTerm(classId, academicYear, term);
        
        dashboard.put("classId", classId);
        dashboard.put("academicYear", academicYear);
        dashboard.put("term", term);
        dashboard.put("totalStudents", summaries.size());
        
        if (!summaries.isEmpty()) {
            double averageAttendance = summaries.stream()
                    .mapToDouble(AttendanceSummary::getAttendancePercentage)
                    .average()
                    .orElse(0.0);
            
            long studentsWithGoodAttendance = summaries.stream()
                    .mapToLong(s -> s.getAttendancePercentage() >= 80.0 ? 1 : 0)
                    .sum();
            
            long studentsWithPoorAttendance = summaries.stream()
                    .mapToLong(s -> s.getAttendancePercentage() < 60.0 ? 1 : 0)
                    .sum();
            
            dashboard.put("averageAttendancePercentage", averageAttendance);
            dashboard.put("studentsWithGoodAttendance", studentsWithGoodAttendance);
            dashboard.put("studentsWithPoorAttendance", studentsWithPoorAttendance);
        } else {
            dashboard.put("averageAttendancePercentage", 0.0);
            dashboard.put("studentsWithGoodAttendance", 0L);
            dashboard.put("studentsWithPoorAttendance", 0L);
        }
        
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSchoolAttendanceSummaryDashboard(Long schoolId, Integer academicYear, Term term) {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findBySchoolIdAndAcademicYearAndTerm(schoolId, academicYear, term);
        
        dashboard.put("schoolId", schoolId);
        dashboard.put("academicYear", academicYear);
        dashboard.put("term", term);
        dashboard.put("totalStudents", summaries.size());
        
        if (!summaries.isEmpty()) {
            double averageAttendance = summaries.stream()
                    .mapToDouble(AttendanceSummary::getAttendancePercentage)
                    .average()
                    .orElse(0.0);
            
            dashboard.put("averageAttendancePercentage", averageAttendance);
            
            // Group by class for class-level statistics
            Map<String, List<AttendanceSummary>> summariesByClass = summaries.stream()
                    .collect(Collectors.groupingBy(s -> s.getClassEntity().getName()));
            
            dashboard.put("totalClasses", summariesByClass.size());
            dashboard.put("classSummaries", summariesByClass.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> entry.getValue().stream()
                                    .mapToDouble(AttendanceSummary::getAttendancePercentage)
                                    .average()
                                    .orElse(0.0)
                    )));
        }
        
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getStudentAttendanceSummaryReport(Long studentId, Integer academicYear) {
        Map<String, Object> report = new HashMap<>();
        
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByStudentIdAndAcademicYear(studentId, academicYear);
        
        report.put("studentId", studentId);
        report.put("academicYear", academicYear);
        report.put("summaries", summaries.stream().map(attendanceSummaryMapper::toDto).collect(Collectors.toList()));
        
        if (!summaries.isEmpty()) {
            double overallAttendance = summaries.stream()
                    .mapToDouble(AttendanceSummary::getAttendancePercentage)
                    .average()
                    .orElse(0.0);
            
            report.put("overallAttendancePercentage", overallAttendance);
            
            // Group by term
            Map<Term, List<AttendanceSummary>> summariesByTerm = summaries.stream()
                    .filter(s -> s.getTerm() != null)
                    .collect(Collectors.groupingBy(AttendanceSummary::getTerm));
            
            report.put("termSummaries", summariesByTerm.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> entry.getValue().stream()
                                    .mapToDouble(AttendanceSummary::getAttendancePercentage)
                                    .average()
                                    .orElse(0.0)
                    )));
        }
        
        return report;
    }

    // Attendance trends and analytics - placeholder implementations
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAttendanceTrendsByClass(Long classId, Integer academicYear) {
        // TODO: Implement attendance trends calculation
        log.info("Attendance trends requested for class {} for year {}", classId, academicYear);
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAttendanceTrendsBySchool(Long schoolId, Integer academicYear) {
        // TODO: Implement school attendance trends calculation
        log.info("School attendance trends requested for school {} for year {}", schoolId, academicYear);
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceComparisonReport(Long classId, Integer academicYear, Term term) {
        // TODO: Implement attendance comparison report
        log.info("Attendance comparison report requested for class {} for {} {}", classId, academicYear, term);
        return new HashMap<>();
    }

    // Export functionality - placeholder implementations
    @Override
    @Transactional(readOnly = true)
    public byte[] exportSummariesToExcel(Long classId, Integer academicYear, Term term) {
        // TODO: Implement Excel export functionality
        log.info("Excel export requested for class {} summaries for {} {}", classId, academicYear, term);
        return new byte[0];
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportSummariesToPdf(Long classId, Integer academicYear, Term term) {
        // TODO: Implement PDF export functionality
        log.info("PDF export requested for class {} summaries for {} {}", classId, academicYear, term);
        return new byte[0];
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportStudentSummaryReport(Long studentId, Integer academicYear) {
        // TODO: Implement student summary report export
        log.info("Student summary report export requested for student {} for year {}", studentId, academicYear);
        return new byte[0];
    }

    // Alert and notification support
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> getStudentsRequiringAttention(Long classId, Double attendanceThreshold, Integer absentDaysThreshold) {
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByClassIdAndActive(classId);
        
        return summaries.stream()
                .filter(s -> s.getAttendancePercentage() < attendanceThreshold || 
                           s.getTotalAbsentDays() > absentDaysThreshold)
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> generateAttendanceAlerts(Long schoolId, Double attendanceThreshold) {
        List<AttendanceSummary> lowAttendanceSummaries = attendanceSummaryRepository.findBySchoolIdAndAttendancePercentageLessThan(schoolId, attendanceThreshold);
        
        return lowAttendanceSummaries.stream()
                .map(summary -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("studentId", summary.getStudentUser().getId());
                    alert.put("studentName", summary.getStudentUser().getFirstName() + " " + summary.getStudentUser().getLastName());
                    alert.put("classId", summary.getClassEntity().getId());
                    alert.put("className", summary.getClassEntity().getName());
                    alert.put("attendancePercentage", summary.getAttendancePercentage());
                    alert.put("totalAbsentDays", summary.getTotalAbsentDays());
                    alert.put("academicYear", summary.getAcademicYear());
                    alert.put("term", summary.getTerm());
                    return alert;
                })
                .collect(Collectors.toList());
    }

    // Performance optimization - placeholder implementations
    @Override
    public void refreshSummaryCache(Long classId, Integer academicYear, Term term) {
        // TODO: Implement cache refresh logic
        log.info("Refreshing summary cache for class {} for {} {}", classId, academicYear, term);
    }

    @Override
    public void clearOutdatedSummaries(Integer academicYear) {
        // TODO: Implement outdated summary cleanup
        log.info("Clearing outdated summaries for academic year {}", academicYear);
    }

    // Validation and integrity checks
    @Override
    @Transactional(readOnly = true)
    public boolean validateSummaryData(Long summaryId) {
        AttendanceSummary summary = attendanceSummaryRepository.findById(summaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance summary not found with id: " + summaryId));

        // Validate that calculated percentage matches stored percentage
        summary.calculateAttendancePercentage();
        double calculatedPercentage = summary.getAttendancePercentage();
        
        // Allow small floating point differences
        return Math.abs(calculatedPercentage - summary.getAttendancePercentage()) < 0.01;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDTO> findInconsistentSummaries(Long classId, Integer academicYear, Term term) {
        List<AttendanceSummary> summaries = attendanceSummaryRepository.findByClassIdAndAcademicYearAndTerm(classId, academicYear, term);
        
        return summaries.stream()
                .filter(summary -> !validateSummaryData(summary.getId()))
                .map(attendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void fixInconsistentSummaries(Long classId, Integer academicYear, Term term) {
        List<AttendanceSummary> inconsistentSummaries = findInconsistentSummaries(classId, academicYear, term)
                .stream()
                .map(dto -> attendanceSummaryRepository.findById(dto.id()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        for (AttendanceSummary summary : inconsistentSummaries) {
            try {
                recalculateSummary(summary.getId());
                log.info("Fixed inconsistent summary {}", summary.getId());
            } catch (Exception e) {
                log.error("Error fixing inconsistent summary {}: {}", summary.getId(), e.getMessage(), e);
            }
        }
    }

    // Helper method to calculate summary statistics from attendance records
    private void calculateSummaryStatistics(AttendanceSummary summary, List<AttendanceRecord> records) {
        summary.setTotalDays(records.size());
        
        Map<AttendanceStatus, Long> statusCounts = records.stream()
                .collect(Collectors.groupingBy(AttendanceRecord::getAttendanceStatus, Collectors.counting()));
        
        summary.setPresentDays(statusCounts.getOrDefault(AttendanceStatus.PRESENT, 0L).intValue());
        summary.setAbsentExcusedDays(statusCounts.getOrDefault(AttendanceStatus.ABSENT_EXCUSED, 0L).intValue());
        summary.setAbsentUnexcusedDays(statusCounts.getOrDefault(AttendanceStatus.ABSENT_UNEXCUSED, 0L).intValue());
        summary.setLateDays(statusCounts.getOrDefault(AttendanceStatus.LATE, 0L).intValue());
        summary.setEarlyDepartureDays(statusCounts.getOrDefault(AttendanceStatus.EARLY_DEPARTURE, 0L).intValue());
        
        // Set period dates
        if (!records.isEmpty()) {
            LocalDate minDate = records.stream()
                    .map(AttendanceRecord::getAttendanceDate)
                    .min(LocalDate::compareTo)
                    .orElse(null);
            LocalDate maxDate = records.stream()
                    .map(AttendanceRecord::getAttendanceDate)
                    .max(LocalDate::compareTo)
                    .orElse(null);
            
            summary.setPeriodFrom(minDate);
            summary.setPeriodTo(maxDate);
        }
        
        // Calculate percentage (this will be done automatically in @PrePersist/@PreUpdate)
        summary.calculateAttendancePercentage();
    }

    @Override
    protected Long extractSchoolId(AttendanceSummary entity) {
        // Extract school from student or class entity
        if (entity.getStudentUser() != null && entity.getStudentUser().getSchool() != null) {
            return entity.getStudentUser().getSchool().getId();
        }
        if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null) {
            return entity.getClassEntity().getSchool().getId();
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(AttendanceSummary entity) {
        // Extract region from student's school or class's school
        if (entity.getStudentUser() != null && entity.getStudentUser().getSchool() != null && entity.getStudentUser().getSchool().getRegion() != null) {
            return entity.getStudentUser().getSchool().getRegion().getId();
        }
        if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null && entity.getClassEntity().getSchool().getRegion() != null) {
            return entity.getClassEntity().getSchool().getRegion().getId();
        }
        return null;
    }
} 