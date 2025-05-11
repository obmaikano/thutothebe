package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByCourse(Course course);
    
    Optional<Assignment> findByCode(String code);
    
    List<Assignment> findByStatus(AssignmentStatus status);
    
    List<Assignment> findByCourseAndStatus(Course course, AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course = :course AND a.status = :status AND a.active = true")
    List<Assignment> findActiveByCourseAndStatus(@Param("course") Course course, @Param("status") AssignmentStatus status);
    
    boolean existsByCode(String code);
    
    @Query("SELECT a FROM Assignment a WHERE a.active = true")
    List<Assignment> findByActive(boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course = ?1 AND a.active = true")
    List<Assignment> findActiveByCourse(Course course);
} 