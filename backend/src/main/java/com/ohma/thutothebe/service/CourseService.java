package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Term;
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
    List<CourseDTO> getCoursesBySubjectId(Long subjectId);
    List<CourseDTO> getActiveCoursesbySubjectId(Long subjectId);
    List<CourseDTO> getCoursesByClassId(Long classId);
    List<CourseDTO> getActiveCoursesByClassId(Long classId);
    List<CourseDTO> getCoursesByTeacherId(Long teacherId);
    List<CourseDTO> getActiveCoursesByTeacherId(Long teacherId);
    List<CourseDTO> getCoursesByTerm(Term term);
    List<CourseDTO> getCoursesByYear(Integer year);
    CourseDTO createCourse(CourseDTO courseDTO);
    CourseDTO updateCourse(Long id, CourseDTO courseDTO);
    void deleteCourse(Long id);
    void activateCourse(Long id);
    void deactivateCourse(Long id);
    void addInstructorToCourse(Long courseId, Long teacherId, boolean isPrimary);
    void removeInstructorFromCourse(Long courseId, Long teacherId);
} 