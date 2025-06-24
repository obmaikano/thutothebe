package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    
    List<Class> findBySchoolId(Long schoolId);
    
    List<Class> findByActive(boolean active);
    
    List<Class> findBySchoolIdAndActive(Long schoolId, boolean active);
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.teachers WHERE c.id = :id")
    Optional<Class> findByIdWithTeachers(Long id);
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.students WHERE c.id = :id")
    Optional<Class> findByIdWithStudents(Long id);
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.teachers LEFT JOIN FETCH c.students")
    List<Class> findAllWithTeachersAndStudents();
    
    @Query("SELECT c FROM Class c LEFT JOIN FETCH c.teachers WHERE c.school.id = :schoolId")
    List<Class> findBySchoolIdWithTeachers(Long schoolId);
    
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE c.school.id = :schoolId AND t.id = :teacherId")
    List<Class> findBySchoolIdAndTeacherId(Long schoolId, Long teacherId);
    
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE t.id = :teacherId")
    List<Class> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT c FROM Class c JOIN c.students s WHERE c.school.id = :schoolId AND s.id = :studentId")
    List<Class> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
    
    @Query("SELECT s.id FROM Class c JOIN c.students s WHERE c.id = :classId")
    List<Long> findStudentIdsByClassId(Long classId);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.id = :schoolId")
    List<Class> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.id = :schoolId AND c.active = :active")
    List<Class> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.id = :schoolId AND c.active = true")
    List<Class> findActiveClassesBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.region.id = :regionId")
    List<Class> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.region.id = :regionId AND c.active = :active")
    List<Class> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.region.id = :regionId AND c.active = true")
    List<Class> findActiveClassesByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.id IN :schoolIds")
    List<Class> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.region.id IN :regionIds")
    List<Class> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.school.id IN :schoolIds OR c.school.region.id IN :regionIds")
    List<Class> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                      @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE (c.school.id IN :schoolIds OR c.school.region.id IN :regionIds) AND c.active = :active")
    List<Class> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                               @Param("regionIds") List<Long> regionIds,
                                               @Param("active") boolean active);
    
    // Grade level filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.gradeLevel = :gradeLevel AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByGradeLevelAndSchoolIdInAndActive(@Param("gradeLevel") GradeLevel gradeLevel,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.gradeLevel = :gradeLevel AND c.school.region.id IN :regionIds AND c.active = :active")
    List<Class> findByGradeLevelAndRegionIdInAndActive(@Param("gradeLevel") GradeLevel gradeLevel,
                                                      @Param("regionIds") List<Long> regionIds,
                                                      @Param("active") boolean active);
    
    // Teacher filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE t.id = :teacherId AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId,
                                                     @Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE t.id = :teacherId AND c.school.id IN :schoolIds")
    List<Class> findByTeacherIdAndSchoolIdIn(@Param("teacherId") Long teacherId,
                                            @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE t.id = :teacherId AND c.school.region.id IN :regionIds AND c.active = :active")
    List<Class> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId,
                                                     @Param("regionIds") List<Long> regionIds,
                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.teachers t WHERE t.id = :teacherId AND c.school.region.id IN :regionIds")
    List<Class> findByTeacherIdAndRegionIdIn(@Param("teacherId") Long teacherId,
                                            @Param("regionIds") List<Long> regionIds);
    
    // Student filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.students s WHERE s.id = :studentId AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByStudentIdAndSchoolIdInAndActive(@Param("studentId") Long studentId,
                                                     @Param("schoolIds") List<Long> schoolIds,
                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c JOIN c.students s WHERE s.id = :studentId AND c.school.region.id IN :regionIds AND c.active = :active")
    List<Class> findByStudentIdAndRegionIdInAndActive(@Param("studentId") Long studentId,
                                                     @Param("regionIds") List<Long> regionIds,
                                                     @Param("active") boolean active);
    
    // Capacity filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.capacity >= :minCapacity AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByMinCapacityAndSchoolIdInAndActive(@Param("minCapacity") Integer minCapacity,
                                                       @Param("schoolIds") List<Long> schoolIds,
                                                       @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.spotsLeft > 0 AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findAvailableClassesBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                         @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE c.overCapacity = :overCapacity AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByOverCapacityAndSchoolIdInAndActive(@Param("overCapacity") Boolean overCapacity,
                                                        @Param("schoolIds") List<Long> schoolIds,
                                                        @Param("active") boolean active);
    
    // Name search with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "teachers", "students"})
    @Query("SELECT c FROM Class c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.school.id IN :schoolIds AND c.active = :active")
    List<Class> findByNameContainingAndSchoolIdInAndActive(@Param("name") String name,
                                                          @Param("schoolIds") List<Long> schoolIds,
                                                          @Param("active") boolean active);
    
    // Business rule validation methods
    @Query("SELECT COUNT(c) > 0 FROM Class c WHERE c.name = :name AND c.school.id = :schoolId")
    boolean existsByNameAndSchoolId(@Param("name") String name, @Param("schoolId") Long schoolId);
    
    @Query("SELECT COUNT(c) > 0 FROM Class c WHERE c.name = :name AND c.school.id = :schoolId AND c.gradeLevel = :gradeLevel")
    boolean existsByNameAndSchoolIdAndGradeLevel(@Param("name") String name, 
                                                @Param("schoolId") Long schoolId,
                                                @Param("gradeLevel") GradeLevel gradeLevel);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(c) FROM Class c WHERE c.school.id IN :schoolIds AND c.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(c) FROM Class c WHERE c.school.region.id IN :regionIds AND c.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT SUM(c.totalEnrolled) FROM Class c WHERE c.school.id IN :schoolIds AND c.active = :active")
    Long sumTotalEnrolledBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT SUM(c.capacity) FROM Class c WHERE c.school.id IN :schoolIds AND c.active = :active")
    Long sumCapacityBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
} 