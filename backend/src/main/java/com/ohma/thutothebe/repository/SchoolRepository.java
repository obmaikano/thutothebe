package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
} 