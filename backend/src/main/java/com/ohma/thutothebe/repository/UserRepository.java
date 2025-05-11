package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TEACHER'")
    List<User> findAllTeachers();
    
    @Query("SELECT u FROM User u WHERE u.role = 'STUDENT'")
    List<User> findAllStudents();
} 