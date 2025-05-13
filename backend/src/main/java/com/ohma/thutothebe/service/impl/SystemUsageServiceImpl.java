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
    public SystemUsageDTO getCurrentUsage() {
        SystemUsage usage = systemUsageRepository.findFirstByOrderByTimestampDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No system usage data found"));
        return systemUsageMapper.toDto(usage);
    }

    @Override
    public List<SystemUsageDTO> getUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<SystemUsage> usage = systemUsageRepository.findByDateRange(startDate, endDate);
        return usage.stream()
                .map(systemUsageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SystemUsageDTO> getPeakUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<SystemUsage> usage = systemUsageRepository.findPeakUsageByDateRange(startDate, endDate);
        return usage.stream()
                .map(systemUsageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SystemUsageDTO> getLoginTrendsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<SystemUsage> trends = systemUsageRepository.findLoginTrendsByDateRange(startDate, endDate);
        return trends.stream()
                .map(systemUsageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateSystemUsage() {
        SystemUsage usage = new SystemUsage();
        usage.setTimestamp(LocalDateTime.now());
        
        // Calculate current statistics
        usage.setActiveUsers(calculateActiveUsers());
        usage.setTotalLogins(calculateTotalLogins());
        usage.setInstructorCount(calculateInstructorCount());
        usage.setStudentCount(calculateStudentCount());
        usage.setAdminCount(calculateAdminCount());
        usage.setPeakModule(calculatePeakModule());
        usage.setPeakCourse(calculatePeakCourse());

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

    protected Integer calculateActiveUsers() {
        LocalDateTime fifteenMinutesAgo = LocalDateTime.now().minusMinutes(15);
        return userRepository.countByLastLoginTimeAfter(fifteenMinutesAgo);
    }

    protected Integer calculateTotalLogins() {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return userRepository.countByLastLoginTimeAfter(today);
    }

    protected Integer calculateInstructorCount() {
        return userRepository.countByRole(UserRole.TEACHER);
    }

    protected Integer calculateStudentCount() {
        return userRepository.countByRole(UserRole.STUDENT);
    }

    protected Integer calculateAdminCount() {
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