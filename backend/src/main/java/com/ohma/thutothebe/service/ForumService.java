package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ForumDTO;

public interface ForumService extends BaseService<ForumDTO, Long> {
    ForumDTO findByCourseId(Long courseId);
    ForumDTO findByCourseIdAndActive(Long courseId, boolean active);
    ForumDTO findByIdWithThreads(Long id);
    ForumDTO findByCourseIdWithThreads(Long courseId);
} 