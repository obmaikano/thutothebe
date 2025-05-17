package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import org.apache.catalina.mapper.Mapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public interface CourseMapper extends BaseDtoMapper<Course, CourseDTO> {

    @Override
    CourseDTO toDto(Course course);

    @Override
    Course toEntity(CourseDTO dto);

    void updateEntityFromDto(CourseDTO dto, Course course);
} 