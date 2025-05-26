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
    private GradeMapper gradeMapper;

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
        
        User gradedBy = userRepository.findById(dto.gradedById())
                .orElseThrow(() -> new ResourceNotFoundException("Graded by user not found with id: " + dto.gradedById()));

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

        User moderatedBy = null;
        if (dto.moderatedById() != null) {
            moderatedBy = userRepository.findById(dto.moderatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Moderated by user not found with id: " + dto.moderatedById()));
        }

        Grade grade = gradeMapper.toEntityWithReferences(dto, student, course, assessment, assignment, gradedBy, moderatedBy);
        beforeCreate(grade);
        Grade savedGrade = gradeRepository.save(grade);
        
        log.info("Created grade with id: {} for student: {} in course: {}", savedGrade.getId(), student.getId(), course.getId());
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
    public List<GradeDTO> findByTerm(Term term) {
        return gradeRepository.findByTermAndActive(term, true)
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
        return gradeRepository.findByAcademicYearAndActive(year, true)
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
    public List<GradeDTO> findByTeacherId(Long teacherId) {
        return gradeRepository.findByTeacherIdAndActive(teacherId, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<GradeDTO> findByStudentId(Long studentId, Pageable pageable) {
        return gradeRepository.findByStudentIdAndActive(studentId, true)
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
    public Double calculateAverageScoreByStudentAndCourse(Long studentId, Long courseId) {
        return gradeRepository.findAverageScoreByStudentAndCourse(studentId, courseId).orElse(0.0);
    }

    @Override
    public Double calculateAverageScoreByCourse(Long courseId) {
        return gradeRepository.findAverageScoreByCourse(courseId).orElse(0.0);
    }

    @Override
    public Double calculateAverageScoreByStudent(Long studentId) {
        return gradeRepository.findAverageScoreByStudent(studentId).orElse(0.0);
    }

    @Override
    public Long countPassingGradesByStudent(Long studentId, Double passingGrade) {
        return gradeRepository.countPassingGradesByStudent(studentId, passingGrade);
    }

    @Override
    public Long countPassingGradesByCourse(Long courseId, Double passingGrade) {
        return gradeRepository.countPassingGradesByCourse(courseId, passingGrade);
    }

    @Override
    public GradeDTO moderateGrade(Long gradeId, Long moderatorId, String moderationNotes, Double newScore) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + gradeId));
        
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator not found with id: " + moderatorId));

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
        return gradeRepository.findByIsModeratedAndActive(false, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDTO> findModeratedGrades() {
        return gradeRepository.findByIsModeratedAndActive(true, true)
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
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
    public GradeDTO createGradeForAssessment(Long studentId, Long assessmentId, Double score, Long gradedById) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + assessmentId));
        
        // For assessment grades, the course ID should be provided separately or derived from submission
        // Since Assessment doesn't have direct course relationship, we'll need to get it from submission
        Long courseId = assessment.getSubmission().getAssignment().getCourse().getId();
        
        GradeDTO gradeDTO = new GradeDTO(
                null, studentId, courseId, assessmentId, null, GradeType.ASSESSMENT,
                score, 100.0, 1.0, null, gradedById, LocalDateTime.now(),
                false, false, null, null, null, null, true, null, null
        );
        
        return create(gradeDTO);
    }

    @Override
    public GradeDTO createGradeForAssignment(Long studentId, Long assignmentId, Double score, Long gradedById) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
        
        Long courseId = assignment.getCourse().getId();
        
        GradeDTO gradeDTO = new GradeDTO(
                null, studentId, courseId, null, assignmentId, GradeType.ASSIGNMENT,
                score, 100.0, 1.0, null, gradedById, LocalDateTime.now(),
                false, false, null, null, null, null, true, null, null
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
} 