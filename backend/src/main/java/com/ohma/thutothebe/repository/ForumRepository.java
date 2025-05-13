package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Forum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumRepository extends JpaRepository<Forum, Long> {
    List<Forum> findByCourseId(Long courseId);
    List<Forum> findByCourseIdAndActive(Long courseId, boolean active);
    
    @Query("SELECT f FROM Forum f LEFT JOIN FETCH f.threads WHERE f.id = :id")
    Forum findByIdWithThreads(Long id);
    
    @Query("SELECT f FROM Forum f LEFT JOIN FETCH f.threads WHERE f.course.id = :courseId")
    List<Forum> findByCourseIdWithThreads(Long courseId);
} 