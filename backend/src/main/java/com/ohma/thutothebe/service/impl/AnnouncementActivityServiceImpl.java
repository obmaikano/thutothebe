package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementActivityDto;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementActivityMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.AnnouncementActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class AnnouncementActivityServiceImpl extends BaseServiceImpl<AnnouncementActivity, AnnouncementActivityDto, Long> 
        implements AnnouncementActivityService {

    private final AnnouncementActivityRepository activityRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final AnnouncementActivityMapper mapper;

    public AnnouncementActivityServiceImpl(
            AnnouncementActivityRepository activityRepository,
            AnnouncementRepository announcementRepository,
            UserRepository userRepository,
            AnnouncementActivityMapper mapper) {
        super(activityRepository);
        this.activityRepository = activityRepository;
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    protected AnnouncementActivity mapToEntity(AnnouncementActivityDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected AnnouncementActivityDto mapToDto(AnnouncementActivity entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected void updateEntity(AnnouncementActivity entity, AnnouncementActivityDto dto) {
        entity.setType(dto.getType());
        entity.setDetails(dto.getDetails());
        entity.setActive(dto.isActive());
    }

    @Override
    public List<AnnouncementActivityDto> getActivitiesByAnnouncementId(Long announcementId) {
        log.info("Getting activities for announcement ID: {}", announcementId);
        List<AnnouncementActivity> activities = activityRepository.findByAnnouncementIdAndActiveTrue(announcementId);
        return activities.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementActivityDto> getActivitiesByAnnouncementIdAndType(Long announcementId, AnnouncementActivityType type) {
        log.info("Getting activities for announcement ID: {} and type: {}", announcementId, type);
        List<AnnouncementActivity> activities = activityRepository.findByAnnouncementIdAndTypeAndActiveTrue(announcementId, type);
        return activities.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementActivityDto> getActivitiesByUserId(Long userId) {
        log.info("Getting activities for user ID: {}", userId);
        List<AnnouncementActivity> activities = activityRepository.findByUserIdAndActiveTrue(userId);
        return activities.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementActivityDto createActivity(Long announcementId, Long userId, AnnouncementActivityType type, String details) {
        log.info("Creating activity for announcement ID: {} by user ID: {} with type: {}", announcementId, userId, type);
        
        // Validate announcement exists
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        AnnouncementActivity activity = new AnnouncementActivity();
        activity.setAnnouncement(announcement);
        activity.setUser(user);
        activity.setType(type);
        activity.setDetails(details);
        activity.setActive(true);
        
        AnnouncementActivity savedActivity = activityRepository.save(activity);
        return mapper.toDto(savedActivity);
    }

    @Override
    public long getActivityCount(Long announcementId, AnnouncementActivityType type) {
        return activityRepository.countByAnnouncementIdAndTypeAndActiveTrue(announcementId, type);
    }

    @Override
    public boolean hasUserPerformedActivity(Long announcementId, Long userId, AnnouncementActivityType type) {
        return activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(announcementId, userId, type);
    }

    @Override
    public void recordReadActivity(Long announcementId, Long userId) {
        if (!hasUserPerformedActivity(announcementId, userId, AnnouncementActivityType.READ)) {
            createActivity(announcementId, userId, AnnouncementActivityType.READ, "User read the announcement");
        }
    }

    @Override
    public void recordAcknowledgeActivity(Long announcementId, Long userId) {
        if (!hasUserPerformedActivity(announcementId, userId, AnnouncementActivityType.ACKNOWLEDGED)) {
            createActivity(announcementId, userId, AnnouncementActivityType.ACKNOWLEDGED, "User acknowledged the announcement");
        }
    }

    @Override
    public void recordCommentActivity(Long announcementId, Long userId, String commentContent) {
        String details = "User commented: " + (commentContent.length() > 50 ? 
                commentContent.substring(0, 50) + "..." : commentContent);
        createActivity(announcementId, userId, AnnouncementActivityType.COMMENTED, details);
    }

    @Override
    public void recordLikeActivity(Long announcementId, Long userId, String details) {
        createActivity(announcementId, userId, AnnouncementActivityType.LIKED, details);
    }
} 