package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.GradeDTO;
import com.ohma.thutothebe.entity.Grade;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Assessment;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.GradeCategory;
import com.ohma.thutothebe.mapper.BaseDtoMapper;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.AssessmentRepository;
import com.ohma.thutothebe.repository.AssignmentRepository;
import com.ohma.thutothebe.repository.GradeCategoryRepository;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GradeMapper implements BaseDtoMapper<Grade, GradeDTO> {

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

    @Override
    public GradeDTO toDto(Grade entity) {
        if (entity == null) {
            return null;
        }

        return new GradeDTO(
                entity.getId(),
                entity.getStudent() != null ? entity.getStudent().getId() : null,
                entity.getCourse() != null ? entity.getCourse().getId() : null,
                entity.getGradeCategory() != null ? entity.getGradeCategory().getId() : null,
                entity.getAssessment() != null ? entity.getAssessment().getId() : null,
                entity.getAssignment() != null ? entity.getAssignment().getId() : null,
                entity.getGradeType(),
                entity.getScore(),
                entity.getMaxScore(),
                entity.getWeight(),
                entity.getFeedback(),
                entity.getGradedBy() != null ? entity.getGradedBy().getId() : null,
                entity.getGradedAt(),
                entity.isFinal(),
                entity.isModerated(),
                entity.getModeratedBy() != null ? entity.getModeratedBy().getId() : null,
                entity.getModeratedAt(),
                entity.getModerationNotes(),
                entity.getOriginalScore(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getModifiedAt()
        );
    }

    @Override
    public Grade toEntity(GradeDTO dto) {
        if (dto == null) {
            return null;
        }

        Grade grade = new Grade();
        grade.setId(dto.id());
        grade.setScore(dto.score());
        grade.setMaxScore(dto.maxScore());
        grade.setWeight(dto.weight());
        grade.setGradeType(dto.gradeType());
        grade.setFeedback(dto.feedback());
        grade.setGradedAt(dto.gradedAt());
        grade.setFinal(dto.isFinal());
        grade.setModerated(dto.isModerated());
        grade.setModeratedAt(dto.moderatedAt());
        grade.setModerationNotes(dto.moderationNotes());
        grade.setOriginalScore(dto.originalScore());
        grade.setActive(dto.active());

        // Map entity references using repositories
        if (dto.studentId() != null) {
            User student = userRepository.findById(dto.studentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.studentId()));
            grade.setStudent(student);
        }

        if (dto.courseId() != null) {
            Course course = courseRepository.findById(dto.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.courseId()));
            grade.setCourse(course);
        }

        if (dto.gradeCategoryId() != null) {
            GradeCategory gradeCategory = gradeCategoryRepository.findById(dto.gradeCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grade category not found with id: " + dto.gradeCategoryId()));
            grade.setGradeCategory(gradeCategory);
        }

        if (dto.assessmentId() != null) {
            Assessment assessment = assessmentRepository.findById(dto.assessmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with id: " + dto.assessmentId()));
            grade.setAssessment(assessment);
        }

        if (dto.assignmentId() != null) {
            Assignment assignment = assignmentRepository.findById(dto.assignmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + dto.assignmentId()));
            grade.setAssignment(assignment);
        }

        if (dto.gradedById() != null) {
            User gradedBy = userRepository.findById(dto.gradedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Graded by user not found with id: " + dto.gradedById()));
            grade.setGradedBy(gradedBy);
        }

        if (dto.moderatedById() != null) {
            User moderatedBy = userRepository.findById(dto.moderatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Moderated by user not found with id: " + dto.moderatedById()));
            grade.setModeratedBy(moderatedBy);
        }

        return grade;
    }

    public Grade toEntityWithReferences(GradeDTO dto, User student, Course course, GradeCategory gradeCategory,
                                       Assessment assessment, Assignment assignment, User gradedBy, User moderatedBy) {
        Grade grade = new Grade();
        grade.setId(dto.id());
        grade.setScore(dto.score());
        grade.setMaxScore(dto.maxScore());
        grade.setWeight(dto.weight());
        grade.setGradeType(dto.gradeType());
        grade.setFeedback(dto.feedback());
        grade.setGradedAt(dto.gradedAt());
        grade.setFinal(dto.isFinal());
        grade.setModerated(dto.isModerated());
        grade.setModeratedAt(dto.moderatedAt());
        grade.setModerationNotes(dto.moderationNotes());
        grade.setOriginalScore(dto.originalScore());
        grade.setActive(dto.active());

        // Set provided entity references directly
        grade.setStudent(student);
        grade.setCourse(course);
        grade.setGradeCategory(gradeCategory);
        grade.setAssessment(assessment);
        grade.setAssignment(assignment);
        grade.setGradedBy(gradedBy);
        grade.setModeratedBy(moderatedBy);

        return grade;
    }
} 