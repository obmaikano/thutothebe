package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.entity.AttendanceRecord;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.AttendanceRecordMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttendanceRecordMapperImpl implements AttendanceRecordMapper {

    @Autowired
    private UserRepository userRepository;

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

        return new AttendanceRecordDTO(
            entity.getId(),
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getStudent() != null ? entity.getStudent().getFirstName() + " " + entity.getStudent().getLastName() : null,
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
        if (dto.studentId() != null) {
            User student = userRepository.findById(dto.studentId()).orElse(null);
            entity.setStudent(student);
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