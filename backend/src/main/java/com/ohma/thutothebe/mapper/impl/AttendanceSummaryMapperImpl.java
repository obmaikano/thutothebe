package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AttendanceSummaryDTO;
import com.ohma.thutothebe.entity.AttendanceSummary;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.AttendanceSummaryMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttendanceSummaryMapperImpl implements AttendanceSummaryMapper {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public AttendanceSummaryDTO toDto(AttendanceSummary entity) {
        if (entity == null) {
            return null;
        }

        return new AttendanceSummaryDTO(
            entity.getId(),
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getStudent() != null ? entity.getStudent().getFirstName() + " " + entity.getStudent().getLastName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getAcademicYear(),
            entity.getTerm(),
            entity.getSummaryType(),
            entity.getTotalDays(),
            entity.getPresentDays(),
            entity.getAbsentExcusedDays(),
            entity.getAbsentUnexcusedDays(),
            entity.getLateDays(),
            entity.getEarlyDepartureDays(),
            entity.getAttendancePercentage(),
            entity.getPeriodFrom(),
            entity.getPeriodTo(),
            entity.getLastCalculatedDate(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public AttendanceSummary toEntity(AttendanceSummaryDTO dto) {
        if (dto == null) {
            return null;
        }

        AttendanceSummary entity = new AttendanceSummary();
        entity.setId(dto.id());
        entity.setAcademicYear(dto.academicYear());
        entity.setTerm(dto.term());
        entity.setSummaryType(dto.summaryType());
        entity.setTotalDays(dto.totalDays() != null ? dto.totalDays() : 0);
        entity.setPresentDays(dto.presentDays() != null ? dto.presentDays() : 0);
        entity.setAbsentExcusedDays(dto.absentExcusedDays() != null ? dto.absentExcusedDays() : 0);
        entity.setAbsentUnexcusedDays(dto.absentUnexcusedDays() != null ? dto.absentUnexcusedDays() : 0);
        entity.setLateDays(dto.lateDays() != null ? dto.lateDays() : 0);
        entity.setEarlyDepartureDays(dto.earlyDepartureDays() != null ? dto.earlyDepartureDays() : 0);
        entity.setAttendancePercentage(dto.attendancePercentage() != null ? dto.attendancePercentage() : 0.0);
        entity.setPeriodFrom(dto.periodFrom());
        entity.setPeriodTo(dto.periodTo());
        entity.setLastCalculatedDate(dto.lastCalculatedDate());
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

        return entity;
    }
} 