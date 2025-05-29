package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AnnouncementActivity;
import com.ohma.thutothebe.entity.AnnouncementActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementActivityRepository extends JpaRepository<AnnouncementActivity, Long> {

    @Query("SELECT a FROM AnnouncementActivity a WHERE a.announcement.id = :announcementId AND a.active = true ORDER BY a.createdAt DESC")
    List<AnnouncementActivity> findByAnnouncementIdAndActiveTrue(@Param("announcementId") Long announcementId);

    @Query("SELECT a FROM AnnouncementActivity a WHERE a.announcement.id = :announcementId AND a.type = :type AND a.active = true ORDER BY a.createdAt DESC")
    List<AnnouncementActivity> findByAnnouncementIdAndTypeAndActiveTrue(@Param("announcementId") Long announcementId, @Param("type") AnnouncementActivityType type);

    @Query("SELECT a FROM AnnouncementActivity a WHERE a.user.id = :userId AND a.active = true ORDER BY a.createdAt DESC")
    List<AnnouncementActivity> findByUserIdAndActiveTrue(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM AnnouncementActivity a WHERE a.announcement.id = :announcementId AND a.type = :type AND a.active = true")
    long countByAnnouncementIdAndTypeAndActiveTrue(@Param("announcementId") Long announcementId, @Param("type") AnnouncementActivityType type);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM AnnouncementActivity a WHERE a.announcement.id = :announcementId AND a.user.id = :userId AND a.type = :type AND a.active = true")
    boolean existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(@Param("announcementId") Long announcementId, @Param("userId") Long userId, @Param("type") AnnouncementActivityType type);
} 