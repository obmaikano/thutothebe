package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.RolePermission;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.PermissionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    
    List<RolePermission> findByRole(UserRole role);
    
    List<RolePermission> findByRoleAndActiveTrue(UserRole role);
    
    List<RolePermission> findByPermissionId(Long permissionId);
    
    List<RolePermission> findByScopeTypeAndScopeId(PermissionScope scopeType, Long scopeId);
    
    @Query("SELECT rp FROM RolePermission rp JOIN rp.permission p " +
           "WHERE rp.role = :role AND p.resource = :resource AND p.action = :action AND rp.active = true")
    List<RolePermission> findByRoleAndResourceAndAction(
        @Param("role") UserRole role,
        @Param("resource") String resource,
        @Param("action") PermissionAction action
    );
    
    @Query("SELECT rp FROM RolePermission rp JOIN rp.permission p " +
           "WHERE rp.role = :role AND p.resource = :resource AND p.action = :action " +
           "AND rp.scopeType = :scopeType AND rp.scopeId = :scopeId AND rp.active = true")
    Optional<RolePermission> findByRoleAndResourceAndActionAndScope(
        @Param("role") UserRole role,
        @Param("resource") String resource,
        @Param("action") PermissionAction action,
        @Param("scopeType") PermissionScope scopeType,
        @Param("scopeId") Long scopeId
    );
    
    @Query("SELECT rp FROM RolePermission rp JOIN rp.permission p " +
           "WHERE rp.role = :role AND p.resource = :resource AND rp.active = true")
    List<RolePermission> findByRoleAndResource(
        @Param("role") UserRole role,
        @Param("resource") String resource
    );
    
    @Query("SELECT DISTINCT p.resource FROM RolePermission rp JOIN rp.permission p " +
           "WHERE rp.role = :role AND rp.active = true")
    List<String> findResourcesByRole(@Param("role") UserRole role);
    
    boolean existsByRoleAndPermissionId(UserRole role, Long permissionId);
} 