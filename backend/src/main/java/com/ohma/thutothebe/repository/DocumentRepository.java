package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Document;
import com.ohma.thutothebe.entity.DocumentAccessLevel;
import com.ohma.thutothebe.entity.DocumentApprovalStatus;
import com.ohma.thutothebe.entity.DocumentCategory;
import com.ohma.thutothebe.entity.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.active = true")
    Page<Document> findAllActiveDocuments(Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.id = :id AND d.active = true")
    Optional<Document> findActiveDocumentById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId AND d.active = true")
    Page<Document> findBySchoolId(@Param("schoolId") Long schoolId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.region.id = :regionId AND d.active = true")
    Page<Document> findByRegionId(@Param("regionId") Long regionId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.classEntity.id = :classId AND d.active = true")
    Page<Document> findByClassId(@Param("classId") Long classId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.course.id = :courseId AND d.active = true")
    Page<Document> findByCourseId(@Param("courseId") Long courseId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.subject.id = :subjectId AND d.active = true")
    Page<Document> findBySubjectId(@Param("subjectId") Long subjectId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.uploadedBy.id = :userId AND d.active = true")
    Page<Document> findByUploadedById(@Param("userId") Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.documentCategory = :category AND d.active = true")
    Page<Document> findByDocumentCategory(@Param("category") DocumentCategory category, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.documentType = :type AND d.active = true")
    Page<Document> findByDocumentType(@Param("type") DocumentType type, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.accessLevel = :accessLevel AND d.active = true")
    Page<Document> findByAccessLevel(@Param("accessLevel") DocumentAccessLevel accessLevel, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.approvalStatus = :status AND d.active = true")
    Page<Document> findByApprovalStatus(@Param("status") DocumentApprovalStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.isPublic = true AND d.active = true AND d.approvalStatus = 'APPROVED'")
    Page<Document> findPublicDocuments(Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.isArchived = true AND d.active = true")
    Page<Document> findArchivedDocuments(Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.parentDocument.id = :parentId AND d.active = true")
    List<Document> findByParentDocumentId(@Param("parentId") Long parentId);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.expiryDate IS NOT NULL AND d.expiryDate < :currentDate AND d.active = true")
    List<Document> findExpiredDocuments(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(d.tags) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "AND d.active = true")
    Page<Document> searchDocuments(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE d.checksum = :checksum AND d.active = true")
    List<Document> findByChecksum(@Param("checksum") String checksum);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.school.id = :schoolId AND d.active = true")
    Long countBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.uploadedBy.id = :userId AND d.active = true")
    Long countByUploadedById(@Param("userId") Long userId);

    @Query("SELECT SUM(d.fileSize) FROM Document d WHERE d.school.id = :schoolId AND d.active = true")
    Long getTotalFileSizeBySchoolId(@Param("schoolId") Long schoolId);
} 