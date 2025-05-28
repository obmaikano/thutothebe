package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.UserActivityLogDTO;
import com.ohma.thutothebe.entity.UserActivityLog;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserActivityLogMapper implements BaseDtoMapper<UserActivityLog, UserActivityLogDTO> {

    private final UserRepository userRepository;

    @Override
    public UserActivityLogDTO toDto(UserActivityLog entity) {
        if (entity == null) return null;

        User user = entity.getUser();
        return new UserActivityLogDTO(
            entity.getId(),
            user != null ? user.getId() : null,
            user != null ? user.getUsername() : null,
            user != null ? user.getRole().name() : null,
            user != null && user.getSchool() != null ? user.getSchool().getId() : null,
            user != null && user.getSchool() != null ? user.getSchool().getName() : null,
            user != null && user.getRegion() != null ? user.getRegion().getId() : null,
            user != null && user.getRegion() != null ? user.getRegion().getName() : null,
            entity.getActivityTimestamp(),
            entity.getActivityType(),
            entity.getModuleName(),
            entity.getFeatureName(),
            entity.getActionPerformed(),
            entity.getSessionId(),
            entity.getIpAddress(),
            entity.getUserAgent(),
            entity.getDurationMinutes(),
            entity.isSuccess(),
            entity.getErrorMessage(),
            entity.getAdditionalData()
        );
    }

    @Override
    public UserActivityLog toEntity(UserActivityLogDTO dto) {
        if (dto == null) return null;

        UserActivityLog entity = new UserActivityLog();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(UserActivityLog entity, UserActivityLogDTO dto) {
        if (dto.userId() != null) {
            User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + dto.userId()));
            entity.setUser(user);
        }
        
        entity.setActivityTimestamp(dto.activityTimestamp());
        entity.setActivityType(dto.activityType());
        entity.setModuleName(dto.moduleName());
        entity.setFeatureName(dto.featureName());
        entity.setActionPerformed(dto.actionPerformed());
        entity.setSessionId(dto.sessionId());
        entity.setIpAddress(dto.ipAddress());
        entity.setUserAgent(dto.userAgent());
        entity.setDurationMinutes(dto.durationMinutes());
        entity.setSuccess(dto.success());
        entity.setErrorMessage(dto.errorMessage());
        entity.setAdditionalData(dto.additionalData());
    }
} 