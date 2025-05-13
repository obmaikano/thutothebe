package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ThreadDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ThreadService extends BaseService<ThreadDTO, Long> {
    List<ThreadDTO> findByForumId(Long forumId);
    List<ThreadDTO> findByForumIdAndActive(Long forumId, boolean active);
    List<ThreadDTO> findByAuthorId(Long authorId);
    List<ThreadDTO> findByAuthorIdAndActive(Long authorId, boolean active);
    ThreadDTO findByIdWithComments(Long id);
    List<ThreadDTO> findByForumIdWithComments(Long forumId);
    Page<ThreadDTO> findByForumIdOrderByPinnedAndLastActivity(Long forumId, Pageable pageable);
} 