package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import com.ohma.thutothebe.entity.MessageGroup;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.MessageGroupMapper;
import com.ohma.thutothebe.repository.MessageGroupRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageGroupServiceImplTest {

    @Mock
    private MessageGroupRepository messageGroupRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageGroupMapper messageGroupMapper;

    @InjectMocks
    private MessageGroupServiceImpl messageGroupService;

    private User creator;
    private User member;
    private MessageGroup messageGroup;
    private MessageGroupDTO messageGroupDTO;

    @BeforeEach
    void setUp() {
        creator = new User();
        creator.setId(1L);
        creator.setUsername("creator");

        member = new User();
        member.setId(2L);
        member.setUsername("member");

        messageGroup = new MessageGroup();
        messageGroup.setId(1L);
        messageGroup.setName("Test Group");
        messageGroup.setDescription("Test Description");
        messageGroup.setCreator(creator);
        messageGroup.setMembers(new HashSet<>(Arrays.asList(member)));
        messageGroup.setActive(true);

        messageGroupDTO = new MessageGroupDTO(1L, "Test Group", "Test Description", 1L, new HashSet<>(Arrays.asList(2L)), true);
    }

    @Test
    void create_ShouldCreateNewGroup() {
        when(messageGroupMapper.toEntity(any(MessageGroupDTO.class))).thenReturn(messageGroup);
        when(userRepository.findById(1L)).thenReturn(Optional.of(creator));
        when(messageGroupRepository.save(any(MessageGroup.class))).thenReturn(messageGroup);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.create(messageGroupDTO);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        assertEquals(messageGroupDTO.name(), result.name());
        verify(messageGroupRepository).save(any(MessageGroup.class));
    }

    @Test
    void getById_ShouldReturnGroup() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));
        when(messageGroupMapper.toDto(messageGroup)).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.getById(1L);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        assertEquals(messageGroupDTO.name(), result.name());
    }

    @Test
    void getById_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllGroups() {
        List<MessageGroup> groups = Arrays.asList(messageGroup);
        when(messageGroupRepository.findAll()).thenReturn(groups);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        List<MessageGroupDTO> results = messageGroupService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageGroupDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateGroup() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));
        when(messageGroupRepository.save(any(MessageGroup.class))).thenReturn(messageGroup);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.update(1L, messageGroupDTO);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        verify(messageGroupRepository).save(any(MessageGroup.class));
    }

    @Test
    void update_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.update(1L, messageGroupDTO));
    }

    @Test
    void delete_ShouldDeleteGroup() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));

        messageGroupService.delete(1L);

        verify(messageGroupRepository).delete(messageGroup);
    }

    @Test
    void delete_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.delete(1L));
        verify(messageGroupRepository, never()).delete(any(MessageGroup.class));
    }

    @Test
    void findByCreatorId_ShouldReturnGroups() {
        List<MessageGroup> groups = Arrays.asList(messageGroup);
        when(messageGroupRepository.findByCreatorId(1L)).thenReturn(groups);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        List<MessageGroupDTO> results = messageGroupService.findByCreatorId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageGroupDTO.id(), results.get(0).id());
    }

    @Test
    void findByCreatorIdAndActive_ShouldReturnGroups() {
        List<MessageGroup> groups = Arrays.asList(messageGroup);
        when(messageGroupRepository.findByCreatorIdAndActive(1L, true)).thenReturn(groups);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        List<MessageGroupDTO> results = messageGroupService.findByCreatorIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageGroupDTO.id(), results.get(0).id());
    }

    @Test
    void findByMemberId_ShouldReturnGroups() {
        List<MessageGroup> groups = Arrays.asList(messageGroup);
        when(messageGroupRepository.findByMemberId(2L)).thenReturn(groups);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        List<MessageGroupDTO> results = messageGroupService.findByMemberId(2L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageGroupDTO.id(), results.get(0).id());
    }

    @Test
    void findByMemberIdAndActive_ShouldReturnGroups() {
        List<MessageGroup> groups = Arrays.asList(messageGroup);
        when(messageGroupRepository.findByMemberIdAndActive(2L, true)).thenReturn(groups);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        List<MessageGroupDTO> results = messageGroupService.findByMemberIdAndActive(2L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageGroupDTO.id(), results.get(0).id());
    }

    @Test
    void findByIdWithMembersAndMessages_ShouldReturnGroup() {
        when(messageGroupRepository.findByIdWithMembersAndMessages(1L)).thenReturn(messageGroup);
        when(messageGroupMapper.toDto(messageGroup)).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.findByIdWithMembersAndMessages(1L);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        assertEquals(messageGroupDTO.name(), result.name());
    }

    @Test
    void findByIdWithMembersAndMessages_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findByIdWithMembersAndMessages(1L)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.findByIdWithMembersAndMessages(1L));
    }

    @Test
    void addMember_ShouldAddMemberToGroup() {
        User newMember = new User();
        newMember.setId(3L);
        newMember.setUsername("newMember");

        when(messageGroupRepository.findByIdWithMembersAndMessages(1L)).thenReturn(messageGroup);
        when(userRepository.findById(3L)).thenReturn(Optional.of(newMember));
        when(messageGroupRepository.save(any(MessageGroup.class))).thenReturn(messageGroup);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.addMember(1L, 3L);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        verify(messageGroupRepository).save(any(MessageGroup.class));
    }

    @Test
    void addMember_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> messageGroupService.addMember(1L, 2L));
    }

    @Test
    void removeMember_ShouldRemoveMemberFromGroup() {
        when(messageGroupRepository.findByIdWithMembersAndMessages(1L)).thenReturn(messageGroup);
        when(messageGroupRepository.save(any(MessageGroup.class))).thenReturn(messageGroup);
        when(messageGroupMapper.toDto(any(MessageGroup.class))).thenReturn(messageGroupDTO);

        MessageGroupDTO result = messageGroupService.removeMember(1L, 2L);

        assertNotNull(result);
        assertEquals(messageGroupDTO.id(), result.id());
        verify(messageGroupRepository).save(any(MessageGroup.class));
    }

    @Test
    void removeMember_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> messageGroupService.removeMember(1L, 2L));
    }

    @Test
    void isGroupMember_ShouldReturnTrue_WhenUserIsMember() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));

        boolean result = messageGroupService.isGroupMember(1L, 2L);

        assertTrue(result);
    }

    @Test
    void isGroupMember_ShouldReturnFalse_WhenUserIsNotMember() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));

        boolean result = messageGroupService.isGroupMember(1L, 3L);

        assertFalse(result);
    }

    @Test
    void isGroupMember_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.isGroupMember(1L, 1L));
    }

    @Test
    void isGroupCreator_ShouldReturnTrue_WhenUserIsCreator() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));

        boolean result = messageGroupService.isGroupCreator(1L, 1L);

        assertTrue(result);
    }

    @Test
    void isGroupCreator_ShouldReturnFalse_WhenUserIsNotCreator() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.of(messageGroup));

        boolean result = messageGroupService.isGroupCreator(1L, 2L);

        assertFalse(result);
    }

    @Test
    void isGroupCreator_ShouldThrowException_WhenGroupNotFound() {
        when(messageGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageGroupService.isGroupCreator(1L, 1L));
    }

} 