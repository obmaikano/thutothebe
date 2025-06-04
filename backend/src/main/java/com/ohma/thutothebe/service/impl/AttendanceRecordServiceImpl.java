package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.dto.BulkAttendanceDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AttendanceRecordMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.AttendanceRecordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class AttendanceRecordServiceImpl extends BaseServiceImpl<AttendanceRecord, AttendanceRecordDTO, Long> 
        implements AttendanceRecordService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final AttendanceRecordMapper attendanceRecordMapper;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public AttendanceRecordServiceImpl(
            AttendanceRecordRepository attendanceRecordRepository,
            AttendanceRecordMapper attendanceRecordMapper,
            UserRepository userRepository,
            ClassRepository classRepository,
            CourseRepository courseRepository,
            SubjectRepository subjectRepository) {
        super(attendanceRecordRepository);
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.attendanceRecordMapper = attendanceRecordMapper;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    protected AttendanceRecord mapToEntity(AttendanceRecordDTO dto) {
        return attendanceRecordMapper.toEntity(dto);
    }

    @Override
    protected AttendanceRecordDTO mapToDto(AttendanceRecord entity) {
        return attendanceRecordMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(AttendanceRecord entity, AttendanceRecordDTO dto) {
        entity.setAttendanceDate(dto.attendanceDate());
        entity.setAttendanceStatus(dto.attendanceStatus());
        entity.setAttendanceType(dto.attendanceType());
        entity.setPeriodNumber(dto.periodNumber());
        entity.setPeriodStartTime(dto.periodStartTime());
        entity.setPeriodEndTime(dto.periodEndTime());
        entity.setArrivalTime(dto.arrivalTime());
        entity.setDepartureTime(dto.departureTime());
        entity.setRemarks(dto.remarks());
        entity.setAcademicYear(dto.academicYear());
        entity.setTerm(dto.term());
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

        if (dto.markedById() != null && (entity.getMarkedBy() == null || !entity.getMarkedBy().getId().equals(dto.markedById()))) {
            userRepository.findById(dto.markedById()).ifPresent(entity::setMarkedBy);
        }
    }

    // Student-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStudent(Long studentId) {
        return attendanceRecordRepository.findByStudentIdAndActive(studentId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate date) {
        return attendanceRecordRepository.findByStudentIdAndDate(studentId, date).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStudentAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return attendanceRecordRepository.findByStudentIdAndDateRange(studentId, startDate, endDate).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYear(Long studentId, Integer academicYear) {
        return attendanceRecordRepository.findByStudentIdAndAcademicYear(studentId, academicYear).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYearAndTerm(Long studentId, Integer academicYear, Term term) {
        return attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Class-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByClass(Long classId) {
        return attendanceRecordRepository.findByClassIdAndActive(classId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByClassAndDate(Long classId, LocalDate date) {
        return attendanceRecordRepository.findByClassIdAndDate(classId, date).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByClassAndDateRange(Long classId, LocalDate startDate, LocalDate endDate) {
        return attendanceRecordRepository.findByClassIdAndDateRange(classId, startDate, endDate).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Course-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByCourse(Long courseId) {
        return attendanceRecordRepository.findByCourseIdAndActive(courseId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRecordRepository.findByCourseIdAndDate(courseId, date).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByCourseAndDateRange(Long courseId, LocalDate startDate, LocalDate endDate) {
        return attendanceRecordRepository.findByCourseIdAndDateRange(courseId, startDate, endDate).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Subject-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceBySubject(Long subjectId) {
        return attendanceRecordRepository.findBySubjectIdAndActive(subjectId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Teacher-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByTeacher(Long teacherId) {
        return attendanceRecordRepository.findByMarkedByIdAndActive(teacherId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByTeacherAndDate(Long teacherId, LocalDate date) {
        return attendanceRecordRepository.findByMarkedByIdAndDate(teacherId, date).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Status-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByStatus(AttendanceStatus status) {
        return attendanceRecordRepository.findByAttendanceStatusAndActive(status).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByClassAndStatusAndDate(Long classId, AttendanceStatus status, LocalDate date) {
        return attendanceRecordRepository.findByClassIdAndStatusAndDate(classId, status, date).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Type-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByType(AttendanceType type) {
        return attendanceRecordRepository.findByAttendanceTypeAndActive(type).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Period-based queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByClassAndDateAndTypeAndPeriod(Long classId, LocalDate date, AttendanceType type, Integer periodNumber) {
        return attendanceRecordRepository.findByClassIdAndDateAndTypeAndPeriod(classId, date, type, periodNumber).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Bulk operations
    @Override
    public List<AttendanceRecordDTO> markBulkAttendance(BulkAttendanceDTO bulkAttendanceDTO) {
        List<AttendanceRecord> attendanceRecords = new ArrayList<>();
        
        for (BulkAttendanceDTO.StudentAttendanceDTO studentAttendance : bulkAttendanceDTO.studentAttendances()) {
            // Check for existing attendance
            Optional<AttendanceRecord> existingRecord = attendanceRecordRepository.findExistingAttendance(
                studentAttendance.studentId(),
                bulkAttendanceDTO.attendanceDate(),
                bulkAttendanceDTO.attendanceType(),
                bulkAttendanceDTO.courseId(),
                bulkAttendanceDTO.periodNumber()
            );
            
            if (existingRecord.isPresent()) {
                log.warn("Attendance already exists for student {} on date {}", 
                    studentAttendance.studentId(), bulkAttendanceDTO.attendanceDate());
                continue;
            }
            
            AttendanceRecord record = new AttendanceRecord();
            record.setStudentUser(userRepository.findById(studentAttendance.studentId()).orElse(null));
            record.setClassEntity(classRepository.findById(bulkAttendanceDTO.classId()).orElse(null));
            record.setCourse(bulkAttendanceDTO.courseId() != null ? 
                courseRepository.findById(bulkAttendanceDTO.courseId()).orElse(null) : null);
            record.setSubject(bulkAttendanceDTO.subjectId() != null ? 
                subjectRepository.findById(bulkAttendanceDTO.subjectId()).orElse(null) : null);
            record.setMarkedBy(userRepository.findById(bulkAttendanceDTO.markedById()).orElse(null));
            record.setAttendanceDate(bulkAttendanceDTO.attendanceDate());
            record.setAttendanceStatus(studentAttendance.attendanceStatus());
            record.setAttendanceType(bulkAttendanceDTO.attendanceType());
            record.setPeriodNumber(bulkAttendanceDTO.periodNumber());
            record.setPeriodStartTime(bulkAttendanceDTO.periodStartTime());
            record.setPeriodEndTime(bulkAttendanceDTO.periodEndTime());
            record.setArrivalTime(studentAttendance.arrivalTime());
            record.setDepartureTime(studentAttendance.departureTime());
            record.setRemarks(studentAttendance.remarks());
            record.setAcademicYear(bulkAttendanceDTO.academicYear());
            record.setTerm(bulkAttendanceDTO.term());
            record.setMarkedAt(LocalDateTime.now());
            record.setActive(true);
            
            attendanceRecords.add(record);
        }
        
        List<AttendanceRecord> savedRecords = attendanceRecordRepository.saveAll(attendanceRecords);
        log.info("Bulk attendance marked for {} students", savedRecords.size());
        
        return savedRecords.stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceRecordDTO> updateBulkAttendance(BulkAttendanceDTO bulkAttendanceDTO) {
        List<AttendanceRecord> updatedRecords = new ArrayList<>();
        
        for (BulkAttendanceDTO.StudentAttendanceDTO studentAttendance : bulkAttendanceDTO.studentAttendances()) {
            Optional<AttendanceRecord> existingRecord = attendanceRecordRepository.findExistingAttendance(
                studentAttendance.studentId(),
                bulkAttendanceDTO.attendanceDate(),
                bulkAttendanceDTO.attendanceType(),
                bulkAttendanceDTO.courseId(),
                bulkAttendanceDTO.periodNumber()
            );
            
            if (existingRecord.isPresent()) {
                AttendanceRecord record = existingRecord.get();
                record.setAttendanceStatus(studentAttendance.attendanceStatus());
                record.setArrivalTime(studentAttendance.arrivalTime());
                record.setDepartureTime(studentAttendance.departureTime());
                record.setRemarks(studentAttendance.remarks());
                record.setModified(true);
                record.setModifiedBy(userRepository.findById(bulkAttendanceDTO.markedById()).orElse(null));
                record.setModifiedAt(LocalDateTime.now());
                record.setModifiedReason("Bulk update");
                
                updatedRecords.add(record);
            }
        }
        
        List<AttendanceRecord> savedRecords = attendanceRecordRepository.saveAll(updatedRecords);
        log.info("Bulk attendance updated for {} students", savedRecords.size());
        
        return savedRecords.stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Attendance modification
    @Override
    public AttendanceRecordDTO modifyAttendance(Long attendanceId, AttendanceRecordDTO updatedRecord, String reason, Long modifiedById) {
        AttendanceRecord existingRecord = attendanceRecordRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + attendanceId));
        
        existingRecord.setAttendanceStatus(updatedRecord.attendanceStatus());
        existingRecord.setArrivalTime(updatedRecord.arrivalTime());
        existingRecord.setDepartureTime(updatedRecord.departureTime());
        existingRecord.setRemarks(updatedRecord.remarks());
        existingRecord.setModified(true);
        existingRecord.setModifiedReason(reason);
        existingRecord.setModifiedBy(userRepository.findById(modifiedById).orElse(null));
        existingRecord.setModifiedAt(LocalDateTime.now());
        
        AttendanceRecord savedRecord = attendanceRecordRepository.save(existingRecord);
        log.info("Attendance record {} modified by user {}", attendanceId, modifiedById);
        
        return attendanceRecordMapper.toDto(savedRecord);
    }

    // Statistics and reporting
    @Override
    @Transactional(readOnly = true)
    public Map<AttendanceStatus, Long> getAttendanceStatsByStudent(Long studentId, Integer academicYear) {
        Map<AttendanceStatus, Long> stats = new HashMap<>();
        for (AttendanceStatus status : AttendanceStatus.values()) {
            Long count = attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, status, academicYear);
            stats.put(status, count);
        }
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<AttendanceStatus, Long> getAttendanceStatsByStudentAndTerm(Long studentId, Integer academicYear, Term term) {
        Map<AttendanceStatus, Long> stats = new HashMap<>();
        for (AttendanceStatus status : AttendanceStatus.values()) {
            Long count = attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYearAndTerm(studentId, status, academicYear, term);
            stats.put(status, count);
        }
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<AttendanceStatus, Long> getAttendanceStatsByClassAndDate(Long classId, LocalDate date) {
        Map<AttendanceStatus, Long> stats = new HashMap<>();
        for (AttendanceStatus status : AttendanceStatus.values()) {
            Long count = attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, status);
            stats.put(status, count);
        }
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAttendancePercentageByStudent(Long studentId, Integer academicYear) {
        Map<AttendanceStatus, Long> stats = getAttendanceStatsByStudent(studentId, academicYear);
        Long totalDays = stats.values().stream().mapToLong(Long::longValue).sum();
        Long presentDays = stats.get(AttendanceStatus.PRESENT);
        
        if (totalDays == 0) return 0.0;
        return (presentDays.doubleValue() / totalDays.doubleValue()) * 100.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAttendancePercentageByStudentAndTerm(Long studentId, Integer academicYear, Term term) {
        Map<AttendanceStatus, Long> stats = getAttendanceStatsByStudentAndTerm(studentId, academicYear, term);
        Long totalDays = stats.values().stream().mapToLong(Long::longValue).sum();
        Long presentDays = stats.get(AttendanceStatus.PRESENT);
        
        if (totalDays == 0) return 0.0;
        return (presentDays.doubleValue() / totalDays.doubleValue()) * 100.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAttendancePercentageByClass(Long classId, LocalDate startDate, LocalDate endDate) {
        List<AttendanceRecord> records = attendanceRecordRepository.findByClassIdAndDateRange(classId, startDate, endDate);
        
        if (records.isEmpty()) return 0.0;
        
        long totalRecords = records.size();
        long presentRecords = records.stream()
                .mapToLong(record -> record.getAttendanceStatus() == AttendanceStatus.PRESENT ? 1 : 0)
                .sum();
        
        return (presentRecords / (double) totalRecords) * 100.0;
    }

    // Low attendance identification
    @Override
    @Transactional(readOnly = true)
    public List<Long> getStudentsWithLowAttendance(Long classId, LocalDate startDate, LocalDate endDate, Double threshold) {
        List<Object[]> results = attendanceRecordRepository.findStudentsWithLowAttendance(classId, startDate, endDate, threshold.longValue());
        return results.stream()
                .map(result -> (Long) result[0])
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getStudentsWithLowAttendanceDetails(Long classId, LocalDate startDate, LocalDate endDate, Double threshold) {
        List<Long> studentIds = getStudentsWithLowAttendance(classId, startDate, endDate, threshold);
        
        return studentIds.stream()
                .flatMap(studentId -> attendanceRecordRepository.findByStudentIdAndDateRange(studentId, startDate, endDate).stream())
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Validation and duplicate checking
    @Override
    @Transactional(readOnly = true)
    public boolean hasExistingAttendance(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber) {
        return attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceRecordDTO getExistingAttendance(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber) {
        return attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber)
                .map(attendanceRecordMapper::toDto)
                .orElse(null);
    }

    // Modified records tracking
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getModifiedRecords() {
        return attendanceRecordRepository.findModifiedRecords().stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getModifiedRecordsByUser(Long userId) {
        return attendanceRecordRepository.findModifiedRecordsByUser(userId).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Academic year and term queries
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByAcademicYear(Integer academicYear) {
        return attendanceRecordRepository.findByAcademicYearAndActive(academicYear).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceByAcademicYearAndTerm(Integer academicYear, Term term) {
        return attendanceRecordRepository.findByAcademicYearAndTermAndActive(academicYear, term).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // School-based queries for reporting
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceBySchoolAndDateRange(Long schoolId, LocalDate startDate, LocalDate endDate) {
        return attendanceRecordRepository.findBySchoolIdAndDateRange(schoolId, startDate, endDate).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordDTO> getAttendanceBySchoolAndAcademicYear(Long schoolId, Integer academicYear) {
        return attendanceRecordRepository.findBySchoolIdAndAcademicYear(schoolId, academicYear).stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Export functionality - placeholder implementations
    @Override
    @Transactional(readOnly = true)
    public byte[] exportAttendanceToExcel(Long classId, LocalDate startDate, LocalDate endDate) {
        // TODO: Implement Excel export functionality
        log.info("Excel export requested for class {} from {} to {}", classId, startDate, endDate);
        return new byte[0];
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportAttendanceToPdf(Long classId, LocalDate startDate, LocalDate endDate) {
        // TODO: Implement PDF export functionality
        log.info("PDF export requested for class {} from {} to {}", classId, startDate, endDate);
        return new byte[0];
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportStudentAttendanceReport(Long studentId, Integer academicYear, Term term) {
        // TODO: Implement student report export functionality
        log.info("Student attendance report export requested for student {} for {} {}", studentId, academicYear, term);
        return new byte[0];
    }

    // Dashboard data - placeholder implementations
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceDashboardData(Long classId, LocalDate date) {
        Map<String, Object> dashboard = new HashMap<>();
        Map<AttendanceStatus, Long> stats = getAttendanceStatsByClassAndDate(classId, date);
        
        dashboard.put("date", date);
        dashboard.put("classId", classId);
        dashboard.put("attendanceStats", stats);
        dashboard.put("totalStudents", stats.values().stream().mapToLong(Long::longValue).sum());
        dashboard.put("presentCount", stats.get(AttendanceStatus.PRESENT));
        dashboard.put("absentCount", stats.get(AttendanceStatus.ABSENT_EXCUSED) + stats.get(AttendanceStatus.ABSENT_UNEXCUSED));
        dashboard.put("lateCount", stats.get(AttendanceStatus.LATE));
        
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTeacherAttendanceDashboard(Long teacherId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> dashboard = new HashMap<>();
        List<AttendanceRecord> records = attendanceRecordRepository.findByMarkedByIdAndActive(teacherId);
        
        dashboard.put("teacherId", teacherId);
        dashboard.put("startDate", startDate);
        dashboard.put("endDate", endDate);
        dashboard.put("totalRecordsMarked", records.size());
        
        return dashboard;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSchoolAttendanceDashboard(Long schoolId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> dashboard = new HashMap<>();
        List<AttendanceRecord> records = attendanceRecordRepository.findBySchoolIdAndDateRange(schoolId, startDate, endDate);
        
        dashboard.put("schoolId", schoolId);
        dashboard.put("startDate", startDate);
        dashboard.put("endDate", endDate);
        dashboard.put("totalRecords", records.size());
        
        return dashboard;
    }

    // Attendance trends - placeholder implementations
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAttendanceTrends(Long classId, LocalDate startDate, LocalDate endDate) {
        // TODO: Implement attendance trends calculation
        log.info("Attendance trends requested for class {} from {} to {}", classId, startDate, endDate);
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStudentAttendanceTrends(Long studentId, LocalDate startDate, LocalDate endDate) {
        // TODO: Implement student attendance trends calculation
        log.info("Student attendance trends requested for student {} from {} to {}", studentId, startDate, endDate);
        return new ArrayList<>();
    }

    // Quick marking support
    @Override
    public List<AttendanceRecordDTO> quickMarkAllPresent(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById) {
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        User markedBy = userRepository.findById(markedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + markedById));
        
        List<AttendanceRecord> records = new ArrayList<>();
        
        for (Student student : classEntity.getStudents()) {
            // Create attendance records for all students (both with and without user accounts)
            // Check if attendance already exists for this student
            if (!hasExistingAttendanceForStudent(student.getId(), date, type, null, periodNumber)) {
                AttendanceRecord record = new AttendanceRecord();
                record.setStudentEntity(student);
                record.setStudentUser(student.getUser()); // This will be null for students without user accounts
                record.setClassEntity(classEntity);
                record.setMarkedBy(markedBy);
                record.setAttendanceDate(date);
                record.setAttendanceStatus(AttendanceStatus.PRESENT);
                record.setAttendanceType(type);
                record.setPeriodNumber(periodNumber);
                record.setAcademicYear(date.getYear());
                record.setMarkedAt(LocalDateTime.now());
                record.setActive(true);
                
                records.add(record);
            }
        }
        
        List<AttendanceRecord> savedRecords = attendanceRecordRepository.saveAll(records);
        log.info("Quick marked {} students as present for class {} on {} (including {} students without user accounts)", 
                savedRecords.size(), classId, date, 
                savedRecords.stream().mapToLong(r -> r.getStudentUser() == null ? 1 : 0).sum());
        
        return savedRecords.stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceRecordDTO> quickMarkAllAbsent(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById, AttendanceStatus absentType) {
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        User markedBy = userRepository.findById(markedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + markedById));
        
        List<AttendanceRecord> records = new ArrayList<>();
        
        for (Student student : classEntity.getStudents()) {
            // Create attendance records for all students (both with and without user accounts)
            // Check if attendance already exists for this student
            if (!hasExistingAttendanceForStudent(student.getId(), date, type, null, periodNumber)) {
                AttendanceRecord record = new AttendanceRecord();
                record.setStudentEntity(student);
                record.setStudentUser(student.getUser()); // This will be null for students without user accounts
                record.setClassEntity(classEntity);
                record.setMarkedBy(markedBy);
                record.setAttendanceDate(date);
                record.setAttendanceStatus(absentType);
                record.setAttendanceType(type);
                record.setPeriodNumber(periodNumber);
                record.setAcademicYear(date.getYear());
                record.setMarkedAt(LocalDateTime.now());
                record.setActive(true);
                
                records.add(record);
            }
        }
        
        List<AttendanceRecord> savedRecords = attendanceRecordRepository.saveAll(records);
        log.info("Quick marked {} students as {} for class {} on {} (including {} students without user accounts)", 
                savedRecords.size(), absentType, classId, date,
                savedRecords.stream().mapToLong(r -> r.getStudentUser() == null ? 1 : 0).sum());
        
        return savedRecords.stream()
                .map(attendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    // Helper method to check if attendance exists for a student entity
    private boolean hasExistingAttendanceForStudent(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber) {
        // This would need a new repository method to check by student entity ID
        // For now, we'll use a simple approach
        return attendanceRecordRepository.findAll().stream()
                .anyMatch(record -> record.getStudentEntity().getId().equals(studentId) &&
                                  record.getAttendanceDate().equals(date) &&
                                  record.getAttendanceType().equals(type) &&
                                  (courseId == null || (record.getCourse() != null && record.getCourse().getId().equals(courseId))) &&
                                  (periodNumber == null || periodNumber.equals(record.getPeriodNumber())));
    }

    // Attendance summary generation - placeholder implementations
    @Override
    public void generateAttendanceSummaries(Long classId, Integer academicYear, Term term) {
        // TODO: Implement attendance summary generation
        log.info("Generating attendance summaries for class {} for {} {}", classId, academicYear, term);
    }

    @Override
    public void generateAttendanceSummariesForStudent(Long studentId, Integer academicYear, Term term) {
        // TODO: Implement student attendance summary generation
        log.info("Generating attendance summaries for student {} for {} {}", studentId, academicYear, term);
    }

    @Override
    protected Long extractSchoolId(AttendanceRecord entity) {
        return entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null 
            ? entity.getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(AttendanceRecord entity) {
        return entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null && entity.getClassEntity().getSchool().getRegion() != null 
            ? entity.getClassEntity().getSchool().getRegion().getId() : null;
    }
} 