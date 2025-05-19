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
    
    Optional<Teacher> findByUser_Id(Long userId);
    
    List<Teacher> findByActive(boolean active);
    
    List<Teacher> findBySchool_Id(Long schoolId);
    
    boolean existsByStaffId(String staffId);
    
    boolean existsByEmail(String email);
} 