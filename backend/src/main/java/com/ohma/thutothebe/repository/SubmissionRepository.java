package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    List<Submission> findByAssignment(Assignment assignment);
    
    List<Submission> findByStudent(User student);
    
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);
    
    @Query("SELECT s FROM Submission s WHERE s.assignment = :assignment AND s.status = 'GRADED'")
    List<Submission> findGradedByAssignment(@Param("assignment") Assignment assignment);
    
    @Query("SELECT s FROM Submission s WHERE s.student = :student AND s.status = 'GRADED'")
    List<Submission> findGradedByStudent(@Param("student") User student);
    
    boolean existsByAssignmentAndStudent(Assignment assignment, User student);
} 