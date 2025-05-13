package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import com.ohma.thutothebe.entity.MessageGroup;
import com.ohma.thutothebe.entity.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MessageGroupMapper implements BaseDtoMapper<MessageGroup, MessageGroupDTO> {
    @Override
    public MessageGroupDTO toDto(MessageGroup group) {
        if (group == null) {
            return null;
        }
        return new MessageGroupDTO(
            group.getId(),
            group.getName(),
            group.getDescription(),
            group.getCreator() != null ? group.getCreator().getId() : null,
            group.getMembers() != null ? group.getMembers().stream().map(User::getId).collect(Collectors.toSet()) : null,
            group.isActive()
        );
    }

    @Override
    public MessageGroup toEntity(MessageGroupDTO dto) {
        if (dto == null) {
            return null;
        }
        MessageGroup group = new MessageGroup();
        group.setId(dto.id());
        group.setName(dto.name());
        group.setDescription(dto.description());
        group.setActive(dto.active());
        // Creator and members are set in the service layer
        return group;
    }

    public void updateEntityFromDto(MessageGroupDTO dto, MessageGroup group) {
        if (dto == null || group == null) {
            return;
        }
        group.setName(dto.name());
        group.setDescription(dto.description());
        group.setActive(dto.active());
        // Creator and members are set in the service layer
    }
}
