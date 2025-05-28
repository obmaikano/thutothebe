package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.mapper.ClassMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ClassMapperImpl implements ClassMapper {

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public ClassDTO toDto(Class entity) {
        if (entity == null) {
            return null;
        }
        
        Set<Long> teacherIds = new HashSet<>();
        if (entity.getTeachers() != null && !entity.getTeachers().isEmpty()) {
            teacherIds = entity.getTeachers().stream()
                .filter(teacher -> teacher != null && teacher.getId() != null)
                .map(Teacher::getId)
                .collect(Collectors.toSet());
        }
        
        Set<Long> studentIds = new HashSet<>();
        if (entity.getStudents() != null && !entity.getStudents().isEmpty()) {
            studentIds = entity.getStudents().stream()
                .filter(student -> student != null && student.getId() != null)
                .map(Student::getId)
                .collect(Collectors.toSet());
        }
        
        return new ClassDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getGradeLevel(),
            entity.getCapacity(),
            entity.getTotalEnrolled(),
            entity.getSpotsLeft(),
            entity.getOverCapacity(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            teacherIds,
            studentIds,
            entity.isActive()
        );
    }

    @Override
    public Class toEntity(ClassDTO dto) {
        if (dto == null) {
            return null;
        }
        Class entity = new Class();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setGradeLevel(dto.gradeLevel());
        entity.setCapacity(dto.capacity() != null ? dto.capacity() : 30);
        entity.setActive(dto.active());
        
        if (dto.schoolId() != null) {
            entity.setSchool(schoolRepository.findById(dto.schoolId()).orElse(null));
        }
        
        Set<Teacher> teachers = new HashSet<>();
        if (dto.teacherIds() != null && !dto.teacherIds().isEmpty()) {
            teachers = dto.teacherIds().stream()
                .filter(teacherId -> teacherId != null)
                .map(teacherId -> teacherRepository.findById(teacherId).orElse(null))
                .filter(teacher -> teacher != null)
                .collect(Collectors.toSet());
        }
        entity.setTeachers(teachers);
        
        Set<Student> students = new HashSet<>();
        if (dto.studentIds() != null && !dto.studentIds().isEmpty()) {
            students = dto.studentIds().stream()
                .filter(studentId -> studentId != null)
                .map(studentId -> studentRepository.findById(studentId).orElse(null))
                .filter(student -> student != null)
                .collect(Collectors.toSet());
        }
        entity.setStudents(students);
        
        return entity;
    }
} 