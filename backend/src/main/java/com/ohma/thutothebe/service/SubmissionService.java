package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.User;

import java.util.List;

public interface SubmissionService extends BaseService<SubmissionDTO, Long> {
    SubmissionDTO getSubmissionByAssignmentAndStudent(Assignment assignment, User student);
    List<SubmissionDTO> getSubmissionsByAssignment(Assignment assignment);
    List<SubmissionDTO> getSubmissionsByStudent(User student);
    List<SubmissionDTO> getGradedSubmissionsByAssignment(Assignment assignment);
    List<SubmissionDTO> getGradedSubmissionsByStudent(User student);
    boolean existsByAssignmentAndStudent(Assignment assignment, User student);
    SubmissionDTO gradeSubmission(Long id, Integer score, String feedback);
} 