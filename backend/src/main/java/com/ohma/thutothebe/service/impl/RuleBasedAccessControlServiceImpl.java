package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Department;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.DepartmentRepository;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.Student;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Objects;

@Slf4j
@Service
public class RuleBasedAccessControlServiceImpl {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Main access control method - determines if user has access to target scope
     */
    @Cacheable(value = "accessControl", key = "#userId + '_' + #targetScope + '_' + #targetScopeId")
    public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
        log.debug("Checking access for user: {}, scope: {}-{}", userId, targetScope, targetScopeId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        // Check temporary access first
        if (hasTemporaryAccess(user, targetScope, targetScopeId)) {
            return true;
        }
        
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true; // Global access
            case MINISTRY_STAFF -> hasMinistryStaffAccess(user, targetScope, targetScopeId);
            case REGIONAL_ADMIN, REGIONAL_OFFICER -> hasRegionalAdminAccess(user, targetScope, targetScopeId);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> hasSchoolAdminAccess(user, targetScope, targetScopeId);
            case DEPARTMENT_HEAD -> hasDepartmentHeadAccess(user, targetScope, targetScopeId);
            case SENIOR_TEACHER, TEACHER -> hasTeacherAccess(user, targetScope, targetScopeId);
            case STUDENT -> hasStudentAccess(user, targetScope, targetScopeId);
            case PARENT -> hasParentAccess(user, targetScope, targetScopeId);
            case DIRECTOR -> hasDirectorAccess(user, targetScope, targetScopeId);
            default -> false;
        };
    }

    /**
     * Get all scope IDs that user has access to
     */
    @Cacheable(value = "accessibleScopes", key = "#userId + '_' + #scopeType")
    public List<Long> getAccessibleScopeIds(Long userId, AccessScope scopeType) {
        log.debug("Getting accessible scope IDs for user: {}, type: {}", userId, scopeType);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> getAllScopeIds(scopeType);
            case MINISTRY_STAFF -> getMinistryStaffScopeIds(user, scopeType);
            case REGIONAL_ADMIN, REGIONAL_OFFICER -> getRegionalAdminScopeIds(user, scopeType);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> getSchoolAdminScopeIds(user, scopeType);
            case DEPARTMENT_HEAD -> getDepartmentHeadScopeIds(user, scopeType);
            case SENIOR_TEACHER, TEACHER -> getTeacherScopeIds(user, scopeType);
            case STUDENT -> getStudentScopeIds(user, scopeType);
            case PARENT -> getParentScopeIds(user, scopeType);
            case DIRECTOR -> getDirectorScopeIds(user, scopeType);
            default -> Collections.emptyList();
        };
    }

    // Role-specific access methods

    private boolean hasMinistryStaffAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Ministry staff can access all scopes except individual users and parents
        return targetScope != AccessScope.USER && targetScope != AccessScope.PARENT;
    }

    private boolean hasRegionalAdminAccess(User user, AccessScope targetScope, Long targetScopeId) {
        if (user.getSchool() == null) return false;
        
        Long userRegionId = user.getSchool().getRegion().getId();
        
        return switch (targetScope) {
            case REGION -> targetScopeId.equals(userRegionId);
            case SCHOOL -> isSchoolInRegion(targetScopeId, userRegionId);
            case DEPARTMENT -> isDepartmentInRegion(targetScopeId, userRegionId);
            case CLASS -> isClassInRegion(targetScopeId, userRegionId);
            case USER -> isUserInRegion(targetScopeId, userRegionId);
            default -> false;
        };
    }

    private boolean hasSchoolAdminAccess(User user, AccessScope targetScope, Long targetScopeId) {
        if (user.getSchool() == null) return false;
        
        Long userSchoolId = user.getSchool().getId();
        
        return switch (targetScope) {
            case SCHOOL -> targetScopeId.equals(userSchoolId);
            case DEPARTMENT -> isDepartmentInSchool(targetScopeId, userSchoolId);
            case CLASS -> isClassInSchool(targetScopeId, userSchoolId);
            case USER -> isUserInSchool(targetScopeId, userSchoolId);
            default -> false;
        };
    }

    private boolean hasDepartmentHeadAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Note: User entity doesn't have department field, would need to be added
        // For now, check based on school access
        if (user.getSchool() == null) return false;
        
        Long userSchoolId = user.getSchool().getId();
        
        return switch (targetScope) {
            case DEPARTMENT -> isDepartmentInSchool(targetScopeId, userSchoolId);
            case CLASS -> isClassInSchool(targetScopeId, userSchoolId);
            case USER -> isUserInSchool(targetScopeId, userSchoolId);
            default -> false;
        };
    }

    private boolean hasTeacherAccess(User user, AccessScope targetScope, Long targetScopeId) {
        return switch (targetScope) {
            case CLASS -> isTeacherAssignedToClass(user.getId(), targetScopeId);
            case USER -> {
                if (targetScopeId.equals(user.getId())) yield true; // Self access
                yield isUserInTeacherClasses(user.getId(), targetScopeId);
            }
            default -> false;
        };
    }

    private boolean hasStudentAccess(User user, AccessScope targetScope, Long targetScopeId) {
        return switch (targetScope) {
            case CLASS -> isStudentEnrolledInClass(user.getId(), targetScopeId);
            case USER -> {
                if (targetScopeId.equals(user.getId())) yield true; // Self access
                yield areStudentsInSameClass(user.getId(), targetScopeId);
            }
            default -> false;
        };
    }

    private boolean hasParentAccess(User user, AccessScope targetScope, Long targetScopeId) {
        List<Long> childrenIds = getParentChildrenIds(user.getId());
        
        return switch (targetScope) {
            case USER -> childrenIds.contains(targetScopeId);
            case CLASS -> isAnyChildInClass(childrenIds, targetScopeId);
            case SCHOOL -> isAnyChildInSchool(childrenIds, targetScopeId);
            default -> false;
        };
    }

    private boolean hasDirectorAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Directors have regional admin level access
        return hasRegionalAdminAccess(user, targetScope, targetScopeId);
    }

    // Scope ID retrieval methods

    private List<Long> getAllScopeIds(AccessScope scopeType) {
        return switch (scopeType) {
            case REGION -> getAllRegionIds();
            case SCHOOL -> getAllSchoolIds();
            case DEPARTMENT -> getAllDepartmentIds();
            case CLASS -> getAllClassIds();
            case USER -> getAllUserIds();
            default -> Collections.emptyList();
        };
    }

    private List<Long> getMinistryStaffScopeIds(User user, AccessScope scopeType) {
        // Ministry staff can access all scopes except USER
        return scopeType != AccessScope.USER ? getAllScopeIds(scopeType) : Collections.emptyList();
    }

    private List<Long> getRegionalAdminScopeIds(User user, AccessScope scopeType) {
        if (user.getSchool() == null) return Collections.emptyList();
        
        Long regionId = user.getSchool().getRegion().getId();
        
        return switch (scopeType) {
            case REGION -> List.of(regionId);
            case SCHOOL -> getSchoolIdsByRegion(regionId);
            case DEPARTMENT -> getDepartmentIdsByRegion(regionId);
            case CLASS -> getClassIdsByRegion(regionId);
            case USER -> getUserIdsByRegion(regionId);
            default -> Collections.emptyList();
        };
    }

    private List<Long> getSchoolAdminScopeIds(User user, AccessScope scopeType) {
        if (user.getSchool() == null) return Collections.emptyList();
        
        Long schoolId = user.getSchool().getId();
        
        return switch (scopeType) {
            case SCHOOL -> List.of(schoolId);
            case DEPARTMENT -> getDepartmentIdsBySchool(schoolId);
            case CLASS -> getClassIdsBySchool(schoolId);
            case USER -> getUserIdsBySchool(schoolId);
            default -> Collections.emptyList();
        };
    }

    private List<Long> getDepartmentHeadScopeIds(User user, AccessScope scopeType) {
        if (user.getSchool() == null) return Collections.emptyList();
        
        Long schoolId = user.getSchool().getId();
        
        return switch (scopeType) {
            case DEPARTMENT -> getDepartmentIdsBySchool(schoolId);
            case CLASS -> getClassIdsBySchool(schoolId);
            case USER -> getUserIdsBySchool(schoolId);
            default -> Collections.emptyList();
        };
    }

    private List<Long> getTeacherScopeIds(User user, AccessScope scopeType) {
        return switch (scopeType) {
            case CLASS -> getTeacherClassIds(user.getId());
            case USER -> getTeacherAccessibleUserIds(user.getId());
            default -> Collections.emptyList();
        };
    }

    private List<Long> getStudentScopeIds(User user, AccessScope scopeType) {
        return switch (scopeType) {
            case CLASS -> getStudentClassIds(user.getId());
            case USER -> getStudentAccessibleUserIds(user.getId());
            default -> Collections.emptyList();
        };
    }

    private List<Long> getParentScopeIds(User user, AccessScope scopeType) {
        List<Long> childrenIds = getParentChildrenIds(user.getId());
        
        return switch (scopeType) {
            case USER -> childrenIds;
            case CLASS -> getClassIdsByStudents(childrenIds);
            case SCHOOL -> getSchoolIdsByStudents(childrenIds);
            default -> Collections.emptyList();
        };
    }

    private List<Long> getDirectorScopeIds(User user, AccessScope scopeType) {
        // Directors have regional admin level access
        return getRegionalAdminScopeIds(user, scopeType);
    }

    // Temporary access support
    private boolean hasTemporaryAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Note: User entity would need these fields added:
        // - temporarySchoolId
        // - temporaryAccessStart  
        // - temporaryAccessEnd
        return false; // Placeholder until User entity is extended
    }

    // Helper methods for relationship checks
    private boolean isSchoolInRegion(Long schoolId, Long regionId) {
        return schoolRepository.findById(schoolId)
            .map(school -> school.getRegion().getId().equals(regionId))
            .orElse(false);
    }

    private boolean isDepartmentInSchool(Long departmentId, Long schoolId) {
        return departmentRepository.findById(departmentId)
            .map(dept -> dept.getSchool().getId().equals(schoolId))
            .orElse(false);
    }

    private boolean isClassInSchool(Long classId, Long schoolId) {
        return classRepository.findById(classId)
            .map(cls -> cls.getSchool().getId().equals(schoolId))
            .orElse(false);
    }

    private boolean isUserInSchool(Long userId, Long schoolId) {
        return userRepository.findById(userId)
            .map(user -> user.getSchool() != null && user.getSchool().getId().equals(schoolId))
            .orElse(false);
    }

    private boolean isDepartmentInRegion(Long departmentId, Long regionId) {
        return departmentRepository.findById(departmentId)
            .map(dept -> dept.getSchool().getRegion().getId().equals(regionId))
            .orElse(false);
    }

    private boolean isClassInRegion(Long classId, Long regionId) {
        return classRepository.findById(classId)
            .map(cls -> cls.getSchool().getRegion().getId().equals(regionId))
            .orElse(false);
    }

    private boolean isUserInRegion(Long userId, Long regionId) {
        return userRepository.findById(userId)
            .map(user -> user.getSchool() != null && 
                user.getSchool().getRegion().getId().equals(regionId))
            .orElse(false);
    }

    // These would use existing repository methods or new simple queries
    private boolean isTeacherAssignedToClass(Long teacherId, Long classId) {
        // Find teacher by user ID and check if they're assigned to the class
        return teacherRepository.findByUser_Id(teacherId)
            .map(teacher -> classRepository.findByIdWithTeachers(classId)
                .map(cls -> cls.getTeachers().contains(teacher))
                .orElse(false))
            .orElse(false);
    }

    private boolean isStudentEnrolledInClass(Long studentId, Long classId) {
        // Find student by user ID and check if they're enrolled in the class
        return studentRepository.findByUser_Id(studentId)
            .map(student -> classRepository.findByIdWithStudents(classId)
                .map(cls -> cls.getStudents().contains(student))
                .orElse(false))
            .orElse(false);
    }

    private boolean isUserInTeacherClasses(Long teacherId, Long userId) {
        // Check if user is a student in any of teacher's classes
        Optional<Teacher> teacherOpt = teacherRepository.findByUser_Id(teacherId);
        Optional<Student> studentOpt = studentRepository.findByUser_Id(userId);
        
        if (teacherOpt.isEmpty() || studentOpt.isEmpty()) {
            return false;
        }
        
        Teacher teacher = teacherOpt.get();
        Student student = studentOpt.get();
        
        // Get all classes where teacher teaches and check if student is enrolled
        return classRepository.findByTeacherId(teacher.getId()).stream()
            .anyMatch(cls -> cls.getStudents().contains(student));
    }

    private boolean areStudentsInSameClass(Long studentId1, Long studentId2) {
        // Check if both students are in any common class
        Optional<Student> student1Opt = studentRepository.findByUser_Id(studentId1);
        Optional<Student> student2Opt = studentRepository.findByUser_Id(studentId2);
        
        if (student1Opt.isEmpty() || student2Opt.isEmpty()) {
            return false;
        }
        
        // Check if both students are in the same class using simpler approach
        Student student1 = student1Opt.get();
        Student student2 = student2Opt.get();
        
        // If both have the same class, they are classmates
        return student1.getStudentClass() != null && student2.getStudentClass() != null &&
               student1.getStudentClass().getId().equals(student2.getStudentClass().getId());
    }

    private List<Long> getParentChildrenIds(Long parentId) {
        // Use existing User parent-child relationship
        return userRepository.findById(parentId)
            .map(parent -> parent.getChildren().stream()
                .map(User::getId)
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());
    }

    private boolean isAnyChildInClass(List<Long> childrenIds, Long classId) {
        return childrenIds.stream()
            .anyMatch(childId -> isStudentEnrolledInClass(childId, classId));
    }

    private boolean isAnyChildInSchool(List<Long> childrenIds, Long schoolId) {
        return childrenIds.stream()
            .anyMatch(childId -> isUserInSchool(childId, schoolId));
    }

    // Scope ID retrieval helper methods
    private List<Long> getAllRegionIds() {
        return regionRepository.findAll().stream()
            .map(Region::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getAllSchoolIds() {
        return schoolRepository.findAll().stream()
            .map(School::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getAllDepartmentIds() {
        return departmentRepository.findAll().stream()
            .map(Department::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getAllClassIds() {
        return classRepository.findAll().stream()
            .map(Class::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getAllUserIds() {
        return userRepository.findAll().stream()
            .map(User::getId)
            .collect(Collectors.toList());
    }

    // Scope ID methods using existing repository relationships
    private List<Long> getSchoolIdsByRegion(Long regionId) {
        return schoolRepository.findByRegionId(regionId).stream()
            .map(School::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getDepartmentIdsByRegion(Long regionId) {
        // Get all schools in region, then get their departments
        List<Long> schoolIds = getSchoolIdsByRegion(regionId);
        return schoolIds.stream()
            .flatMap(schoolId -> departmentRepository.findBySchoolId(schoolId).stream())
            .map(Department::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getClassIdsByRegion(Long regionId) {
        // Get all schools in region, then get their classes
        List<Long> schoolIds = getSchoolIdsByRegion(regionId);
        return schoolIds.stream()
            .flatMap(schoolId -> classRepository.findBySchoolId(schoolId).stream())
            .map(Class::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getUserIdsByRegion(Long regionId) {
        // Get all schools in region, then get their users
        List<Long> schoolIds = getSchoolIdsByRegion(regionId);
        return schoolIds.stream()
            .flatMap(schoolId -> userRepository.findAll().stream()
                .filter(user -> user.getSchool() != null && user.getSchool().getId().equals(schoolId)))
            .map(User::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getDepartmentIdsBySchool(Long schoolId) {
        return departmentRepository.findBySchoolId(schoolId).stream()
            .map(Department::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getClassIdsBySchool(Long schoolId) {
        return classRepository.findBySchoolId(schoolId).stream()
            .map(Class::getId)
            .collect(Collectors.toList());
    }

    private List<Long> getUserIdsBySchool(Long schoolId) {
        return userRepository.findAll().stream()
            .filter(user -> user.getSchool() != null && user.getSchool().getId().equals(schoolId))
            .map(User::getId)
            .collect(Collectors.toList());
    }

    // Placeholder methods for teacher/student relationships
    // These would be implemented based on existing assignment tables
    private List<Long> getTeacherClassIds(Long teacherId) {
        // Get classes where this teacher teaches
        return teacherRepository.findByUser_Id(teacherId)
            .map(teacher -> classRepository.findByTeacherId(teacher.getId()).stream()
                .map(Class::getId)
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());
    }

    private List<Long> getTeacherAccessibleUserIds(Long teacherId) {
        // Get all students in teacher's classes
        return teacherRepository.findByUser_Id(teacherId)
            .map(teacher -> classRepository.findByTeacherId(teacher.getId()).stream()
                .flatMap(cls -> cls.getStudents().stream())
                .map(student -> student.getUser() != null ? student.getUser().getId() : null)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());
    }

    private List<Long> getStudentClassIds(Long studentId) {
        // Get class where this student is enrolled
        return studentRepository.findByUser_Id(studentId)
            .map(student -> {
                if (student.getStudentClass() != null) {
                    return List.of(student.getStudentClass().getId());
                }
                return Collections.<Long>emptyList();
            })
            .orElse(Collections.emptyList());
    }

    private List<Long> getStudentAccessibleUserIds(Long studentId) {
        // Get classmates (students in the same class)
        return studentRepository.findByUser_Id(studentId)
            .map(student -> {
                if (student.getStudentClass() != null) {
                    return studentRepository.findByStudentClass_Id(student.getStudentClass().getId()).stream()
                        .map(classmate -> classmate.getUser() != null ? classmate.getUser().getId() : null)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                }
                return Collections.<Long>emptyList();
            })
            .orElse(Collections.emptyList());
    }

    private List<Long> getClassIdsByStudents(List<Long> studentIds) {
        // Get all classes these students are in
        return studentIds.stream()
            .map(this::getStudentClassIds)
            .flatMap(List::stream)
            .distinct()
            .collect(Collectors.toList());
    }

    private List<Long> getSchoolIdsByStudents(List<Long> studentIds) {
        // Get all schools these students attend
        return studentRepository.findByUser_IdIn(studentIds).stream()
            .map(student -> student.getSchool() != null ? student.getSchool().getId() : null)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());
    }
} 