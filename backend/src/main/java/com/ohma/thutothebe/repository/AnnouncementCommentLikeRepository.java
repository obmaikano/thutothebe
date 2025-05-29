package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AnnouncementCommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnouncementCommentLikeRepository extends JpaRepository<AnnouncementCommentLike, Long> {

    @Query("SELECT l FROM AnnouncementCommentLike l WHERE l.comment.id = :commentId AND l.user.id = :userId")
    Optional<AnnouncementCommentLike> findByCommentIdAndUserId(@Param("commentId") Long commentId, @Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM AnnouncementCommentLike l WHERE l.comment.id = :commentId AND l.active = true")
    long countByCommentIdAndActiveTrue(@Param("commentId") Long commentId);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM AnnouncementCommentLike l WHERE l.comment.id = :commentId AND l.user.id = :userId AND l.active = true")
    boolean existsByCommentIdAndUserIdAndActiveTrue(@Param("commentId") Long commentId, @Param("userId") Long userId);
} 