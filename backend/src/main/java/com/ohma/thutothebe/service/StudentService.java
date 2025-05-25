package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.dto.StudentOnboardingDTO;

import java.util.List;

public interface StudentService extends BaseService<StudentDTO, Long> {
    
    StudentDTO getStudentByAdmissionNumber(String admissionNumber);
    
    StudentDTO getStudentByEmail(String email);
    
    StudentDTO getStudentByUserId(Long userId);
    
    List<StudentDTO> getActiveStudents();
    
    List<StudentDTO> getStudentsBySchoolId(Long schoolId);
    
    StudentDTO createStudent(StudentDTO studentDTO);
    
    void activateStudent(Long id);

    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    
    void deactivateStudent(Long id);
    
    boolean existsByAdmissionNumber(String admissionNumber);
    
    boolean existsByEmail(String email);
    
    StudentDTO linkToUser(Long studentId, Long userId);
    
    StudentDTO onboardStudent(StudentOnboardingDTO onboardingDTO);
    
    List<StudentDTO> getStudentsByClassId(Long classId);
    
    List<StudentDTO> getStudentsEnrolledInClass(Long classId);
    
    List<StudentDTO> getStudentsBySubjectId(Long subjectId);

    List<StudentDTO> getStudentsByCourseId(Long courseId);
    
    List<StudentDTO> getStudentsByTeacherId(Long teacherId);
    
    List<StudentDTO> getActiveStudentsByTeacherId(Long teacherId);
    
    List<StudentDTO> getActiveStudentsBySubjectId(Long subjectId);
    
    List<StudentDTO> getActiveStudentsByCourseId(Long courseId);
    
    List<StudentDTO> getActiveStudentsByClassId(Long classId);
    
    String debugClassEnrollment(Long classId);
    
    void cleanupClassEnrollmentInconsistencies(Long classId);

    // Student-specific methods for student role access
    List<Object> getStudentCourses(Long studentId);
    
    List<Object> getStudentAssignments(Long studentId);
    
    Object getStudentPerformanceAnalytics(Long studentId);
    
    Object getStudentDashboardData(Long studentId);
    
    // Helper method to create student record for user if it doesn't exist
    StudentDTO createStudentForUser(Long userId);
} 