package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.entity.Message;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.MessageMapper;
import com.ohma.thutothebe.repository.MessageRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceImplTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageMapper messageMapper;

    @InjectMocks
    private MessageServiceImpl messageService;

    private User sender;
    private User recipient;
    private Message message;
    private MessageDTO messageDTO;

    @BeforeEach
    void setUp() {
        sender = new User();
        sender.setId(1L);
        sender.setUsername("sender");

        recipient = new User();
        recipient.setId(2L);
        recipient.setUsername("recipient");

        message = new Message();
        message.setId(1L);
        message.setContent("Test message");
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setActive(true);

        messageDTO = new MessageDTO(1L, "Test message", 1L, 2L, null, LocalDateTime.now(), true);
    }

    @Test
    void create_ShouldCreateNewMessage() {
        when(messageMapper.toEntity(any(MessageDTO.class))).thenReturn(message);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(recipient));
        when(messageRepository.save(any(Message.class))).thenReturn(message);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        MessageDTO result = messageService.create(messageDTO);

        assertNotNull(result);
        assertEquals(messageDTO.id(), result.id());
        assertEquals(messageDTO.content(), result.content());
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void getById_ShouldReturnMessage() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));
        when(messageMapper.toDto(message)).thenReturn(messageDTO);

        MessageDTO result = messageService.getById(1L);

        assertNotNull(result);
        assertEquals(messageDTO.id(), result.id());
        assertEquals(messageDTO.content(), result.content());
    }

    @Test
    void getById_ShouldThrowException_WhenMessageNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> messageService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findAll()).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateMessage() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(recipient));
        when(messageRepository.save(any(Message.class))).thenReturn(message);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        MessageDTO result = messageService.update(1L, messageDTO);

        assertNotNull(result);
        assertEquals(messageDTO.id(), result.id());
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void update_ShouldThrowException_WhenMessageNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> messageService.update(1L, messageDTO));
    }

    @Test
    void delete_ShouldDeleteMessage() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        messageService.delete(1L);

        verify(messageRepository).delete(message);
    }

    @Test
    void delete_ShouldThrowException_WhenMessageNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> messageService.delete(1L));
        verify(messageRepository, never()).delete(any(Message.class));
    }

    @Test
    void findByUserId_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findByUserId(1L)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findByUserId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void findByUserIdAndActive_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findByUserIdAndActive(1L, true)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findByUserIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void findBySenderAndRecipient_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findBySenderAndRecipient(1L, 2L)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findBySenderAndRecipient(1L, 2L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void findBySenderAndRecipientAndActive_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findBySenderAndRecipientAndActive(1L, 2L, true)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findBySenderAndRecipientAndActive(1L, 2L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void findByGroupId_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findByGroupId(1L)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findByGroupId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void findByGroupIdAndActive_ShouldReturnMessages() {
        List<Message> messages = Arrays.asList(message);
        when(messageRepository.findByGroupIdAndActive(1L, true)).thenReturn(messages);
        when(messageMapper.toDto(any(Message.class))).thenReturn(messageDTO);

        List<MessageDTO> results = messageService.findByGroupIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(messageDTO.id(), results.get(0).id());
    }

    @Test
    void isMessageOwner_ShouldReturnTrue_WhenUserIsSender() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        boolean result = messageService.isMessageOwner(1L, 1L);

        assertTrue(result);
    }

    @Test
    void isMessageOwner_ShouldReturnFalse_WhenUserIsNotSender() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));

        boolean result = messageService.isMessageOwner(1L, 2L);

        assertFalse(result);
    }

    @Test
    void isMessageOwner_ShouldThrowException_WhenMessageNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> messageService.isMessageOwner(1L, 1L));
    }

    @Test
    void create_ShouldThrowException_WhenContentIsBlank() {
        MessageDTO invalidDTO = new MessageDTO(1L, "", 1L, 2L, null, LocalDateTime.now(), true);
        assertThrows(IllegalArgumentException.class, () -> messageService.create(invalidDTO));
    }

    @Test
    void create_ShouldThrowException_WhenSenderIdIsNull() {
        MessageDTO invalidDTO = new MessageDTO(1L, "Test message", null, 2L, null, LocalDateTime.now(), true);
        assertThrows(IllegalArgumentException.class, () -> messageService.create(invalidDTO));
    }

    @Test
    void create_ShouldThrowException_WhenBothRecipientAndGroupAreNull() {
        MessageDTO invalidDTO = new MessageDTO(1L, "Test message", 1L, null, null, LocalDateTime.now(), true);
        assertThrows(IllegalArgumentException.class, () -> messageService.create(invalidDTO));
    }

    @Test
    void create_ShouldSucceed_WhenOnlyGroupIdIsProvided() {
        MessageDTO validDTO = new MessageDTO(1L, "Test message", 1L, null, 1L, LocalDateTime.now(), true);
        when(messageMapper.toEntity(any(MessageDTO.class))).thenReturn(message);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(messageRepository.save(any(Message.class))).thenReturn(message);
        when(messageMapper.toDto(any(Message.class))).thenReturn(validDTO);

        MessageDTO result = messageService.create(validDTO);

        assertNotNull(result);
        assertEquals(validDTO.id(), result.id());
        assertEquals(validDTO.content(), result.content());
        verify(messageRepository).save(any(Message.class));
    }
} 