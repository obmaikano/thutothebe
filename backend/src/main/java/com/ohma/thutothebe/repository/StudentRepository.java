package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByUser_Id(Long userId);
    
    List<Student> findByUser_IdIn(List<Long> userIds);
    
    List<Student> findByActive(boolean active);
    
    List<Student> findBySchool_Id(Long schoolId);
    
    List<Student> findByStudentClass_Id(Long classId);
    
    List<Student> findBySubjects_Id(Long subjectId);

    @Query("SELECT s FROM Student s WHERE s.studentClass.id IN (SELECT c.classEntity.id FROM Course c WHERE c.id = :courseId)")
    List<Student> findByCourseId(@Param("courseId") Long courseId);
    
    boolean existsByAdmissionNumber(String admissionNumber);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE EXTRACT(YEAR FROM s.createdAt) = :year")
    long countByEnrollmentYear(@Param("year") int year);
} 