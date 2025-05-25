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

    @Query("SELECT c FROM Content c JOIN c.course co JOIN co.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Content> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT c FROM Content c JOIN c.course co JOIN co.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.active = :active")
    List<Content> findByTeacherIdAndActive(@Param("teacherId") Long teacherId, @Param("active") boolean active);

    @Query("SELECT c FROM Content c JOIN c.course co JOIN co.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.type = :type")
    List<Content> findByTeacherIdAndType(@Param("teacherId") Long teacherId, @Param("type") ContentType type);

    List<Content> findByCreatedById(Long userId);

    @Query("SELECT c FROM Content c WHERE c.createdBy.id = :userId AND c.active = :active")
    List<Content> findByCreatedByIdAndActive(@Param("userId") Long userId, @Param("active") boolean active);
} 