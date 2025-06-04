package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseType;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCode(String code);
    
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.courseInstructors ci " +
           "LEFT JOIN FETCH ci.teacher " +
           "LEFT JOIN FETCH c.subject " +
           "WHERE c.active = :active")
    List<Course> findByActive(@Param("active") boolean active);
    
    List<Course> findBySubject(Subject subject);
    
    List<Course> findBySubjectIdAndActive(Long subjectId, boolean active);
    
    List<Course> findByClassEntityId(Long classId);
    
    @Query("SELECT DISTINCT c FROM Course c " +
           "LEFT JOIN FETCH c.courseInstructors ci " +
           "LEFT JOIN FETCH ci.teacher " +
           "LEFT JOIN FETCH c.subject " +
           "WHERE c.classEntity.id = :classId AND c.active = :active")
    List<Course> findByClassEntityIdAndActive(@Param("classId") Long classId, @Param("active") boolean active);
    
    List<Course> findByTerm(Term term);
    
    List<Course> findByYear(Integer year);
    
    List<Course> findByType(CourseType type);
    
    List<Course> findByTypeAndActive(CourseType type, boolean active);
    
    boolean existsByCode(String code);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Course> findByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.active = true")
    List<Course> findByTeacherIdAndActive(@Param("teacherId") Long teacherId);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // School-level filtering
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id = :schoolId")
    List<Course> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id = :schoolId AND c.active = :active")
    List<Course> findBySchoolIdAndActive(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id = :schoolId AND c.active = true")
    List<Course> findActiveCoursesBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.region.id = :regionId")
    List<Course> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.region.id = :regionId AND c.active = :active")
    List<Course> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.region.id = :regionId AND c.active = true")
    List<Course> findActiveCoursesByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id IN :schoolIds")
    List<Course> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.region.id IN :regionIds")
    List<Course> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id IN :schoolIds OR c.classEntity.school.region.id IN :regionIds")
    List<Course> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                       @Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE (c.classEntity.school.id IN :schoolIds OR c.classEntity.school.region.id IN :regionIds) AND c.active = :active")
    List<Course> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds,
                                                @Param("regionIds") List<Long> regionIds,
                                                @Param("active") boolean active);
    
    // Subject filtering with multi-tenant security
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.subject.id = :subjectId AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.subject.id = :subjectId AND c.classEntity.school.region.id IN :regionIds AND c.active = :active")
    List<Course> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId,
                                                      @Param("regionIds") List<Long> regionIds,
                                                      @Param("active") boolean active);
    
    // Teacher filtering with multi-tenant security
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId,
                                                      @Param("schoolIds") List<Long> schoolIds,
                                                      @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "classEntity.school.region", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND c.classEntity.school.region.id IN :regionIds AND c.active = :active")
    List<Course> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId,
                                                      @Param("regionIds") List<Long> regionIds,
                                                      @Param("active") boolean active);
    
    // Class filtering with multi-tenant security
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.id = :classId AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId,
                                                    @Param("schoolIds") List<Long> schoolIds,
                                                    @Param("active") boolean active);
    
    // Term and Year filtering with multi-tenant security
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.term = :term AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findByTermAndSchoolIdInAndActive(@Param("term") Term term,
                                                 @Param("schoolIds") List<Long> schoolIds,
                                                 @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.year = :year AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findByYearAndSchoolIdInAndActive(@Param("year") Integer year,
                                                 @Param("schoolIds") List<Long> schoolIds,
                                                 @Param("active") boolean active);
    
    // Type filtering with multi-tenant security
    @EntityGraph(attributePaths = {"classEntity", "classEntity.school", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.type = :type AND c.classEntity.school.id IN :schoolIds AND c.active = :active")
    List<Course> findByTypeAndSchoolIdInAndActive(@Param("type") CourseType type,
                                                 @Param("schoolIds") List<Long> schoolIds,
                                                 @Param("active") boolean active);
    
    // Validation methods for business rules
    @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.code = :code AND c.classEntity.school.id = :schoolId")
    boolean existsByCodeAndSchoolId(@Param("code") String code, @Param("schoolId") Long schoolId);
    
    @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.name = :name AND c.classEntity.school.id = :schoolId AND c.term = :term AND c.year = :year")
    boolean existsByNameAndSchoolIdAndTermAndYear(@Param("name") String name, 
                                                 @Param("schoolId") Long schoolId,
                                                 @Param("term") Term term,
                                                 @Param("year") Integer year);
} 