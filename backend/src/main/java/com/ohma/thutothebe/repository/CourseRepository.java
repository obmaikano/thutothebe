package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    @EntityGraph(attributePaths = {"teacher", "students"})
    Optional<Course> findById(Long id);

    @EntityGraph(attributePaths = {"teacher", "students"})
    List<Course> findByTeacher(User teacher);

    @EntityGraph(attributePaths = {"teacher", "students"})
    List<Course> findByStudentsContaining(User student);

    @EntityGraph(attributePaths = {"teacher", "students"})
    List<Course> findByActive(boolean active);

    @Query("SELECT c FROM Course c WHERE c.code = :code")
    Optional<Course> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.students WHERE c.id = :id")
    Optional<Course> findByIdWithEnrolledStudents(@Param("id") Long id);

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.teacher WHERE c.id = :id")
    Optional<Course> findByIdWithInstructor(@Param("id") Long id);

    @Query("SELECT c FROM Course c WHERE c.teacher.id = :instructorId")
    List<Course> findByInstructorId(@Param("instructorId") Long instructorId);

    @Query("SELECT c FROM Course c JOIN c.students s WHERE s.id = :studentId")
    List<Course> findByEnrolledStudentId(@Param("studentId") Long studentId);

    @EntityGraph(attributePaths = {"teacher", "students"})
    Set<Course> findByActiveTrue();
} 