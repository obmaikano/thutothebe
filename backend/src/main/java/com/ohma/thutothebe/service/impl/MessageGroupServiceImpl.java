package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import com.ohma.thutothebe.entity.MessageGroup;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.MessageGroupMapper;
import com.ohma.thutothebe.repository.MessageGroupRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.MessageGroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MessageGroupServiceImpl extends BaseServiceImpl<MessageGroup, MessageGroupDTO, Long> implements MessageGroupService {

    private final MessageGroupRepository messageGroupRepository;
    private final UserRepository userRepository;
    private final MessageGroupMapper messageGroupMapper;

    @Autowired
    public MessageGroupServiceImpl(MessageGroupRepository messageGroupRepository, UserRepository userRepository, MessageGroupMapper messageGroupMapper) {
        super(messageGroupRepository);
        this.messageGroupRepository = messageGroupRepository;
        this.userRepository = userRepository;
        this.messageGroupMapper = messageGroupMapper;
    }

    @Override
    protected MessageGroupDTO mapToDto(MessageGroup entity) {
        return messageGroupMapper.toDto(entity);
    }

    @Override
    protected MessageGroup mapToEntity(MessageGroupDTO dto) {
        return messageGroupMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(MessageGroup entity, MessageGroupDTO dto) {
        messageGroupMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    public List<MessageGroupDTO> findByCreatorId(Long creatorId) {
        return messageGroupRepository.findByCreatorId(creatorId).stream()
                .map(messageGroupMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageGroupDTO> findByCreatorIdAndActive(Long creatorId, boolean active) {
        return messageGroupRepository.findByCreatorIdAndActive(creatorId, active).stream()
                .map(messageGroupMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageGroupDTO> findByMemberId(Long memberId) {
        return messageGroupRepository.findByMemberId(memberId).stream()
                .map(messageGroupMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageGroupDTO> findByMemberIdAndActive(Long memberId, boolean active) {
        return messageGroupRepository.findByMemberIdAndActive(memberId, active).stream()
                .map(messageGroupMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MessageGroupDTO findByIdWithMembersAndMessages(Long id) {
        MessageGroup group = messageGroupRepository.findByIdWithMembersAndMessages(id);
        if (group == null) {
            throw new IllegalArgumentException("Message group not found");
        }
        return messageGroupMapper.toDto(group);
    }

    @Override
    @Transactional
    public MessageGroupDTO addMember(Long groupId, Long userId) {
        MessageGroup group = messageGroupRepository.findByIdWithMembersAndMessages(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Message group not found");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        group.getMembers().add(user);
        MessageGroup saved = messageGroupRepository.save(group);
        return messageGroupMapper.toDto(saved);
    }

    @Override
    @Transactional
    public MessageGroupDTO removeMember(Long groupId, Long userId) {
        MessageGroup group = messageGroupRepository.findByIdWithMembersAndMessages(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Message group not found");
        }
        group.getMembers().removeIf(u -> u.getId().equals(userId));
        MessageGroup saved = messageGroupRepository.save(group);
        return messageGroupMapper.toDto(saved);
    }

    @Override
    public boolean isGroupMember(Long groupId, Long userId) {
        MessageGroup group = messageGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Message group not found"));
        return group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));
    }

    @Override
    public boolean isGroupCreator(Long groupId, Long userId) {
        MessageGroup group = messageGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Message group not found"));
        return group.getCreator().getId().equals(userId);
    }

    @Override
    protected Long extractSchoolId(MessageGroup entity) {
        // Extract school from group creator or from members' common school
        if (entity.getCreator() != null && entity.getCreator().getSchool() != null) {
            return entity.getCreator().getSchool().getId();
        }
        // If creator has no school, try to find common school from members
        if (entity.getMembers() != null && !entity.getMembers().isEmpty()) {
            return entity.getMembers().stream()
                .filter(member -> member.getSchool() != null)
                .map(member -> member.getSchool().getId())
                .findFirst()
                .orElse(null);
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(MessageGroup entity) {
        // Extract region from group creator or from members' common region
        if (entity.getCreator() != null && entity.getCreator().getSchool() != null && entity.getCreator().getSchool().getRegion() != null) {
            return entity.getCreator().getSchool().getRegion().getId();
        }
        // If creator has no region, try to find common region from members
        if (entity.getMembers() != null && !entity.getMembers().isEmpty()) {
            return entity.getMembers().stream()
                .filter(member -> member.getSchool() != null && member.getSchool().getRegion() != null)
                .map(member -> member.getSchool().getRegion().getId())
                .findFirst()
                .orElse(null);
        }
        return null;
    }
} 