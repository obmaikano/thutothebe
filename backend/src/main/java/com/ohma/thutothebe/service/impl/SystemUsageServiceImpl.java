package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SystemUsageDTO;
import com.ohma.thutothebe.entity.SystemUsage;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SystemUsageMapper;
import com.ohma.thutothebe.repository.SystemUsageRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.ModuleRepository;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.SystemUsageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SystemUsageServiceImpl extends BaseServiceImpl<SystemUsage, SystemUsageDTO, Long> implements SystemUsageService {

    private final SystemUsageRepository systemUsageRepository;
    private final SystemUsageMapper systemUsageMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;

    @Autowired
    public SystemUsageServiceImpl(
            SystemUsageRepository systemUsageRepository,
            SystemUsageMapper systemUsageMapper,
            UserRepository userRepository,
            CourseRepository courseRepository,
            ModuleRepository moduleRepository) {
        super(systemUsageRepository);
        this.systemUsageRepository = systemUsageRepository;
        this.systemUsageMapper = systemUsageMapper;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
    }

    @Override
    protected SystemUsageDTO mapToDto(SystemUsage entity) {
        return systemUsageMapper.toDto(entity);
    }

    @Override
    protected SystemUsage mapToEntity(SystemUsageDTO dto) {
        return systemUsageMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(SystemUsage entity, SystemUsageDTO dto) {
        entity.setTimestamp(dto.timestamp());
        entity.setActiveUsers(dto.activeUsers());
        entity.setTotalLogins(dto.totalLogins());
        entity.setInstructorCount(dto.instructorCount());
        entity.setStudentCount(dto.studentCount());
        entity.setAdminCount(dto.adminCount());
        entity.setPeakModule(dto.peakModule());
        entity.setPeakCourse(dto.peakCourse());
    }

    @Override
    @Transactional(readOnly = true)
    public SystemUsageDTO getCurrentUsage() {
        return systemUsageRepository.findFirstByOrderByTimestampDesc()
            .map(systemUsageMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("No system usage data available"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemUsageDTO> getUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return systemUsageRepository.findByDateRange(startDate, endDate).stream()
            .map(systemUsageMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemUsageDTO> getPeakUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return systemUsageRepository.findPeakUsageByDateRange(startDate, endDate).stream()
            .map(systemUsageMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemUsageDTO> getLoginTrendsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return systemUsageRepository.findLoginTrendsByDateRange(startDate, endDate).stream()
            .map(systemUsageMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateSystemUsage() {
        SystemUsage usage = new SystemUsage();
        usage.setActiveUsers(calculateActiveUsers());
        usage.setTotalLogins(calculateTotalLogins());
        usage.setInstructorCount(calculateInstructorCount());
        usage.setStudentCount(calculateStudentCount());
        usage.setAdminCount(calculateAdminCount());
        usage.setPeakModule(calculatePeakModule());
        usage.setPeakCourse(calculatePeakCourse());
        usage.setTimestamp(LocalDateTime.now());
        
        systemUsageRepository.save(usage);
        log.info("Updated system usage statistics");
    }

    @Override
    @Transactional
    public void updateSystemUsageScheduled() {
        try {
            updateSystemUsage();
        } catch (Exception e) {
            log.error("Error updating system usage statistics: {}", e.getMessage(), e);
        }
    }

    protected int calculateActiveUsers() {
        return userRepository.countByLastLoginTimeAfter(LocalDateTime.now().minusHours(24));
    }

    protected int calculateTotalLogins() {
        return userRepository.countByLastLoginTimeAfter(LocalDateTime.now().withHour(0).withMinute(0).withSecond(0));
    }

    protected int calculateInstructorCount() {
        return userRepository.countByRole(UserRole.TEACHER);
    }

    protected int calculateStudentCount() {
        return userRepository.countByRole(UserRole.STUDENT);
    }

    protected int calculateAdminCount() {
        return userRepository.countByRole(UserRole.ADMIN);
    }

    protected String calculatePeakModule() {
        return moduleRepository.findMostAccessed().stream()
            .findFirst()
            .map(module -> module.getTitle())
            .orElse("N/A");
    }

    protected String calculatePeakCourse() {
        return courseRepository.findByActiveTrue().stream()
            .max((c1, c2) -> Long.compare(
                c1.getStudents().size(),
                c2.getStudents().size()
            ))
            .map(course -> course.getName())
            .orElse("N/A");
    }
} 