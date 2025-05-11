package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Content;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    
    List<Content> findByCourse(Course course);
    
    List<Content> findByCourseAndType(Course course, ContentType type);
    
    List<Content> findByCourseAndActive(Course course, boolean active);
    
    @Query("SELECT c FROM Content c WHERE c.course = :course AND c.type = :type AND c.active = true")
    List<Content> findActiveByCourseAndType(@Param("course") Course course, @Param("type") ContentType type);
    
    boolean existsByTitleAndCourse(String title, Course course);
} 