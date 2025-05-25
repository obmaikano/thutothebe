package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AnnouncementReadReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementReadReceiptRepository extends JpaRepository<AnnouncementReadReceipt, Long> {

    @Query("SELECT arr FROM AnnouncementReadReceipt arr WHERE arr.announcement.id = :announcementId AND arr.user.id = :userId")
    Optional<AnnouncementReadReceipt> findByAnnouncementIdAndUserId(@Param("announcementId") Long announcementId, 
                                                                   @Param("userId") Long userId);

    @Query("SELECT arr FROM AnnouncementReadReceipt arr WHERE arr.announcement.id = :announcementId")
    List<AnnouncementReadReceipt> findByAnnouncementId(@Param("announcementId") Long announcementId);

    @Query("SELECT arr FROM AnnouncementReadReceipt arr WHERE arr.user.id = :userId ORDER BY arr.readAt DESC")
    List<AnnouncementReadReceipt> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(arr) FROM AnnouncementReadReceipt arr WHERE arr.announcement.id = :announcementId")
    Long countByAnnouncementId(@Param("announcementId") Long announcementId);

    @Query("SELECT COUNT(arr) FROM AnnouncementReadReceipt arr WHERE arr.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    boolean existsByAnnouncementIdAndUserId(Long announcementId, Long userId);
} 