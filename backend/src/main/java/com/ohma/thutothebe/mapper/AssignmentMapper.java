package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AssignmentMapper implements BaseDtoMapper<Assignment, AssignmentDTO> {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AssignmentDTO toDto(Assignment assignment) {
        return new AssignmentDTO(
            assignment.getId(),                                                          // 1. id
            assignment.getTitle(),                                                       // 2. title
            assignment.getDescription(),                                                 // 3. description
            (String) null,                                                              // 4. instructions
            assignment.getCode(),                                                        // 5. code
            assignment.getCourse().getId(),                                             // 6. courseId
            assignment.getInstructor().getId(),                                         // 7. instructorId
            (Long) null,                                                                // 8. categoryId
            assignment.getDueDate(),                                                    // 9. dueDate
            assignment.getCreatedAt(),                                                  // 10. createdAt
            assignment.getTotalPoints() != null ? assignment.getTotalPoints().doubleValue() : null, // 11. maxScore
            (Double) null,                                                              // 12. weight
            assignment.isAllowLateSubmissions(),                                        // 13. allowLateSubmissions
            (Double) null,                                                              // 14. latePenalty
            assignment.getMaxAttempts(),                                                // 15. maxAttempts
            (Boolean) null,                                                             // 16. shuffleQuestions
            (Integer) null,                                                             // 17. timeLimit
            (String) null,                                                              // 18. rubricId
            (String) null,                                                              // 19. gradingCriteria
            (Long) null,                                                                // 20. estimatedDuration
            (Long) null,                                                                // 21. difficultyLevel
            assignment.getGradingType() != null ? assignment.getGradingType().toString() : null, // 22. gradingType
            (Boolean) null,                                                             // 23. requiresSubmissionFile
            (Boolean) null,                                                             // 24. allowMultipleFiles
            (Boolean) null,                                                             // 25. showCorrectAnswers
            (Boolean) null,                                                             // 26. randomizeQuestions
            assignment.getStatus(),                                                     // 27. status
            (String) null,                                                              // 28. tags
            (Integer) null,                                                             // 29. passingScore
            (String) null,                                                              // 30. attachments
            (String) null,                                                              // 31. resources
            (Integer) null,                                                             // 32. submissionCount
            (Integer) null,                                                             // 33. gradedCount
            (String) null,                                                              // 34. visibility
            assignment.isActive(),                                                      // 35. active
            (LocalDateTime) null,                                                       // 36. publishedAt
            assignment.getModifiedAt()                                                  // 37. updatedAt
        );
    }

    @Override
    public Assignment toEntity(AssignmentDTO dto) {
        Assignment assignment = new Assignment();
        assignment.setId(dto.id());
        assignment.setTitle(dto.title());
        assignment.setDescription(dto.description());
        assignment.setCourse(dto.courseId() != null ? courseRepository.findById(dto.courseId()).isPresent() ? courseRepository.findById(dto.courseId()).get() : null : null);
        assignment.setInstructor(dto.instructorId() != null ? userRepository.findById(dto.instructorId()).isPresent() ? userRepository.findById(dto.instructorId()).get() : null : null);
        assignment.setDueDate(dto.dueDate());
        assignment.setStatus(dto.status());
        return assignment;
    }
} 