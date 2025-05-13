package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByThreadId(Long threadId);
    List<Comment> findByThreadIdAndActive(Long threadId, boolean active);
    List<Comment> findByAuthorId(Long authorId);
    List<Comment> findByAuthorIdAndActive(Long authorId, boolean active);
    List<Comment> findByParentId(Long parentId);
    List<Comment> findByParentIdAndActive(Long parentId, boolean active);
    
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.replies WHERE c.id = :id")
    Comment findByIdWithReplies(Long id);
    
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.replies WHERE c.thread.id = :threadId AND c.parent IS NULL")
    List<Comment> findTopLevelCommentsByThreadId(Long threadId);
    
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.replies WHERE c.parent.id = :parentId")
    List<Comment> findRepliesByParentId(Long parentId);
} 