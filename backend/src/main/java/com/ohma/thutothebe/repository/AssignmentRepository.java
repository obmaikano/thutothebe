package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByCourse(Course course);
    
    Optional<Assignment> findByCode(String code);
    
    List<Assignment> findByStatus(AssignmentStatus status);
    
    List<Assignment> findByCourseAndStatus(Course course, AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course = :course AND a.status = :status AND a.active = true")
    List<Assignment> findActiveByCourseAndStatus(@Param("course") Course course, @Param("status") AssignmentStatus status);
    
    boolean existsByCode(String code);
    
    @Query("SELECT a FROM Assignment a WHERE a.active = true")
    List<Assignment> findByActive(boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course = ?1 AND a.active = true")
    List<Assignment> findActiveByCourse(Course course);

    @Query("SELECT a FROM Assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Assignment> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT a FROM Assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND a.active = :active")
    List<Assignment> findByTeacherIdAndActive(@Param("teacherId") Long teacherId, @Param("active") boolean active);

    List<Assignment> findByInstructorId(Long instructorId);

    @Query("SELECT a FROM Assignment a WHERE a.instructor.id = :instructorId AND a.active = :active")
    List<Assignment> findByInstructorIdAndActive(@Param("instructorId") Long instructorId, @Param("active") boolean active);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering (through course relationship)
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id = :schoolId")
    List<Assignment> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id = :schoolId AND a.active = :active")
    List<Assignment> findBySchoolIdAndActive(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id = :schoolId AND a.status = :status")
    List<Assignment> findBySchoolIdAndStatus(@Param("schoolId") Long schoolId, @Param("status") AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id = :schoolId AND a.active = true")
    List<Assignment> findActiveAssignmentsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering (through course → school → region relationship)
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id = :regionId")
    List<Assignment> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id = :regionId AND a.active = :active")
    List<Assignment> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id = :regionId AND a.status = :status")
    List<Assignment> findByRegionIdAndStatus(@Param("regionId") Long regionId, @Param("status") AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id = :regionId AND a.active = true")
    List<Assignment> findActiveAssignmentsByRegionId(@Param("regionId") Long regionId);
    
    // Course-level filtering with multi-tenancy
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.course.classEntity.school.id IN :schoolIds")
    List<Assignment> findByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.course.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<Assignment> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.course.classEntity.school.id = :schoolId AND a.active = true")
    List<Assignment> findByCourseIdAndSchoolIdAndActive(@Param("courseId") Long courseId, @Param("schoolId") Long schoolId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id IN :schoolIds")
    List<Assignment> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id IN :schoolIds AND a.active = :active")
    List<Assignment> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.id IN :schoolIds AND a.status = :status")
    List<Assignment> findBySchoolIdInAndStatus(@Param("schoolIds") List<Long> schoolIds, @Param("status") AssignmentStatus status);
    
    // Region IDs list filtering
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id IN :regionIds")
    List<Assignment> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id IN :regionIds AND a.active = :active")
    List<Assignment> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.school.region.id IN :regionIds AND a.status = :status")
    List<Assignment> findByRegionIdInAndStatus(@Param("regionIds") List<Long> regionIds, @Param("status") AssignmentStatus status);
    
    // Assignment IDs list filtering (for user-level access)
    @Query("SELECT a FROM Assignment a WHERE a.id IN :assignmentIds")
    List<Assignment> findByIdIn(@Param("assignmentIds") List<Long> assignmentIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.id IN :assignmentIds AND a.active = :active")
    List<Assignment> findByIdInAndActive(@Param("assignmentIds") List<Long> assignmentIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.id IN :assignmentIds AND a.status = :status")
    List<Assignment> findByIdInAndStatus(@Param("assignmentIds") List<Long> assignmentIds, @Param("status") AssignmentStatus status);
    
    // Instructor IDs list filtering (for user-level access through instructor relationship)
    @Query("SELECT a FROM Assignment a WHERE a.instructor.id IN :instructorIds")
    List<Assignment> findByInstructorIdIn(@Param("instructorIds") List<Long> instructorIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.instructor.id IN :instructorIds AND a.active = :active")
    List<Assignment> findByInstructorIdInAndActive(@Param("instructorIds") List<Long> instructorIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE a.instructor.id IN :instructorIds AND a.status = :status")
    List<Assignment> findByInstructorIdInAndStatus(@Param("instructorIds") List<Long> instructorIds, @Param("status") AssignmentStatus status);
    
    // Combined filtering for complex access patterns
    @Query("SELECT a FROM Assignment a WHERE " +
           "(a.course.classEntity.school.id IN :schoolIds OR a.course.classEntity.school.region.id IN :regionIds OR a.instructor.id IN :instructorIds) " +
           "AND a.active = true")
    List<Assignment> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                           @Param("regionIds") List<Long> regionIds, 
                                           @Param("instructorIds") List<Long> instructorIds);
    
    @Query("SELECT a FROM Assignment a WHERE " +
           "(a.course.classEntity.school.id IN :schoolIds OR a.course.classEntity.school.region.id IN :regionIds OR a.instructor.id IN :instructorIds) " +
           "AND a.active = :active")
    List<Assignment> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                                    @Param("regionIds") List<Long> regionIds, 
                                                    @Param("instructorIds") List<Long> instructorIds,
                                                    @Param("active") boolean active);
    
    @Query("SELECT a FROM Assignment a WHERE " +
           "(a.course.classEntity.school.id IN :schoolIds OR a.course.classEntity.school.region.id IN :regionIds OR a.instructor.id IN :instructorIds) " +
           "AND a.status = :status")
    List<Assignment> findByMultiScopeAccessAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                                    @Param("regionIds") List<Long> regionIds, 
                                                    @Param("instructorIds") List<Long> instructorIds,
                                                    @Param("status") AssignmentStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE " +
           "(a.course.classEntity.school.id IN :schoolIds OR a.course.classEntity.school.region.id IN :regionIds OR a.instructor.id IN :instructorIds) " +
           "AND a.active = :active AND a.status = :status")
    List<Assignment> findByMultiScopeAccessAndActiveAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                                             @Param("regionIds") List<Long> regionIds, 
                                                             @Param("instructorIds") List<Long> instructorIds,
                                                             @Param("active") boolean active,
                                                             @Param("status") AssignmentStatus status);
    
    // Teacher-level filtering with multi-tenancy (through course instructors)
    @Query("SELECT a FROM Assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND a.course.classEntity.school.id IN :schoolIds AND a.active = true")
    List<Assignment> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND a.course.classEntity.school.region.id IN :regionIds AND a.active = true")
    List<Assignment> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId, @Param("regionIds") List<Long> regionIds);
    
    // Class-level filtering with multi-tenancy (through course → class relationship)
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.id = :classId AND a.course.classEntity.school.id IN :schoolIds AND a.active = true")
    List<Assignment> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.classEntity.id = :classId AND a.course.classEntity.school.id = :schoolId AND a.active = true")
    List<Assignment> findByClassIdAndSchoolIdAndActive(@Param("classId") Long classId, @Param("schoolId") Long schoolId);
    
    // Subject-level filtering with multi-tenancy (through course → subject relationship)
    @Query("SELECT a FROM Assignment a WHERE a.course.subject.id = :subjectId AND a.course.classEntity.school.id IN :schoolIds AND a.active = true")
    List<Assignment> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.subject.id = :subjectId AND a.course.classEntity.school.region.id IN :regionIds AND a.active = true")
    List<Assignment> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId, @Param("regionIds") List<Long> regionIds);
} 