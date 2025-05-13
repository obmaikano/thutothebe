package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ProgressDTO;
import java.util.List;

public interface ProgressService extends BaseService<ProgressDTO, Long> {
    
    List<ProgressDTO> getByStudent(Long studentId);
    
    List<ProgressDTO> getByCourse(Long courseId);
    
    ProgressDTO getByStudentAndCourse(Long studentId, Long courseId);
    
    List<ProgressDTO> getActiveByStudent(Long studentId);
    
    List<ProgressDTO> getActiveByCourse(Long courseId);
    
    List<ProgressDTO> getCompletedByStudent(Long studentId);
    
    List<ProgressDTO> getCompletedByCourse(Long courseId);
    
    Double getAverageGradeByCourse(Long courseId);
    
    Double getAverageCompletionByCourse(Long courseId);
    
    ProgressDTO updateProgress(Long studentId, Long courseId, Double completionPercentage, Double grade);
} 