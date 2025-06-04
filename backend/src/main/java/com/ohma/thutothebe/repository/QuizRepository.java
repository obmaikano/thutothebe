package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    Optional<Quiz> findByCode(String code);
    
    @EntityGraph(attributePaths = {"questions", "questions.options"})
    Optional<Quiz> findWithQuestionsById(Long id);
    
    @EntityGraph(attributePaths = {"questions", "questions.options"})
    Optional<Quiz> findWithQuestionsByCode(String code);
    
    List<Quiz> findByCourseId(Long courseId);
    
    List<Quiz> findByInstructorId(Long instructorId);
    
    @Query("SELECT q FROM Quiz q WHERE q.instructor.id = :instructorId AND q.active = :active")
    List<Quiz> findByInstructorIdAndActive(@Param("instructorId") Long instructorId, @Param("active") boolean active);
    
    List<Quiz> findByStatus(QuizStatus status);
    
    List<Quiz> findByCourseIdAndStatus(Long courseId, QuizStatus status);
    
    @Query("SELECT q FROM Quiz q WHERE q.active = true AND q.course.id = :courseId")
    List<Quiz> findActiveByCourseId(Long courseId);
    
    boolean existsByCode(String code);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering (through course relationship)
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id = :schoolId")
    List<Quiz> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id = :schoolId AND q.active = :active")
    List<Quiz> findBySchoolIdAndActive(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id = :schoolId AND q.status = :status")
    List<Quiz> findBySchoolIdAndStatus(@Param("schoolId") Long schoolId, @Param("status") QuizStatus status);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id = :schoolId AND q.active = true")
    List<Quiz> findActiveQuizzesBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering (through course → school → region relationship)
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id = :regionId")
    List<Quiz> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id = :regionId AND q.active = :active")
    List<Quiz> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id = :regionId AND q.status = :status")
    List<Quiz> findByRegionIdAndStatus(@Param("regionId") Long regionId, @Param("status") QuizStatus status);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id = :regionId AND q.active = true")
    List<Quiz> findActiveQuizzesByRegionId(@Param("regionId") Long regionId);
    
    // Course-level filtering with multi-tenancy
    @Query("SELECT q FROM Quiz q WHERE q.course.id = :courseId AND q.course.classEntity.school.id IN :schoolIds")
    List<Quiz> findByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.id = :courseId AND q.course.classEntity.school.id IN :schoolIds AND q.active = :active")
    List<Quiz> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.id = :courseId AND q.course.classEntity.school.id = :schoolId AND q.active = true")
    List<Quiz> findByCourseIdAndSchoolIdAndActive(@Param("courseId") Long courseId, @Param("schoolId") Long schoolId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id IN :schoolIds")
    List<Quiz> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id IN :schoolIds AND q.active = :active")
    List<Quiz> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.id IN :schoolIds AND q.status = :status")
    List<Quiz> findBySchoolIdInAndStatus(@Param("schoolIds") List<Long> schoolIds, @Param("status") QuizStatus status);
    
    // Region IDs list filtering
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id IN :regionIds")
    List<Quiz> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id IN :regionIds AND q.active = :active")
    List<Quiz> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.school.region.id IN :regionIds AND q.status = :status")
    List<Quiz> findByRegionIdInAndStatus(@Param("regionIds") List<Long> regionIds, @Param("status") QuizStatus status);
    
    // Quiz IDs list filtering (for user-level access)
    @Query("SELECT q FROM Quiz q WHERE q.id IN :quizIds")
    List<Quiz> findByIdIn(@Param("quizIds") List<Long> quizIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.id IN :quizIds AND q.active = :active")
    List<Quiz> findByIdInAndActive(@Param("quizIds") List<Long> quizIds, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.id IN :quizIds AND q.status = :status")
    List<Quiz> findByIdInAndStatus(@Param("quizIds") List<Long> quizIds, @Param("status") QuizStatus status);
    
    // Instructor IDs list filtering (for user-level access through instructor relationship)
    @Query("SELECT q FROM Quiz q WHERE q.instructor.id IN :instructorIds")
    List<Quiz> findByInstructorIdIn(@Param("instructorIds") List<Long> instructorIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.instructor.id IN :instructorIds AND q.active = :active")
    List<Quiz> findByInstructorIdInAndActive(@Param("instructorIds") List<Long> instructorIds, @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE q.instructor.id IN :instructorIds AND q.status = :status")
    List<Quiz> findByInstructorIdInAndStatus(@Param("instructorIds") List<Long> instructorIds, @Param("status") QuizStatus status);
    
    // Combined filtering for complex access patterns
    @Query("SELECT q FROM Quiz q WHERE " +
           "(q.course.classEntity.school.id IN :schoolIds OR q.course.classEntity.school.region.id IN :regionIds OR q.instructor.id IN :instructorIds) " +
           "AND q.active = true")
    List<Quiz> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                     @Param("regionIds") List<Long> regionIds, 
                                     @Param("instructorIds") List<Long> instructorIds);
    
    @Query("SELECT q FROM Quiz q WHERE " +
           "(q.course.classEntity.school.id IN :schoolIds OR q.course.classEntity.school.region.id IN :regionIds OR q.instructor.id IN :instructorIds) " +
           "AND q.active = :active")
    List<Quiz> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                              @Param("regionIds") List<Long> regionIds, 
                                              @Param("instructorIds") List<Long> instructorIds,
                                              @Param("active") boolean active);
    
    @Query("SELECT q FROM Quiz q WHERE " +
           "(q.course.classEntity.school.id IN :schoolIds OR q.course.classEntity.school.region.id IN :regionIds OR q.instructor.id IN :instructorIds) " +
           "AND q.status = :status")
    List<Quiz> findByMultiScopeAccessAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                              @Param("regionIds") List<Long> regionIds, 
                                              @Param("instructorIds") List<Long> instructorIds,
                                              @Param("status") QuizStatus status);
    
    @Query("SELECT q FROM Quiz q WHERE " +
           "(q.course.classEntity.school.id IN :schoolIds OR q.course.classEntity.school.region.id IN :regionIds OR q.instructor.id IN :instructorIds) " +
           "AND q.active = :active AND q.status = :status")
    List<Quiz> findByMultiScopeAccessAndActiveAndStatus(@Param("schoolIds") List<Long> schoolIds, 
                                                       @Param("regionIds") List<Long> regionIds, 
                                                       @Param("instructorIds") List<Long> instructorIds,
                                                       @Param("active") boolean active,
                                                       @Param("status") QuizStatus status);
    
    // Teacher-level filtering with multi-tenancy (through course instructors)
    @Query("SELECT q FROM Quiz q JOIN q.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND q.course.classEntity.school.id IN :schoolIds AND q.active = true")
    List<Quiz> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT q FROM Quiz q JOIN q.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND q.course.classEntity.school.region.id IN :regionIds AND q.active = true")
    List<Quiz> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId, @Param("regionIds") List<Long> regionIds);
    
    // Class-level filtering with multi-tenancy (through course → class relationship)
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.id = :classId AND q.course.classEntity.school.id IN :schoolIds AND q.active = true")
    List<Quiz> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.classEntity.id = :classId AND q.course.classEntity.school.id = :schoolId AND q.active = true")
    List<Quiz> findByClassIdAndSchoolIdAndActive(@Param("classId") Long classId, @Param("schoolId") Long schoolId);
    
    // Subject-level filtering with multi-tenancy (through course → subject relationship)
    @Query("SELECT q FROM Quiz q WHERE q.course.subject.id = :subjectId AND q.course.classEntity.school.id IN :schoolIds AND q.active = true")
    List<Quiz> findBySubjectIdAndSchoolIdInAndActive(@Param("subjectId") Long subjectId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.subject.id = :subjectId AND q.course.classEntity.school.region.id IN :regionIds AND q.active = true")
    List<Quiz> findBySubjectIdAndRegionIdInAndActive(@Param("subjectId") Long subjectId, @Param("regionIds") List<Long> regionIds);
} 