package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    
    Optional<Module> findByCode(String code);
    
    List<Module> findByCourseId(Long courseId);
    
    List<Module> findByCourseIdAndActive(Long courseId, boolean active);
    
    @Query("SELECT m FROM Module m WHERE m.course.id = :courseId ORDER BY m.accessCount DESC")
    List<Module> findMostAccessedByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT m FROM Module m ORDER BY m.accessCount DESC")
    List<Module> findMostAccessed();
    
    boolean existsByCode(String code);
} 