package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCode(String code);
    
    List<Course> findByActive(boolean active);
    
    List<Course> findBySubject(Subject subject);
    
    List<Course> findBySubjectIdAndActive(Long subjectId, boolean active);
    
    List<Course> findByClassEntityId(Long classId);
    
    List<Course> findByClassEntityIdAndActive(Long classId, boolean active);
    
    List<Course> findByTerm(Term term);
    
    List<Course> findByYear(Integer year);
    
    boolean existsByCode(String code);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Course> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.active = true")
    List<Course> findByTeacherIdAndActive(@Param("teacherId") Long teacherId);
} 