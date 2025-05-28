package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AssignmentQuestion;
import com.ohma.thutothebe.entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestion, Long> {

    /**
     * Find questions by assignment ID
     */
    @Query("SELECT aq FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.active = true ORDER BY aq.orderIndex")
    List<AssignmentQuestion> findByAssignmentIdAndActiveTrue(@Param("assignmentId") Long assignmentId);

    /**
     * Find auto-gradable questions by assignment ID
     */
    @Query("SELECT aq FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.autoGradable = true AND aq.active = true ORDER BY aq.orderIndex")
    List<AssignmentQuestion> findAutoGradableByAssignmentId(@Param("assignmentId") Long assignmentId);

    /**
     * Find manual-gradable questions by assignment ID
     */
    @Query("SELECT aq FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.autoGradable = false AND aq.active = true ORDER BY aq.orderIndex")
    List<AssignmentQuestion> findManualGradableByAssignmentId(@Param("assignmentId") Long assignmentId);

    /**
     * Find questions by type
     */
    List<AssignmentQuestion> findByTypeAndActiveTrue(QuestionType type);

    /**
     * Count total points for an assignment
     */
    @Query("SELECT SUM(aq.points) FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.active = true")
    Integer sumPointsByAssignmentId(@Param("assignmentId") Long assignmentId);

    /**
     * Count auto-gradable points for an assignment
     */
    @Query("SELECT SUM(aq.points) FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.autoGradable = true AND aq.active = true")
    Integer sumAutoGradablePointsByAssignmentId(@Param("assignmentId") Long assignmentId);

    /**
     * Count manual-gradable points for an assignment
     */
    @Query("SELECT SUM(aq.points) FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.autoGradable = false AND aq.active = true")
    Integer sumManualGradablePointsByAssignmentId(@Param("assignmentId") Long assignmentId);

    /**
     * Check if assignment has auto-gradable questions
     */
    @Query("SELECT COUNT(aq) > 0 FROM AssignmentQuestion aq WHERE aq.assignment.id = :assignmentId AND aq.autoGradable = true AND aq.active = true")
    boolean hasAutoGradableQuestions(@Param("assignmentId") Long assignmentId);
} 