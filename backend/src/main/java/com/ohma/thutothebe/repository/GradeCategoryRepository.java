package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.GradeCategory;
import com.ohma.thutothebe.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeCategoryRepository extends JpaRepository<GradeCategory, Long> {
    
    List<GradeCategory> findByCourse(Course course);
    
    List<GradeCategory> findByCourseAndActive(Course course, boolean active);
    
    @Query("SELECT SUM(gc.weight) FROM GradeCategory gc WHERE gc.course = :course AND gc.active = true")
    Double findTotalWeightByCourse(@Param("course") Course course);
    
    @Query("SELECT AVG(gc.passingGrade) FROM GradeCategory gc WHERE gc.course = :course AND gc.active = true")
    Double findAveragePassingGradeByCourse(@Param("course") Course course);
} 