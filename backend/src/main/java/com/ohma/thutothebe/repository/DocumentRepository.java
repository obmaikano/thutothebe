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

    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.active = true")
    List<Document> findByActiveTrue();
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.uploadedBy.id = :userId")
    List<Document> findByUploadedById(@Param("userId") Long userId);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.documentType = :type")
    List<Document> findByDocumentType(@Param("type") DocumentType type);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "region", "classEntity", "course", "subject"})
    @Query("SELECT d FROM Document d WHERE d.documentCategory = :category")
    List<Document> findByDocumentCategory(@Param("category") DocumentCategory category);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.uploadedBy.id = :userId AND d.active = true")
    Long countByUploadedByIdAndActiveTrue(@Param("userId") Long userId);
    
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Document d WHERE d.fileName = :fileName AND d.uploadedBy.id = :userId")
    boolean existsByFileNameAndUploadedById(@Param("fileName") String fileName, @Param("userId") Long userId);

    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId")
    List<Document> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId AND d.active = :active")
    List<Document> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId AND d.active = true")
    List<Document> findActiveDocumentsBySchoolId(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.region.id = :regionId")
    List<Document> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.region.id = :regionId AND d.active = :active")
    List<Document> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.region.id = :regionId AND d.active = true")
    List<Document> findActiveDocumentsByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.school.id IN :schoolIds")
    List<Document> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.region.id IN :regionIds")
    List<Document> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.school.id IN :schoolIds OR d.region.id IN :regionIds")
    List<Document> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                         @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE (d.school.id IN :schoolIds OR d.region.id IN :regionIds) AND d.active = :active")
    List<Document> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                  @Param("regionIds") List<Long> regionIds,
                                                  @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.documentType = :type AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByDocumentTypeAndSchoolIdInAndActive(@Param("type") DocumentType type,
                                                           @Param("schoolIds") List<Long> schoolIds,
                                                           @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.documentType = :type AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByDocumentTypeAndRegionIdInAndActive(@Param("type") DocumentType type,
                                                           @Param("regionIds") List<Long> regionIds,
                                                           @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.documentCategory = :category AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByDocumentCategoryAndSchoolIdInAndActive(@Param("category") DocumentCategory category,
                                                               @Param("schoolIds") List<Long> schoolIds,
                                                               @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.documentCategory = :category AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByDocumentCategoryAndRegionIdInAndActive(@Param("category") DocumentCategory category,
                                                               @Param("regionIds") List<Long> regionIds,
                                                               @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.accessLevel = :accessLevel AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByAccessLevelAndSchoolIdInAndActive(@Param("accessLevel") DocumentAccessLevel accessLevel,
                                                          @Param("schoolIds") List<Long> schoolIds,
                                                          @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.accessLevel = :accessLevel AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByAccessLevelAndRegionIdInAndActive(@Param("accessLevel") DocumentAccessLevel accessLevel,
                                                          @Param("regionIds") List<Long> regionIds,
                                                          @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.approvalStatus = :status AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByApprovalStatusAndSchoolIdInAndActive(@Param("status") DocumentApprovalStatus status,
                                                             @Param("schoolIds") List<Long> schoolIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.approvalStatus = :status AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByApprovalStatusAndRegionIdInAndActive(@Param("status") DocumentApprovalStatus status,
                                                             @Param("regionIds") List<Long> regionIds,
                                                             @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.uploadedBy.id = :uploaderId AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByUploaderIdAndSchoolIdInAndActive(@Param("uploaderId") Long uploaderId,
                                                         @Param("schoolIds") List<Long> schoolIds,
                                                         @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.uploadedBy.id = :uploaderId AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByUploaderIdAndRegionIdInAndActive(@Param("uploaderId") Long uploaderId,
                                                         @Param("regionIds") List<Long> regionIds,
                                                         @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.course.id = :courseId AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId,
                                                       @Param("schoolIds") List<Long> schoolIds,
                                                       @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.course.id = :courseId AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByCourseIdAndRegionIdInAndActive(@Param("courseId") Long courseId,
                                                       @Param("regionIds") List<Long> regionIds,
                                                       @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.classEntity.id = :classId AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.classEntity.id = :classId AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByClassIdAndRegionIdInAndActive(@Param("classId") Long classId,
                                                      @Param("regionIds") List<Long> regionIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.subject.id = :subjectId AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.subject.id = :subjectId AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId,
                                                        @Param("regionIds") List<Long> regionIds,
                                                        @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%')) AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findByTitleContainingAndSchoolIdInAndActive(@Param("title") String title,
                                                              @Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%')) AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findByTitleContainingAndRegionIdInAndActive(@Param("title") String title,
                                                              @Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.isPublic = true AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findPublicDocumentsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                           @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.isPublic = true AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findPublicDocumentsByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                           @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.expiryDate IS NOT NULL AND d.expiryDate < :currentTime AND d.school.id IN :schoolIds AND d.active = :active")
    List<Document> findExpiredDocumentsBySchoolIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                            @Param("schoolIds") List<Long> schoolIds,
                                                            @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"uploadedBy", "school", "school.region", "region", "classEntity", "course", "subject", "approvedBy", "archivedBy"})
    @Query("SELECT d FROM Document d WHERE d.expiryDate IS NOT NULL AND d.expiryDate < :currentTime AND d.region.id IN :regionIds AND d.active = :active")
    List<Document> findExpiredDocumentsByRegionIdInAndActive(@Param("currentTime") LocalDateTime currentTime,
                                                            @Param("regionIds") List<Long> regionIds,
                                                            @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) > 0 FROM Document d WHERE d.fileName = :fileName AND d.uploadedBy.id = :uploaderId AND d.school.id IN :schoolIds")
    boolean existsByFileNameAndUploaderIdAndSchoolIdIn(@Param("fileName") String fileName,
                                                       @Param("uploaderId") Long uploaderId,
                                                       @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Document d WHERE d.title = :title AND d.uploadedBy.id = :uploaderId AND d.school.id IN :schoolIds")
    boolean existsByTitleAndUploaderIdAndSchoolIdIn(@Param("title") String title,
                                                    @Param("uploaderId") Long uploaderId,
                                                    @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Document d WHERE d.course.id = :courseId AND d.school.id IN :schoolIds")
    boolean existsByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Document d WHERE d.classEntity.id = :classId AND d.school.id IN :schoolIds")
    boolean existsByClassIdAndSchoolIdIn(@Param("classId") Long classId,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Document d WHERE d.subject.id = :subjectId AND d.school.id IN :schoolIds")
    boolean existsBySubjectIdAndSchoolIdIn(@Param("subjectId") Long subjectId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.school.id IN :schoolIds AND d.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.region.id IN :regionIds AND d.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.documentType = :type AND d.school.id IN :schoolIds AND d.active = :active")
    Long countByDocumentTypeAndSchoolIdInAndActive(@Param("type") DocumentType type,
                                                  @Param("schoolIds") List<Long> schoolIds,
                                                  @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.approvalStatus = :status AND d.school.id IN :schoolIds AND d.active = :active")
    Long countByApprovalStatusAndSchoolIdInAndActive(@Param("status") DocumentApprovalStatus status,
                                                    @Param("schoolIds") List<Long> schoolIds,
                                                    @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.isPublic = true AND d.school.id IN :schoolIds AND d.active = :active")
    Long countPublicDocumentsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                  @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.uploadedBy.id = :uploaderId AND d.school.id IN :schoolIds AND d.active = :active")
    Long countByUploaderIdAndSchoolIdInAndActive(@Param("uploaderId") Long uploaderId,
                                                @Param("schoolIds") List<Long> schoolIds,
                                                @Param("active") boolean active);
    
    @Query("SELECT SUM(d.fileSize) FROM Document d WHERE d.school.id IN :schoolIds AND d.active = :active")
    Long sumFileSizeBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                         @Param("active") boolean active);
    
    @Query("SELECT SUM(d.downloadCount) FROM Document d WHERE d.school.id IN :schoolIds AND d.active = :active")
    Long sumDownloadCountBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                              @Param("active") boolean active);
    
    @Query("SELECT SUM(d.viewCount) FROM Document d WHERE d.school.id IN :schoolIds AND d.active = :active")
    Long sumViewCountBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                          @Param("active") boolean active);
} 