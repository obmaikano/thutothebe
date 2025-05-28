package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.entity.AttendanceRecord;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.AttendanceRecordMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttendanceRecordMapperImpl implements AttendanceRecordMapper {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public AttendanceRecordDTO toDto(AttendanceRecord entity) {
        if (entity == null) {
            return null;
        }

        // Get student name from either studentUser or studentEntity
        String studentName = null;
        if (entity.getStudentUser() != null) {
            studentName = entity.getStudentUser().getFirstName() + " " + entity.getStudentUser().getLastName();
        } else if (entity.getStudentEntity() != null) {
            studentName = entity.getStudentEntity().getFirstName() + " " + entity.getStudentEntity().getLastName();
        }

        return new AttendanceRecordDTO(
            entity.getId(),
            entity.getStudentEntity() != null ? entity.getStudentEntity().getId() : null,
            entity.getStudentUser() != null ? entity.getStudentUser().getId() : null,
            studentName,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getMarkedBy() != null ? entity.getMarkedBy().getId() : null,
            entity.getMarkedBy() != null ? entity.getMarkedBy().getFirstName() + " " + entity.getMarkedBy().getLastName() : null,
            entity.getAttendanceDate(),
            entity.getAttendanceStatus(),
            entity.getAttendanceType(),
            entity.getPeriodNumber(),
            entity.getPeriodStartTime(),
            entity.getPeriodEndTime(),
            entity.getMarkedAt(),
            entity.getArrivalTime(),
            entity.getDepartureTime(),
            entity.getRemarks(),
            entity.getAcademicYear(),
            entity.getTerm(),
            entity.isModified(),
            entity.getModifiedReason(),
            entity.getModifiedBy() != null ? entity.getModifiedBy().getId() : null,
            entity.getModifiedBy() != null ? entity.getModifiedBy().getFirstName() + " " + entity.getModifiedBy().getLastName() : null,
            entity.getModifiedAt(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public AttendanceRecord toEntity(AttendanceRecordDTO dto) {
        if (dto == null) {
            return null;
        }

        AttendanceRecord entity = new AttendanceRecord();
        entity.setId(dto.id());
        entity.setAttendanceDate(dto.attendanceDate());
        entity.setAttendanceStatus(dto.attendanceStatus());
        entity.setAttendanceType(dto.attendanceType());
        entity.setPeriodNumber(dto.periodNumber());
        entity.setPeriodStartTime(dto.periodStartTime());
        entity.setPeriodEndTime(dto.periodEndTime());
        entity.setMarkedAt(dto.markedAt());
        entity.setArrivalTime(dto.arrivalTime());
        entity.setDepartureTime(dto.departureTime());
        entity.setRemarks(dto.remarks());
        entity.setAcademicYear(dto.academicYear());
        entity.setTerm(dto.term());
        entity.setModified(dto.isModified());
        entity.setModifiedReason(dto.modifiedReason());
        entity.setModifiedAt(dto.modifiedAt());
        entity.setActive(dto.active());

        // Set relationships
        if (dto.studentEntityId() != null) {
            Student student = studentRepository.findById(dto.studentEntityId()).orElse(null);
            entity.setStudentEntity(student);
        }

        if (dto.studentUserId() != null) {
            User studentUser = userRepository.findById(dto.studentUserId()).orElse(null);
            entity.setStudentUser(studentUser);
        }

        if (dto.classId() != null) {
            Class classEntity = classRepository.findById(dto.classId()).orElse(null);
            entity.setClassEntity(classEntity);
        }

        if (dto.courseId() != null) {
            Course course = courseRepository.findById(dto.courseId()).orElse(null);
            entity.setCourse(course);
        }

        if (dto.subjectId() != null) {
            Subject subject = subjectRepository.findById(dto.subjectId()).orElse(null);
            entity.setSubject(subject);
        }

        if (dto.markedById() != null) {
            User markedBy = userRepository.findById(dto.markedById()).orElse(null);
            entity.setMarkedBy(markedBy);
        }

        if (dto.modifiedById() != null) {
            User modifiedBy = userRepository.findById(dto.modifiedById()).orElse(null);
            entity.setModifiedBy(modifiedBy);
        }

        return entity;
    }
} 