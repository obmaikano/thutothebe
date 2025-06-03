package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    @Query("SELECT t FROM Teacher t JOIN t.courseInstructors ci WHERE ci.course.id = :courseId")
    List<Teacher> findByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT t FROM Teacher t JOIN Class c ON t MEMBER OF c.teachers WHERE c.id = :classId")
    List<Teacher> findByClassId(@Param("classId") Long classId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering
    List<Teacher> findBySchoolId(Long schoolId);
    
    List<Teacher> findBySchoolIdAndActive(Long schoolId, boolean active);
    
    @Query("SELECT t FROM Teacher t WHERE t.school.id = :schoolId AND t.active = true")
    List<Teacher> findActiveTeachersBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering (through school relationship)
    @Query("SELECT t FROM Teacher t WHERE t.school.region.id = :regionId")
    List<Teacher> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT t FROM Teacher t WHERE t.school.region.id = :regionId AND t.active = :active")
    List<Teacher> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT t FROM Teacher t WHERE t.school.region.id = :regionId AND t.active = true")
    List<Teacher> findActiveTeachersByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT t FROM Teacher t WHERE t.school.id IN :schoolIds")
    List<Teacher> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT t FROM Teacher t WHERE t.school.id IN :schoolIds AND t.active = :active")
    List<Teacher> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    // Region IDs list filtering
    @Query("SELECT t FROM Teacher t WHERE t.school.region.id IN :regionIds")
    List<Teacher> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT t FROM Teacher t WHERE t.school.region.id IN :regionIds AND t.active = :active")
    List<Teacher> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    // Teacher IDs list filtering (for user-level access)
    @Query("SELECT t FROM Teacher t WHERE t.id IN :teacherIds")
    List<Teacher> findByIdIn(@Param("teacherIds") List<Long> teacherIds);
    
    @Query("SELECT t FROM Teacher t WHERE t.id IN :teacherIds AND t.active = :active")
    List<Teacher> findByIdInAndActive(@Param("teacherIds") List<Long> teacherIds, @Param("active") boolean active);
    
    // User IDs list filtering (for user-level access through user relationship)
    @Query("SELECT t FROM Teacher t WHERE t.user.id IN :userIds")
    List<Teacher> findByUserIdIn(@Param("userIds") List<Long> userIds);
    
    @Query("SELECT t FROM Teacher t WHERE t.user.id IN :userIds AND t.active = :active")
    List<Teacher> findByUserIdInAndActive(@Param("userIds") List<Long> userIds, @Param("active") boolean active);
    
    // Combined filtering for complex access patterns
    @Query("SELECT t FROM Teacher t WHERE " +
           "(t.school.id IN :schoolIds OR t.school.region.id IN :regionIds OR t.user.id IN :userIds) " +
           "AND t.active = true")
    List<Teacher> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                        @Param("regionIds") List<Long> regionIds, 
                                        @Param("userIds") List<Long> userIds);
    
    @Query("SELECT t FROM Teacher t WHERE " +
           "(t.school.id IN :schoolIds OR t.school.region.id IN :regionIds OR t.user.id IN :userIds) " +
           "AND t.active = :active")
    List<Teacher> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                                 @Param("regionIds") List<Long> regionIds, 
                                                 @Param("userIds") List<Long> userIds,
                                                 @Param("active") boolean active);
    
    // Course-level filtering with multi-tenancy
    @Query("SELECT t FROM Teacher t JOIN t.courseInstructors ci WHERE ci.course.id = :courseId AND t.school.id IN :schoolIds AND t.active = true")
    List<Teacher> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT t FROM Teacher t JOIN t.courseInstructors ci WHERE ci.course.id = :courseId AND t.school.id = :schoolId AND t.active = true")
    List<Teacher> findByCourseIdAndSchoolIdAndActive(@Param("courseId") Long courseId, @Param("schoolId") Long schoolId);
    
    // Class-level filtering with multi-tenancy
    @Query("SELECT t FROM Teacher t JOIN Class c ON t MEMBER OF c.teachers WHERE c.id = :classId AND t.school.id IN :schoolIds AND t.active = true")
    List<Teacher> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT t FROM Teacher t JOIN Class c ON t MEMBER OF c.teachers WHERE c.id = :classId AND t.school.id = :schoolId AND t.active = true")
    List<Teacher> findByClassIdAndSchoolIdAndActive(@Param("classId") Long classId, @Param("schoolId") Long schoolId);
    
    // Subject-level filtering with multi-tenancy (through course instructors)
    @Query("SELECT DISTINCT t FROM Teacher t JOIN t.courseInstructors ci WHERE ci.course.subject.id = :subjectId AND t.school.id IN :schoolIds AND t.active = true")
    List<Teacher> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT DISTINCT t FROM Teacher t JOIN t.courseInstructors ci WHERE ci.course.subject.id = :subjectId AND t.school.region.id IN :regionIds AND t.active = true")
    List<Teacher> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId, @Param("regionIds") List<Long> regionIds);
} 