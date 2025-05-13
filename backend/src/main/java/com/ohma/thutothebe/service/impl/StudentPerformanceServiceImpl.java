package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentPerformanceDTO;
import com.ohma.thutothebe.entity.StudentPerformance;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.StudentPerformanceMapper;
import com.ohma.thutothebe.mapper.impl.StudentPerformanceMapperImpl;
import com.ohma.thutothebe.repository.StudentPerformanceRepository;
import com.ohma.thutothebe.service.StudentPerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentPerformanceServiceImpl extends BaseServiceImpl<StudentPerformance, StudentPerformanceDTO, Long> implements StudentPerformanceService {

    @Autowired
    private StudentPerformanceRepository studentPerformanceRepository;

    @Autowired
    private StudentPerformanceMapper studentPerformanceMapper;

    protected StudentPerformanceServiceImpl(JpaRepository<StudentPerformance, Long> repository) {
        super(repository);
    }

    @Override
    protected StudentPerformanceDTO mapToDto(StudentPerformance entity) {
        return studentPerformanceMapper.toDto(entity);
    }

    @Override
    protected StudentPerformance mapToEntity(StudentPerformanceDTO dto) {
        return studentPerformanceMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(StudentPerformance entity, StudentPerformanceDTO dto) {
        // Implement as needed, or leave empty if not required
    }

    @Override
    public StudentPerformanceDTO getStudentPerformance(Long studentId, Long courseId) {
        StudentPerformance sp = studentPerformanceRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Student performance not found for studentId: " + studentId + ", courseId: " + courseId));
        return studentPerformanceMapper.toDto(sp);
    }

    @Override
    public List<StudentPerformanceDTO> getStudentPerformanceHistory(Long studentId) {
        return studentPerformanceRepository.findByStudentId(studentId).stream()
                .map(studentPerformanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentPerformanceDTO> getCoursePerformance(Long courseId) {
        return studentPerformanceRepository.findByCourseId(courseId).stream()
                .map(studentPerformanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentPerformanceDTO> getPerformanceByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return studentPerformanceRepository.findByDateRange(startDate, endDate).stream()
                .map(studentPerformanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateStudentPerformance(Long studentId, Long courseId) {
        // Implement update logic as needed, for now just a stub
    }

    @Override
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void updateAllStudentPerformance() {
        // Implement update logic as needed, for now just a stub
    }
} 