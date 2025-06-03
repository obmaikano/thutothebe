package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradeDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.GradeMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.GradeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class GradeServiceImpl extends BaseServiceImpl<Grade, GradeDTO, Long> implements GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private GradeCategoryRepository gradeCategoryRepository;

    @Autowired
    private GradeMapper gradeMapper;

    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    public GradeServiceImpl(GradeRepository gradeRepository) {
        super(gradeRepository);
        this.gradeRepository = gradeRepository;
    }

    @Override
    protected Grade mapToEntity(GradeDTO dto) {
        return gradeMapper.toEntity(dto);
    }

    @Override
    protected GradeDTO mapToDto(Grade entity) {
        return gradeMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Grade entity, GradeDTO dto) {
        entity.setScore(dto.score());
        entity.setMaxScore(dto.maxScore());
        entity.setWeight(dto.weight());
        entity.setGradeType(dto.gradeType());
        entity.setFeedback(dto.feedback());
        entity.setFinal(dto.isFinal());
        entity.setModerated(dto.isModerated());
        entity.setModerationNotes(dto.moderationNotes());
        entity.setOriginalScore(dto.originalScore());
        entity.setActive(dto.active());
        entity.setModifiedAt(LocalDateTime.now());
    }

    @Override
    public GradeDTO create(GradeDTO dto) {
        User student = userRepository.findById(dto.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.studentId()));
        
        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.courseId()));

        GradeCategory gradeCategory = null;
        if (dto.gradeCategoryId() != null) {
            gradeCategory = gradeCategoryRepository.findById(dto.gradeCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grade category not found with id: " + dto.gradeCategoryId()));
        }

        Assessment assessment = null;
        if (dto.assessmentId() != null) {
            assessment = assessmentRepository.findById(dto.assessmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + dto.assessmentId()));
        }

        Assignment assignment = null;
        if (dto.assignmentId() != null) {
            assignment = assignmentRepository.findById(dto.assignmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + dto.assignmentId()));
        }

        User gradedBy = userRepository.findById(dto.gradedById())
                .orElseThrow(() -> new ResourceNotFoundException("Graded by user not found with id: " + dto.gradedById()));

        User moderatedBy = null;
        if (dto.moderatedById() != null) {
            moderatedBy = userRepository.findById(dto.moderatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Moderated by user not found with id: " + dto.moderatedById()));
        }

        Grade grade = gradeMapper.toEntityWithReferences(dto, student, course, gradeCategory, assessment, assignment, gradedBy, moderatedBy);
        beforeCreate(grade);
        Grade savedGrade = gradeRepository.save(grade);
        
        log.info("Created grade with id: {} for student: {}", savedGrade.getId(), student.getId());
        return gradeMapper.toDto(savedGrade);
    }

    @Override
    public List<GradeDTO> findByStudentId(Long studentId) {
        return gradeRepository.findByStudentIdAndActive(studentId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByCourseId(Long courseId) {
        return gradeRepository.findByCourseIdAndActive(courseId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByStudentIdAndCourseId(Long studentId, Long courseId) {
        return gradeRepository.findByStudentIdAndCourseIdAndActive(studentId, courseId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByGradeType(GradeType gradeType) {
        return gradeRepository.findByGradeTypeAndActive(gradeType, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByTerm(Term term) {
        return gradeRepository.findByStudentIdAndTermAndActive(null, term, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByAssessmentId(Long assessmentId) {
        return gradeRepository.findByAssessmentIdAndActive(assessmentId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByAssignmentId(Long assignmentId) {
        return gradeRepository.findByAssignmentIdAndActive(assignmentId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByTeacherId(Long teacherId) {
        return gradeRepository.findByTeacherIdAndActive(teacherId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<GradeDTO> findByStudentId(Long studentId, Pageable pageable) {
        return gradeRepository.findByStudentIdAndActive(studentId, true, pageable)
                .map(gradeMapper::toDto);
    }

    @Override
    public Double calculateAverageScoreByStudentAndCourse(Long studentId, Long courseId) {
        return gradeRepository.findAverageScoreByStudentAndCourse(studentId, courseId)
                .orElse(0.0);
    }

    @Override
    public Double calculateAverageScoreByCourse(Long courseId) {
        return gradeRepository.findAverageScoreByCourse(courseId)
                .orElse(0.0);
    }

    @Override
    public Double calculateAverageScoreByStudent(Long studentId) {
        return gradeRepository.findAverageScoreByStudent(studentId)
                .orElse(0.0);
    }

    @Override
    public GradeDTO moderateGrade(Long gradeId, Long moderatorId, String moderationNotes, Double newScore) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + gradeId));
        
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator not found with id: " + moderatorId));

        // Store original score if not already stored
        if (grade.getOriginalScore() == null) {
            grade.setOriginalScore(grade.getScore());
        }

        grade.setScore(newScore);
        grade.setModerated(true);
        grade.setModeratedBy(moderator);
        grade.setModeratedAt(LocalDateTime.now());
        grade.setModerationNotes(moderationNotes);
        grade.setModifiedAt(LocalDateTime.now());

        Grade savedGrade = gradeRepository.save(grade);
        log.info("Moderated grade with id: {} by moderator: {}", gradeId, moderatorId);
        
        return gradeMapper.toDto(savedGrade);
    }

    @Override
    public List<GradeDTO> findUnmoderatedGrades() {
        return gradeRepository.findUnmoderatedGrades()
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findModeratedGrades() {
        return gradeRepository.findModeratedGrades()
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public GradeDTO createGradeForAssessment(Long studentId, Long assessmentId, Double score, Long gradedById) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + assessmentId));

        // Get course from assessment through submission relationship
        Course course = assessment.getSubmission().getAssignment().getCourse();

        GradeDTO gradeDTO = new GradeDTO(
                null, studentId, course.getId(), null, assessmentId, null,
                GradeType.ASSESSMENT, score, 100.0, 1.0, null, gradedById,
                LocalDateTime.now(), false, false, null, null, null, null,
                true, null, null
        );

        return create(gradeDTO);
    }

    @Override
    public GradeDTO createGradeForAssignment(Long studentId, Long assignmentId, Double score, Long gradedById) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        GradeDTO gradeDTO = new GradeDTO(
                null, studentId, assignment.getCourse().getId(), null, null, assignmentId,
                GradeType.ASSIGNMENT, score, 100.0, 1.0, null, gradedById,
                LocalDateTime.now(), false, false, null, null, null, null,
                true, null, null
        );

        return create(gradeDTO);
    }

    @Override
    public List<GradeDTO> bulkCreateGrades(List<GradeDTO> grades) {
        return grades.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivateGrade(Long gradeId) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + gradeId));
        
        grade.setActive(false);
        grade.setModifiedAt(LocalDateTime.now());
        gradeRepository.save(grade);
        
        log.info("Deactivated grade with id: {}", gradeId);
    }

    @Override
    public void reactivateGrade(Long gradeId) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + gradeId));
        
        grade.setActive(true);
        grade.setModifiedAt(LocalDateTime.now());
        gradeRepository.save(grade);
        
        log.info("Reactivated grade with id: {}", gradeId);
    }

    @Override
    public boolean existsByStudentIdAndAssessmentId(Long studentId, Long assessmentId) {
        return gradeRepository.existsByStudentIdAndAssessmentIdAndActive(studentId, assessmentId, true);
    }

    @Override
    public boolean existsByStudentIdAndAssignmentId(Long studentId, Long assignmentId) {
        return gradeRepository.existsByStudentIdAndAssignmentIdAndActive(studentId, assignmentId, true);
    }

    @Override
    public List<GradeDTO> findByGradeCategoryId(Long gradeCategoryId) {
        return gradeRepository.findByGradeCategoryIdAndActive(gradeCategoryId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByStudentIdAndGradeCategoryId(Long studentId, Long gradeCategoryId) {
        return gradeRepository.findByStudentIdAndGradeCategoryIdAndActive(studentId, gradeCategoryId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Double calculateAverageScoreByGradeCategory(Long gradeCategoryId) {
        return gradeRepository.findAverageScoreByGradeCategory(gradeCategoryId)
                .orElse(0.0);
    }

    @Override
    public Long countPassingGradesByGradeCategory(Long gradeCategoryId, Double passingGrade) {
        return gradeRepository.countPassingGradesByGradeCategory(gradeCategoryId, passingGrade);
    }

    @Override
    public boolean existsByStudentIdAndGradeCategoryId(Long studentId, Long gradeCategoryId) {
        return gradeRepository.existsByStudentIdAndGradeCategoryIdAndActive(studentId, gradeCategoryId, true);
    }

    @Override
    public GradeDTO createGradeForCategory(Long studentId, Long gradeCategoryId, Double score, Long gradedById, String feedback) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        GradeCategory gradeCategory = gradeCategoryRepository.findById(gradeCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade category not found with id: " + gradeCategoryId));
        
        User gradedBy = userRepository.findById(gradedById)
                .orElseThrow(() -> new ResourceNotFoundException("Graded by user not found with id: " + gradedById));

        // Use the grade category's weight and max grade
        Double weight = gradeCategory.getWeight();
        Double maxScore = gradeCategory.getMaxGrade() != null ? gradeCategory.getMaxGrade() : 100.0;

        GradeDTO gradeDTO = new GradeDTO(
                null, studentId, gradeCategory.getCourse().getId(), gradeCategoryId, null, null,
                GradeType.ASSESSMENT, score, maxScore, weight, feedback, gradedById,
                LocalDateTime.now(), false, false, null, null, null, null,
                true, null, null
        );

        Grade grade = gradeMapper.toEntityWithReferences(gradeDTO, student, gradeCategory.getCourse(), 
                gradeCategory, null, null, gradedBy, null);
        beforeCreate(grade);
        Grade savedGrade = gradeRepository.save(grade);
        
        log.info("Created grade for category with id: {} for student: {}", gradeCategoryId, studentId);
        return gradeMapper.toDto(savedGrade);
    }

    @Override
    public List<GradeDTO> findByStudentIdAndGradeType(Long studentId, GradeType gradeType) {
        return gradeRepository.findByStudentIdAndGradeTypeAndActive(studentId, gradeType, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByCourseIdAndGradeType(Long courseId, GradeType gradeType) {
        return gradeRepository.findByCourseIdAndGradeTypeAndActive(courseId, gradeType, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByStudentIdAndTerm(Long studentId, Term term) {
        return gradeRepository.findByStudentIdAndTermAndActive(studentId, term, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByAcademicYear(Integer year) {
        return gradeRepository.findByStudentIdAndAcademicYearAndActive(null, year, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByStudentIdAndAcademicYear(Long studentId, Integer year) {
        return gradeRepository.findByStudentIdAndAcademicYearAndActive(studentId, year, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByClassId(Long classId) {
        return gradeRepository.findByClassIdAndActive(classId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findByStudentIdAndClassId(Long studentId, Long classId) {
        return gradeRepository.findByStudentIdAndClassIdAndActive(studentId, classId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<GradeDTO> findByCourseId(Long courseId, Pageable pageable) {
        return gradeRepository.findByCourseIdAndActive(courseId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        list -> {
                            int start = (int) pageable.getOffset();
                            int end = Math.min((start + pageable.getPageSize()), list.size());
                            return new org.springframework.data.domain.PageImpl<>(
                                    list.subList(start, end), pageable, list.size());
                        }));
    }

    @Override
    public Long countPassingGradesByStudent(Long studentId, Double passingGrade) {
        return gradeRepository.countPassingGradesByStudent(studentId, passingGrade);
    }

    @Override
    public Long countPassingGradesByCourse(Long courseId, Double passingGrade) {
        return gradeRepository.countPassingGradesByCourse(courseId, passingGrade);
    }

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByAccessibleScopes(Long currentUserId) {
        try {
            // Get accessible scope IDs from access control service
            List<Long> accessibleStudentIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            // Check if user has global access
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // Global access - return all active grades
                return gradeRepository.findBySchoolIdInAndActive(List.of(), true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            // Use multi-scope access query for database-level filtering
            return gradeRepository.findByMultiScopeAccess(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleStudentIds.isEmpty() ? List.of(-1L) : accessibleStudentIds
            ).stream()
                    .map(gradeMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting grades by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of(); // Return empty list on error for security
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleStudentIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findBySchoolIdInAndActive(List.of(), true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return gradeRepository.findByMultiScopeAccessAndActive(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleStudentIds.isEmpty() ? List.of(-1L) : accessibleStudentIds,
                    true
            ).stream()
                    .map(gradeMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting active grades by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesBySchoolId(Long schoolId) {
        return gradeRepository.findBySchoolIdAndActive(schoolId, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByRegionId(Long regionId) {
        return gradeRepository.findByRegionIdAndActive(regionId, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesBySchoolId(Long schoolId) {
        return gradeRepository.findActiveGradesBySchoolId(schoolId).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesByRegionId(Long regionId) {
        return gradeRepository.findActiveGradesByRegionId(regionId).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByStudentIds(List<Long> studentIds) {
        if (studentIds == null || studentIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findByStudentIdInAndActive(studentIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesByStudentIds(List<Long> studentIds) {
        if (studentIds == null || studentIds.isEmpty()) {
            return List.of();
        }
        return gradeRepository.findByStudentIdInAndActive(studentIds, true).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds) {
        return gradeRepository.findByMultiScopeAccess(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                studentIds == null || studentIds.isEmpty() ? List.of(-1L) : studentIds
        ).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getActiveGradesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds) {
        return gradeRepository.findByMultiScopeAccessAndActive(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                studentIds == null || studentIds.isEmpty() ? List.of(-1L) : studentIds,
                true
        ).stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return gradeRepository.findByCourseIdAndSchoolIdInAndActive(courseId, accessibleSchoolIds, true).stream()
                    .map(gradeMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting grades by course and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByClassIdAndAccessibleScopes(Long classId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return gradeRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds).stream()
                    .map(gradeMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting grades by class and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByTeacherIdAndActive(teacherId, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by teacher and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByAssessmentIdAndAccessibleScopes(Long assessmentId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByAssessmentIdAndActive(assessmentId, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByAssessmentIdAndSchoolIdInAndActive(assessmentId, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByAssessmentIdAndRegionIdInAndActive(assessmentId, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by assessment and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByAssignmentIdAndAccessibleScopes(Long assignmentId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByAssignmentIdAndActive(assignmentId, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByAssignmentIdAndSchoolIdInAndActive(assignmentId, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByAssignmentIdAndRegionIdInAndActive(assignmentId, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by assignment and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByGradeCategoryIdAndAccessibleScopes(Long gradeCategoryId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByGradeCategoryIdAndActive(gradeCategoryId, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByGradeCategoryIdAndSchoolIdInAndActive(gradeCategoryId, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByGradeCategoryIdAndRegionIdInAndActive(gradeCategoryId, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by grade category and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByGradeTypeAndAccessibleScopes(GradeType gradeType, Long currentUserId) {
        try {
            List<Long> accessibleStudentIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByGradeTypeAndActive(gradeType, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return gradeRepository.findByMultiScopeAccessAndGradeType(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleStudentIds.isEmpty() ? List.of(-1L) : accessibleStudentIds,
                    gradeType
            ).stream()
                    .map(gradeMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting grades by grade type and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByTermAndAccessibleScopes(Term term, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByStudentIdAndTermAndActive(null, term, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByTermAndSchoolIdInAndActive(term, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByTermAndRegionIdInAndActive(term, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by term and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByAcademicYearAndAccessibleScopes(Integer academicYear, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return gradeRepository.findByStudentIdAndAcademicYearAndActive(null, academicYear, true).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByAcademicYearAndSchoolIdInAndActive(academicYear, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByAcademicYearAndRegionIdInAndActive(academicYear, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by academic year and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByModerationStatusAndAccessibleScopes(boolean isModerated, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                if (isModerated) {
                    return gradeRepository.findModeratedGrades().stream()
                            .map(gradeMapper::toDto)
                            .collect(Collectors.toList());
                } else {
                    return gradeRepository.findUnmoderatedGrades().stream()
                            .map(gradeMapper::toDto)
                            .collect(Collectors.toList());
                }
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return gradeRepository.findByModerationStatusAndSchoolIdInAndActive(isModerated, accessibleSchoolIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return gradeRepository.findByModerationStatusAndRegionIdInAndActive(isModerated, accessibleRegionIds).stream()
                        .map(gradeMapper::toDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting grades by moderation status and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getUnmoderatedGradesByAccessibleScopes(Long currentUserId) {
        return getGradesByModerationStatusAndAccessibleScopes(false, currentUserId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getModeratedGradesByAccessibleScopes(Long currentUserId) {
        return getGradesByModerationStatusAndAccessibleScopes(true, currentUserId);
    }
    
    @Override
    public boolean existsForStudentAndAssessment(Long studentId, Long assessmentId) {
        return gradeRepository.existsByStudentIdAndAssessmentIdAndActive(studentId, assessmentId, true);
    }
    
    @Override
    public boolean existsForStudentAndAssignment(Long studentId, Long assignmentId) {
        return gradeRepository.existsByStudentIdAndAssignmentIdAndActive(studentId, assignmentId, true);
    }
    
    @Override
    public boolean existsForStudentAndCategory(Long studentId, Long gradeCategoryId) {
        return gradeRepository.existsByStudentIdAndGradeCategoryIdAndActive(studentId, gradeCategoryId, true);
    }
} 