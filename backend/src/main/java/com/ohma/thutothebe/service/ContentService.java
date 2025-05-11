package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.entity.ContentType;

import java.util.List;

public interface ContentService extends BaseService<ContentDTO, Long> {
    
    List<ContentDTO> getByCourse(Long courseId);
    
    List<ContentDTO> getByType(Long courseId, ContentType type);
    
    List<ContentDTO> getActiveByCourse(Long courseId);
    
    List<ContentDTO> getActiveByType(Long courseId, ContentType type);
    
    boolean existsByTitleAndCourse(String title, Long courseId);
} 