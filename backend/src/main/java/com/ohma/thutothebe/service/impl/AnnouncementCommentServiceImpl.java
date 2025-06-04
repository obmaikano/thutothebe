package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementCommentDto;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementCommentMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.AnnouncementCommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class AnnouncementCommentServiceImpl extends BaseServiceImpl<AnnouncementComment, AnnouncementCommentDto, Long> 
        implements AnnouncementCommentService {

    private final AnnouncementCommentRepository commentRepository;
    private final AnnouncementCommentLikeRepository likeRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final AnnouncementCommentMapper mapper;

    public AnnouncementCommentServiceImpl(
            AnnouncementCommentRepository commentRepository,
            AnnouncementCommentLikeRepository likeRepository,
            AnnouncementRepository announcementRepository,
            UserRepository userRepository,
            AnnouncementCommentMapper mapper) {
        super(commentRepository);
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    protected AnnouncementComment mapToEntity(AnnouncementCommentDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected AnnouncementCommentDto mapToDto(AnnouncementComment entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected void updateEntity(AnnouncementComment entity, AnnouncementCommentDto dto) {
        entity.setContent(dto.getContent());
        entity.setActive(dto.isActive());
    }

    @Override
    public List<AnnouncementCommentDto> getCommentsByAnnouncementId(Long announcementId) {
        log.info("Getting comments for announcement ID: {}", announcementId);
        List<AnnouncementComment> comments = commentRepository.findByAnnouncementIdAndParentCommentIsNull(announcementId);
        return comments.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementCommentDto> getRepliesByParentCommentId(Long parentCommentId) {
        log.info("Getting replies for parent comment ID: {}", parentCommentId);
        List<AnnouncementComment> replies = commentRepository.findByParentCommentIdAndActiveTrue(parentCommentId);
        return replies.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementCommentDto createComment(Long announcementId, Long authorId, String content, Long parentCommentId) {
        log.info("Creating comment for announcement ID: {} by user ID: {}", announcementId, authorId);
        
        // Validate announcement exists
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
        
        // Validate user exists
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
        
        // Validate parent comment if provided
        AnnouncementComment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found with id: " + parentCommentId));
        }
        
        AnnouncementComment comment = new AnnouncementComment();
        comment.setContent(content);
        comment.setAnnouncement(announcement);
        comment.setAuthor(author);
        comment.setParentComment(parentComment);
        comment.setActive(true);
        
        AnnouncementComment savedComment = commentRepository.save(comment);
        return mapper.toDto(savedComment);
    }

    @Override
    public AnnouncementCommentDto updateComment(Long commentId, String content, Long userId) {
        log.info("Updating comment ID: {} by user ID: {}", commentId, userId);
        
        AnnouncementComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Verify user is the author
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("User can only update their own comments");
        }
        
        comment.setContent(content);
        AnnouncementComment updatedComment = commentRepository.save(comment);
        return mapper.toDto(updatedComment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {
        log.info("Deleting comment ID: {} by user ID: {}", commentId, userId);
        
        AnnouncementComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Verify user is the author
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("User can only delete their own comments");
        }
        
        comment.setActive(false);
        commentRepository.save(comment);
    }

    @Override
    public void toggleLike(Long commentId, Long userId) {
        log.info("Toggling like for comment ID: {} by user ID: {}", commentId, userId);
        
        AnnouncementComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Check if like already exists
        var existingLike = likeRepository.findByCommentIdAndUserId(commentId, userId);
        
        if (existingLike.isPresent()) {
            AnnouncementCommentLike like = existingLike.get();
            like.setActive(!like.isActive());
            likeRepository.save(like);
        } else {
            AnnouncementCommentLike like = new AnnouncementCommentLike();
            like.setComment(comment);
            like.setUser(user);
            like.setActive(true);
            likeRepository.save(like);
        }
    }

    @Override
    public boolean isCommentLikedByUser(Long commentId, Long userId) {
        return likeRepository.existsByCommentIdAndUserIdAndActiveTrue(commentId, userId);
    }

    @Override
    public long getCommentCount(Long announcementId) {
        return commentRepository.countByAnnouncementIdAndActiveTrue(announcementId);
    }

    @Override
    public List<AnnouncementCommentDto> getCommentsByAuthor(Long authorId) {
        log.info("Getting comments by author ID: {}", authorId);
        List<AnnouncementComment> comments = commentRepository.findByAuthorIdAndActiveTrue(authorId);
        return comments.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    protected Long extractSchoolId(AnnouncementComment entity) {
        // Extract school from announcement's target school or author's school
        if (entity.getAnnouncement() != null && entity.getAnnouncement().getTargetSchool() != null) {
            return entity.getAnnouncement().getTargetSchool().getId();
        }
        if (entity.getAuthor() != null && entity.getAuthor().getSchool() != null) {
            return entity.getAuthor().getSchool().getId();
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(AnnouncementComment entity) {
        // Extract region from announcement's target region or author's school region
        if (entity.getAnnouncement() != null && entity.getAnnouncement().getTargetRegion() != null) {
            return entity.getAnnouncement().getTargetRegion().getId();
        }
        if (entity.getAnnouncement() != null && entity.getAnnouncement().getTargetSchool() != null && entity.getAnnouncement().getTargetSchool().getRegion() != null) {
            return entity.getAnnouncement().getTargetSchool().getRegion().getId();
        }
        if (entity.getAuthor() != null && entity.getAuthor().getSchool() != null && entity.getAuthor().getSchool().getRegion() != null) {
            return entity.getAuthor().getSchool().getRegion().getId();
        }
        return null;
    }
} 