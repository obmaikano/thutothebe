package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import com.ohma.thutothebe.entity.SchoolMonitoring;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.repository.SchoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchoolMonitoringMapper implements BaseDtoMapper<SchoolMonitoring, SchoolMonitoringDTO> {

    private final SchoolRepository schoolRepository;

    @Override
    public SchoolMonitoringDTO toDto(SchoolMonitoring entity) {
        if (entity == null) return null;

        School school = entity.getSchool();
        return new SchoolMonitoringDTO(
            entity.getId(),
            school != null ? school.getId() : null,
            school != null ? school.getName() : null,
            school != null ? school.getCode() : null,
            school != null && school.getRegion() != null ? school.getRegion().getId() : null,
            school != null && school.getRegion() != null ? school.getRegion().getName() : null,
            entity.getMonitoringDate(),
            entity.getTotalActiveTeachers(),
            entity.getTotalActiveStudents(),
            entity.getTotalLogins(),
            entity.getTeacherLogins(),
            entity.getStudentLogins(),
            entity.getAdminLogins(),
            entity.getAttendanceRate(),
            entity.getAssignmentSubmissions(),
            entity.getAssignmentsGraded(),
            entity.getAverageGradingTurnaroundHours(),
            entity.getCurriculumCompletionRate(),
            entity.getSystemUptimePercentage(),
            entity.getPeakUsageHour(),
            entity.getTotalAnnouncements(),
            entity.getAnnouncementsAcknowledged(),
            entity.getForumPosts(),
            entity.getQuizSubmissions(),
            entity.getDocumentUploads(),
            entity.getDocumentDownloads(),
            entity.getLastActivityTimestamp(),
            entity.getComplianceScore(),
            entity.getAlertCount(),
            entity.isActive()
        );
    }

    @Override
    public SchoolMonitoring toEntity(SchoolMonitoringDTO dto) {
        if (dto == null) return null;

        SchoolMonitoring entity = new SchoolMonitoring();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(SchoolMonitoring entity, SchoolMonitoringDTO dto) {
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new IllegalArgumentException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
        
        entity.setMonitoringDate(dto.monitoringDate());
        entity.setTotalActiveTeachers(dto.totalActiveTeachers());
        entity.setTotalActiveStudents(dto.totalActiveStudents());
        entity.setTotalLogins(dto.totalLogins());
        entity.setTeacherLogins(dto.teacherLogins());
        entity.setStudentLogins(dto.studentLogins());
        entity.setAdminLogins(dto.adminLogins());
        entity.setAttendanceRate(dto.attendanceRate());
        entity.setAssignmentSubmissions(dto.assignmentSubmissions());
        entity.setAssignmentsGraded(dto.assignmentsGraded());
        entity.setAverageGradingTurnaroundHours(dto.averageGradingTurnaroundHours());
        entity.setCurriculumCompletionRate(dto.curriculumCompletionRate());
        entity.setSystemUptimePercentage(dto.systemUptimePercentage());
        entity.setPeakUsageHour(dto.peakUsageHour());
        entity.setTotalAnnouncements(dto.totalAnnouncements());
        entity.setAnnouncementsAcknowledged(dto.announcementsAcknowledged());
        entity.setForumPosts(dto.forumPosts());
        entity.setQuizSubmissions(dto.quizSubmissions());
        entity.setDocumentUploads(dto.documentUploads());
        entity.setDocumentDownloads(dto.documentDownloads());
        entity.setLastActivityTimestamp(dto.lastActivityTimestamp());
        entity.setComplianceScore(dto.complianceScore());
        entity.setAlertCount(dto.alertCount());
        entity.setActive(dto.active());
    }
} 