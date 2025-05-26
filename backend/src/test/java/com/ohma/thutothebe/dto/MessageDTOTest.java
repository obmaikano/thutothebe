package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.MessageType;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MessageDTOTest {

    @Test
    void constructor_ShouldThrowException_WhenContentIsBlank() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "", 1L, "Sender", 2L, "Recipient", null, null, 
                MessageType.TEXT, LocalDateTime.now(), null, true, 
                false, false, null, null, null, false, null)
        );
    }

    @Test
    void constructor_ShouldThrowException_WhenSenderIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "Test message", null, "Sender", 2L, "Recipient", null, null, 
                MessageType.TEXT, LocalDateTime.now(), null, true, 
                false, false, null, null, null, false, null)
        );
    }

    @Test
    void constructor_ShouldThrowException_WhenBothRecipientAndGroupAreNull() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "Test message", 1L, "Sender", null, null, null, null, 
                MessageType.TEXT, LocalDateTime.now(), null, true, 
                false, false, null, null, null, false, null)
        );
    }

    @Test
    void constructor_ShouldSucceed_WhenOnlyGroupIdIsProvided() {
        MessageDTO dto = new MessageDTO(1L, "Test message", 1L, "Sender", null, null, 1L, "Group", 
            MessageType.TEXT, LocalDateTime.now(), null, true, 
            false, false, null, null, null, false, null);
        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertEquals("Test message", dto.content());
        assertEquals(1L, dto.senderId());
        assertNull(dto.recipientId());
        assertEquals(1L, dto.groupId());
    }

    @Test
    void constructor_ShouldSucceed_WhenOnlyRecipientIdIsProvided() {
        MessageDTO dto = new MessageDTO(1L, "Test message", 1L, "Sender", 2L, "Recipient", null, null, 
            MessageType.TEXT, LocalDateTime.now(), null, true, 
            false, false, null, null, null, false, null);
        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertEquals("Test message", dto.content());
        assertEquals(1L, dto.senderId());
        assertEquals(2L, dto.recipientId());
        assertNull(dto.groupId());
    }
} 