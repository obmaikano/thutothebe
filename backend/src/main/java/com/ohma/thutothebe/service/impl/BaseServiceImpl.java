package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.entity.BaseEntity;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.service.BaseService;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import com.ohma.thutothebe.util.AuthUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Transactional
public abstract class BaseServiceImpl<E extends BaseEntity, D, ID> implements BaseService<D, ID> {

    protected final JpaRepository<E, ID> repository;

    @Autowired
    protected RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    protected AuthUtils authUtils;

    protected BaseServiceImpl(JpaRepository<E, ID> repository) {
        this.repository = repository;
    }

    protected abstract E mapToEntity(D dto);
    protected abstract D mapToDto(E entity);
    protected abstract void updateEntity(E entity, D dto);

    // ==================== ENTERPRISE SECURITY HOOKS ====================
    
    /**
     * Extract school ID from entity for tenant validation
     * Must be implemented by subclasses for multi-tenant entities
     */
    protected abstract Long extractSchoolId(E entity);
    
    /**
     * Extract region ID from entity for tenant validation
     * Must be implemented by subclasses for multi-tenant entities
     */
    protected abstract Long extractRegionId(E entity);
    
    /**
     * Validate business rules before create/update
     * Override in subclasses for entity-specific validation
     */
    protected void validateBusinessRules(E entity, boolean isUpdate) {
        // Default implementation - override in subclasses
    }
    
