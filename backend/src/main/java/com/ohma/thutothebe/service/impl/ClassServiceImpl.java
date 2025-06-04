package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.mapper.ClassMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.service.ClassService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ClassServiceImpl extends BaseServiceImpl<Class, ClassDTO, Long> implements ClassService {

    private final ClassRepository classRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassMapper classMapper;

    @Autowired
    public ClassServiceImpl(ClassRepository classRepository, SchoolRepository schoolRepository, 
                          UserRepository userRepository, StudentRepository studentRepository, TeacherRepository teacherRepository, ClassMapper classMapper) {
        super(classRepository);
        this.classRepository = classRepository;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.classMapper = classMapper;
    }

    @Override
    protected Class mapToEntity(ClassDTO dto) {
        return classMapper.toEntity(dto);
    }

    @Override
    protected ClassDTO mapToDto(Class entity) {
        return classMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Class entity, ClassDTO dto) {
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setGradeLevel(dto.gradeLevel());
        entity.setCapacity(dto.capacity() != null ? dto.capacity() : 30);
        entity.setActive(dto.active());
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
    }

    // ==================== BASESERVICEIMPL ABSTRACT METHOD IMPLEMENTATIONS ====================

    @Override
    protected Long extractSchoolId(Class entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(Class entity) {
        return entity.getSchool() != null && entity.getSchool().getRegion() != null 
               ? entity.getSchool().getRegion().getId() : null;
    }

    @Override
    protected void validateBusinessRules(Class entity, boolean isUpdate) {
        // Validate class name uniqueness within school
        Long schoolId = extractSchoolId(entity);
        if (schoolId != null) {
            if (!isUpdate && classRepository.existsByNameAndSchoolId(entity.getName(), schoolId)) {
                throw new IllegalArgumentException("Class name '" + entity.getName() + "' already exists in this school");
            }
            
            // Validate class name uniqueness for specific grade level within school
            if (classRepository.existsByNameAndSchoolIdAndGradeLevel(
                    entity.getName(), schoolId, entity.getGradeLevel())) {
                throw new IllegalArgumentException("Class '" + entity.getName() + "' already exists for " + 
                                                 entity.getGradeLevel() + " in this school");
            }
        }
        
        // Validate capacity constraints
        if (entity.getCapacity() != null && entity.getCapacity() < 1) {
            throw new IllegalArgumentException("Class capacity must be at least 1");
        }
        
        // Validate enrollment constraints
        if (entity.getTotalEnrolled() != null && entity.getTotalEnrolled() < 0) {
            throw new IllegalArgumentException("Total enrolled cannot be negative");
        }
    }

    // ==================== SECURE GETALL OVERRIDE ====================

    @Override
    public List<ClassDTO> getAll() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to getAll classes");
            return Collections.emptyList();
        }
        return getClassesByAccessibleScopes(currentUserId);
    }

    // ==================== EXISTING METHODS WITH SECURITY UPDATES ====================

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolId(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClasses() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getActiveClassesByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClassesBySchoolId(Long schoolId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolIdAndTeacherId(Long schoolId, Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolIdAndStudentId(Long schoolId, Long studentId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesByStudentIdAndAccessibleScopes(studentId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByTeacherId(Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClassesByTeacherId(Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }

    @Override
    @Transactional
    public ClassDTO createClass(ClassDTO classDTO) {
        validateClassBusinessRules(classDTO, false, getCurrentUserId());
        return create(classDTO);
    }

    @Override
    @Transactional
    public ClassDTO updateClass(Long id, ClassDTO classDTO) {
        validateClassBusinessRules(classDTO, true, getCurrentUserId());
        return update(id, classDTO);
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        delete(id);
    }

    @Override
    @Transactional
    public void deactivateClass(Long id) {
        Class classEntity = classRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        classEntity.setActive(false);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void activateClass(Long id) {
        Class classEntity = classRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        classEntity.setActive(true);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void addTeacherToClass(Long classId, Long teacherId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        
        classEntity.getTeachers().add(teacher);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void removeTeacherFromClass(Long classId, Long teacherId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        
        classEntity.getTeachers().remove(teacher);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void addStudentToClass(Long classId, Long studentId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));
        
        // Check if student is already in the join table
        if (classEntity.getStudents().contains(student)) {
            throw new IllegalArgumentException("Student is already enrolled in this class via join table");
        }
        
        // Add to the join table (class_students)
        classEntity.getStudents().add(student);
        classRepository.save(classEntity);
        
        // Also update the Student entity's classId for consistency
        if (student.getStudentClass() != null && !student.getStudentClass().getId().equals(classId)) {
            throw new IllegalArgumentException("Student is already enrolled in another class (ID: " + student.getStudentClass().getId() + ")");
        }
        student.setStudentClass(classEntity);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void removeStudentFromClass(Long classId, Long studentId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));
        
        // Remove from the join table (class_students)
        classEntity.getStudents().remove(student);
        classRepository.save(classEntity);
        
        // Also update the Student entity's classId for consistency
        student.setStudentClass(null);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDTO getClassWithStudents(Long id) {
        Class classEntity = classRepository.findByIdWithStudents(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        return classMapper.toDto(classEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDTO getById(Long id) {
        Class classEntity = classRepository.findByIdWithTeachers(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        return classMapper.toDto(classEntity);
    }

    // ==================== MULTI-TENANT SECURITY METHODS ====================

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByMultiScopeAccess(accessibleSchoolIds, accessibleRegionIds);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClassesByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByMultiScopeAccessAndActive(accessibleSchoolIds, accessibleRegionIds, true);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving active classes by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolIdAndAccessibleScopes(Long schoolId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) {
                log.warn("User {} denied access to school {}", userId, schoolId);
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findBySchoolIdSecure(schoolId);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by school {} for user {}: {}", schoolId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByRegionIdAndAccessibleScopes(Long regionId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.REGION, regionId)) {
                log.warn("User {} denied access to region {}", userId, regionId);
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByRegionId(regionId);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by region {} for user {}: {}", regionId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByGradeLevelAndAccessibleScopes(GradeLevel gradeLevel, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByGradeLevelAndSchoolIdInAndActive(gradeLevel, accessibleSchoolIds, true);
            if (classes.isEmpty() && !accessibleRegionIds.isEmpty()) {
                classes = classRepository.findByGradeLevelAndRegionIdInAndActive(gradeLevel, accessibleRegionIds, true);
            }
            
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by grade level {} for user {}: {}", gradeLevel, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByTeacherIdAndAccessibleScopes(Long teacherId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds, true);
            if (classes.isEmpty() && !accessibleRegionIds.isEmpty()) {
                classes = classRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds, true);
            }
            
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by teacher {} for user {}: {}", teacherId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByStudentIdAndAccessibleScopes(Long studentId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByStudentIdAndSchoolIdInAndActive(studentId, accessibleSchoolIds, true);
            if (classes.isEmpty() && !accessibleRegionIds.isEmpty()) {
                classes = classRepository.findByStudentIdAndRegionIdInAndActive(studentId, accessibleRegionIds, true);
            }
            
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by student {} for user {}: {}", studentId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByMinCapacityAndAccessibleScopes(Integer minCapacity, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByMinCapacityAndSchoolIdInAndActive(minCapacity, accessibleSchoolIds, true);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by min capacity {} for user {}: {}", minCapacity, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getAvailableClassesByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findAvailableClassesBySchoolIdInAndActive(accessibleSchoolIds, true);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving available classes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByOverCapacityAndAccessibleScopes(Boolean overCapacity, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByOverCapacityAndSchoolIdInAndActive(overCapacity, accessibleSchoolIds, true);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by over capacity {} for user {}: {}", overCapacity, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> searchClassesByNameAndAccessibleScopes(String name, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Class> classes = classRepository.findByNameContainingAndSchoolIdInAndActive(name, accessibleSchoolIds, true);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching classes by name {} for user {}: {}", name, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds) {
        try {
            List<Class> classes = classRepository.findByMultiScopeAccess(schoolIds, regionIds);
            return classes.stream()
                    .map(classMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving classes by multi-scope access: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateClassAccess(Long classId, Long userId) {
        try {
            Class classEntity = classRepository.findById(classId).orElse(null);
            if (classEntity == null) {
                return false;
            }
            
            Long schoolId = extractSchoolId(classEntity);
            Long regionId = extractRegionId(classEntity);
            
            return (schoolId != null && accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) ||
                   (regionId != null && accessControlService.hasAccess(userId, AccessScope.REGION, regionId));
        } catch (Exception e) {
            log.error("Error validating class access for user {} and class {}: {}", userId, classId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndAccessibleScopes(String name, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            for (Long schoolId : accessibleSchoolIds) {
                if (classRepository.existsByNameAndSchoolId(name, schoolId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking class name existence for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndGradeLevelAndAccessibleScopes(String name, GradeLevel gradeLevel, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            for (Long schoolId : accessibleSchoolIds) {
                if (classRepository.existsByNameAndSchoolIdAndGradeLevel(name, schoolId, gradeLevel)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking class name and grade level existence for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    public void validateClassBusinessRules(ClassDTO classDTO, boolean isUpdate, Long userId) {
        if (userId == null) {
            throw new SecurityException("Authentication required for class operations");
        }
        
        // Validate user has access to the school
        if (classDTO.schoolId() != null) {
            if (!accessControlService.hasAccess(userId, AccessScope.SCHOOL, classDTO.schoolId())) {
                throw new SecurityException("Access denied: Cannot create/update class in school " + classDTO.schoolId());
            }
        }
        
        // Additional business rule validations can be added here
    }

    @Override
    @Transactional(readOnly = true)
    public Long getClassCountByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            Long schoolCount = accessibleSchoolIds.isEmpty() ? 0L : 
                classRepository.countBySchoolIdInAndActive(accessibleSchoolIds, true);
            Long regionCount = accessibleRegionIds.isEmpty() ? 0L : 
                classRepository.countByRegionIdInAndActive(accessibleRegionIds, true);
            
            return schoolCount + regionCount;
        } catch (Exception e) {
            log.error("Error getting class count for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalEnrollmentByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long totalEnrollment = classRepository.sumTotalEnrolledBySchoolIdInAndActive(accessibleSchoolIds, true);
            return totalEnrollment != null ? totalEnrollment : 0L;
        } catch (Exception e) {
            log.error("Error getting total enrollment for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalCapacityByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return 0L;
            }
            
            Long totalCapacity = classRepository.sumCapacityBySchoolIdInAndActive(accessibleSchoolIds, true);
            return totalCapacity != null ? totalCapacity : 0L;
        } catch (Exception e) {
            log.error("Error getting total capacity for user {}: {}", userId, e.getMessage());
            return 0L;
        }
    }
} 