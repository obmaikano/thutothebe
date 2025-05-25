package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.AnnouncementAcknowledgment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementAcknowledgmentRepository extends JpaRepository<AnnouncementAcknowledgment, Long> {

    @Query("SELECT aa FROM AnnouncementAcknowledgment aa WHERE aa.announcement.id = :announcementId AND aa.user.id = :userId")
    Optional<AnnouncementAcknowledgment> findByAnnouncementIdAndUserId(@Param("announcementId") Long announcementId, 
                                                                      @Param("userId") Long userId);

    @Query("SELECT aa FROM AnnouncementAcknowledgment aa WHERE aa.announcement.id = :announcementId")
    List<AnnouncementAcknowledgment> findByAnnouncementId(@Param("announcementId") Long announcementId);

    @Query("SELECT aa FROM AnnouncementAcknowledgment aa WHERE aa.user.id = :userId ORDER BY aa.acknowledgedAt DESC")
    List<AnnouncementAcknowledgment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(aa) FROM AnnouncementAcknowledgment aa WHERE aa.announcement.id = :announcementId")
    Long countByAnnouncementId(@Param("announcementId") Long announcementId);

    @Query("SELECT COUNT(aa) FROM AnnouncementAcknowledgment aa WHERE aa.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    boolean existsByAnnouncementIdAndUserId(Long announcementId, Long userId);
} 