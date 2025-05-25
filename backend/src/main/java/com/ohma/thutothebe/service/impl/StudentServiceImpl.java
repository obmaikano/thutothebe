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
        
        // Find Student entities that have User entities with these IDs
        return studentRepository.findByUser_IdIn(studentIds).stream()
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
        
        // Check for orphaned User IDs (in join table but no corresponding Student entity)
        List<Long> orphanedUserIds = joinTableStudentIds.stream()
            .filter(userId -> studentRepository.findByUser_Id(userId).isEmpty())
            .collect(Collectors.toList());
        debug.append("Orphaned User IDs (in join table but no Student entity): ").append(orphanedUserIds).append("\n");
        
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
        
        // Remove orphaned User IDs from the join table (Users that don't have corresponding Student entities)
        List<Long> orphanedUserIds = joinTableStudentIds.stream()
            .filter(userId -> studentRepository.findByUser_Id(userId).isEmpty())
            .collect(Collectors.toList());
        
        if (!orphanedUserIds.isEmpty()) {
            // Remove orphaned users from the class
            orphanedUserIds.forEach(userId -> {
                userRepository.findById(userId).ifPresent(user -> {
                    classEntity.getStudents().remove(user);
                });
            });
            classRepository.save(classEntity);
        }
        
        // Ensure all Student entities with this classId are also in the join table
        List<Student> studentsWithClassId = studentRepository.findByStudentClass_Id(classId);
        studentsWithClassId.forEach(student -> {
            if (student.getUser() != null && !joinTableStudentIds.contains(student.getUser().getId())) {
                // Add the user to the join table
                classEntity.getStudents().add(student.getUser());
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
        
        // Get assignments from student's courses
        if (student.getStudentClass() != null) {
            List<Course> studentCourses = courseRepository.findByClassEntityIdAndActive(student.getStudentClass().getId(), true);
            // For now, return empty list - this would need AssignmentRepository integration
            return List.of();
        }
        
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getStudentPerformanceAnalytics(Long studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        // Return basic performance data structure
        return new Object() {
            public final Long studentId = student.getId();
            public final String studentName = student.getFirstName() + " " + student.getLastName();
            public final String admissionNumber = student.getAdmissionNumber();
            public final boolean active = student.isActive();
        };
    }

    @Override
    @Transactional(readOnly = true)
    public Object getStudentDashboardData(Long studentId) {
        // TODO: Implement dashboard data aggregation
        // This should return comprehensive dashboard information including:
        // - Course count, class information, school information
        // - Recent assignments, grades, announcements
        // - Performance metrics, attendance, etc.
        
        // For now, return basic information
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("studentId", student.getId());
        dashboardData.put("studentName", student.getFirstName() + " " + student.getLastName());
        dashboardData.put("admissionNumber", student.getAdmissionNumber());
        dashboardData.put("className", student.getStudentClass() != null ? student.getStudentClass().getName() : null);
        dashboardData.put("schoolName", student.getSchool() != null ? student.getSchool().getName() : null);
        dashboardData.put("status", student.getStatus());
        dashboardData.put("active", student.isActive());
        
        // Add course count (placeholder)
        dashboardData.put("courseCount", 0);
        
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