package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.TeacherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TeacherServiceImpl extends BaseServiceImpl<Teacher, TeacherDTO, Long> implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final TeacherMapper teacherMapper;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public TeacherServiceImpl(
            TeacherRepository teacherRepository,
            CourseInstructorRepository courseInstructorRepository,
            TeacherMapper teacherMapper,
            SchoolRepository schoolRepository,
            UserRepository userRepository,
            RuleBasedAccessControlServiceImpl accessControlService) {
        super(teacherRepository);
        this.teacherRepository = teacherRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.teacherMapper = teacherMapper;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
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
    public List<TeacherDTO> getTeachersBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByTeacherIds(List<Long> teacherIds) {
        if (teacherIds == null || teacherIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByIdInAndActive(teacherIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByUserIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByUserIdInAndActive(userIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByTeacherIds(List<Long> teacherIds) {
        if (teacherIds == null || teacherIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByIdInAndActive(teacherIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByUserIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        return teacherRepository.findByUserIdInAndActive(userIds, true).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> userIds) {
        return teacherRepository.findByMultiScopeAccess(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                userIds == null || userIds.isEmpty() ? List.of(-1L) : userIds
        ).stream()
                .map(teacherMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachersByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> userIds) {
        return teacherRepository.findByMultiScopeAccessAndActive(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                userIds == null || userIds.isEmpty() ? List.of(-1L) : userIds,
                true
        ).stream()
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
} 