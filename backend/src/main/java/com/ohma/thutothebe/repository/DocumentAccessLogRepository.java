package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.DocumentAccessLog;
import com.ohma.thutothebe.entity.DocumentAccessType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DocumentAccessLogRepository extends JpaRepository<DocumentAccessLog, Long> {

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findAllOrderByAccessedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.document.id = :documentId ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findByDocumentIdOrderByAccessedAtDesc(@Param("documentId") Long documentId, Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.user.id = :userId ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findByUserIdOrderByAccessedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.accessType = :accessType ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findByAccessTypeOrderByAccessedAtDesc(@Param("accessType") DocumentAccessType accessType, Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.success = :success ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findBySuccessOrderByAccessedAtDesc(@Param("success") boolean success, Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.accessedAt BETWEEN :startDate AND :endDate ORDER BY dal.accessedAt DESC")
    Page<DocumentAccessLog> findByAccessedAtBetweenOrderByAccessedAtDesc(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.document.id = :documentId AND dal.user.id = :userId ORDER BY dal.accessedAt DESC")
    List<DocumentAccessLog> findByDocumentIdAndUserIdOrderByAccessedAtDesc(@Param("documentId") Long documentId, @Param("userId") Long userId);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.document.id = :documentId AND dal.accessType = :accessType ORDER BY dal.accessedAt DESC")
    List<DocumentAccessLog> findByDocumentIdAndAccessTypeOrderByAccessedAtDesc(@Param("documentId") Long documentId, @Param("accessType") DocumentAccessType accessType);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.user.id = :userId AND dal.accessType = :accessType ORDER BY dal.accessedAt DESC")
    List<DocumentAccessLog> findByUserIdAndAccessTypeOrderByAccessedAtDesc(@Param("userId") Long userId, @Param("accessType") DocumentAccessType accessType);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.ipAddress = :ipAddress ORDER BY dal.accessedAt DESC")
    List<DocumentAccessLog> findByIpAddressOrderByAccessedAtDesc(@Param("ipAddress") String ipAddress);

    @EntityGraph(attributePaths = {"document", "user"})
    @Query("SELECT dal FROM DocumentAccessLog dal WHERE dal.sessionId = :sessionId ORDER BY dal.accessedAt DESC")
    List<DocumentAccessLog> findBySessionIdOrderByAccessedAtDesc(@Param("sessionId") String sessionId);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.document.id = :documentId")
    Long countByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.document.id = :documentId AND dal.accessType = :accessType")
    Long countByDocumentIdAndAccessType(@Param("documentId") Long documentId, @Param("accessType") DocumentAccessType accessType);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.user.id = :userId AND dal.accessType = :accessType")
    Long countByUserIdAndAccessType(@Param("userId") Long userId, @Param("accessType") DocumentAccessType accessType);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.accessedAt BETWEEN :startDate AND :endDate")
    Long countByAccessedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.document.id = :documentId AND dal.accessedAt BETWEEN :startDate AND :endDate")
    Long countByDocumentIdAndAccessedAtBetween(@Param("documentId") Long documentId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(dal) FROM DocumentAccessLog dal WHERE dal.user.id = :userId AND dal.accessedAt BETWEEN :startDate AND :endDate")
    Long countByUserIdAndAccessedAtBetween(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT dal.accessType, COUNT(dal) FROM DocumentAccessLog dal WHERE dal.document.id = :documentId GROUP BY dal.accessType")
    List<Object[]> getAccessTypeStatsByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT dal.accessType, COUNT(dal) FROM DocumentAccessLog dal WHERE dal.user.id = :userId GROUP BY dal.accessType")
    List<Object[]> getAccessTypeStatsByUserId(@Param("userId") Long userId);
} 