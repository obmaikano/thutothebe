package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.enums.StudentStatus;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.exception.UserNotFoundException;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.StudentService;
import com.ohma.thutothebe.service.TeacherService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl extends BaseServiceImpl<User, UserDTO, Long> implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final TeacherService teacherService;
    private final StudentService studentService;

    public UserServiceImpl(
            UserRepository userRepository, 
            UserMapper userMapper, 
            PasswordEncoder passwordEncoder,
            TeacherRepository teacherRepository,
            StudentRepository studentRepository,
            SchoolRepository schoolRepository,
            TeacherService teacherService,
            StudentService studentService) {
        super(userRepository);
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.schoolRepository = schoolRepository;
        this.teacherService = teacherService;
        this.studentService = studentService;
    }

    @Override
    protected User mapToEntity(UserDTO dto) {
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return user;
    }

    @Override
    protected UserDTO mapToDto(User entity) {
        return userMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(User entity, UserDTO dto) {
        userMapper.updateEntityFromDto(entity, dto);
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
    }

    @Override
    @Transactional
    public UserDTO create(UserDTO dto) {
        // Validate person information based on role and age
        validatePersonInformation(dto);

        User user = mapToEntity(dto);
        beforeCreate(user);
        User savedUser = userRepository.save(user);
        UserDTO userDTO = mapToDto(savedUser);
        
        // Handle role-specific entity creation/linking
        if (dto.getRole() == UserRole.TEACHER) {
            handleTeacherRoleForUser(savedUser);
        } else if (dto.getRole() == UserRole.STUDENT) {
            handleStudentRoleForUser(savedUser);
        }
        
        return userDTO;
    }

    private void validatePersonInformation(UserDTO dto) {
        // Calculate age
        int age = Period.between(dto.getDateOfBirth(), LocalDate.now()).getYears();

        // Validate based on role and age
        switch (dto.getRole()) {
            case STUDENT:
                break;
            case TEACHER:
            case SCHOOL_ADMIN:
            case SUPER_ADMIN:
                if (age < 18) {
                    throw new IllegalArgumentException("Teachers and administrators must be 18 years or older");
                }
                if (dto.getIdentityNumber() == null || dto.getIdentityNumber().trim().isEmpty()) {
                    throw new IllegalArgumentException("Identity number is required for teachers and administrators");
                }
                if (dto.getRole() == UserRole.TEACHER && (dto.getQualification() == null || dto.getQualification().trim().isEmpty())) {
                    throw new IllegalArgumentException("Qualification is required for teachers");
                }
                break;

            case PARENT:
                if (age < 18) {
                    throw new IllegalArgumentException("Parents must be 18 years or older");
                }
                if (dto.getIdentityNumber() == null || dto.getIdentityNumber().trim().isEmpty()) {
                    throw new IllegalArgumentException("Identity number is required for parents");
                }
                break;
        }
    }

    private void handleTeacherRoleForUser(User user) {
        try {
            // Try to find an existing unlinked teacher with the same email
            Optional<Teacher> existingTeacher = teacherRepository.findByEmail(user.getEmail());

            if (existingTeacher.isPresent()) {
                // Link the existing teacher to the user
                Teacher teacher = existingTeacher.get();
                teacher.setUser(user);
                teacherRepository.save(teacher);
            } else {
                // Validate school ID is present
                if (user.getSchool() == null) {
                    throw new IllegalStateException("School must be specified to create a Teacher entity.");
                }

                // Create a new teacher entity
                TeacherDTO teacherDTO = new TeacherDTO(
                        null,
                        generateStaffId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getQualification(),
                        user.getSchool().getId(),
                        user.getId(),
                        true
                );
                teacherService.createTeacher(teacherDTO);
            }
        } catch (Exception e) {
            log.error("Failed to handle teacher role for user ID {}: {}", user.getId(), e.getMessage(), e);
            throw new IllegalStateException("Failed to create teacher entity: " + e.getMessage(), e);
        }
    }

    private void handleStudentRoleForUser(User user) {
        try {
            if (user.getSchool() == null) {
                throw new IllegalStateException("School must be specified to create a Student entity.");
            }

            // Create a new student entity
            StudentDTO studentDTO = new StudentDTO(
                null, // id
                generateStudentId(), // admissionNumber
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
                null, // onboardingNotes
                null // subjectIds
            );
            studentService.createStudent(studentDTO);
        } catch (Exception e) {
            log.error("Failed to handle student role for user ID {}: {}", user.getId(), e.getMessage(), e);
            throw new IllegalStateException("Failed to create student entity: " + e.getMessage(), e);
        }
    }

    private String generateStaffId() {
        return "STF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String generateStudentId() {
        int currentYear = LocalDate.now().getYear();
        // Get count of students enrolled this year
        long studentCount = studentRepository.countByEnrollmentYear(currentYear);
        // Format with leading zeros to ensure 4 digits
        return String.format("STU-%d-%04d", currentYear, studentCount + 1);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> UserNotFoundException.withEmail(email));
        return mapToDto(user);
    }

    @Override
    public List<UserDTO> getAllTeachers() {
        return userRepository.findByRole(UserRole.TEACHER).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getAllStudents() {
        return userRepository.findByRole(UserRole.STUDENT).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
} 