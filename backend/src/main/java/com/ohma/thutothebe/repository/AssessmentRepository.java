package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assessment;
import com.ohma.thutothebe.entity.enums.AssessmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    @EntityGraph(attributePaths = {"submission", "assessor"})
    List<Assessment> findBySubmissionId(Long submissionId);

    @EntityGraph(attributePaths = {"submission", "assessor"})
    List<Assessment> findByAssessorId(Long assessorId);

    @EntityGraph(attributePaths = {"submission", "assessor"})
    List<Assessment> findBySubmissionIdAndStatus(Long submissionId, AssessmentStatus status);

    @Query("SELECT a FROM Assessment a WHERE a.submission.course.id = :courseId")
    @EntityGraph(attributePaths = {"submission", "assessor"})
    List<Assessment> findByCourseId(Long courseId);

    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.submission.id = :submissionId AND a.isSelfAssessment = true")
    long countSelfAssessmentsBySubmissionId(Long submissionId);

    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.submission.id = :submissionId AND a.isSelfAssessment = false")
    long countPeerAssessmentsBySubmissionId(Long submissionId);
} 