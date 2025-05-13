package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import java.util.List;

public interface MessageGroupService extends BaseService<MessageGroupDTO, Long> {
    
    List<MessageGroupDTO> findByCreatorId(Long creatorId);
    
    List<MessageGroupDTO> findByCreatorIdAndActive(Long creatorId, boolean active);
    
    List<MessageGroupDTO> findByMemberId(Long memberId);
    
    List<MessageGroupDTO> findByMemberIdAndActive(Long memberId, boolean active);
    
    MessageGroupDTO findByIdWithMembersAndMessages(Long id);
    
    MessageGroupDTO addMember(Long groupId, Long userId);
    
    MessageGroupDTO removeMember(Long groupId, Long userId);
    
    boolean isGroupMember(Long groupId, Long userId);
    
    boolean isGroupCreator(Long groupId, Long userId);
} 