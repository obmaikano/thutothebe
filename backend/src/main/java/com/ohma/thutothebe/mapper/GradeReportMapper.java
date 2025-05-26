package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.GradeReportDTO;
import com.ohma.thutothebe.entity.GradeReport;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.mapper.BaseDtoMapper;
import org.springframework.stereotype.Component;

@Component
public class GradeReportMapper implements BaseDtoMapper<GradeReport, GradeReportDTO> {

    @Override
    public GradeReportDTO toDto(GradeReport entity) {
        if (entity == null) {
            return null;
        }

        return new GradeReportDTO(
                entity.getId(),
                entity.getStudent() != null ? entity.getStudent().getId() : null,
                entity.getCourse() != null ? entity.getCourse().getId() : null,
                entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
                entity.getReportType(),
                entity.getTerm(),
                entity.getAcademicYear(),
                entity.getOverallGrade(),
                entity.getOverallPercentage(),
                entity.getGradeLetter(),
                entity.getRankInClass(),
                entity.getTotalStudentsInClass(),
                entity.getComments(),
                entity.getGeneratedBy() != null ? entity.getGeneratedBy().getId() : null,
                entity.getGeneratedAt(),
                entity.getFilePath(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getModifiedAt()
        );
    }

    @Override
    public GradeReport toEntity(GradeReportDTO dto) {
        if (dto == null) {
            return null;
        }

        GradeReport report = new GradeReport();
        report.setId(dto.id());
        report.setReportType(dto.reportType());
        report.setTerm(dto.term());
        report.setAcademicYear(dto.academicYear());
        report.setOverallGrade(dto.overallGrade());
        report.setOverallPercentage(dto.overallPercentage());
        report.setGradeLetter(dto.gradeLetter());
        report.setRankInClass(dto.rankInClass());
        report.setTotalStudentsInClass(dto.totalStudentsInClass());
        report.setComments(dto.comments());
        report.setGeneratedAt(dto.generatedAt());
        report.setFilePath(dto.filePath());
        report.setActive(dto.active());

        return report;
    }

    public GradeReport toEntityWithReferences(GradeReportDTO dto, User student, Course course, 
                                            Class classEntity, User generatedBy) {
        GradeReport report = toEntity(dto);
        if (report != null) {
            report.setStudent(student);
            report.setCourse(course);
            report.setClassEntity(classEntity);
            report.setGeneratedBy(generatedBy);
        }
        return report;
    }
} 