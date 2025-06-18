package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.enums.StudentStatus;
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
    
    // Schedule access control methods
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Student s WHERE s.user.id = :userId AND s.studentClass.id = :classId")
    boolean existsByUserIdAndStudentClassId(@Param("userId") Long userId, @Param("classId") Long classId);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Student s WHERE s.user.parent.id = :parentId AND s.studentClass.id = :classId")
    boolean existsByUserParentIdAndStudentClassId(@Param("parentId") Long parentId, @Param("classId") Long classId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering
    List<Student> findBySchoolId(Long schoolId);
    
    List<Student> findBySchoolIdAndActive(Long schoolId, boolean active);
    
    List<Student> findBySchoolIdAndStatus(Long schoolId, StudentStatus status);
    
    List<Student> findBySchoolIdAndActiveAndStatus(Long schoolId, boolean active, StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE s.school.id = :schoolId AND s.active = true AND s.status = 'ACTIVE'")
    List<Student> findActiveStudentsBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT s FROM Student s WHERE s.school.id = :schoolId AND s.studentClass.id = :classId AND s.active = true")
    List<Student> findActiveStudentsBySchoolIdAndClassId(@Param("schoolId") Long schoolId, @Param("classId") Long classId);
    
    // Region-level filtering (through school relationship)
    @Query("SELECT s FROM Student s WHERE s.school.region.id = :regionId")
    List<Student> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id = :regionId AND s.active = :active")
    List<Student> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id = :regionId AND s.status = :status")
    List<Student> findByRegionIdAndStatus(@Param("regionId") Long regionId, @Param("status") StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id = :regionId AND s.active = true AND s.status = 'ACTIVE'")
    List<Student> findActiveStudentsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT s FROM Student s WHERE s.school.id IN :schoolIds")
    List<Student> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT s FROM Student s WHERE s.school.id IN :schoolIds AND s.active = :active")
    List<Student> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT s FROM Student s WHERE s.school.id IN :schoolIds AND s.status = :status")
    List<Student> findBySchoolIdInAndStatus(@Param("schoolIds") List<Long> schoolIds, @Param("status") StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE s.school.id IN :schoolIds AND s.active = :active AND s.status = :status")
    List<Student> findBySchoolIdInAndActiveAndStatus(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active, @Param("status") StudentStatus status);
    
    // Region IDs list filtering
    @Query("SELECT s FROM Student s WHERE s.school.region.id IN :regionIds")
    List<Student> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id IN :regionIds AND s.active = :active")
    List<Student> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id IN :regionIds AND s.status = :status")
    List<Student> findByRegionIdInAndStatus(@Param("regionIds") List<Long> regionIds, @Param("status") StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE s.school.region.id IN :regionIds AND s.active = :active AND s.status = :status")
    List<Student> findByRegionIdInAndActiveAndStatus(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active, @Param("status") StudentStatus status);
    
    // Student IDs list filtering (for user-level access)
    @Query("SELECT s FROM Student s WHERE s.id IN :studentIds")
    List<Student> findByIdIn(@Param("studentIds") List<Long> studentIds);
    
    @Query("SELECT s FROM Student s WHERE s.id IN :studentIds AND s.active = :active")
    List<Student> findByIdInAndActive(@Param("studentIds") List<Long> studentIds, @Param("active") boolean active);
    
    @Query("SELECT s FROM Student s WHERE s.id IN :studentIds AND s.status = :status")
    List<Student> findByIdInAndStatus(@Param("studentIds") List<Long> studentIds, @Param("status") StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE s.id IN :studentIds AND s.active = :active AND s.status = :status")
    List<Student> findByIdInAndActiveAndStatus(@Param("studentIds") List<Long> studentIds, @Param("active") boolean active, @Param("status") StudentStatus status);
    
    // Combined filtering for complex access patterns
    @Query("SELECT s FROM Student s WHERE " +
           "(s.school.id IN :schoolIds OR s.school.region.id IN :regionIds OR s.id IN :studentIds) " +
           "AND s.active = true")
    List<Student> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                        @Param("regionIds") List<Long> regionIds, 
                                        @Param("studentIds") List<Long> studentIds);
    
    @Query("SELECT s FROM Student s WHERE " +
           "(s.school.id IN :schoolIds OR s.school.region.id IN :regionIds OR s.id IN :studentIds) " +
           "AND s.active = :active")
    List<Student> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                                 @Param("regionIds") List<Long> regionIds, 
                                                 @Param("studentIds") List<Long> studentIds,
                                                 @Param("active") boolean active);
    
    @Query("SELECT s FROM Student s WHERE " +
           "(s.school.id IN :schoolIds OR s.school.region.id IN :regionIds OR s.id IN :studentIds) " +
           "AND s.status = :status")
    List<Student> findByMultiScopeAccessAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                                 @Param("regionIds") List<Long> regionIds, 
                                                 @Param("studentIds") List<Long> studentIds,
                                                 @Param("status") StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE " +
           "(s.school.id IN :schoolIds OR s.school.region.id IN :regionIds OR s.id IN :studentIds) " +
           "AND s.active = :active AND s.status = :status")
    List<Student> findByMultiScopeAccessAndActiveAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                                          @Param("regionIds") List<Long> regionIds, 
                                                          @Param("studentIds") List<Long> studentIds,
                                                          @Param("active") boolean active,
                                                          @Param("status") StudentStatus status);
    
    // Class-level filtering with multi-tenancy
    @Query("SELECT s FROM Student s WHERE s.studentClass.id IN :classIds AND s.school.id IN :schoolIds AND s.active = true")
    List<Student> findByClassIdInAndSchoolIdInAndActive(@Param("classIds") List<Long> classIds, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT s FROM Student s WHERE s.studentClass.id = :classId AND s.school.id = :schoolId AND s.active = true")
    List<Student> findByClassIdAndSchoolIdAndActive(@Param("classId") Long classId, @Param("schoolId") Long schoolId);
    
    // Academic year filtering with multi-tenancy
    @Query("SELECT s FROM Student s WHERE s.academicYear = :academicYear AND s.school.id IN :schoolIds AND s.active = true")
    List<Student> findByAcademicYearAndSchoolIdInAndActive(@Param("academicYear") Integer academicYear, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT s FROM Student s WHERE s.academicYear = :academicYear AND s.school.region.id IN :regionIds AND s.active = true")
    List<Student> findByAcademicYearAndRegionIdInAndActive(@Param("academicYear") Integer academicYear, @Param("regionIds") List<Long> regionIds);
} 