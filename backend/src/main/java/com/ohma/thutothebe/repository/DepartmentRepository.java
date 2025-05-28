package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Department;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id = :schoolId")
    List<Department> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id = :schoolId AND d.active = true")
    List<Department> findBySchoolIdAndActiveTrue(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.active = true")
    List<Department> findByActiveTrue();
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.name = :name AND d.school.id = :schoolId")
    Optional<Department> findByNameAndSchoolId(@Param("name") String name, @Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.departmentHead.id = :departmentHeadId")
    Optional<Department> findByDepartmentHeadId(@Param("departmentHeadId") Long departmentHeadId);
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.teachers t WHERE t.id = :teacherId")
    List<Department> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @EntityGraph(attributePaths = {"school", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.subjects s WHERE s.id = :subjectId")
    Optional<Department> findBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE d.school.id = :schoolId AND d.active = true")
    Long countBySchoolIdAndActiveTrue(@Param("schoolId") Long schoolId);
    
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d WHERE d.name = :name AND d.school.id = :schoolId")
    boolean existsByNameAndSchoolId(@Param("name") String name, @Param("schoolId") Long schoolId);
    
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d WHERE d.departmentHead.id = :departmentHeadId")
    boolean existsByDepartmentHeadId(@Param("departmentHeadId") Long departmentHeadId);
    
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d JOIN d.teachers t WHERE t.id = :teacherId")
    boolean existsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d JOIN d.subjects s WHERE s.id = :subjectId")
    boolean existsBySubjectId(@Param("subjectId") Long subjectId);
} 