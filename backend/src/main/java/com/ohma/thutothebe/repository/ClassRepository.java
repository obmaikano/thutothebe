package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    
    List<Class> findBySchoolId(Long schoolId);
    
    List<Class> findBySchoolIdAndActive(Long schoolId, boolean active);
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.teachers WHERE c.id = :id")
    Optional<Class> findByIdWithTeachers(Long id);
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.students WHERE c.id = :id")
    Optional<Class> findByIdWithStudents(Long id);
    
    @Query("SELECT c FROM Class c WHERE c.school.id = :schoolId AND :teacherId MEMBER OF c.teachers")
    List<Class> findBySchoolIdAndTeacherId(Long schoolId, Long teacherId);
    
    @Query("SELECT c FROM Class c WHERE c.school.id = :schoolId AND :studentId MEMBER OF c.students")
    List<Class> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
    
    @Query("SELECT s.id FROM Class c JOIN c.students s WHERE c.id = :classId")
    List<Long> findStudentIdsByClassId(Long classId);
} 