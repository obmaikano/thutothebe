package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AnnouncementComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementCommentRepository extends JpaRepository<AnnouncementComment, Long> {

    @Query("SELECT c FROM AnnouncementComment c WHERE c.announcement.id = :announcementId AND c.parentComment IS NULL AND c.active = true ORDER BY c.createdAt ASC")
    List<AnnouncementComment> findByAnnouncementIdAndParentCommentIsNull(@Param("announcementId") Long announcementId);

    @Query("SELECT c FROM AnnouncementComment c WHERE c.announcement.id = :announcementId AND c.active = true ORDER BY c.createdAt ASC")
    List<AnnouncementComment> findByAnnouncementIdAndActiveTrue(@Param("announcementId") Long announcementId);

    @Query("SELECT c FROM AnnouncementComment c WHERE c.parentComment.id = :parentId AND c.active = true ORDER BY c.createdAt ASC")
    List<AnnouncementComment> findByParentCommentIdAndActiveTrue(@Param("parentId") Long parentId);

    @Query("SELECT COUNT(c) FROM AnnouncementComment c WHERE c.announcement.id = :announcementId AND c.active = true")
    long countByAnnouncementIdAndActiveTrue(@Param("announcementId") Long announcementId);

    @Query("SELECT c FROM AnnouncementComment c WHERE c.author.id = :authorId AND c.active = true ORDER BY c.createdAt DESC")
    List<AnnouncementComment> findByAuthorIdAndActiveTrue(@Param("authorId") Long authorId);
} 