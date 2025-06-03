package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.AssignmentNotFoundException;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.mapper.AssignmentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.AssignmentRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AssignmentServiceImpl extends BaseServiceImpl<Assignment, AssignmentDTO, Long> implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentMapper assignmentMapper;
    private final CourseService courseService;
    private final UserService userService;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final UserMapper userMapper;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public AssignmentServiceImpl(AssignmentRepository assignmentRepository, AssignmentMapper assignmentMapper,
                                 CourseService courseService, UserService userService, CourseRepository courseRepository,
                                 UserMapper userMapper, CourseMapper courseMapper,
                                 RuleBasedAccessControlServiceImpl accessControlService) {
        super(assignmentRepository);
        this.assignmentRepository = assignmentRepository;
        this.assignmentMapper = assignmentMapper;
        this.courseService = courseService;
        this.userService = userService;
        this.courseRepository = courseRepository;
        this.userMapper = userMapper;
        this.courseMapper = courseMapper;
        this.accessControlService = accessControlService;
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentDTO getById(Long id) {
        return assignmentRepository.findById(id)
            .map(assignmentMapper::toDto)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAll() {
        return assignmentRepository.findAll().stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    protected Assignment mapToEntity(AssignmentDTO dto) {
        return assignmentMapper.toEntity(dto);
    }

    @Override
    protected AssignmentDTO mapToDto(Assignment entity) {
        return assignmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Assignment entity, AssignmentDTO dto) {

    }

    @Override
    @Transactional
    public AssignmentDTO create(AssignmentDTO dto) {
        Assignment assignment = assignmentMapper.toEntity(dto);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public AssignmentDTO update(Long id, AssignmentDTO dto) {
        Assignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + id));
        assignment = assignmentMapper.toEntity(dto);
        assignment.setId(id);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new AssignmentNotFoundException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return assignmentRepository.findByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getByStatus(AssignmentStatus status) {
        return assignmentRepository.findByStatus(status).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActive() {
        return assignmentRepository.findByActive(true).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return assignmentRepository.findActiveByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    public AssignmentDTO getAssignmentByCode(String code) {
        Assignment assignment = assignmentRepository.findByCode(code)
            .orElseThrow(() -> AssignmentNotFoundException.withCode(code));
        return assignmentMapper.toDto(assignment);
    }

    public List<AssignmentDTO> getAssignmentsByCourse(Course course) {
        return assignmentRepository.findByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    public boolean existsByCode(String code) {
        return assignmentRepository.existsByCode(code);
    }

    protected RuntimeException notFoundException(Long id) {
        return AssignmentNotFoundException.withId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherIdAndActive(teacherId, true).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructorId(instructorId).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructorIdAndActive(instructorId, true).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AssignmentDTO publishAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + assignmentId));
        
        assignment.setStatus(AssignmentStatus.PUBLISHED);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public AssignmentDTO closeAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + assignmentId));
        
        assignment.setStatus(AssignmentStatus.CLOSED);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public AssignmentDTO archiveAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + assignmentId));
        
        assignment.setStatus(AssignmentStatus.ARCHIVED);
        assignment.setActive(false);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public void updateAssignmentStatistics(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + assignmentId));
        
        // In a real implementation, you would calculate and update submission and graded counts
        // For now, this is a placeholder method
        assignmentRepository.save(assignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByStatus(String status) {
        AssignmentStatus assignmentStatus = AssignmentStatus.valueOf(status.toUpperCase());
        return assignmentRepository.findByStatus(assignmentStatus).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByCourseAndStatus(Long courseId, String status) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        AssignmentStatus assignmentStatus = AssignmentStatus.valueOf(status.toUpperCase());
        return assignmentRepository.findByCourseAndStatus(course, assignmentStatus).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByAccessibleScopes(Long currentUserId) {
        try {
            // Get accessible scope IDs from access control service
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            // Check if user has global access
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // Global access - return all active assignments
                return assignmentRepository.findByActive(true).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            // Use multi-scope access query for database-level filtering
            return assignmentRepository.findByMultiScopeAccess(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds
            ).stream()
                    .map(assignmentMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting assignments by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of(); // Return empty list on error for security
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return assignmentRepository.findByActive(true).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return assignmentRepository.findByMultiScopeAccessAndActive(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds,
                    true
            ).stream()
                    .map(assignmentMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting active assignments by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsBySchoolId(Long schoolId) {
        return assignmentRepository.findBySchoolIdAndActive(schoolId, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByRegionId(Long regionId) {
        return assignmentRepository.findByRegionIdAndActive(regionId, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsBySchoolId(Long schoolId) {
        return assignmentRepository.findActiveAssignmentsBySchoolId(schoolId).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByRegionId(Long regionId) {
        return assignmentRepository.findActiveAssignmentsByRegionId(regionId).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByAssignmentIds(List<Long> assignmentIds) {
        if (assignmentIds == null || assignmentIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByIdInAndActive(assignmentIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByInstructorIds(List<Long> instructorIds) {
        if (instructorIds == null || instructorIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByInstructorIdInAndActive(instructorIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByAssignmentIds(List<Long> assignmentIds) {
        if (assignmentIds == null || assignmentIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByIdInAndActive(assignmentIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByInstructorIds(List<Long> instructorIds) {
        if (instructorIds == null || instructorIds.isEmpty()) {
            return List.of();
        }
        return assignmentRepository.findByInstructorIdInAndActive(instructorIds, true).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds) {
        return assignmentRepository.findByMultiScopeAccess(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                instructorIds == null || instructorIds.isEmpty() ? List.of(-1L) : instructorIds
        ).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveAssignmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds) {
        return assignmentRepository.findByMultiScopeAccessAndActive(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                instructorIds == null || instructorIds.isEmpty() ? List.of(-1L) : instructorIds,
                true
        ).stream()
                .map(assignmentMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return assignmentRepository.findByCourseIdAndSchoolIdInAndActive(courseId, accessibleSchoolIds, true).stream()
                    .map(assignmentMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting assignments by course and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByClassIdAndAccessibleScopes(Long classId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return assignmentRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds).stream()
                    .map(assignmentMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting assignments by class and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // For global access, get all assignments for the subject (would need a repository method)
                return assignmentRepository.findAll().stream() // This is a placeholder - would need proper subject filtering
                        .filter(Assignment::isActive)
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return assignmentRepository.findBySubjectIdAndSchoolIdInAndActive(subjectId, accessibleSchoolIds).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return assignmentRepository.findBySubjectIdAndRegionIdInAndActive(subjectId, accessibleRegionIds).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting assignments by subject and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return assignmentRepository.findByTeacherIdAndActive(teacherId, true).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return assignmentRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return assignmentRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting assignments by teacher and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByStatusAndAccessibleScopes(AssignmentStatus status, Long currentUserId) {
        try {
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return assignmentRepository.findByStatus(status).stream()
                        .map(assignmentMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return assignmentRepository.findByMultiScopeAccessAndStatus(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds,
                    status
            ).stream()
                    .map(assignmentMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting assignments by status and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsByStatusAndAccessibleScopes(String status, Long currentUserId) {
        try {
            AssignmentStatus assignmentStatus = AssignmentStatus.valueOf(status.toUpperCase());
            return getAssignmentsByStatusAndAccessibleScopes(assignmentStatus, currentUserId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid assignment status: {}", status);
            return List.of();
        }
    }
} 