package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.entity.Department;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DepartmentMapper;
import com.ohma.thutothebe.repository.DepartmentRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Collections;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DepartmentServiceImpl extends BaseServiceImpl<Department, DepartmentDTO, Long> implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            DepartmentMapper departmentMapper,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository) {
        super(departmentRepository);
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    protected Department mapToEntity(DepartmentDTO dto) {
        return departmentMapper.toEntity(dto);
    }

    @Override
    protected DepartmentDTO mapToDto(Department entity) {
        return departmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Department entity, DepartmentDTO dto) {
        departmentMapper.updateEntityFromDto(entity, dto);
    }

    // ==================== BASESERVICEIMPL ABSTRACT METHOD IMPLEMENTATIONS ====================

    @Override
    protected Long extractSchoolId(Department entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(Department entity) {
        return entity.getSchool() != null && entity.getSchool().getRegion() != null 
               ? entity.getSchool().getRegion().getId() : null;
    }

    @Override
    protected void validateBusinessRules(Department entity, boolean isUpdate) {
        // Validate department name uniqueness within school
        Long schoolId = extractSchoolId(entity);
        if (schoolId != null) {
            if (!isUpdate && departmentRepository.existsByNameAndSchoolIdSecure(entity.getName(), schoolId)) {
                throw new IllegalArgumentException("Department name '" + entity.getName() + "' already exists in this school");
            }
        }
        
        // Validate department head role constraints
        if (entity.getDepartmentHead() != null) {
            Teacher departmentHead = entity.getDepartmentHead();
            if (departmentHead.getUser() != null) {
                UserRole role = departmentHead.getUser().getRole();
                if (role != UserRole.DEPARTMENT_HEAD && role != UserRole.TEACHER && role != UserRole.SENIOR_TEACHER) {
                    throw new IllegalArgumentException("Department head must have DEPARTMENT_HEAD, SENIOR_TEACHER, or TEACHER role");
                }
            }
        }
        
        // Validate cross-tenant references for subjects and teachers
        if (entity.getSubjects() != null) {
            for (Subject subject : entity.getSubjects()) {
                if (subject.getDepartment() != null && subject.getDepartment().getSchool() != null && 
                    !subject.getDepartment().getSchool().getId().equals(schoolId)) {
                    throw new IllegalArgumentException("Subject '" + subject.getName() + "' belongs to a different school");
                }
            }
        }
        
        if (entity.getTeachers() != null) {
            for (Teacher teacher : entity.getTeachers()) {
                if (teacher.getSchool() != null && !teacher.getSchool().getId().equals(schoolId)) {
                    throw new IllegalArgumentException("Teacher '" + teacher.getUser().getFirstName() + " " + 
                                                     teacher.getUser().getLastName() + "' belongs to a different school");
                }
            }
        }
    }

    // ==================== SECURE GETALL OVERRIDE ====================

    @Override
    public List<DepartmentDTO> getAll() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to getAll departments");
            return Collections.emptyList();
        }
        return getDepartmentsByAccessibleScopes(currentUserId);
    }

    // ==================== EXISTING METHODS WITH SECURITY UPDATES ====================

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsBySchoolId(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getDepartmentsBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartmentsBySchoolId(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getActiveDepartmentsByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartments() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getActiveDepartmentsByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentByNameAndSchoolId(String name, Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null || !accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, schoolId)) {
            throw new SecurityException("Access denied to school " + schoolId);
        }
        
        log.info("Retrieving department by name '{}' and school ID: {}", name, schoolId);
        return departmentRepository.findByNameAndSchoolId(name, schoolId)
                .map(departmentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with name '" + name + "' in school " + schoolId));
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentByDepartmentHeadId(Long departmentHeadId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Authentication required");
        }
        return getDepartmentByDepartmentHeadIdAndAccessibleScopes(departmentHeadId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByTeacherId(Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getDepartmentsByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentBySubjectId(Long subjectId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Authentication required");
        }
        return getDepartmentBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithoutHead(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getDepartmentsWithoutHeadByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithSubjects(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getDepartmentsWithSubjectsByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional
    public DepartmentDTO create(DepartmentDTO dto) {
        validateDepartmentBusinessRules(dto, false, getCurrentUserId());
        return super.create(dto);
    }

    @Override
    @Transactional
    public DepartmentDTO update(Long id, DepartmentDTO dto) {
        validateDepartmentBusinessRules(dto, true, getCurrentUserId());
        return super.update(id, dto);
    }

    // ==================== MULTI-TENANT SECURITY METHODS ====================

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findByMultiScopeAccess(accessibleSchoolIds, accessibleRegionIds);
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartmentsByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findByMultiScopeAccessAndActive(accessibleSchoolIds, accessibleRegionIds, true);
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving active departments by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsBySchoolIdAndAccessibleScopes(Long schoolId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) {
                log.warn("User {} denied access to school {}", userId, schoolId);
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findBySchoolIdSecure(schoolId);
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments by school {} for user {}: {}", schoolId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByRegionIdAndAccessibleScopes(Long regionId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.REGION, regionId)) {
                log.warn("User {} denied access to region {}", userId, regionId);
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findByRegionId(regionId);
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments by region {} for user {}: {}", regionId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentByDepartmentHeadIdAndAccessibleScopes(Long departmentHeadId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                throw new ResourceNotFoundException("No accessible departments found");
            }
            
            Optional<Department> department = departmentRepository.findByDepartmentHeadIdAndSchoolIdIn(departmentHeadId, accessibleSchoolIds);
            if (department.isEmpty() && !accessibleRegionIds.isEmpty()) {
                department = departmentRepository.findByDepartmentHeadIdAndRegionIdIn(departmentHeadId, accessibleRegionIds);
            }
            
            return department.map(departmentMapper::toDto)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with department head ID: " + departmentHeadId));
        } catch (Exception e) {
            log.error("Error retrieving department by department head {} for user {}: {}", departmentHeadId, userId, e.getMessage());
            throw new ResourceNotFoundException("Department not found with department head ID: " + departmentHeadId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByTeacherIdAndAccessibleScopes(Long teacherId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds, true);
            if (departments.isEmpty() && !accessibleRegionIds.isEmpty()) {
                departments = departmentRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds, true);
            }
            
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments by teacher {} for user {}: {}", teacherId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentBySubjectIdAndAccessibleScopes(Long subjectId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                throw new ResourceNotFoundException("No accessible departments found");
            }
            
            Optional<Department> department = departmentRepository.findBySubjectIdAndSchoolIdInAndActive(subjectId, accessibleSchoolIds, true);
            if (department.isEmpty() && !accessibleRegionIds.isEmpty()) {
                department = departmentRepository.findBySubjectIdAndRegionIdInAndActive(subjectId, accessibleRegionIds, true);
            }
            
            return department.map(departmentMapper::toDto)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with subject ID: " + subjectId));
        } catch (Exception e) {
            log.error("Error retrieving department by subject {} for user {}: {}", subjectId, userId, e.getMessage());
            throw new ResourceNotFoundException("Department not found with subject ID: " + subjectId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> searchDepartmentsByNameAndAccessibleScopes(String name, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findByNameContainingAndSchoolIdInAndActive(name, accessibleSchoolIds, true);
            if (departments.isEmpty() && !accessibleRegionIds.isEmpty()) {
                departments = departmentRepository.findByNameContainingAndRegionIdInAndActive(name, accessibleRegionIds, true);
            }
            
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching departments by name {} for user {}: {}", name, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithoutHeadByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findDepartmentsWithoutHeadBySchoolIdInAndActive(accessibleSchoolIds, true);
            if (departments.isEmpty() && !accessibleRegionIds.isEmpty()) {
                departments = departmentRepository.findDepartmentsWithoutHeadByRegionIdInAndActive(accessibleRegionIds, true);
            }
            
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments without head for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithSubjectsByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Department> departments = departmentRepository.findDepartmentsWithSubjectsBySchoolIdInAndActive(accessibleSchoolIds, true);
            if (departments.isEmpty() && !accessibleRegionIds.isEmpty()) {
                departments = departmentRepository.findDepartmentsWithSubjectsByRegionIdInAndActive(accessibleRegionIds, true);
            }
            
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments with subjects for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds) {
        try {
            List<Department> departments = departmentRepository.findByMultiScopeAccess(schoolIds, regionIds);
            return departments.stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving departments by multi-scope access: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateDepartmentAccess(Long departmentId, Long userId) {
        try {
            Department department = departmentRepository.findById(departmentId).orElse(null);
            if (department == null) {
                return false;
            }
            
            Long schoolId = extractSchoolId(department);
            Long regionId = extractRegionId(department);
            
            return (schoolId != null && accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) ||
                   (regionId != null && accessControlService.hasAccess(userId, AccessScope.REGION, regionId));
        } catch (Exception e) {
            log.error("Error validating department access for user {} and department {}: {}", userId, departmentId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndAccessibleScopes(String name, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            for (Long schoolId : accessibleSchoolIds) {
                if (departmentRepository.existsByNameAndSchoolIdSecure(name, schoolId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking department name existence for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByDepartmentHeadIdAndAccessibleScopes(Long departmentHeadId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            return departmentRepository.existsByDepartmentHeadIdAndSchoolIdIn(departmentHeadId, accessibleSchoolIds);
        } catch (Exception e) {
            log.error("Error checking department head existence for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTeacherIdAndAccessibleScopes(Long teacherId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            return departmentRepository.existsByTeacherIdAndSchoolIdIn(teacherId, accessibleSchoolIds);
        } catch (Exception e) {
            log.error("Error checking teacher existence in departments for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySubjectIdAndAccessibleScopes(Long subjectId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            return departmentRepository.existsBySubjectIdAndSchoolIdIn(subjectId, accessibleSchoolIds);
        } catch (Exception e) {
            log.error("Error checking subject existence in departments for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    public void validateDepartmentBusinessRules(DepartmentDTO departmentDTO, boolean isUpdate, Long userId) {
        if (userId == null) {
            throw new SecurityException("Authentication required for department operations");
        }
        
        // Validate user has access to the school
        if (departmentDTO.schoolId() != null) {
            if (!accessControlService.hasAccess(userId, AccessScope.SCHOOL, departmentDTO.schoolId())) {
                throw new SecurityException("Access denied: Cannot create/update department in school " + departmentDTO.schoolId());
            }
        }
        
        // Additional business rule validations can be added here
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDepartmentCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            Long schoolCount = accessibleSchoolIds.isEmpty() ? 0L : 
                departmentRepository.countBySchoolIdInAndActive(accessibleSchoolIds, true);
            Long regionCount = accessibleRegionIds.isEmpty() ? 0L : 
                departmentRepository.countByRegionIdInAndActive(accessibleRegionIds, true);
            
            return schoolCount + regionCount;
        } catch (Exception e) {
            log.error("Error getting department count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDepartmentsWithHeadCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long count = departmentRepository.countDepartmentsWithHeadBySchoolIdInAndActive(accessibleSchoolIds, true);
            return count != null ? count : 0L;
        } catch (Exception e) {
            log.error("Error getting departments with head count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDepartmentsWithoutHeadCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long count = departmentRepository.countDepartmentsWithoutHeadBySchoolIdInAndActive(accessibleSchoolIds, true);
            return count != null ? count : 0L;
        } catch (Exception e) {
            log.error("Error getting departments without head count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDepartmentsWithSubjectsCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long count = departmentRepository.countDepartmentsWithSubjectsBySchoolIdInAndActive(accessibleSchoolIds, true);
            return count != null ? count : 0L;
        } catch (Exception e) {
            log.error("Error getting departments with subjects count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDepartmentsWithTeachersCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long count = departmentRepository.countDepartmentsWithTeachersBySchoolIdInAndActive(accessibleSchoolIds, true);
            return count != null ? count : 0L;
        } catch (Exception e) {
            log.error("Error getting departments with teachers count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    // ==================== EXISTING METHODS CONTINUED ====================

    @Override
    @Transactional
    public DepartmentDTO assignDepartmentHead(Long departmentId, Long teacherId) {
        log.info("Assigning department head {} to department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Validate that teacher belongs to the same school as department
        if (!teacher.getSchool().getId().equals(department.getSchool().getId())) {
            throw new IllegalArgumentException("Teacher must belong to the same school as the department");
        }
        
        // Check if teacher is already a department head elsewhere
        if (departmentRepository.existsByDepartmentHeadId(teacherId)) {
            throw new IllegalArgumentException("Teacher is already a department head of another department");
        }
        
        // Promote teacher to DEPARTMENT_HEAD role if they're not already
        if (teacher.getUser().getRole() == UserRole.TEACHER) {
            teacher.getUser().setRole(UserRole.DEPARTMENT_HEAD);
        }
        
        department.setDepartmentHead(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned department head {} to department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeDepartmentHead(Long departmentId) {
        log.info("Removing department head from department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        if (department.getDepartmentHead() == null) {
            throw new IllegalArgumentException("Department does not have a department head to remove");
        }
        
        Teacher formerHead = department.getDepartmentHead();
        
        // Demote former head back to TEACHER role if they're not head of another department
        if (!departmentRepository.existsByDepartmentHeadId(formerHead.getId())) {
            formerHead.getUser().setRole(UserRole.TEACHER);
        }
        
        department.setDepartmentHead(null);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed department head from department {}", departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO assignTeacherToDepartment(Long departmentId, Long teacherId) {
        log.info("Assigning teacher {} to department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Validate that teacher belongs to the same school as department
        if (!teacher.getSchool().getId().equals(department.getSchool().getId())) {
            throw new IllegalArgumentException("Teacher must belong to the same school as the department");
        }
        
        department.addTeacher(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned teacher {} to department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeTeacherFromDepartment(Long departmentId, Long teacherId) {
        log.info("Removing teacher {} from department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Check if teacher is the department head
        if (department.getDepartmentHead() != null && department.getDepartmentHead().getId().equals(teacherId)) {
            throw new IllegalArgumentException("Cannot remove department head. Remove department head first.");
        }
        
        department.removeTeacher(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed teacher {} from department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO assignSubjectToDepartment(Long departmentId, Long subjectId) {
        log.info("Assigning subject {} to department {}", subjectId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        // Validate that subject belongs to the same school as department
        if (subject.getDepartment() != null && subject.getDepartment().getSchool() != null && 
            !subject.getDepartment().getSchool().getId().equals(department.getSchool().getId())) {
            throw new IllegalArgumentException("Subject must belong to the same school as the department");
        }
        
        // Check if subject is already assigned to another department
        if (subject.getDepartment() != null && !subject.getDepartment().getId().equals(departmentId)) {
            throw new IllegalArgumentException("Subject is already assigned to another department");
        }
        
        department.addSubject(subject);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned subject {} to department {}", subjectId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeSubjectFromDepartment(Long departmentId, Long subjectId) {
        log.info("Removing subject {} from department {}", subjectId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        department.removeSubject(subject);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed subject {} from department {}", subjectId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public void activateDepartment(Long departmentId) {
        log.info("Activating department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        department.setActive(true);
        departmentRepository.save(department);
        
        log.info("Successfully activated department {}", departmentId);
    }

    @Override
    @Transactional
    public void deactivateDepartment(Long departmentId) {
        log.info("Deactivating department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        department.setActive(false);
        departmentRepository.save(department);
        
        log.info("Successfully deactivated department {}", departmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActiveDepartmentsBySchoolId(Long schoolId) {
        log.info("Counting active departments for school ID: {}", schoolId);
        return departmentRepository.countBySchoolIdAndActiveTrue(schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndSchoolId(String name, Long schoolId) {
        return departmentRepository.existsByNameAndSchoolId(name, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByDepartmentHeadId(Long departmentHeadId) {
        return departmentRepository.existsByDepartmentHeadId(departmentHeadId);
    }
} 