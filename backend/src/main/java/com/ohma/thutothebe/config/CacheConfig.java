package com.ohma.thutothebe.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration for the access control system
 * Works with the existing EhCache configuration in ehcache.xml
 * 
 * The access control caches are configured in ehcache.xml:
 * - accessControl: for hasAccess() method calls
 * - accessibleScopes: for getAccessibleScopeIds() method calls
 */
@Configuration
@EnableCaching
public class CacheConfig {
    
    // Cache configuration is handled in ehcache.xml
    // No additional configuration needed - Spring Boot auto-configures
    // EhCache with the existing JCache setup
    
} 