package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.entity.Department;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.mapper.DepartmentMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DepartmentMapperImpl implements DepartmentMapper {

    private final SchoolRepository schoolRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;

    public DepartmentMapperImpl(
            SchoolRepository schoolRepository,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository) {
        this.schoolRepository = schoolRepository;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public Department toEntity(DepartmentDTO dto) {
        if (dto == null) {
            return null;
        }

        Department department = new Department();
        department.setId(dto.id());
        department.setName(dto.name());
        department.setDescription(dto.description());
        department.setActive(dto.active());
        department.setCreatedAt(dto.createdAt());
        department.setModifiedAt(dto.modifiedAt());

        // Set school
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId()).orElse(null);
            department.setSchool(school);
        }

        // Set department head
        if (dto.departmentHeadId() != null) {
            Teacher departmentHead = teacherRepository.findById(dto.departmentHeadId()).orElse(null);
            department.setDepartmentHead(departmentHead);
        }

        // Set subjects
        if (dto.subjectIds() != null && !dto.subjectIds().isEmpty()) {
            Set<Subject> subjects = dto.subjectIds().stream()
                    .map(subjectId -> subjectRepository.findById(subjectId).orElse(null))
                    .filter(subject -> subject != null)
                    .collect(Collectors.toSet());
            department.setSubjects(subjects);
        }

        // Set teachers
        if (dto.teacherIds() != null && !dto.teacherIds().isEmpty()) {
            Set<Teacher> teachers = dto.teacherIds().stream()
                    .map(teacherId -> teacherRepository.findById(teacherId).orElse(null))
                    .filter(teacher -> teacher != null)
                    .collect(Collectors.toSet());
            department.setTeachers(teachers);
        }

        return department;
    }

    @Override
    public DepartmentDTO toDto(Department entity) {
        if (entity == null) {
            return null;
        }

        return new DepartmentDTO(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getSchool() != null ? entity.getSchool().getId() : null,
                entity.getSchool() != null ? entity.getSchool().getName() : null,
                entity.getDepartmentHead() != null ? entity.getDepartmentHead().getId() : null,
                entity.getDepartmentHead() != null ? 
                    entity.getDepartmentHead().getFirstName() + " " + entity.getDepartmentHead().getLastName() : null,
                entity.getSubjects() != null ? 
                    entity.getSubjects().stream().map(Subject::getId).collect(Collectors.toSet()) : Set.of(),
                entity.getSubjects() != null ? 
                    entity.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()) : Set.of(),
                entity.getTeachers() != null ? 
                    entity.getTeachers().stream().map(Teacher::getId).collect(Collectors.toSet()) : Set.of(),
                entity.getTeachers() != null ? 
                    entity.getTeachers().stream()
                        .map(teacher -> teacher.getFirstName() + " " + teacher.getLastName())
                        .collect(Collectors.toSet()) : Set.of(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getModifiedAt()
        );
    }

    public void updateEntityFromDto(Department entity, DepartmentDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());

        // Update school if changed
        if (dto.schoolId() != null && (entity.getSchool() == null || !entity.getSchool().getId().equals(dto.schoolId()))) {
            School school = schoolRepository.findById(dto.schoolId()).orElse(null);
            entity.setSchool(school);
        }

        // Update department head if changed
        if (dto.departmentHeadId() != null && 
            (entity.getDepartmentHead() == null || !entity.getDepartmentHead().getId().equals(dto.departmentHeadId()))) {
            Teacher departmentHead = teacherRepository.findById(dto.departmentHeadId()).orElse(null);
            entity.setDepartmentHead(departmentHead);
        } else if (dto.departmentHeadId() == null) {
            entity.setDepartmentHead(null);
        }

        // Update subjects if provided
        if (dto.subjectIds() != null) {
            Set<Subject> subjects = dto.subjectIds().stream()
                    .map(subjectId -> subjectRepository.findById(subjectId).orElse(null))
                    .filter(subject -> subject != null)
                    .collect(Collectors.toSet());
            entity.setSubjects(subjects);
        }

        // Update teachers if provided
        if (dto.teacherIds() != null) {
            Set<Teacher> teachers = dto.teacherIds().stream()
                    .map(teacherId -> teacherRepository.findById(teacherId).orElse(null))
                    .filter(teacher -> teacher != null)
                    .collect(Collectors.toSet());
            entity.setTeachers(teachers);
        }
    }
} 