package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.dto.TeacherOnboardingDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.TeacherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TeacherServiceImpl extends BaseServiceImpl<Teacher, TeacherDTO, Long> implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final TeacherMapper teacherMapper;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public TeacherServiceImpl(
            TeacherRepository teacherRepository,
            CourseInstructorRepository courseInstructorRepository,
            TeacherMapper teacherMapper,
            SchoolRepository schoolRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RuleBasedAccessControlServiceImpl accessControlService) {
        super(teacherRepository);
        this.teacherRepository = teacherRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.teacherMapper = teacherMapper;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.accessControlService = accessControlService;
    }

    @Override
    protected Teacher mapToEntity(TeacherDTO dto) {
        return teacherMapper.toEntity(dto);
    }

    @Override
    protected TeacherDTO mapToDto(Teacher entity) {
        return teacherMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Teacher entity, TeacherDTO dto) {
        entity.setStaffId(dto.staffId());
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setEmail(dto.email());
        entity.setQualification(dto.qualification());
        entity.setActive(dto.active());
        
        if (dto.schoolId() != null && (entity.getSchool() == null || !entity.getSchool().getId().equals(dto.schoolId()))) {
            schoolRepository.findById(dto.schoolId())
                .ifPresent(entity::setSchool);
        }
        
        if (dto.userId() != null && (entity.getUser() == null || !entity.getUser().getId().equals(dto.userId()))) {
            userRepository.findById(dto.userId())
                .ifPresent(entity::setUser);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByStaffId(String staffId) {
        return teacherRepository.findByStaffId(staffId)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with staff ID: " + staffId));
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByEmail(String email) {
        return teacherRepository.findByEmail(email)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachers() {
        return teacherRepository.findByActive(true).stream()
            .map(teacherMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        if (teacherRepository.existsByStaffId(teacherDTO.staffId())) {
            throw new IllegalArgumentException("Teacher with staff ID " + teacherDTO.staffId() + " already exists");
        }
        
        if (teacherRepository.existsByEmail(teacherDTO.email())) {
            throw new IllegalArgumentException("Teacher with email " + teacherDTO.email() + " already exists");
        }
        
        return create(teacherDTO);
    }

    @Override
    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO) {
        var existingTeacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        
        // Check if the staff ID exists but belongs to a different teacher
        if (!existingTeacher.getStaffId().equals(teacherDTO.staffId()) && 
            teacherRepository.existsByStaffId(teacherDTO.staffId())) {
            throw new IllegalArgumentException("Teacher with staff ID " + teacherDTO.staffId() + " already exists");
        }
        
        // Check if the email exists but belongs to a different teacher
        if (!existingTeacher.getEmail().equals(teacherDTO.email()) && 
            teacherRepository.existsByEmail(teacherDTO.email())) {
            throw new IllegalArgumentException("Teacher with email " + teacherDTO.email() + " already exists");
        }
        
        return update(id, teacherDTO);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void activateTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(true);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional
    public void deactivateTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(false);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByStaffId(String staffId) {
        return teacherRepository.existsByStaffId(staffId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByCourseId(Long courseId) {
        return courseInstructorRepository.findByCourseId(courseId).stream()
            .map(ci -> teacherMapper.toDto(ci.getTeacher()))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByUserId(Long userId) {
        return teacherRepository.findByUser_Id(userId)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with user ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersBySchoolId(Long schoolId) {
        return teacherRepository.findBySchool_Id(schoolId).stream()
            .map(teacherMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherDTO linkToUser(Long teacherId, Long userId) {
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        teacher.setUser(user);
        Teacher savedTeacher = teacherRepository.save(teacher);
        
        return teacherMapper.toDto(savedTeacher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByClassId(Long classId) {
        return teacherRepository.findByClassId(classId).stream()
            .map(teacherMapper::toDto)
            .collect(Collectors.toList());
    }

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByAccessibleScopes(Long currentUserId) {
        try {
            // Get accessible scope IDs from access control service
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            // Check if user has global access
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // Global access - return all active teachers
                return teacherRepository.findByActive(true).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            // Use multi-scope access query for database-level filtering
            return teacherRepository.findByMultiScopeAccess(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleUserIds.isEmpty() ? List.of(-1L) : accessibleUserIds
            ).stream()
                    .map(teacherMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting teachers by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of(); // Return empty list on error for security
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return teacherRepository.findByActive(true).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return teacherRepository.findByMultiScopeAccessAndActive(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleUserIds.isEmpty() ? List.of(-1L) : accessibleUserIds,
                    true
            ).stream()
                    .map(teacherMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting active teachers by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersBySchoolIdSecure(Long schoolId) {
        return teacherRepository.findBySchoolIdAndActive(schoolId, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByRegionId(Long regionId) {
        return teacherRepository.findByRegionIdAndActive(regionId, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersBySchoolId(Long schoolId) {
        return teacherRepository.findActiveTeachersBySchoolId(schoolId).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByRegionId(Long regionId) {
        return teacherRepository.findActiveTeachersByRegionId(regionId).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return teacherRepository.findByCourseIdAndSchoolIdInAndActive(courseId, accessibleSchoolIds).stream()
                    .map(teacherMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting teachers by course and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByClassIdAndAccessibleScopes(Long classId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return teacherRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds).stream()
                    .map(teacherMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting teachers by class and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // For global access, get all teachers for the subject (would need a repository method)
                return teacherRepository.findByCourseId(subjectId).stream() // This is a placeholder - would need proper subject filtering
                        .filter(Teacher::isActive)
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return teacherRepository.findBySubjectIdAndSchoolIdInAndActive(subjectId, accessibleSchoolIds).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return teacherRepository.findBySubjectIdAndRegionIdInAndActive(subjectId, accessibleRegionIds).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting teachers by subject and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByDepartmentId(Long departmentId) {
        // TODO: Implement department filtering in repository
        return List.of();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByDepartmentIdAndAccessibleScopes(Long departmentId, Long currentUserId) {
        // TODO: Implement department and school filtering in repository
        return List.of();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersBySchoolIdAndAccessibleScopes(Long schoolId, Long currentUserId) {
        try {
            boolean hasSchoolAccess = accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, schoolId);
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess || hasSchoolAccess) {
                return teacherRepository.findBySchool_Id(schoolId).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting teachers by school and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByRegionIdAndAccessibleScopes(Long regionId, Long currentUserId) {
        try {
            boolean hasRegionAccess = accessControlService.hasAccess(currentUserId, AccessScope.REGION, regionId);
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess || hasRegionAccess) {
                return teacherRepository.findActiveTeachersByRegionId(regionId).stream()
                        .map(teacherMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting teachers by region and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }

    @Override
    protected Long extractSchoolId(Teacher entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Teacher entity) {
        return entity.getSchool() != null && entity.getSchool().getRegion() != null ? 
            entity.getSchool().getRegion().getId() : null;
    }

    @Override
    @Transactional
    public TeacherDTO onboardTeacher(TeacherOnboardingDTO onboardingDTO) {
        log.info("Starting teacher onboarding for email: {}", onboardingDTO.email());
        
        // Validate that teacher doesn't already exist
        if (teacherRepository.existsByStaffId(onboardingDTO.staffId())) {
            throw new IllegalArgumentException("Teacher with staff ID " + onboardingDTO.staffId() + " already exists");
        }
        
        if (teacherRepository.existsByEmail(onboardingDTO.email())) {
            throw new IllegalArgumentException("Teacher with email " + onboardingDTO.email() + " already exists");
        }
        
        if (userRepository.existsByEmail(onboardingDTO.email())) {
            throw new IllegalArgumentException("User with email " + onboardingDTO.email() + " already exists");
        }
        
        // Username uniqueness check (not supported by repository, skipping for now)
        // if (userRepository.existsByUsername(onboardingDTO.username())) {
        //     throw new IllegalArgumentException("User with username " + onboardingDTO.username() + " already exists");
        // }
        
        // Validate school exists
        School school = schoolRepository.findById(onboardingDTO.schoolId())
            .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + onboardingDTO.schoolId()));
        
        // Create Person entity first
        Person person = new Person();
        person.setFirstName(onboardingDTO.firstName());
        person.setSurname(onboardingDTO.lastName());
        person.setIdentityNumber(onboardingDTO.identityNumber());
        person.setNationality(onboardingDTO.nationality());
        person.setGender(onboardingDTO.gender());
        person.setDateOfBirth(onboardingDTO.dateOfBirth());
        
        // Create user account
        User user = new User();
        user.setUsername(onboardingDTO.username());
        user.setEmail(onboardingDTO.email());
        user.setPassword(passwordEncoder.encode(onboardingDTO.password()));
        user.setFirstName(onboardingDTO.firstName());
        user.setLastName(onboardingDTO.lastName());
        user.setRole(UserRole.TEACHER);
        user.setActive(onboardingDTO.active());
        user.setSchool(school);
        user.setQualification(onboardingDTO.qualification());
        user.setPerson(person);
        
        User savedUser = userRepository.save(user);
        
        // Create teacher profile
        TeacherDTO teacherDTO = new TeacherDTO(
            null, // id
            onboardingDTO.staffId(),
            onboardingDTO.firstName(),
            onboardingDTO.lastName(),
            onboardingDTO.email(),
            onboardingDTO.qualification(),
            onboardingDTO.schoolId(),
            savedUser.getId(),
            onboardingDTO.active()
        );
        
        TeacherDTO createdTeacher = createTeacher(teacherDTO);
        
        log.info("Teacher onboarding completed successfully for email: {}", onboardingDTO.email());
        return createdTeacher;
    }
} 