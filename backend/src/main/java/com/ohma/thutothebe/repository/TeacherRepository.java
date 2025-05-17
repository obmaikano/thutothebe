package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    Optional<Teacher> findByStaffId(String staffId);
    
    Optional<Teacher> findByEmail(String email);
    
    List<Teacher> findByActive(boolean active);
    
    boolean existsByStaffId(String staffId);
    
    boolean existsByEmail(String email);
} 