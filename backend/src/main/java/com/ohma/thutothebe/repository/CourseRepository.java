package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseType;
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
    
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.courseInstructors ci " +
           "LEFT JOIN FETCH ci.teacher " +
           "LEFT JOIN FETCH c.subject " +
           "WHERE c.active = :active")
    List<Course> findByActive(@Param("active") boolean active);
    
    List<Course> findBySubject(Subject subject);
    
    List<Course> findBySubjectIdAndActive(Long subjectId, boolean active);
    
    List<Course> findByClassEntityId(Long classId);
    
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.courseInstructors ci " +
           "LEFT JOIN FETCH ci.teacher " +
           "LEFT JOIN FETCH c.subject " +
           "WHERE c.classEntity.id = :classId AND c.active = :active")
    List<Course> findByClassEntityIdAndActive(@Param("classId") Long classId, @Param("active") boolean active);
    
    List<Course> findByTerm(Term term);
    
    List<Course> findByYear(Integer year);
    
    List<Course> findByType(CourseType type);
    
    List<Course> findByTypeAndActive(CourseType type, boolean active);
    
    boolean existsByCode(String code);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Course> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.active = true")
    List<Course> findByTeacherIdAndActive(@Param("teacherId") Long teacherId);
} 