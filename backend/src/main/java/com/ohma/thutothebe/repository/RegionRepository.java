package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    
    Optional<Region> findByCode(String code);
    
    List<Region> findByActive(boolean active);
    
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.schools WHERE r.id = :id")
    Optional<Region> findByIdWithSchools(Long id);
    
    boolean existsByCode(String code);

    boolean existsByName(String name);
} 