package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Thread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findByForumId(Long forumId);
    List<Thread> findByForumIdAndActive(Long forumId, boolean active);
    List<Thread> findByAuthorId(Long authorId);
    List<Thread> findByAuthorIdAndActive(Long authorId, boolean active);
    
    @Query("SELECT t FROM Thread t LEFT JOIN FETCH t.comments WHERE t.id = :id")
    Thread findByIdWithComments(Long id);
    
    @Query("SELECT t FROM Thread t LEFT JOIN FETCH t.comments WHERE t.forum.id = :forumId")
    List<Thread> findByForumIdWithComments(Long forumId);
    
    @Query("SELECT t FROM Thread t WHERE t.forum.id = :forumId ORDER BY t.pinned DESC, t.lastActivityAt DESC")
    Page<Thread> findByForumIdOrderByPinnedAndLastActivity(Long forumId, Pageable pageable);
} 