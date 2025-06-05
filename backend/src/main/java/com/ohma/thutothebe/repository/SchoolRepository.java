package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    
    Optional<School> findByCode(String code);
    
    List<School> findByRegionId(Long regionId);
    
    List<School> findByRegionIdAndActive(Long regionId, boolean active);
    
    @Query("SELECT s FROM School s LEFT JOIN FETCH s.classes WHERE s.id = :id")
    Optional<School> findByIdWithClasses(Long id);
    
    @Query("SELECT s FROM School s LEFT JOIN FETCH s.users WHERE s.id = :id")
    Optional<School> findByIdWithUsers(Long id);
    
    boolean existsByCode(String code);

    @Query("SELECT COUNT(s) FROM School s WHERE s.region.id = :regionId")
    Long countByRegionId(@Param("regionId") Long regionId);

    @Query("SELECT COUNT(s) FROM School s WHERE s.region.id = :regionId AND s.active = :active")
    Long countByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
} 