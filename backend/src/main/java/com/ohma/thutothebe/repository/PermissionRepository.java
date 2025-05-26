package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Permission;
import com.ohma.thutothebe.entity.PermissionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    
    Optional<Permission> findByName(String name);
    
    Optional<Permission> findByResourceAndAction(String resource, PermissionAction action);
    
    List<Permission> findByResource(String resource);
    
    List<Permission> findByAction(PermissionAction action);
    
    List<Permission> findByActiveTrue();
    
    @Query("SELECT p FROM Permission p WHERE p.resource = :resource AND p.active = true")
    List<Permission> findActivePermissionsByResource(@Param("resource") String resource);
    
    @Query("SELECT p FROM Permission p WHERE p.action = :action AND p.active = true")
    List<Permission> findActivePermissionsByAction(@Param("action") PermissionAction action);
    
    boolean existsByName(String name);
    
    boolean existsByResourceAndAction(String resource, PermissionAction action);
} 