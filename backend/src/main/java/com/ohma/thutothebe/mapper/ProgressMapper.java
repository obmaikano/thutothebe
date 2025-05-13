package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ProgressDTO;
import com.ohma.thutothebe.entity.Progress;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProgressMapper implements BaseDtoMapper<Progress, ProgressDTO> {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ProgressDTO toDto(Progress progress) {
        return new ProgressDTO(
            progress.getId(),
            progress.getStudent().getId(),
            progress.getCourse().getId(),
            progress.getCompletionPercentage(),
            progress.getGrade(),
            progress.isCompleted(),
            progress.isActive(),
            progress.getLastActivityAt(),
            progress.getCompletedAt()
        );
    }

    @Override
    public Progress toEntity(ProgressDTO dto) {
        Progress progress = new Progress();
        progress.setId(dto.id());
        progress.setStudent(userRepository.findById(dto.studentId())
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + dto.studentId())));
        progress.setCourse(courseRepository.findById(dto.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + dto.courseId())));
        progress.setCompletionPercentage(dto.completionPercentage());
        progress.setGrade(dto.grade());
        progress.setCompleted(dto.completed());
        progress.setActive(dto.active());
        progress.setLastActivityAt(dto.lastActivityAt());
        progress.setCompletedAt(dto.completedAt());
        return progress;
    }

    public void updateEntityFromDto(ProgressDTO dto, Progress progress) {
        if (dto == null || progress == null) {
            return;
        }

        progress.setCompletionPercentage(dto.completionPercentage());
        progress.setGrade(dto.grade());
        progress.setCompleted(dto.completed());
        progress.setActive(dto.active());
        progress.setLastActivityAt(dto.lastActivityAt());
        progress.setCompletedAt(dto.completedAt());
    }
} 