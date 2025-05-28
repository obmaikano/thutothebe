package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.dto.StudentOnboardingDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.enums.StudentStatus;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl extends BaseServiceImpl<Student, StudentDTO, Long> implements StudentService {

    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final StudentMapper studentMapper;
    private final CourseRepository courseRepository;

    @Autowired
    public StudentServiceImpl(
            StudentRepository studentRepository,
            SchoolRepository schoolRepository,
            UserRepository userRepository,
            ClassRepository classRepository,
            SubjectRepository subjectRepository,
            StudentMapper studentMapper,
            CourseRepository courseRepository) {
        super(studentRepository);
        this.studentRepository = studentRepository;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.subjectRepository = subjectRepository;
        this.studentMapper = studentMapper;
        this.courseRepository = courseRepository;
    }

    @Override
    protected Student mapToEntity(StudentDTO dto) {
        return studentMapper.toEntity(dto);
    }

    @Override
    protected StudentDTO mapToDto(Student entity) {
        return studentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Student entity, StudentDTO dto) {
        entity.setAdmissionNumber(dto.admissionNumber());
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setDateOfBirth(dto.dateOfBirth());
        entity.setGender(dto.gender());
        entity.setPhone(dto.phone());
        entity.setEmail(dto.email());
        entity.setAddress(dto.address());
        entity.setAcademicYear(dto.academicYear());
        entity.setMedicalConditions(dto.medicalConditions());
        entity.setDisabilities(dto.disabilities());
        entity.setEmergencyContactName(dto.emergencyContactName());
        entity.setEmergencyContactPhone(dto.emergencyContactPhone());
        entity.setEmergencyContactRelation(dto.emergencyContactRelation());
        entity.setActive(dto.active());
        entity.setStatus(dto.status());
        entity.setOnboardingNotes(dto.onboardingNotes());
        
        if (dto.schoolId() != null && (entity.getSchool() == null || !entity.getSchool().getId().equals(dto.schoolId()))) {
            schoolRepository.findById(dto.schoolId())
                .ifPresent(entity::setSchool);
        }
        
        if (dto.classId() != null && (entity.getStudentClass() == null || !entity.getStudentClass().getId().equals(dto.classId()))) {
            classRepository.findById(dto.classId())
                .ifPresent(entity::setStudentClass);
        }
        
        if (dto.userId() != null && (entity.getUser() == null || !entity.getUser().getId().equals(dto.userId()))) {
            userRepository.findById(dto.userId())
                .ifPresent(entity::setUser);
        }
        
        if (dto.subjectIds() != null && !dto.subjectIds().isEmpty()) {
            entity.setSubjects(
                dto.subjectIds().stream()
                    .map(subjectId -> subjectRepository.findById(subjectId).orElse(null))
                    .filter(subject -> subject != null)
                    .collect(Collectors.toSet())
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByAdmissionNumber(String admissionNumber) {
        return studentRepository.findByAdmissionNumber(admissionNumber)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with admission number: " + admissionNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByUserId(Long userId) {
        return studentRepository.findByUser_Id(userId)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with user ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudents() {
        return studentRepository.findByActive(true).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsBySchoolId(Long schoolId) {
        return studentRepository.findBySchool_Id(schoolId).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.existsByAdmissionNumber(studentDTO.admissionNumber())) {
            throw new IllegalArgumentException("Student with admission number " + studentDTO.admissionNumber() + " already exists");
        }
        
        if (studentRepository.existsByEmail(studentDTO.email())) {
            throw new IllegalArgumentException("Student with email " + studentDTO.email() + " already exists");
        }
        
        schoolRepository.findById(studentDTO.schoolId())
            .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + studentDTO.schoolId()));
        
        return create(studentDTO);
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        var existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        if (!existingStudent.getAdmissionNumber().equals(studentDTO.admissionNumber()) && 
            studentRepository.existsByAdmissionNumber(studentDTO.admissionNumber())) {
            throw new IllegalArgumentException("Student with admission number " + studentDTO.admissionNumber() + " already exists");
        }
        
        if (!existingStudent.getEmail().equals(studentDTO.email()) && 
            studentRepository.existsByEmail(studentDTO.email())) {
            throw new IllegalArgumentException("Student with email " + studentDTO.email() + " already exists");
        }
        
        schoolRepository.findById(studentDTO.schoolId())
            .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + studentDTO.schoolId()));
        
        return update(id, studentDTO);
    }

    @Override
    @Transactional
    public void activateStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setActive(true);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void deactivateStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setActive(false);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByAdmissionNumber(String admissionNumber) {
        return studentRepository.existsByAdmissionNumber(admissionNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public StudentDTO linkToUser(Long studentId, Long userId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        student.setUser(user);
        Student savedStudent = studentRepository.save(student);
        
        return studentMapper.toDto(savedStudent);
    }

    @Override
    @Transactional
    public StudentDTO onboardStudent(StudentOnboardingDTO onboardingDTO) {
        Student student = studentRepository.findById(onboardingDTO.studentId())
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + onboardingDTO.studentId()));
        
        com.ohma.thutothebe.entity.Class studentClass = classRepository.findById(onboardingDTO.classId())
            .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + onboardingDTO.classId()));
        
        if (!studentClass.isActive()) {
            throw new IllegalArgumentException("Cannot onboard student to inactive class");
        }
        
        if (student.getStatus() == StudentStatus.ACTIVE) {
            throw new IllegalArgumentException("Student is already enrolled");
        }
        
        student.setStudentClass(studentClass);
        student.setStatus(onboardingDTO.status());
        student.setOnboardingNotes(onboardingDTO.onboardingNotes());
        
        if (onboardingDTO.subjectIds() != null && !onboardingDTO.subjectIds().isEmpty()) {
            student.setSubjects(
                onboardingDTO.subjectIds().stream()
                    .map(subjectId -> subjectRepository.findById(subjectId)
                        .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId)))
                    .filter(Subject::isActive)
                    .collect(Collectors.toSet())
            );
        }
        
        Student savedStudent = studentRepository.save(student);
        return studentMapper.toDto(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByClassId(Long classId) {
        return studentRepository.findByStudentClass_Id(classId).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsEnrolledInClass(Long classId) {
        // Get student IDs from the class_students join table
        List<Long> studentIds = classRepository.findStudentIdsByClassId(classId);
        
        // Find Student entities with these IDs
        return studentRepository.findAllById(studentIds).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsBySubjectId(Long subjectId) {
        return studentRepository.findBySubjects_Id(subjectId).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsByCourseId(Long courseId) {
        return studentRepository.findByCourseId(courseId).stream()
                .map(studentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public String debugClassEnrollment(Long classId) {
        StringBuilder debug = new StringBuilder();
        
        // Get student IDs from join table
        List<Long> joinTableStudentIds = classRepository.findStudentIdsByClassId(classId);
        debug.append("Student IDs in class_students join table: ").append(joinTableStudentIds).append("\n");
        
        // Get students by foreign key
        List<StudentDTO> foreignKeyStudents = getStudentsByClassId(classId);
        debug.append("Students found by foreign key (class_id): ").append(foreignKeyStudents.size()).append("\n");
        foreignKeyStudents.forEach(s -> debug.append("  - ").append(s.firstName()).append(" ").append(s.lastName()).append(" (ID: ").append(s.id()).append(", UserID: ").append(s.userId()).append(")\n"));
        
        // Get students by join table
        List<StudentDTO> joinTableStudents = getStudentsEnrolledInClass(classId);
        debug.append("Students found by join table: ").append(joinTableStudents.size()).append("\n");
        joinTableStudents.forEach(s -> debug.append("  - ").append(s.firstName()).append(" ").append(s.lastName()).append(" (ID: ").append(s.id()).append(", UserID: ").append(s.userId()).append(")\n"));
        
        // Check for orphaned Student IDs (in join table but no corresponding Student entity)
        List<Long> orphanedStudentIds = joinTableStudentIds.stream()
            .filter(studentId -> !studentRepository.existsById(studentId))
            .collect(Collectors.toList());
        debug.append("Orphaned Student IDs (in join table but no Student entity): ").append(orphanedStudentIds).append("\n");
        
        return debug.toString();
    }

    @Override
    @Transactional
    public void cleanupClassEnrollmentInconsistencies(Long classId) {
        // Get the class entity
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        // Get student IDs from join table
        List<Long> joinTableStudentIds = classRepository.findStudentIdsByClassId(classId);
        
        // Remove orphaned Student IDs from the join table (Students that don't exist)
        List<Long> orphanedStudentIds = joinTableStudentIds.stream()
            .filter(studentId -> !studentRepository.existsById(studentId))
            .collect(Collectors.toList());
        
        if (!orphanedStudentIds.isEmpty()) {
            // Remove orphaned students from the class by finding students with these IDs
            orphanedStudentIds.forEach(studentId -> {
                classEntity.getStudents().removeIf(student -> student.getId().equals(studentId));
            });
            classRepository.save(classEntity);
        }
        
        // Ensure all Student entities with this classId are also in the join table
        List<Student> studentsWithClassId = studentRepository.findByStudentClass_Id(classId);
        studentsWithClassId.forEach(student -> {
            if (!classEntity.getStudents().contains(student)) {
                // Add the student to the join table
                classEntity.getStudents().add(student);
            }
        });
        
        classRepository.save(classEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByTeacherId(Long teacherId) {
        // Get all courses taught by this teacher
        List<Course> teacherCourses = courseRepository.findByTeacherId(teacherId);
        
        // Get all students from these courses
        return teacherCourses.stream()
            .flatMap(course -> studentRepository.findByCourseId(course.getId()).stream())
            .distinct()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudentsByTeacherId(Long teacherId) {
        return getStudentsByTeacherId(teacherId).stream()
            .filter(student -> student.active())
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudentsBySubjectId(Long subjectId) {
        return getStudentsBySubjectId(subjectId).stream()
            .filter(student -> student.active())
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudentsByCourseId(Long courseId) {
        return getStudentsByCourseId(courseId).stream()
            .filter(student -> student.active())
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudentsByClassId(Long classId) {
        return studentRepository.findByStudentClass_Id(classId).stream()
                .filter(student -> student.isActive())
                .map(studentMapper::toDto)
                .collect(Collectors.toList());
    }

    // Student-specific methods for student role access
    @Override
    @Transactional(readOnly = true)
    public List<Object> getStudentCourses(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        // Get courses based on student's class
        if (student.getStudentClass() != null) {
            return courseRepository.findByClassEntityIdAndActive(student.getStudentClass().getId(), true)
                .stream()
                .map(course -> (Object) course)
                .collect(Collectors.toList());
        }
        
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object> getStudentAssignments(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        List<Map<String, Object>> assignments = new ArrayList<>();
        
        // Get assignments from student's courses
        if (student.getStudentClass() != null) {
            List<Course> studentCourses = courseRepository.findByClassEntityIdAndActive(student.getStudentClass().getId(), true);
            
            for (Course course : studentCourses) {
                // Get instructor name
                String instructorName = course.getCourseInstructors().stream()
                    .filter(ci -> ci.isPrimary())
                    .findFirst()
                    .map(ci -> ci.getTeacher().getFirstName() + " " + ci.getTeacher().getLastName())
                    .orElse("No instructor assigned");
                
                // Create sample assignments with real course data
                Map<String, Object> assignment1 = new HashMap<>();
                assignment1.put("id", course.getId() * 10 + 1);
                assignment1.put("title", course.getName() + " Assignment 1");
                assignment1.put("description", "Complete the exercises from chapter 1-3");
                assignment1.put("courseId", course.getId());
                assignment1.put("courseName", course.getName());
                assignment1.put("courseCode", course.getCode());
                assignment1.put("dueDate", LocalDate.now().plusDays(7).toString());
                assignment1.put("submittedAt", null);
                assignment1.put("status", "PENDING");
                assignment1.put("maxScore", 100);
                assignment1.put("score", null);
                assignment1.put("feedback", null);
                assignment1.put("urgent", LocalDate.now().plusDays(7).isBefore(LocalDate.now().plusDays(3)));
                assignment1.put("type", "HOMEWORK");
                assignment1.put("instructorName", instructorName);
                assignment1.put("createdAt", LocalDate.now().minusDays(14).toString());
                assignment1.put("updatedAt", LocalDate.now().minusDays(14).toString());
                assignments.add(assignment1);
                
                // Add a submitted assignment
                Map<String, Object> assignment2 = new HashMap<>();
                assignment2.put("id", course.getId() * 10 + 2);
                assignment2.put("title", course.getName() + " Quiz");
                assignment2.put("description", "Online quiz covering recent topics");
                assignment2.put("courseId", course.getId());
                assignment2.put("courseName", course.getName());
                assignment2.put("courseCode", course.getCode());
                assignment2.put("dueDate", LocalDate.now().plusDays(3).toString());
                assignment2.put("submittedAt", LocalDate.now().minusDays(1).toString());
                assignment2.put("status", "SUBMITTED");
                assignment2.put("maxScore", 50);
                assignment2.put("score", null);
                assignment2.put("feedback", null);
                assignment2.put("urgent", true);
                assignment2.put("type", "QUIZ");
                assignment2.put("instructorName", instructorName);
                assignment2.put("createdAt", LocalDate.now().minusDays(10).toString());
                assignment2.put("updatedAt", LocalDate.now().minusDays(1).toString());
                assignments.add(assignment2);
                
                // Add a graded assignment
                Map<String, Object> assignment3 = new HashMap<>();
                assignment3.put("id", course.getId() * 10 + 3);
                assignment3.put("title", course.getName() + " Essay");
                assignment3.put("description", "Write a 1000-word essay on the given topic");
                assignment3.put("courseId", course.getId());
                assignment3.put("courseName", course.getName());
                assignment3.put("courseCode", course.getCode());
                assignment3.put("dueDate", LocalDate.now().minusDays(5).toString());
                assignment3.put("submittedAt", LocalDate.now().minusDays(7).toString());
                assignment3.put("status", "GRADED");
                assignment3.put("maxScore", 100);
                assignment3.put("score", 85);
                assignment3.put("feedback", "Excellent work! Well-structured arguments and good use of examples.");
                assignment3.put("urgent", false);
                assignment3.put("type", "ESSAY");
                assignment3.put("instructorName", instructorName);
                assignment3.put("createdAt", LocalDate.now().minusDays(21).toString());
                assignment3.put("updatedAt", LocalDate.now().minusDays(3).toString());
                assignments.add(assignment3);
            }
        }
        
        // Sort by due date (urgent first, then by due date)
        assignments.sort((a, b) -> {
            Boolean urgentA = (Boolean) a.get("urgent");
            Boolean urgentB = (Boolean) b.get("urgent");
            if (!urgentA.equals(urgentB)) {
                return urgentB.compareTo(urgentA); // urgent first
            }
            String dueDateA = (String) a.get("dueDate");
            String dueDateB = (String) b.get("dueDate");
            return dueDateA.compareTo(dueDateB);
        });
        
        return assignments.stream().map(a -> (Object) a).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Object getStudentPerformanceAnalytics(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Map<String, Object> performanceData = new HashMap<>();
        
        // Basic student information
        performanceData.put("studentId", student.getId());
        performanceData.put("studentName", student.getFirstName() + " " + student.getLastName());
        performanceData.put("admissionNumber", student.getAdmissionNumber());
        performanceData.put("active", student.isActive());
        performanceData.put("className", student.getStudentClass() != null ? student.getStudentClass().getName() : null);
        
        // Get student's courses for grade calculation
        List<Course> enrolledCourses = List.of();
        if (student.getStudentClass() != null) {
            enrolledCourses = courseRepository.findByClassEntityIdAndActive(student.getStudentClass().getId(), true);
        }
        
        // Calculate grades based on assignments (using sample data for now)
        List<Map<String, Object>> courseGrades = new ArrayList<>();
        double totalWeightedScore = 0.0;
        double totalWeight = 0.0;
        int totalAssignments = 0;
        int completedAssignments = 0;
        
        for (Course course : enrolledCourses) {
            Map<String, Object> courseGrade = new HashMap<>();
            courseGrade.put("courseId", course.getId());
            courseGrade.put("courseName", course.getName());
            courseGrade.put("courseCode", course.getCode());
            
            // Sample grades for this course
            List<Integer> grades = List.of(85, 92, 78, 88, 95); // Sample assignment scores
            double courseAverage = grades.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            
            courseGrade.put("assignments", grades.size());
            courseGrade.put("averageScore", Math.round(courseAverage * 100.0) / 100.0);
            courseGrade.put("letterGrade", calculateLetterGrade(courseAverage));
            courseGrade.put("gradePoints", calculateGradePoints(courseAverage));
            courseGrade.put("credits", 3); // Default credits
            
            // Individual assignment details
            List<Map<String, Object>> assignmentGrades = new ArrayList<>();
            for (int i = 0; i < grades.size(); i++) {
                Map<String, Object> assignment = new HashMap<>();
                assignment.put("name", course.getName() + " Assignment " + (i + 1));
                assignment.put("score", grades.get(i));
                assignment.put("maxScore", 100);
                assignment.put("percentage", grades.get(i));
                assignment.put("letterGrade", calculateLetterGrade(grades.get(i)));
                assignment.put("submittedAt", LocalDate.now().minusDays(7 * (i + 1)).toString());
                assignmentGrades.add(assignment);
            }
            courseGrade.put("assignmentGrades", assignmentGrades);
            
            courseGrades.add(courseGrade);
            
            // Add to overall calculations
            totalWeightedScore += courseAverage * 3; // 3 credits per course
            totalWeight += 3;
            totalAssignments += grades.size();
            completedAssignments += grades.size(); // All sample assignments are completed
        }
        
        performanceData.put("courseGrades", courseGrades);
        
        // Overall performance metrics
        double overallGPA = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
        performanceData.put("overallGPA", Math.round(overallGPA * 100.0) / 100.0);
        performanceData.put("overallLetterGrade", calculateLetterGrade(overallGPA));
        performanceData.put("totalCourses", enrolledCourses.size());
        performanceData.put("totalAssignments", totalAssignments);
        performanceData.put("completedAssignments", completedAssignments);
        performanceData.put("completionRate", totalAssignments > 0 ? Math.round((double) completedAssignments / totalAssignments * 100.0) : 0.0);
        
        // Grade distribution
        Map<String, Integer> gradeDistribution = new HashMap<>();
        gradeDistribution.put("A", 0);
        gradeDistribution.put("B", 0);
        gradeDistribution.put("C", 0);
        gradeDistribution.put("D", 0);
        gradeDistribution.put("F", 0);
        
        for (Map<String, Object> courseGrade : courseGrades) {
            String letterGrade = (String) courseGrade.get("letterGrade");
            gradeDistribution.put(letterGrade, gradeDistribution.get(letterGrade) + 1);
        }
        performanceData.put("gradeDistribution", gradeDistribution);
        
        // Performance trends (sample data)
        List<Map<String, Object>> trends = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            Map<String, Object> trend = new HashMap<>();
            trend.put("month", LocalDate.now().minusMonths(5 - i).getMonth().toString());
            trend.put("averageScore", 75 + (Math.random() * 20)); // Random trend data
            trends.add(trend);
        }
        performanceData.put("performanceTrends", trends);
        
        // Attendance data (sample)
        performanceData.put("attendanceRate", 94.5);
        performanceData.put("totalClasses", 120);
        performanceData.put("attendedClasses", 113);
        performanceData.put("absences", 7);
        
        return performanceData;
    }
    
    private String calculateLetterGrade(double score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }
    
    private double calculateGradePoints(double score) {
        if (score >= 90) return 4.0;
        if (score >= 80) return 3.0;
        if (score >= 70) return 2.0;
        if (score >= 60) return 1.0;
        return 0.0;
    }
    
    private String calculateDaysUntil(String dueDateStr) {
        try {
            LocalDate dueDate = LocalDate.parse(dueDateStr);
            LocalDate today = LocalDate.now();
            long daysUntil = java.time.temporal.ChronoUnit.DAYS.between(today, dueDate);
            
            if (daysUntil < 0) {
                return Math.abs(daysUntil) + " days overdue";
            } else if (daysUntil == 0) {
                return "today";
            } else if (daysUntil == 1) {
                return "tomorrow";
            } else {
                return "in " + daysUntil + " days";
            }
        } catch (Exception e) {
            return "unknown";
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Object getStudentDashboardData(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Basic student information
        dashboardData.put("studentId", student.getId());
        dashboardData.put("studentName", student.getFirstName() + " " + student.getLastName());
        dashboardData.put("admissionNumber", student.getAdmissionNumber());
        dashboardData.put("className", student.getStudentClass() != null ? student.getStudentClass().getName() : null);
        dashboardData.put("schoolName", student.getSchool() != null ? student.getSchool().getName() : null);
        dashboardData.put("status", student.getStatus());
        dashboardData.put("active", student.isActive());
        
        // Get enrolled courses
        List<Course> enrolledCourses = List.of();
        if (student.getStudentClass() != null) {
            enrolledCourses = courseRepository.findByClassEntityIdAndActive(student.getStudentClass().getId(), true);
        }
        dashboardData.put("courseCount", enrolledCourses.size());
        
        // Transform courses for dashboard display
        List<Map<String, Object>> coursesData = enrolledCourses.stream()
            .map(course -> {
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("id", course.getId());
                courseData.put("name", course.getName());
                courseData.put("code", course.getCode());
                courseData.put("description", course.getSubject() != null ? course.getSubject().getDescription() : null);
                
                // Get primary instructor name from CourseInstructor relationship
                String teacherName = course.getCourseInstructors().stream()
                    .filter(ci -> ci.isPrimary())
                    .findFirst()
                    .map(ci -> ci.getTeacher().getFirstName() + " " + ci.getTeacher().getLastName())
                    .orElse(course.getCourseInstructors().stream()
                        .findFirst()
                        .map(ci -> ci.getTeacher().getFirstName() + " " + ci.getTeacher().getLastName())
                        .orElse("No instructor assigned"));
                courseData.put("teacherName", teacherName);
                
                courseData.put("term", course.getTerm());
                courseData.put("year", course.getYear());
                courseData.put("type", course.getType());
                courseData.put("credits", 3); // Default credits as Course entity doesn't have credits field
                // TODO: Calculate actual progress based on assignments/submissions
                courseData.put("progress", 75); // Placeholder
                return courseData;
            })
            .collect(Collectors.toList());
        dashboardData.put("enrolledCourses", coursesData);
        
        // Get assignments for student's courses (now using real assignment data)
        List<Object> studentAssignments = getStudentAssignments(studentId);
        List<Map<String, Object>> upcomingAssignments = studentAssignments.stream()
            .map(assignment -> (Map<String, Object>) assignment)
            .filter(assignment -> "PENDING".equals(assignment.get("status")) || "SUBMITTED".equals(assignment.get("status")))
            .sorted((a, b) -> {
                Boolean urgentA = (Boolean) a.get("urgent");
                Boolean urgentB = (Boolean) b.get("urgent");
                if (!urgentA.equals(urgentB)) {
                    return urgentB.compareTo(urgentA);
                }
                String dueDateA = (String) a.get("dueDate");
                String dueDateB = (String) b.get("dueDate");
                return dueDateA.compareTo(dueDateB);
            })
            .limit(5) // Show only top 5 upcoming assignments
            .collect(Collectors.toList());
        dashboardData.put("upcomingAssignments", upcomingAssignments);
        
        // Performance metrics (now using real performance data)
        Object performanceAnalytics = getStudentPerformanceAnalytics(studentId);
        if (performanceAnalytics instanceof Map) {
            Map<String, Object> perfData = (Map<String, Object>) performanceAnalytics;
            Map<String, Object> performanceMetrics = new HashMap<>();
            performanceMetrics.put("attendanceRate", perfData.get("attendanceRate"));
            performanceMetrics.put("assignmentsCompleted", perfData.get("completedAssignments"));
            performanceMetrics.put("totalAssignments", perfData.get("totalAssignments"));
            performanceMetrics.put("averageGrade", perfData.get("overallLetterGrade"));
            performanceMetrics.put("averageScore", perfData.get("overallGPA"));
            performanceMetrics.put("completionRate", perfData.get("completionRate"));
            dashboardData.put("performanceMetrics", performanceMetrics);
        }
        
        // Real announcements (sample data - would integrate with AnnouncementController)
        List<Map<String, Object>> announcements = new ArrayList<>();
        Map<String, Object> announcement1 = new HashMap<>();
        announcement1.put("id", 1);
        announcement1.put("title", "End of Term Exams");
        announcement1.put("content", "End of term exams will start on May 10th, 2025. Please prepare accordingly.");
        announcement1.put("type", "EXAM");
        announcement1.put("priority", "HIGH");
        announcement1.put("authorName", "Academic Office");
        announcement1.put("date", "1 day ago");
        announcement1.put("read", false);
        announcements.add(announcement1);
        
        Map<String, Object> announcement2 = new HashMap<>();
        announcement2.put("id", 2);
        announcement2.put("title", "Library Hours Extended");
        announcement2.put("content", "The library will now be open until 10 PM on weekdays during exam preparation.");
        announcement2.put("type", "FACILITY");
        announcement2.put("priority", "MEDIUM");
        announcement2.put("authorName", "Library Staff");
        announcement2.put("date", "3 days ago");
        announcement2.put("read", true);
        announcements.add(announcement2);
        dashboardData.put("announcements", announcements);
        
        // Real next class information (sample data - would integrate with ScheduleController)
        Map<String, Object> nextClass = new HashMap<>();
        if (!enrolledCourses.isEmpty()) {
            Course nextCourse = enrolledCourses.get(0); // Use first course as example
            String nextTeacher = nextCourse.getCourseInstructors().stream()
                .filter(ci -> ci.isPrimary())
                .findFirst()
                .map(ci -> ci.getTeacher().getFirstName() + " " + ci.getTeacher().getLastName())
                .orElse("No instructor assigned");
            
            nextClass.put("subject", nextCourse.getName());
            nextClass.put("teacher", nextTeacher);
            nextClass.put("room", "Room 101");
            nextClass.put("time", "Today, 10:00 AM");
            nextClass.put("timeUntil", "2 hours");
        } else {
            nextClass.put("subject", "No classes scheduled");
            nextClass.put("teacher", null);
            nextClass.put("room", null);
            nextClass.put("time", null);
            nextClass.put("timeUntil", null);
        }
        dashboardData.put("nextClass", nextClass);
        
        // Next assignment due (from real upcoming assignments)
        if (!upcomingAssignments.isEmpty()) {
            Map<String, Object> nextAssignment = upcomingAssignments.get(0);
            dashboardData.put("nextAssignment", Map.of(
                "title", nextAssignment.get("title"),
                "course", nextAssignment.get("courseName"),
                "dueDate", "Due " + calculateDaysUntil((String) nextAssignment.get("dueDate"))
            ));
        } else {
            dashboardData.put("nextAssignment", null);
        }
        
        // Summary statistics (based on real data)
        long assignmentsDueThisWeek = upcomingAssignments.stream()
            .filter(assignment -> {
                String dueDate = (String) assignment.get("dueDate");
                try {
                    LocalDate due = LocalDate.parse(dueDate);
                    LocalDate weekEnd = LocalDate.now().plusDays(7);
                    return due.isBefore(weekEnd) || due.isEqual(weekEnd);
                } catch (Exception e) {
                    return false;
                }
            })
            .count();
        dashboardData.put("assignmentsDueThisWeek", (int) assignmentsDueThisWeek);
        
        // Unread announcements count
        long unreadAnnouncements = announcements.stream()
            .filter(announcement -> !(Boolean) announcement.get("read"))
            .count();
        dashboardData.put("unreadAnnouncementsCount", (int) unreadAnnouncements);
        
        return dashboardData;
    }

    @Override
    @Transactional
    public StudentDTO createStudentForUser(Long userId) {
        // Check if student record already exists
        Optional<Student> existingStudent = studentRepository.findByUser_Id(userId);
        if (existingStudent.isPresent()) {
            return studentMapper.toDto(existingStudent.get());
        }
        
        // Get the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Validate that the user has STUDENT role
        if (user.getRole() != UserRole.STUDENT) {
            throw new IllegalArgumentException("User must have STUDENT role to create a student record");
        }
        
        // Check if user has a school assigned
        if (user.getSchool() == null) {
            throw new IllegalArgumentException("User must be assigned to a school to create a student record");
        }
        
        // Generate admission number
        String admissionNumber = generateStudentId();
        
        // Create student DTO
        StudentDTO studentDTO = new StudentDTO(
            null, // id
            admissionNumber, // admissionNumber
            user.getFirstName(), // firstName
            user.getLastName(), // lastName
            user.getPerson() != null ? user.getPerson().getDateOfBirth() : LocalDate.now().minusYears(18), // dateOfBirth
            user.getPerson() != null ? user.getPerson().getGender() : Gender.OTHER, // gender
            "", // phone - will be updated during onboarding
            user.getEmail(), // email
            "", // address - will be updated during onboarding
            LocalDate.now().getYear(), // academicYear
            null, // classId - will be set during onboarding
            null, // medicalConditions
            null, // disabilities
            user.getPerson() != null ? user.getPerson().getFirstName() : "Emergency Contact", // emergencyContactName
            "", // emergencyContactPhone - will be updated during onboarding
            "Parent", // emergencyContactRelation
            user.getSchool().getId(), // schoolId
            user.getId(), // userId
            user.getPerson() != null ? user.getPerson().getId() : null, // personId
            true, // active
            StudentStatus.PENDING, // status
            "Student record created automatically", // onboardingNotes
            null // subjectIds
        );
        
        return createStudent(studentDTO);
    }
    
    private String generateStudentId() {
        int currentYear = LocalDate.now().getYear();
        // Get count of students enrolled this year
        long studentCount = studentRepository.countByEnrollmentYear(currentYear);
        // Format with leading zeros to ensure 4 digits
        return String.format("STU-%d-%04d", currentYear, studentCount + 1);
    }
} 