package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.GradeCategoryDTO;
import com.ohma.thutothebe.entity.GradeCategory;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GradeCategoryMapper implements BaseDtoMapper<GradeCategory, GradeCategoryDTO> {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public GradeCategoryDTO toDto(GradeCategory category) {
        return new GradeCategoryDTO(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getWeight(),
            category.getCourse().getId(),
            category.isActive(),
            category.getMinGrade(),
            category.getMaxGrade(),
            category.getPassingGrade()
        );
    }

    @Override
    public GradeCategory toEntity(GradeCategoryDTO dto) {
        GradeCategory category = new GradeCategory();
        category.setId(dto.id());
        category.setName(dto.name());
        category.setDescription(dto.description());
        category.setWeight(dto.weight());
        category.setCourse(courseRepository.findById(dto.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + dto.courseId())));
        category.setActive(dto.active());
        category.setMinGrade(dto.minGrade());
        category.setMaxGrade(dto.maxGrade());
        category.setPassingGrade(dto.passingGrade());
        return category;
    }

    public void updateEntityFromDto(GradeCategoryDTO dto, GradeCategory category) {
        if (dto == null || category == null) {
            return;
        }

        category.setName(dto.name());
        category.setDescription(dto.description());
        category.setWeight(dto.weight());
        category.setActive(dto.active());
        category.setMinGrade(dto.minGrade());
        category.setMaxGrade(dto.maxGrade());
        category.setPassingGrade(dto.passingGrade());
    }
} 