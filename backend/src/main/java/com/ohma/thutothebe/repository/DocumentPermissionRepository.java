package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.DocumentPermission;
import com.ohma.thutothebe.entity.DocumentPermissionType;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentPermissionRepository extends JpaRepository<DocumentPermission, Long> {

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.active = true")
    Page<DocumentPermission> findAllActivePermissions(Pageable pageable);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND dp.active = true")
    List<DocumentPermission> findByDocumentId(@Param("documentId") Long documentId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND dp.userRole = :userRole AND dp.active = true")
    List<DocumentPermission> findByDocumentIdAndUserRole(@Param("documentId") Long documentId, @Param("userRole") UserRole userRole);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND dp.specificUser.id = :userId AND dp.active = true")
    List<DocumentPermission> findByDocumentIdAndSpecificUserId(@Param("documentId") Long documentId, @Param("userId") Long userId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND dp.permissionType = :permissionType AND dp.active = true")
    List<DocumentPermission> findByDocumentIdAndPermissionType(@Param("documentId") Long documentId, @Param("permissionType") DocumentPermissionType permissionType);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.school.id = :schoolId AND dp.active = true")
    List<DocumentPermission> findBySchoolId(@Param("schoolId") Long schoolId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.region.id = :regionId AND dp.active = true")
    List<DocumentPermission> findByRegionId(@Param("regionId") Long regionId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.classEntity.id = :classId AND dp.active = true")
    List<DocumentPermission> findByClassId(@Param("classId") Long classId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.course.id = :courseId AND dp.active = true")
    List<DocumentPermission> findByCourseId(@Param("courseId") Long courseId);

    @EntityGraph(attributePaths = {"document", "specificUser", "school", "region", "classEntity", "course"})
    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.specificUser.id = :userId AND dp.active = true")
    List<DocumentPermission> findBySpecificUserId(@Param("userId") Long userId);

    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId " +
           "AND dp.userRole = :userRole AND dp.permissionType = :permissionType " +
           "AND dp.active = true")
    Optional<DocumentPermission> findByDocumentIdAndUserRoleAndPermissionType(
            @Param("documentId") Long documentId,
            @Param("userRole") UserRole userRole,
            @Param("permissionType") DocumentPermissionType permissionType);

    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId " +
           "AND dp.specificUser.id = :userId AND dp.permissionType = :permissionType " +
           "AND dp.active = true")
    Optional<DocumentPermission> findByDocumentIdAndSpecificUserIdAndPermissionType(
            @Param("documentId") Long documentId,
            @Param("userId") Long userId,
            @Param("permissionType") DocumentPermissionType permissionType);

    @Query("SELECT CASE WHEN COUNT(dp) > 0 THEN true ELSE false END FROM DocumentPermission dp " +
           "WHERE dp.document.id = :documentId AND dp.userRole = :userRole " +
           "AND dp.permissionType = :permissionType AND dp.active = true")
    boolean hasPermission(@Param("documentId") Long documentId,
                         @Param("userRole") UserRole userRole,
                         @Param("permissionType") DocumentPermissionType permissionType);

    @Query("SELECT CASE WHEN COUNT(dp) > 0 THEN true ELSE false END FROM DocumentPermission dp " +
           "WHERE dp.document.id = :documentId AND dp.specificUser.id = :userId " +
           "AND dp.permissionType = :permissionType AND dp.active = true")
    boolean hasSpecificUserPermission(@Param("documentId") Long documentId,
                                     @Param("userId") Long userId,
                                     @Param("permissionType") DocumentPermissionType permissionType);
} 