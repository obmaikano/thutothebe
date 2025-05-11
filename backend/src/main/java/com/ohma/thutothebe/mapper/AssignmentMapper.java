package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AssignmentMapper implements BaseDtoMapper<Assignment, AssignmentDTO> {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AssignmentDTO toDto(Assignment assignment) {
        return new AssignmentDTO(
            assignment.getId(),
            assignment.getTitle(),
            assignment.getDescription(),
            assignment.getCourse().getId(),
            assignment.getInstructor().getId(),
            assignment.getDueDate(),
            assignment.getStatus()
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