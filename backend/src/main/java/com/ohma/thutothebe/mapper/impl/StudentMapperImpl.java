package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.repository.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class StudentMapperImpl implements StudentMapper {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final ClassRepository classRepository;
    private final PersonRepository personRepository;
    private final SubjectRepository subjectRepository;

    public StudentMapperImpl(
            UserRepository userRepository,
            SchoolRepository schoolRepository,
            ClassRepository classRepository,
            PersonRepository personRepository,
            SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.classRepository = classRepository;
        this.personRepository = personRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public Student toEntity(StudentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Student student = new Student();
        student.setId(dto.id());
        student.setAdmissionNumber(dto.admissionNumber());
        student.setFirstName(dto.firstName());
        student.setLastName(dto.lastName());
        student.setDateOfBirth(dto.dateOfBirth());
        student.setGender(dto.gender());
        student.setPhone(dto.phone());
        student.setEmail(dto.email());
        student.setAddress(dto.address());
        student.setAcademicYear(dto.academicYear());
        student.setMedicalConditions(dto.medicalConditions());
        student.setDisabilities(dto.disabilities());
        student.setEmergencyContactName(dto.emergencyContactName());
        student.setEmergencyContactPhone(dto.emergencyContactPhone());
        student.setEmergencyContactRelationship(dto.emergencyContactRelation());
        student.setActive(dto.active());
        student.setStatus(dto.status());
        student.setOnboardingNotes(dto.onboardingNotes());
        
        if (dto.schoolId() != null) {
            schoolRepository.findById(dto.schoolId()).ifPresent(student::setSchool);
        }
        
        if (dto.classId() != null) {
            classRepository.findById(dto.classId()).ifPresent(student::setStudentClass);
        }
        
        if (dto.userId() != null) {
            userRepository.findById(dto.userId()).ifPresent(student::setUser);
        }
        
        if (dto.personId() != null) {
            personRepository.findById(dto.personId()).ifPresent(student::setPerson);
        }
        
        if (dto.subjectIds() != null && !dto.subjectIds().isEmpty()) {
            student.setSubjects(
                dto.subjectIds().stream()
                    .map(subjectId -> subjectRepository.findById(subjectId).orElse(null))
                    .filter(subject -> subject != null)
                    .collect(Collectors.toSet())
            );
        }
        
        return student;
    }

    @Override
    public StudentDTO toDto(Student entity) {
        if (entity == null) {
            return null;
        }
        
        return new StudentDTO(
            entity.getId(),
            entity.getAdmissionNumber(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getDateOfBirth(),
            entity.getGender(),
            entity.getPhone(),
            entity.getEmail(),
            entity.getAddress(),
            entity.getAcademicYear(),
            entity.getStudentClass() != null ? entity.getStudentClass().getId() : null,
            entity.getMedicalConditions(),
            entity.getDisabilities(),
            entity.getEmergencyContactName(),
            entity.getEmergencyContactPhone(),
            entity.getEmergencyContactRelationship(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.getPerson() != null ? entity.getPerson().getId() : null,
            entity.isActive(),
            entity.getStatus(),
            entity.getOnboardingNotes(),
            entity.getSubjects() != null ? 
                entity.getSubjects().stream()
                    .map(Subject::getId)
                    .collect(Collectors.toSet()) : null
        );
    }
} 