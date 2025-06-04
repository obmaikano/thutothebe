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

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id = :schoolId")
    List<Department> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id = :schoolId AND d.active = :active")
    List<Department> findBySchoolIdAndActiveSecure(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id = :schoolId AND d.active = true")
    List<Department> findActiveDepartmentsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.region.id = :regionId")
    List<Department> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.region.id = :regionId AND d.active = :active")
    List<Department> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.region.id = :regionId AND d.active = true")
    List<Department> findActiveDepartmentsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id IN :schoolIds")
    List<Department> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.region.id IN :regionIds")
    List<Department> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.school.id IN :schoolIds OR d.school.region.id IN :regionIds")
    List<Department> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                           @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE (d.school.id IN :schoolIds OR d.school.region.id IN :regionIds) AND d.active = :active")
    List<Department> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                    @Param("regionIds") List<Long> regionIds,
                                                    @Param("active") boolean active);
    
    // Department head filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.departmentHead.id = :departmentHeadId AND d.school.id IN :schoolIds")
    Optional<Department> findByDepartmentHeadIdAndSchoolIdIn(@Param("departmentHeadId") Long departmentHeadId,
                                                            @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.departmentHead.id = :departmentHeadId AND d.school.region.id IN :regionIds")
    Optional<Department> findByDepartmentHeadIdAndRegionIdIn(@Param("departmentHeadId") Long departmentHeadId,
                                                            @Param("regionIds") List<Long> regionIds);
    
    // Teacher filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.teachers t WHERE t.id = :teacherId AND d.school.id IN :schoolIds AND d.active = :active")
    List<Department> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId,
                                                          @Param("schoolIds") List<Long> schoolIds,
                                                          @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.teachers t WHERE t.id = :teacherId AND d.school.region.id IN :regionIds AND d.active = :active")
    List<Department> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId,
                                                          @Param("regionIds") List<Long> regionIds,
                                                          @Param("active") boolean active);
    
    // Subject filtering with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.subjects s WHERE s.id = :subjectId AND d.school.id IN :schoolIds AND d.active = :active")
    Optional<Department> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId,
                                                              @Param("schoolIds") List<Long> schoolIds,
                                                              @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d JOIN d.subjects s WHERE s.id = :subjectId AND d.school.region.id IN :regionIds AND d.active = :active")
    Optional<Department> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId,
                                                              @Param("regionIds") List<Long> regionIds,
                                                              @Param("active") boolean active);
    
    // Name search with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.school.id IN :schoolIds AND d.active = :active")
    List<Department> findByNameContainingAndSchoolIdInAndActive(@Param("name") String name,
                                                               @Param("schoolIds") List<Long> schoolIds,
                                                               @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.school.region.id IN :regionIds AND d.active = :active")
    List<Department> findByNameContainingAndRegionIdInAndActive(@Param("name") String name,
                                                               @Param("regionIds") List<Long> regionIds,
                                                               @Param("active") boolean active);
    
    // Departments without head with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.departmentHead IS NULL AND d.school.id IN :schoolIds AND d.active = :active")
    List<Department> findDepartmentsWithoutHeadBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                                    @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE d.departmentHead IS NULL AND d.school.region.id IN :regionIds AND d.active = :active")
    List<Department> findDepartmentsWithoutHeadByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                                    @Param("active") boolean active);
    
    // Departments with subjects with multi-tenant security
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE SIZE(d.subjects) > 0 AND d.school.id IN :schoolIds AND d.active = :active")
    List<Department> findDepartmentsWithSubjectsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                                     @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"school", "school.region", "departmentHead", "subjects", "teachers"})
    @Query("SELECT d FROM Department d WHERE SIZE(d.subjects) > 0 AND d.school.region.id IN :regionIds AND d.active = :active")
    List<Department> findDepartmentsWithSubjectsByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds,
                                                                     @Param("active") boolean active);
    
    // Business rule validation methods with multi-tenant security
    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE d.name = :name AND d.school.id = :schoolId")
    boolean existsByNameAndSchoolIdSecure(@Param("name") String name, @Param("schoolId") Long schoolId);
    
    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE d.departmentHead.id = :departmentHeadId AND d.school.id IN :schoolIds")
    boolean existsByDepartmentHeadIdAndSchoolIdIn(@Param("departmentHeadId") Long departmentHeadId,
                                                  @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Department d JOIN d.teachers t WHERE t.id = :teacherId AND d.school.id IN :schoolIds")
    boolean existsByTeacherIdAndSchoolIdIn(@Param("teacherId") Long teacherId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(d) > 0 FROM Department d JOIN d.subjects s WHERE s.id = :subjectId AND d.school.id IN :schoolIds")
    boolean existsBySubjectIdAndSchoolIdIn(@Param("subjectId") Long subjectId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(d) FROM Department d WHERE d.school.id IN :schoolIds AND d.active = :active")
    Long countBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE d.school.region.id IN :regionIds AND d.active = :active")
    Long countByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE d.departmentHead IS NOT NULL AND d.school.id IN :schoolIds AND d.active = :active")
    Long countDepartmentsWithHeadBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE d.departmentHead IS NULL AND d.school.id IN :schoolIds AND d.active = :active")
    Long countDepartmentsWithoutHeadBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE SIZE(d.subjects) > 0 AND d.school.id IN :schoolIds AND d.active = :active")
    Long countDepartmentsWithSubjectsBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE SIZE(d.teachers) > 0 AND d.school.id IN :schoolIds AND d.active = :active")
    Long countDepartmentsWithTeachersBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
} 