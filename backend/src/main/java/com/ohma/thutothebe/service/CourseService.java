package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.User;

import java.util.List;
import java.util.Set;

public interface CourseService extends BaseService<CourseDTO, Long> {
    CourseDTO getCourseByCode(String code);
    Set<CourseDTO> getCoursesByTeacher(User teacher);
    List<CourseDTO> findByEnrolledStudentId(Long studentId);
    Set<CourseDTO> getActiveCourses();
    List<CourseDTO> findByInstructorId(Long instructorId);
    CourseDTO enrollStudent(Long courseId, Long studentId);
    CourseDTO unenrollStudent(Long courseId, Long studentId);
    boolean existsByCode(String code);
} 