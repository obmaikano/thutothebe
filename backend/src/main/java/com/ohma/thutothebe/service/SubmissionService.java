package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SubmissionService extends BaseService<SubmissionDTO, Long> {
    
    List<SubmissionDTO> getSubmissionsByUserId(Long userId);
    
    List<SubmissionDTO> getSubmissionsByCourseId(Long courseId);
    
    List<SubmissionDTO> getSubmissionsByCourseIdAndPhase(Long courseId, SubmissionPhase phase);
    
    SubmissionDTO updateSubmissionPhase(Long id, SubmissionPhase phase);
    
    List<SubmissionDTO> getOtherSubmissionsByCourseId(Long courseId, Long userId);
    
    long countSubmissionsByCourseId(Long courseId);
    
    SubmissionDTO calculateFinalScore(Long id);

    SubmissionDTO getSubmissionByAssignmentAndStudent(Long assignmentId, Long studentId);

    List<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId);

    List<SubmissionDTO> getSubmissionsByStudent(Long studentId);

    List<SubmissionDTO> getGradedSubmissionsByAssignment(Long assignmentId);

    List<SubmissionDTO> getGradedSubmissionsByStudent(Long studentId);

    SubmissionDTO gradeSubmission(Long submissionId, int score, String feedback);

    boolean existsByAssignmentAndStudent(Long assignmentId, Long studentId);

    List<SubmissionDTO> getSubmissionsByTeacher(Long teacherId);

    List<SubmissionDTO> getPendingSubmissionsByTeacher(Long teacherId);

    List<SubmissionDTO> getLateSubmissionsByTeacher(Long teacherId);

    List<SubmissionDTO> getPendingSubmissionsByCourse(Long courseId);

    List<SubmissionDTO> getLateSubmissionsByCourse(Long courseId);
    
    // Additional methods expected by tests
    SubmissionDTO gradeSubmissionWithDetails(Long submissionId, Double score, Double maxScore, String grade, String feedback, String rubricScores);
    SubmissionDTO markSubmissionReviewed(Long submissionId, Long reviewerId);
    List<SubmissionDTO> gradeMultipleSubmissions(List<Long> submissionIds, Double score, String feedback);
    List<SubmissionDTO> returnMultipleSubmissions(List<Long> submissionIds, String feedback);
    List<SubmissionDTO> getSubmissionsNeedingReviewByTeacher(Long teacherId);
    List<SubmissionDTO> getSubmissionsByCourse(Long courseId);
    SubmissionDTO returnSubmissionToStudent(Long submissionId, String feedback);
    SubmissionDTO uploadSubmissionFile(Long submissionId, MultipartFile file);
    SubmissionDTO deleteSubmissionFile(Long submissionId, String fileName);
} 