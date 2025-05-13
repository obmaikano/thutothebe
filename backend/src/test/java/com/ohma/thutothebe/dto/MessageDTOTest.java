package com.ohma.thutothebe.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MessageDTOTest {

    @Test
    void constructor_ShouldThrowException_WhenContentIsBlank() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "", 1L, 2L, null, LocalDateTime.now(), true)
        );
    }

    @Test
    void constructor_ShouldThrowException_WhenSenderIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "Test message", null, 2L, null, LocalDateTime.now(), true)
        );
    }

    @Test
    void constructor_ShouldThrowException_WhenBothRecipientAndGroupAreNull() {
        assertThrows(IllegalArgumentException.class, () -> 
            new MessageDTO(1L, "Test message", 1L, null, null, LocalDateTime.now(), true)
        );
    }

    @Test
    void constructor_ShouldSucceed_WhenOnlyGroupIdIsProvided() {
        MessageDTO dto = new MessageDTO(1L, "Test message", 1L, null, 1L, LocalDateTime.now(), true);
        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertEquals("Test message", dto.content());
        assertEquals(1L, dto.senderId());
        assertNull(dto.recipientId());
        assertEquals(1L, dto.groupId());
    }

    @Test
    void constructor_ShouldSucceed_WhenOnlyRecipientIdIsProvided() {
        MessageDTO dto = new MessageDTO(1L, "Test message", 1L, 2L, null, LocalDateTime.now(), true);
        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertEquals("Test message", dto.content());
        assertEquals(1L, dto.senderId());
        assertEquals(2L, dto.recipientId());
        assertNull(dto.groupId());
    }
} 