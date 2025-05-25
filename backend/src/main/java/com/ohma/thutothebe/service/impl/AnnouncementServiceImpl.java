package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.AnnouncementReadReceiptDTO;
import com.ohma.thutothebe.dto.AnnouncementAcknowledgmentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.AnnouncementService;
import com.ohma.thutothebe.service.RealTimeAnnouncementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class AnnouncementServiceImpl extends BaseServiceImpl<Announcement, AnnouncementDTO, Long> implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementReadReceiptRepository readReceiptRepository;
    private final AnnouncementAcknowledgmentRepository acknowledgmentRepository;
    private final UserRepository userRepository;
    private final AnnouncementMapper announcementMapper;
    private final RealTimeAnnouncementService realTimeAnnouncementService;

    @Autowired
    public AnnouncementServiceImpl(
            AnnouncementRepository announcementRepository,
            AnnouncementReadReceiptRepository readReceiptRepository,
            AnnouncementAcknowledgmentRepository acknowledgmentRepository,
            UserRepository userRepository,
            AnnouncementMapper announcementMapper,
            RealTimeAnnouncementService realTimeAnnouncementService) {
        super(announcementRepository);
        this.announcementRepository = announcementRepository;
        this.readReceiptRepository = readReceiptRepository;
        this.acknowledgmentRepository = acknowledgmentRepository;
        this.userRepository = userRepository;
        this.announcementMapper = announcementMapper;
        this.realTimeAnnouncementService = realTimeAnnouncementService;
    }

    @Override
    protected Announcement mapToEntity(AnnouncementDTO dto) {
        return announcementMapper.toEntity(dto);
    }

    @Override
    protected AnnouncementDTO mapToDto(Announcement entity) {
        return announcementMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Announcement entity, AnnouncementDTO dto) {
        announcementMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getAnnouncementsForUser(Long userId, Pageable pageable) {
        User user = getUserById(userId);
        LocalDateTime now = LocalDateTime.now();
        
        Page<Announcement> announcements = announcementRepository.findAnnouncementsForUserRole(
            user.getRole(),
            user.getSchool() != null ? user.getSchool().getId() : null,
            user.getRegion() != null ? user.getRegion().getId() : null,
            now,
            pageable
        );
        
        return announcements.map(announcement -> announcementMapper.toDtoWithUserStatus(announcement, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getAnnouncementsByTypeForUser(Long userId, AnnouncementType type, Pageable pageable) {
        getUserById(userId); // Validate user exists
        LocalDateTime now = LocalDateTime.now();
        
        Page<Announcement> announcements = announcementRepository.findActiveAnnouncementsByType(now, type, pageable);
        return announcements.map(announcement -> announcementMapper.toDtoWithUserStatus(announcement, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getAnnouncementsByCreator(Long creatorId, Pageable pageable) {
        getUserById(creatorId); // Validate user exists
        
        Page<Announcement> announcements = announcementRepository.findByCreatorId(creatorId, pageable);
        return announcements.map(announcementMapper::toDto);
    }

    @Override
    @Transactional
    public AnnouncementDTO createAnnouncement(AnnouncementDTO dto, Long creatorId) {
        User creator = getUserById(creatorId);
        
        // Validate creator can create announcement for the specified target
        if (!canUserCreateAnnouncementForTarget(
                creator.getRole(),
                creator.getRegion() != null ? creator.getRegion().getId() : null,
                creator.getSchool() != null ? creator.getSchool().getId() : null,
                dto.targetRegionId(),
                dto.targetSchoolId(),
                dto.targetRole())) {
            throw new IllegalArgumentException("User does not have permission to create announcement for the specified target");
        }

        // Create new DTO with creator information
        AnnouncementDTO createDto = new AnnouncementDTO(
            null, // id will be generated
            dto.title(),
            dto.content(),
            dto.type(),
            dto.priority(),
            creatorId,
            null, // creatorName will be set by mapper
            creator.getRole(),
            dto.targetRegionId(),
            null, // targetRegionName will be set by mapper
            dto.targetSchoolId(),
            null, // targetSchoolName will be set by mapper
            dto.targetRole(),
            dto.targetDepartment(),
            dto.targetClass(),
            dto.startDate(),
            dto.endDate(),
            dto.commentsEnabled(),
            dto.acknowledgmentRequired(),
            dto.attachmentUrls(),
            dto.tags(),
            true, // active by default
            null, // createdAt will be set automatically
            null, // modifiedAt will be set automatically
            null, null, null, null, null // counts and flags will be calculated
        );

        AnnouncementDTO createdDto = create(createDto);
        realTimeAnnouncementService.broadcastAnnouncementCreated(createdDto);
        return createdDto;
    }

    @Override
    @Transactional
    public AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO dto, Long userId) {
        if (!canUserModifyAnnouncement(userId, id)) {
            throw new IllegalArgumentException("User does not have permission to modify this announcement");
        }

        AnnouncementDTO updatedDto = update(id, dto);
        realTimeAnnouncementService.broadcastAnnouncementUpdated(updatedDto);
        return updatedDto;
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id, Long userId) {
        if (!canUserModifyAnnouncement(userId, id)) {
            throw new IllegalArgumentException("User does not have permission to delete this announcement");
        }

        // Get the announcement before deletion for broadcasting
        AnnouncementDTO announcementToDelete = findById(id);
        delete(id);
        realTimeAnnouncementService.broadcastAnnouncementDeleted(announcementToDelete);
    }

    @Override
    @Transactional
    public AnnouncementReadReceiptDTO markAsRead(Long announcementId, Long userId) {
        Announcement announcement = getAnnouncementById(announcementId);
        User user = getUserById(userId);

        // Check if already read
        if (readReceiptRepository.existsByAnnouncementIdAndUserId(announcementId, userId)) {
            throw new IllegalArgumentException("Announcement already marked as read by this user");
        }

        AnnouncementReadReceipt receipt = new AnnouncementReadReceipt();
        receipt.setAnnouncement(announcement);
        receipt.setUser(user);
        receipt.setReadAt(LocalDateTime.now());

        AnnouncementReadReceipt savedReceipt = readReceiptRepository.save(receipt);

        return new AnnouncementReadReceiptDTO(
            savedReceipt.getId(),
            announcementId,
            announcement.getTitle(),
            userId,
            user.getFirstName() + " " + user.getLastName(),
            savedReceipt.getReadAt(),
            savedReceipt.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public AnnouncementAcknowledgmentDTO acknowledgeAnnouncement(Long announcementId, Long userId, String note) {
        Announcement announcement = getAnnouncementById(announcementId);
        User user = getUserById(userId);

        if (!announcement.isAcknowledgmentRequired()) {
            throw new IllegalArgumentException("This announcement does not require acknowledgment");
        }

        // Check if already acknowledged
        if (acknowledgmentRepository.existsByAnnouncementIdAndUserId(announcementId, userId)) {
            throw new IllegalArgumentException("Announcement already acknowledged by this user");
        }

        AnnouncementAcknowledgment acknowledgment = new AnnouncementAcknowledgment();
        acknowledgment.setAnnouncement(announcement);
        acknowledgment.setUser(user);
        acknowledgment.setAcknowledgedAt(LocalDateTime.now());
        acknowledgment.setAcknowledgmentNote(note);

        AnnouncementAcknowledgment savedAcknowledgment = acknowledgmentRepository.save(acknowledgment);

        return new AnnouncementAcknowledgmentDTO(
            savedAcknowledgment.getId(),
            announcementId,
            announcement.getTitle(),
            userId,
            user.getFirstName() + " " + user.getLastName(),
            savedAcknowledgment.getAcknowledgedAt(),
            savedAcknowledgment.getAcknowledgmentNote(),
            savedAcknowledgment.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Long getPendingAcknowledgmentsCount(Long userId) {
        User user = getUserById(userId);
        LocalDateTime now = LocalDateTime.now();
        
        return announcementRepository.countPendingAcknowledgments(
            userId,
            user.getRole(),
            user.getSchool() != null ? user.getSchool().getId() : null,
            user.getRegion() != null ? user.getRegion().getId() : null,
            now
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> searchAnnouncementsForUser(Long userId, String searchTerm, Pageable pageable) {
        getUserById(userId); // Validate user exists
        LocalDateTime now = LocalDateTime.now();
        
        Page<Announcement> announcements = announcementRepository.searchAnnouncements(searchTerm, now, pageable);
        return announcements.map(announcement -> announcementMapper.toDtoWithUserStatus(announcement, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getAnnouncementsByTagForUser(Long userId, String tag, Pageable pageable) {
        getUserById(userId); // Validate user exists
        LocalDateTime now = LocalDateTime.now();
        
        Page<Announcement> announcements = announcementRepository.findByTag(tag, now, pageable);
        return announcements.map(announcement -> announcementMapper.toDtoWithUserStatus(announcement, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementReadReceiptDTO> getReadReceipts(Long announcementId, Long requesterId) {
        Announcement announcement = getAnnouncementById(announcementId);
        User requester = getUserById(requesterId);

        // Only creators and admins can view read receipts
        if (!canUserModifyAnnouncement(requesterId, announcementId) && !isAdminRole(requester.getRole())) {
            throw new IllegalArgumentException("User does not have permission to view read receipts");
        }

        List<AnnouncementReadReceipt> receipts = readReceiptRepository.findByAnnouncementId(announcementId);
        return receipts.stream()
            .map(receipt -> new AnnouncementReadReceiptDTO(
                receipt.getId(),
                announcementId,
                announcement.getTitle(),
                receipt.getUser().getId(),
                receipt.getUser().getFirstName() + " " + receipt.getUser().getLastName(),
                receipt.getReadAt(),
                receipt.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementAcknowledgmentDTO> getAcknowledgments(Long announcementId, Long requesterId) {
        Announcement announcement = getAnnouncementById(announcementId);
        User requester = getUserById(requesterId);

        // Only creators and admins can view acknowledgments
        if (!canUserModifyAnnouncement(requesterId, announcementId) && !isAdminRole(requester.getRole())) {
            throw new IllegalArgumentException("User does not have permission to view acknowledgments");
        }

        List<AnnouncementAcknowledgment> acknowledgments = acknowledgmentRepository.findByAnnouncementId(announcementId);
        return acknowledgments.stream()
            .map(ack -> new AnnouncementAcknowledgmentDTO(
                ack.getId(),
                announcementId,
                announcement.getTitle(),
                ack.getUser().getId(),
                ack.getUser().getFirstName() + " " + ack.getUser().getLastName(),
                ack.getAcknowledgedAt(),
                ack.getAcknowledgmentNote(),
                ack.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserCreateAnnouncementForTarget(UserRole userRole, Long userRegionId, Long userSchoolId,
                                                    Long targetRegionId, Long targetSchoolId, UserRole targetRole) {
        switch (userRole) {
            case SUPER_ADMIN:
                return true; // Can target anyone
                
            case MINISTRY_EXECUTIVE:
                return true; // Can target any region, school, or role
                
            case MINISTRY_STAFF:
                // Can target assigned departments/schools (simplified: any school/region)
                return true;
                
            case DIRECTOR:
                // Can target assigned regional/school users
                return targetRegionId == null || targetRegionId.equals(userRegionId);
                
            case REGIONAL_ADMIN:
                // Can target schools and users within their region
                if (targetRegionId != null && !targetRegionId.equals(userRegionId)) {
                    return false;
                }
                return targetSchoolId == null || isSchoolInRegion(targetSchoolId, userRegionId);
                
            case REGIONAL_OFFICER:
                // Can target schools/users in their assignment (simplified: same region)
                return (targetRegionId == null || targetRegionId.equals(userRegionId)) &&
                       (targetSchoolId == null || isSchoolInRegion(targetSchoolId, userRegionId));
                
            case SCHOOL_ADMIN:
                // Can target full school scope
                return targetSchoolId == null || targetSchoolId.equals(userSchoolId);
                
            case SCHOOL_HEAD:
                // Can target teachers and departments in their school
                return (targetSchoolId == null || targetSchoolId.equals(userSchoolId)) &&
                       (targetRole == null || isSchoolStaffRole(targetRole));
                
            case DEPARTMENT_HEAD:
                // Can target teachers/students within the department (simplified: same school)
                return (targetSchoolId == null || targetSchoolId.equals(userSchoolId)) &&
                       (targetRole == null || targetRole == UserRole.TEACHER || targetRole == UserRole.STUDENT);
                
            case SENIOR_TEACHER:
                // Can target class-level or department-level
                return (targetSchoolId == null || targetSchoolId.equals(userSchoolId)) &&
                       (targetRole == null || targetRole == UserRole.STUDENT);
                
            case TEACHER:
                // Can target students in their own courses
                return (targetSchoolId == null || targetSchoolId.equals(userSchoolId)) &&
                       (targetRole == null || targetRole == UserRole.STUDENT);
                
            default:
                return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserModifyAnnouncement(Long userId, Long announcementId) {
        User user = getUserById(userId);
        Announcement announcement = getAnnouncementById(announcementId);

        // Creators can modify their own announcements
        if (announcement.getCreator().getId().equals(userId)) {
            return true;
        }

        // Admins can modify any announcement
        return isAdminRole(user.getRole());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getGlobalAnnouncements(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        Page<Announcement> announcements = announcementRepository.findGlobalAnnouncements(now, pageable);
        return announcements.map(announcementMapper::toDto);
    }

    @Override
    @Transactional
    public AnnouncementDTO toggleAnnouncementStatus(Long id, Long userId) {
        if (!canUserModifyAnnouncement(userId, id)) {
            throw new IllegalArgumentException("User does not have permission to modify this announcement");
        }

        Announcement announcement = getAnnouncementById(id);
        boolean wasActive = announcement.isActive();
        announcement.setActive(!announcement.isActive());
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        
        AnnouncementDTO updatedDto = announcementMapper.toDto(savedAnnouncement);
        realTimeAnnouncementService.broadcastAnnouncementStatusChanged(updatedDto, !wasActive);
        return updatedDto;
    }

    // Helper methods
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Announcement getAnnouncementById(Long announcementId) {
        return announcementRepository.findById(announcementId)
            .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
    }

    private boolean isAdminRole(UserRole role) {
        return role == UserRole.SUPER_ADMIN || 
               role == UserRole.MINISTRY_EXECUTIVE || 
               role == UserRole.MINISTRY_STAFF ||
               role == UserRole.DIRECTOR ||
               role == UserRole.REGIONAL_ADMIN;
    }

    private boolean isSchoolStaffRole(UserRole role) {
        return role == UserRole.TEACHER || 
               role == UserRole.SENIOR_TEACHER || 
               role == UserRole.DEPARTMENT_HEAD ||
               role == UserRole.STUDENT ||
               role == UserRole.PARENT;
    }

    private boolean isSchoolInRegion(Long schoolId, Long regionId) {
        // This would typically query the school repository to check if school belongs to region
        // For now, returning true as a simplified implementation
        return true;
    }
} 