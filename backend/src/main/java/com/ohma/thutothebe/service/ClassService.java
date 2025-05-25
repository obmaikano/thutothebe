package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ClassDTO;
import java.util.List;
import java.util.Set;

public interface ClassService extends BaseService<ClassDTO, Long> {
    List<ClassDTO> getClassesBySchoolId(Long schoolId);
    List<ClassDTO> getActiveClassesBySchoolId(Long schoolId);
    List<ClassDTO> getClassesBySchoolIdAndTeacherId(Long schoolId, Long teacherId);
    List<ClassDTO> getClassesBySchoolIdAndStudentId(Long schoolId, Long studentId);
    ClassDTO createClass(ClassDTO classDTO);
    ClassDTO updateClass(Long id, ClassDTO classDTO);
    void deleteClass(Long id);
    void deactivateClass(Long id);
    void activateClass(Long id);
    void addTeacherToClass(Long classId, Long teacherId);
    void removeTeacherFromClass(Long classId, Long teacherId);
    void addStudentToClass(Long classId, Long studentId);
    void removeStudentFromClass(Long classId, Long studentId);
    ClassDTO getClassWithStudents(Long id);
} 