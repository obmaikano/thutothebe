package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CommentDTO;
import java.util.List;

public interface CommentService extends BaseService<CommentDTO, Long> {
    List<CommentDTO> findByThreadId(Long threadId);
    List<CommentDTO> findByThreadIdAndActive(Long threadId, boolean active);
    List<CommentDTO> findByAuthorId(Long authorId);
    List<CommentDTO> findByAuthorIdAndActive(Long authorId, boolean active);
    List<CommentDTO> findByParentId(Long parentId);
    List<CommentDTO> findByParentIdAndActive(Long parentId, boolean active);
    CommentDTO findByIdWithReplies(Long id);
    List<CommentDTO> findTopLevelCommentsByThreadId(Long threadId);
    List<CommentDTO> findRepliesByParentId(Long parentId);
} 