    /**
     * Validate tenant access for create operations
     */
    protected void validateTenantAccessForCreate(E entity) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Authentication required for create operations");
        }
        
        Long schoolId = extractSchoolId(entity);
        Long regionId = extractRegionId(entity);
        
        // Validate school access
        if (schoolId != null && !accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, schoolId)) {
            log.error("SECURITY VIOLATION: User {} attempted to create entity in unauthorized school {}", 
                     currentUserId, schoolId);
            throw new SecurityException("Access denied: Cannot create entity in school " + schoolId);
        }
        
        // Validate region access
        if (regionId != null && !accessControlService.hasAccess(currentUserId, AccessScope.REGION, regionId)) {
            log.error("SECURITY VIOLATION: User {} attempted to create entity in unauthorized region {}", 
                     currentUserId, regionId);
            throw new SecurityException("Access denied: Cannot create entity in region " + regionId);
        }
    }
    
    /**
     * Validate tenant access for update operations
     */
    protected void validateTenantAccessForUpdate(E existingEntity, E updatedEntity) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Authentication required for update operations");
        }
        
        Long existingSchoolId = extractSchoolId(existingEntity);
        Long existingRegionId = extractRegionId(existingEntity);
        Long newSchoolId = extractSchoolId(updatedEntity);
        Long newRegionId = extractRegionId(updatedEntity);
        
        // Validate access to existing entity
        if (existingSchoolId != null && !accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, existingSchoolId)) {
            log.error("SECURITY VIOLATION: User {} attempted to update entity in unauthorized school {}", 
                     currentUserId, existingSchoolId);
            throw new SecurityException("Access denied: Cannot update entity in school " + existingSchoolId);
        }
        
        if (existingRegionId != null && !accessControlService.hasAccess(currentUserId, AccessScope.REGION, existingRegionId)) {
            log.error("SECURITY VIOLATION: User {} attempted to update entity in unauthorized region {}", 
                     currentUserId, existingRegionId);
            throw new SecurityException("Access denied: Cannot update entity in region " + existingRegionId);
        }
        
        // Validate access to new school/region if changed
        if (newSchoolId != null && !newSchoolId.equals(existingSchoolId) && 
            !accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, newSchoolId)) {
            log.error("SECURITY VIOLATION: User {} attempted to move entity to unauthorized school {}", 
                     currentUserId, newSchoolId);
            throw new SecurityException("Access denied: Cannot move entity to school " + newSchoolId);
        }
        
        if (newRegionId != null && !newRegionId.equals(existingRegionId) && 
            !accessControlService.hasAccess(currentUserId, AccessScope.REGION, newRegionId)) {
            log.error("SECURITY VIOLATION: User {} attempted to move entity to unauthorized region {}", 
                     currentUserId, newRegionId);
            throw new SecurityException("Access denied: Cannot move entity to region " + newRegionId);
        }
    }
    
    /**
     * Validate that entity can be accessed by current user
     */
    protected void validateEntityAccess(E entity) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Authentication required");
        }
        
        Long schoolId = extractSchoolId(entity);
        Long regionId = extractRegionId(entity);
        
        if (schoolId != null && !accessControlService.hasAccess(currentUserId, AccessScope.SCHOOL, schoolId)) {
            throw new SecurityException("Access denied: Cannot access entity in school " + schoolId);
        }
        
        if (regionId != null && !accessControlService.hasAccess(currentUserId, AccessScope.REGION, regionId)) {
            throw new SecurityException("Access denied: Cannot access entity in region " + regionId);
        }
    }
    
    /**
     * Get current user ID with proper error handling
     */
    protected Long getCurrentUserId() {
        try {
            return authUtils.getCurrentUserId();
        } catch (Exception e) {
            log.error("Failed to get current user ID: {}", e.getMessage());
            return null;
        }
    }

    // ==================== SECURE CRUD OPERATIONS ====================

    @Override
    @CacheEvict(value = {"accessControl", "accessibleScopes"}, allEntries = true)
    public D create(D dto) {
        E entity = mapToEntity(dto);
        
        // Enterprise security validation
        validateTenantAccessForCreate(entity);
        validateBusinessRules(entity, false);
        
        beforeCreate(entity);
        
        try {
            E savedEntity = repository.save(entity);
            log.info("Entity created successfully: {} by user: {}", 
                    savedEntity.getClass().getSimpleName(), getCurrentUserId());
            return mapToDto(savedEntity);
        } catch (Exception e) {
            log.error("Failed to create entity: {}", e.getMessage());
            throw new RuntimeException("Failed to create entity: " + e.getMessage(), e);
        }
    }

    protected void beforeCreate(E entity) {
        // Hook method for subclasses to override
        entity.setCreatedAt(LocalDateTime.now());
        entity.setModifiedAt(LocalDateTime.now());
    }

    @Override
    public D getById(ID id) {
        E entity = repository.findById(id)
            .orElseThrow(() -> notFoundException((Long) id));
        
        // Validate access to entity
        validateEntityAccess(entity);
        
        return mapToDto(entity);
    }

    @Override
    public D findById(ID id) {
        E entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        
        // Validate access to entity
        validateEntityAccess(entity);
        
        return mapToDto(entity);
    }

    @Override
    public List<D> getAll() {
        // WARNING: This method should be overridden in subclasses to use multi-tenant filtering
        log.warn("SECURITY WARNING: getAll() called without multi-tenant filtering for {}", 
                this.getClass().getSimpleName());
        return repository.findAll().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public Page<D> getAll(Pageable pageable) {
        // WARNING: This method should be overridden in subclasses to use multi-tenant filtering
        log.warn("SECURITY WARNING: getAll(Pageable) called without multi-tenant filtering for {}", 
                this.getClass().getSimpleName());
        return repository.findAll(pageable)
            .map(this::mapToDto);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"accessControl", "accessibleScopes"}, allEntries = true)
    public D update(ID id, D dto) {
        E existingEntity = repository.findById(id)
                .orElseThrow(() -> notFoundException((Long) id));

        // Validate access to existing entity
        validateEntityAccess(existingEntity);
        
        // Create updated entity for validation
        E updatedEntity = mapToEntity(dto);
        updatedEntity.setId(existingEntity.getId());
        updatedEntity.setVersion(existingEntity.getVersion());
        
        // Enterprise security validation
        validateTenantAccessForUpdate(existingEntity, updatedEntity);
        validateBusinessRules(updatedEntity, true);

        updateEntity(existingEntity, dto);
        existingEntity.setModifiedAt(LocalDateTime.now());

        try {
            E savedEntity = repository.save(existingEntity); // JPA handles version check here
            log.info("Entity updated successfully: {} (ID: {}) by user: {}", 
                    savedEntity.getClass().getSimpleName(), id, getCurrentUserId());
            return mapToDto(savedEntity);
        } catch (ObjectOptimisticLockingFailureException e) {
            log.error("Optimistic locking failure for entity update: {}", e.getMessage());
            throw new IllegalStateException("The resource was modified by another user. Please refresh and try again.");
        } catch (Exception e) {
            log.error("Failed to update entity: {}", e.getMessage());
            throw new RuntimeException("Failed to update entity: " + e.getMessage(), e);
        }
    }

    @Override
    @CacheEvict(value = {"accessControl", "accessibleScopes"}, allEntries = true)
    public void delete(ID id) {
        E entity = repository.findById(id)
            .orElseThrow(() -> notFoundException((Long) id));
        
        // Validate access to entity
        validateEntityAccess(entity);
        
        repository.deleteById(id);
        log.info("Entity deleted successfully: {} (ID: {}) by user: {}", 
                entity.getClass().getSimpleName(), id, getCurrentUserId());
    }

    protected RuntimeException notFoundException(Long id) {
        return new ResourceNotFoundException("Resource not found with id: " + id);
    }
} 