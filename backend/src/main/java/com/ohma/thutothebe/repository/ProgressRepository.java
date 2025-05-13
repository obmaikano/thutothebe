package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Progress;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    
    List<Progress> findByStudent(User student);
    
    List<Progress> findByCourse(Course course);
    
    Optional<Progress> findByStudentAndCourse(User student, Course course);
    
    List<Progress> findByStudentAndActive(User student, boolean active);
    
    List<Progress> findByCourseAndActive(Course course, boolean active);
    
    @Query("SELECT p FROM Progress p WHERE p.student = :student AND p.completed = true")
    List<Progress> findCompletedByStudent(@Param("student") User student);
    
    @Query("SELECT p FROM Progress p WHERE p.course = :course AND p.completed = true")
    List<Progress> findCompletedByCourse(@Param("course") Course course);
    
    @Query("SELECT AVG(p.grade) FROM Progress p WHERE p.course = :course")
    Double findAverageGradeByCourse(@Param("course") Course course);
    
    @Query("SELECT AVG(p.completionPercentage) FROM Progress p WHERE p.course = :course")
    Double findAverageCompletionByCourse(@Param("course") Course course);
} 