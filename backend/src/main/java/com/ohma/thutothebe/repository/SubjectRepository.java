package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    Optional<Subject> findByCode(String code);
    
    List<Subject> findByActive(boolean active);
    
    boolean existsByCode(String code);
} 