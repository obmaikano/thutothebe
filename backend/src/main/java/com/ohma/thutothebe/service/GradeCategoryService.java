package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.GradeCategoryDTO;
import java.util.List;

public interface GradeCategoryService extends BaseService<GradeCategoryDTO, Long> {
    
    List<GradeCategoryDTO> getByCourse(Long courseId);
    
    List<GradeCategoryDTO> getActiveByCourse(Long courseId);
    
    Double getTotalWeightByCourse(Long courseId);
    
    Double getAveragePassingGradeByCourse(Long courseId);

} 