package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceEnhancedTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubmissionMapper submissionMapper;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    private Submission submission;
    private SubmissionDTO submissionDTO;
    private User reviewer;

    @BeforeEach
    void setUp() {
        submission = new Submission();
        submission.setId(1L);
        submission.setScore(85.0);
        submission.setMaxScore(100.0);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setNeedsReview(true);

        submissionDTO = new SubmissionDTO(
            1L,                          // id
            1L,                          // studentId
            1L,                          // courseId
            1L,                          // assignmentId
            "Test content",              // content
            LocalDateTime.now(),         // submittedAt
            null,                        // phase
            SubmissionStatus.GRADED,     // status
            null,                        // assessments
            null,                        // finalScore
            "Good work",                 // feedback
            LocalDateTime.now(),         // createdAt
            LocalDateTime.now(),         // updatedAt
            85.0,                        // score
            100.0,                       // maxScore
            85.0,                        // percentage
            "B",                         // grade
            "Comments",                  // comments
            null,                        // filePaths
            LocalDateTime.now(),         // gradedAt
            1L,                          // gradedBy
            1,                           // attemptNumber
            false,                       // isLateSubmission
            false,                       // needsReview
            null,                        // originalFileName
            null,                        // fileSize
            false,                       // autoGraded
            false,                       // manuallyGraded
            LocalDateTime.now(),         // reviewedAt
            1L,                          // reviewedBy
            null,                        // studentComments
            null,                        // rubricScores
            1,                           // timeSpent
            true                         // plagiarismChecked
        );

        reviewer = new User();
        reviewer.setId(1L);
        reviewer.setUsername("reviewer");
    }

    @Test
    void whenGetSubmissionsNeedingReviewByTeacher_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);

        when(submissionRepository.findNeedingReviewByTeacherId(1L)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getSubmissionsNeedingReviewByTeacher(1L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findNeedingReviewByTeacherId(1L);
    }

    @Test
    void whenGradeSubmissionWithDetails_thenReturnGradedSubmission() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.gradeSubmissionWithDetails(
            1L, 90.0, 90.0, "A-", "Excellent work", "rubric scores"
        );

        assertThat(result).isNotNull();
        assertThat(result.score()).isEqualTo(85.0); // From the mocked DTO
        verify(submissionRepository).findById(1L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenGradeSubmissionWithDetails_andCalculatePercentage_thenCalculateCorrectly() {
        submission.setMaxScore(100.0);
        
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        submissionService.gradeSubmissionWithDetails(1L, 85.0, null, "B", "Good work", null);

        verify(submissionRepository).save(argThat(sub -> 
            sub.getPercentage() != null && sub.getPercentage() == 85.0
        ));
    }

    @Test
    void whenReturnSubmissionToStudent_thenReturnSubmission() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.returnSubmissionToStudent(1L, "Please revise");

        assertThat(result).isNotNull();
        verify(submissionRepository).save(argThat(sub -> 
            sub.getStatus() == SubmissionStatus.RETURNED
        ));
    }

    @Test
    void whenMarkSubmissionReviewed_thenMarkAsReviewed() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(1L)).thenReturn(Optional.of(reviewer));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.markSubmissionReviewed(1L, 1L);

        assertThat(result).isNotNull();
        verify(submissionRepository).save(argThat(sub -> 
            !sub.isNeedsReview() && sub.getReviewedBy() != null
        ));
    }

    @Test
    void whenUploadSubmissionFile_thenUploadSuccessfully() throws Exception {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);
        when(multipartFile.getOriginalFilename()).thenReturn("test.pdf");
        when(multipartFile.getSize()).thenReturn(1024L);
        when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream("test content".getBytes()));

        SubmissionDTO result = submissionService.uploadSubmissionFile(1L, multipartFile);

        assertThat(result).isNotNull();
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenDeleteSubmissionFile_thenDeleteSuccessfully() {
        submission.setFilePaths("uploads/submissions/1/test.pdf");
        
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.deleteSubmissionFile(1L, "test.pdf");

        assertThat(result).isNotNull();
        verify(submissionRepository).save(argThat(sub -> 
            sub.getFilePaths() == null && sub.getOriginalFileName() == null
        ));
    }

    @Test
    void whenGradeMultipleSubmissions_thenGradeAll() {
        List<Long> submissionIds = Arrays.asList(1L, 2L);
        List<Submission> submissions = Arrays.asList(submission, submission);
        
        when(submissionRepository.findByIdIn(submissionIds)).thenReturn(submissions);
        when(submissionRepository.saveAll(any())).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.gradeMultipleSubmissions(
            submissionIds, 90.0, "Good work"
        );

        assertThat(results).hasSize(2);
        verify(submissionRepository).saveAll(any());
    }

    @Test
    void whenReturnMultipleSubmissions_thenReturnAll() {
        List<Long> submissionIds = Arrays.asList(1L, 2L);
        List<Submission> submissions = Arrays.asList(submission, submission);
        
        when(submissionRepository.findByIdIn(submissionIds)).thenReturn(submissions);
        when(submissionRepository.saveAll(any())).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.returnMultipleSubmissions(
            submissionIds, "Please revise"
        );

        assertThat(results).hasSize(2);
        verify(submissionRepository).saveAll(argThat(subs -> 
            ((List<Submission>) subs).stream().allMatch(sub -> sub.getStatus() == SubmissionStatus.RETURNED)
        ));
    }

    @Test
    void whenGradeNonExistentSubmission_thenThrowException() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> submissionService.gradeSubmissionWithDetails(
            1L, 90.0, 90.0, "A", "Good work", null
        )).isInstanceOf(ResourceNotFoundException.class)
          .hasMessageContaining("Submission not found");
    }

    @Test
    void whenMarkReviewedWithNonExistentReviewer_thenThrowException() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> submissionService.markSubmissionReviewed(1L, 1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Reviewer not found");
    }

    @Test
    void whenUploadFileToNonExistentSubmission_thenThrowException() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> submissionService.uploadSubmissionFile(1L, multipartFile))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Submission not found");
    }
} 