package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    
    int countByRole(UserRole role);
    
    int countByLastLoginTimeAfter(LocalDateTime dateTime);
    
    // Parent-specific repository methods
    List<User> findByParentId(Long parentId);
    
    List<User> findByRoleAndSchoolId(UserRole role, Long schoolId);
    
    List<User> findByRoleAndActive(UserRole role, boolean active);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering
    List<User> findBySchoolId(Long schoolId);
    
    List<User> findBySchoolIdAndRole(Long schoolId, UserRole role);
    
    List<User> findBySchoolIdAndActive(Long schoolId, boolean active);
    
    List<User> findBySchoolIdAndRoleAndActive(Long schoolId, UserRole role, boolean active);
    
    @Query("SELECT u FROM User u WHERE u.school.id = :schoolId AND u.role = 'TEACHER' AND u.active = true")
    List<User> findActiveTeachersBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT u FROM User u WHERE u.school.id = :schoolId AND u.role = 'STUDENT' AND u.active = true")
    List<User> findActiveStudentsBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT u FROM User u WHERE u.school.id = :schoolId AND u.role = 'PARENT' AND u.active = true")
    List<User> findActiveParentsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    List<User> findByRegionId(Long regionId);
    
    List<User> findByRegionIdAndRole(Long regionId, UserRole role);
    
    List<User> findByRegionIdAndActive(Long regionId, boolean active);
    
    List<User> findByRegionIdAndRoleAndActive(Long regionId, UserRole role, boolean active);
    
    @Query("SELECT u FROM User u WHERE u.region.id = :regionId AND u.role = 'TEACHER' AND u.active = true")
    List<User> findActiveTeachersByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT u FROM User u WHERE u.region.id = :regionId AND u.role = 'STUDENT' AND u.active = true")
    List<User> findActiveStudentsByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT u FROM User u WHERE u.region.id = :regionId AND u.role = 'SCHOOL_ADMIN' AND u.active = true")
    List<User> findActiveSchoolAdminsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT u FROM User u WHERE u.school.id IN :schoolIds")
    List<User> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT u FROM User u WHERE u.school.id IN :schoolIds AND u.role = :role")
    List<User> findBySchoolIdInAndRole(@Param("schoolIds") List<Long> schoolIds, @Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.school.id IN :schoolIds AND u.active = :active")
    List<User> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT u FROM User u WHERE u.school.id IN :schoolIds AND u.role = :role AND u.active = :active")
    List<User> findBySchoolIdInAndRoleAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("role") UserRole role, @Param("active") boolean active);
    
    // Region IDs list filtering
    @Query("SELECT u FROM User u WHERE u.region.id IN :regionIds")
    List<User> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT u FROM User u WHERE u.region.id IN :regionIds AND u.role = :role")
    List<User> findByRegionIdInAndRole(@Param("regionIds") List<Long> regionIds, @Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.region.id IN :regionIds AND u.active = :active")
    List<User> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT u FROM User u WHERE u.region.id IN :regionIds AND u.role = :role AND u.active = :active")
    List<User> findByRegionIdInAndRoleAndActive(@Param("regionIds") List<Long> regionIds, @Param("role") UserRole role, @Param("active") boolean active);
    
    // User IDs list filtering (for user-level access)
    @Query("SELECT u FROM User u WHERE u.id IN :userIds")
    List<User> findByIdIn(@Param("userIds") List<Long> userIds);
    
    @Query("SELECT u FROM User u WHERE u.id IN :userIds AND u.role = :role")
    List<User> findByIdInAndRole(@Param("userIds") List<Long> userIds, @Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.id IN :userIds AND u.active = :active")
    List<User> findByIdInAndActive(@Param("userIds") List<Long> userIds, @Param("active") boolean active);
    
    @Query("SELECT u FROM User u WHERE u.id IN :userIds AND u.role = :role AND u.active = :active")
    List<User> findByIdInAndRoleAndActive(@Param("userIds") List<Long> userIds, @Param("role") UserRole role, @Param("active") boolean active);
    
    // Combined filtering for complex access patterns
    @Query("SELECT u FROM User u WHERE " +
           "(u.school.id IN :schoolIds OR u.region.id IN :regionIds OR u.id IN :userIds) " +
           "AND u.active = true")
    List<User> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                     @Param("regionIds") List<Long> regionIds, 
                                     @Param("userIds") List<Long> userIds);
    
    @Query("SELECT u FROM User u WHERE " +
           "(u.school.id IN :schoolIds OR u.region.id IN :regionIds OR u.id IN :userIds) " +
           "AND u.role = :role AND u.active = true")
    List<User> findByMultiScopeAccessAndRole(@Param("schoolIds") List<Long> schoolIds, 
                                            @Param("regionIds") List<Long> regionIds, 
                                            @Param("userIds") List<Long> userIds,
                                            @Param("role") UserRole role);
} 