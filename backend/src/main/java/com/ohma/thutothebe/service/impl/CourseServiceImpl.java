package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.exception.UserNotFoundException;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.util.LoggingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.Collections;
import java.util.stream.Collectors;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.entity.CourseType;

@Slf4j
@Service
public class CourseServiceImpl extends BaseServiceImpl<Course, CourseDTO, Long> implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, CourseMapper courseMapper,
                           SubjectRepository subjectRepository, ClassRepository classRepository,
                           CourseInstructorRepository courseInstructorRepository, TeacherRepository teacherRepository) {
        super(courseRepository);
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    protected Course mapToEntity(CourseDTO dto) {
        return courseMapper.toEntity(dto);
    }

    @Override
    protected CourseDTO mapToDto(Course entity) {
        return courseMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Course entity, CourseDTO dto) {
        courseMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    protected Long extractSchoolId(Course entity) {
        return entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null 
               ? entity.getClassEntity().getSchool().getId() 
               : null;
    }

    @Override
    protected Long extractRegionId(Course entity) {
        return entity.getClassEntity() != null && 
               entity.getClassEntity().getSchool() != null && 
               entity.getClassEntity().getSchool().getRegion() != null 
               ? entity.getClassEntity().getSchool().getRegion().getId() 
               : null;
    }

    @Override
    protected void validateBusinessRules(Course entity, boolean isUpdate) {
        // Validate course code uniqueness within school
        Long schoolId = extractSchoolId(entity);
        if (schoolId != null) {
            if (!isUpdate && courseRepository.existsByCodeAndSchoolId(entity.getCode(), schoolId)) {
                throw new IllegalArgumentException("Course code '" + entity.getCode() + "' already exists in this school");
            }
            
            // Validate course name uniqueness within school for same term and year
            if (courseRepository.existsByNameAndSchoolIdAndTermAndYear(
                    entity.getName(), schoolId, entity.getTerm(), entity.getYear())) {
                throw new IllegalArgumentException("Course '" + entity.getName() + "' already exists for " + 
                                                 entity.getTerm() + " " + entity.getYear() + " in this school");
            }
        }
        
        // Validate class belongs to same school
        if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null) {
            Long classSchoolId = entity.getClassEntity().getSchool().getId();
            if (schoolId != null && !schoolId.equals(classSchoolId)) {
                throw new IllegalArgumentException("Course class must belong to the same school");
            }
        }
    }

    @Override
    public List<CourseDTO> getAll() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to getAll courses");
            return Collections.emptyList();
        }
        return getCoursesByAccessibleScopes(currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDTO getCourseByCode(String code) {
        return courseRepository.findByCode(code)
            .map(courseMapper::toDto)
            .orElseThrow(() -> CourseNotFoundException.withCode(code));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseDTO> getCoursesByTeacher(User teacher) {
        List<Course> courses = courseRepository.findByTeacherId(teacher.getId());
        return courses.stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByEnrolledStudentId(Long studentId) {
        // Since there's no direct repository method, we need to implement a workaround
        // For now, we'll return an empty list
        return Collections.emptyList();
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseDTO> getActiveCourses() {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptySet();
        }
        return getActiveCoursesByAccessibleScopes(currentUserId).stream()
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByInstructorId(Long instructorId) {
        List<Course> courses = courseRepository.findByTeacherId(instructorId);
        return courses.stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseDTO enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        // This method should be implemented when the Course entity has a students collection
        // For now, return the course DTO
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional
    public CourseDTO unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        // This method should be implemented when the Course entity has a students collection
        // For now, return the course DTO
        return courseMapper.toDto(course);
    }

    @Override
    public boolean existsByCode(String code) {
        return courseRepository.existsByCode(code);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return CourseNotFoundException.withId(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesBySubjectId(Long subjectId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesbySubjectId(Long subjectId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByClassId(Long classId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByClassIdAndAccessibleScopes(classId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByClassId(Long classId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByClassIdAndAccessibleScopes(classId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTeacherId(Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByTeacherId(Long teacherId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTerm(Term term) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByTermAndAccessibleScopes(term, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByYear(Integer year) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByYearAndAccessibleScopes(year, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByType(CourseType type) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByTypeAndAccessibleScopes(type, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByType(CourseType type) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return Collections.emptyList();
        }
        return getCoursesByTypeAndAccessibleScopes(type, currentUserId);
    }
    
    @Override
    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO) {
        validateCourseBusinessRules(courseDTO, false, getCurrentUserId());
        return create(courseDTO);
    }
    
    @Override
    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        validateCourseBusinessRules(courseDTO, true, getCurrentUserId());
        return update(id, courseDTO);
    }
    
    @Override
    @Transactional
    public void deleteCourse(Long id) {
        delete(id);
    }
    
    @Override
    @Transactional
    public void activateCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.setActive(true);
        courseRepository.save(course);
    }
    
    @Override
    @Transactional
    public void deactivateCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.setActive(false);
        courseRepository.save(course);
    }
    
    @Override
    @Transactional
    public void addInstructorToCourse(Long courseId, Long teacherId, boolean isPrimary) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        CourseInstructor courseInstructor = new CourseInstructor();
        courseInstructor.setCourse(course);
        courseInstructor.setTeacher(teacher);
        courseInstructor.setPrimary(isPrimary);
        
        courseInstructorRepository.save(courseInstructor);
    }
    
    @Override
    @Transactional
    public void removeInstructorFromCourse(Long courseId, Long teacherId) {
        CourseInstructor courseInstructor = courseInstructorRepository.findByCourseIdAndTeacherId(courseId, teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Course instructor relationship not found"));
        
        courseInstructorRepository.delete(courseInstructor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByMultiScopeAccess(accessibleSchoolIds, accessibleRegionIds);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByAccessibleScopes(Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByMultiScopeAccessAndActive(accessibleSchoolIds, accessibleRegionIds, true);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving active courses by accessible scopes for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesBySchoolIdAndAccessibleScopes(Long schoolId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) {
                log.warn("User {} denied access to school {}", userId, schoolId);
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findBySchoolId(schoolId);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by school {} for user {}: {}", schoolId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByRegionIdAndAccessibleScopes(Long regionId, Long userId) {
        try {
            if (!accessControlService.hasAccess(userId, AccessScope.REGION, regionId)) {
                log.warn("User {} denied access to region {}", userId, regionId);
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByRegionId(regionId);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by region {} for user {}: {}", regionId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesBySubjectIdAndAccessibleScopes(Long subjectId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findBySubjectIdAndSchoolIdInAndActive(subjectId, accessibleSchoolIds, true);
            if (courses.isEmpty() && !accessibleRegionIds.isEmpty()) {
                courses = courseRepository.findBySubjectIdAndRegionIdInAndActive(subjectId, accessibleRegionIds, true);
            }
            
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by subject {} for user {}: {}", subjectId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTeacherIdAndAccessibleScopes(Long teacherId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.REGION);
            
            if (accessibleSchoolIds.isEmpty() && accessibleRegionIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds, true);
            if (courses.isEmpty() && !accessibleRegionIds.isEmpty()) {
                courses = courseRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds, true);
            }
            
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by teacher {} for user {}: {}", teacherId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByClassIdAndAccessibleScopes(Long classId, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds, true);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by class {} for user {}: {}", classId, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTermAndAccessibleScopes(Term term, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByTermAndSchoolIdInAndActive(term, accessibleSchoolIds, true);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by term {} for user {}: {}", term, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByYearAndAccessibleScopes(Integer year, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByYearAndSchoolIdInAndActive(year, accessibleSchoolIds, true);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by year {} for user {}: {}", year, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTypeAndAccessibleScopes(CourseType type, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return Collections.emptyList();
            }
            
            List<Course> courses = courseRepository.findByTypeAndSchoolIdInAndActive(type, accessibleSchoolIds, true);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by type {} for user {}: {}", type, userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds) {
        try {
            List<Course> courses = courseRepository.findByMultiScopeAccess(schoolIds, regionIds);
            return courses.stream()
                    .map(courseMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving courses by multi-scope access: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateCourseAccess(Long courseId, Long userId) {
        try {
            Course course = courseRepository.findById(courseId).orElse(null);
            if (course == null) {
                return false;
            }
            
            Long schoolId = extractSchoolId(course);
            Long regionId = extractRegionId(course);
            
            return (schoolId != null && accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) ||
                   (regionId != null && accessControlService.hasAccess(userId, AccessScope.REGION, regionId));
        } catch (Exception e) {
            log.error("Error validating course access for user {} and course {}: {}", userId, courseId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCodeAndAccessibleScopes(String code, Long userId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(userId, AccessScope.SCHOOL);
            
            for (Long schoolId : accessibleSchoolIds) {
                if (courseRepository.existsByCodeAndSchoolId(code, schoolId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking course code existence for user {}: {}", userId, e.getMessage());
            return false;
        }
    }

    @Override
    public void validateCourseBusinessRules(CourseDTO courseDTO, boolean isUpdate, Long userId) {
        if (userId == null) {
            throw new SecurityException("Authentication required for course operations");
        }
        
        // Validate user has access to the class's school
        if (courseDTO.classId() != null) {
            com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(courseDTO.classId())
                .orElseThrow(() -> new IllegalArgumentException("Class not found with id: " + courseDTO.classId()));
            
            Long schoolId = classEntity.getSchool() != null ? classEntity.getSchool().getId() : null;
            if (schoolId != null && !accessControlService.hasAccess(userId, AccessScope.SCHOOL, schoolId)) {
                throw new SecurityException("Access denied: Cannot create/update course in school " + schoolId);
            }
        }
        
        // Additional business rule validations can be added here
    }
} 