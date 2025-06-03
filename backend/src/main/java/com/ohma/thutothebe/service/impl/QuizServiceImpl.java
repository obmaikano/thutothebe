package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.QuizMapper;
import com.ohma.thutothebe.repository.QuizRepository;
import com.ohma.thutothebe.service.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuizServiceImpl extends BaseServiceImpl<Quiz, QuizDTO, Long> implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public QuizServiceImpl(QuizRepository quizRepository, QuizMapper quizMapper,
                          RuleBasedAccessControlServiceImpl accessControlService) {
        super(quizRepository);
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
        this.accessControlService = accessControlService;
    }

    @Override
    protected Quiz mapToEntity(QuizDTO dto) {
        return quizMapper.toEntity(dto);
    }

    @Override
    protected QuizDTO mapToDto(Quiz entity) {
        return quizMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Quiz entity, QuizDTO dto) {
        quizMapper.updateEntity(entity, dto);
    }

    @Override
    public QuizDTO getByCode(String code) {
        Quiz quiz = quizRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with code: " + code));
        return mapToDto(quiz);
    }

    @Override
    public List<QuizDTO> getByCourseId(Long courseId) {
        return quizRepository.findByCourseId(courseId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByInstructorId(Long instructorId) {
        return quizRepository.findByInstructorId(instructorId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByStatus(QuizStatus status) {
        return quizRepository.findByStatus(status).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByCourseIdAndStatus(Long courseId, QuizStatus status) {
        return quizRepository.findByCourseIdAndStatus(courseId, status).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getActiveByCourseId(Long courseId) {
        return quizRepository.findActiveByCourseId(courseId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByCode(String code) {
        return quizRepository.existsByCode(code);
    }

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByAccessibleScopes(Long currentUserId) {
        try {
            // Get accessible scope IDs from access control service
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            // Check if user has global access
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // Global access - return all active quizzes
                return quizRepository.findBySchoolIdInAndActive(List.of(), true).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            // Use multi-scope access query for database-level filtering
            return quizRepository.findByMultiScopeAccess(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds
            ).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of(); // Return empty list on error for security
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByAccessibleScopes(Long currentUserId) {
        try {
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return quizRepository.findBySchoolIdInAndActive(List.of(), true).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            return quizRepository.findByMultiScopeAccessAndActive(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds,
                    true
            ).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting active quizzes by accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesBySchoolId(Long schoolId) {
        return quizRepository.findBySchoolIdAndActive(schoolId, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByRegionId(Long regionId) {
        return quizRepository.findByRegionIdAndActive(regionId, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesBySchoolId(Long schoolId) {
        return quizRepository.findActiveQuizzesBySchoolId(schoolId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByRegionId(Long regionId) {
        return quizRepository.findActiveQuizzesByRegionId(regionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByQuizIds(List<Long> quizIds) {
        if (quizIds == null || quizIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByIdInAndActive(quizIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByInstructorIds(List<Long> instructorIds) {
        if (instructorIds == null || instructorIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByInstructorIdInAndActive(instructorIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesBySchoolIds(List<Long> schoolIds) {
        if (schoolIds == null || schoolIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findBySchoolIdInAndActive(schoolIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByRegionIds(List<Long> regionIds) {
        if (regionIds == null || regionIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByRegionIdInAndActive(regionIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByQuizIds(List<Long> quizIds) {
        if (quizIds == null || quizIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByIdInAndActive(quizIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByInstructorIds(List<Long> instructorIds) {
        if (instructorIds == null || instructorIds.isEmpty()) {
            return List.of();
        }
        return quizRepository.findByInstructorIdInAndActive(instructorIds, true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds) {
        return quizRepository.findByMultiScopeAccess(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                instructorIds == null || instructorIds.isEmpty() ? List.of(-1L) : instructorIds
        ).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getActiveQuizzesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds) {
        return quizRepository.findByMultiScopeAccessAndActive(
                schoolIds == null || schoolIds.isEmpty() ? List.of(-1L) : schoolIds,
                regionIds == null || regionIds.isEmpty() ? List.of(-1L) : regionIds,
                instructorIds == null || instructorIds.isEmpty() ? List.of(-1L) : instructorIds,
                true
        ).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return quizRepository.findByCourseIdAndSchoolIdInAndActive(courseId, accessibleSchoolIds, true).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by course and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByClassIdAndAccessibleScopes(Long classId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return List.of();
            }
            
            return quizRepository.findByClassIdAndSchoolIdInAndActive(classId, accessibleSchoolIds).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by class and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                // For global access, get all quizzes for the subject (would need a repository method)
                return quizRepository.findAll().stream() // This is a placeholder - would need proper subject filtering
                        .filter(Quiz::isActive)
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return quizRepository.findBySubjectIdAndSchoolIdInAndActive(subjectId, accessibleSchoolIds).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return quizRepository.findBySubjectIdAndRegionIdInAndActive(subjectId, accessibleRegionIds).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by subject and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId) {
        try {
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return quizRepository.findByInstructorIdAndActive(teacherId, true).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleSchoolIds.isEmpty()) {
                return quizRepository.findByTeacherIdAndSchoolIdInAndActive(teacherId, accessibleSchoolIds).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            if (!accessibleRegionIds.isEmpty()) {
                return quizRepository.findByTeacherIdAndRegionIdInAndActive(teacherId, accessibleRegionIds).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            return List.of();
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by teacher and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByStatusAndAccessibleScopes(QuizStatus status, Long currentUserId) {
        try {
            List<Long> accessibleInstructorIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            boolean hasGlobalAccess = accessControlService.hasAccess(currentUserId, AccessScope.GLOBAL, null);
            
            if (hasGlobalAccess) {
                return quizRepository.findByStatus(status).stream()
                        .map(this::mapToDto)
                        .collect(Collectors.toList());
            }
            
            return quizRepository.findByMultiScopeAccessAndStatus(
                    accessibleSchoolIds.isEmpty() ? List.of(-1L) : accessibleSchoolIds,
                    accessibleRegionIds.isEmpty() ? List.of(-1L) : accessibleRegionIds,
                    accessibleInstructorIds.isEmpty() ? List.of(-1L) : accessibleInstructorIds,
                    status
            ).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error getting quizzes by status and accessible scopes for user {}: {}", currentUserId, e.getMessage(), e);
            return List.of();
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizDTO> getQuizzesByStatusAndAccessibleScopes(String status, Long currentUserId) {
        try {
            QuizStatus quizStatus = QuizStatus.valueOf(status.toUpperCase());
            return getQuizzesByStatusAndAccessibleScopes(quizStatus, currentUserId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid quiz status: {}", status);
            return List.of();
        }
    }
} 