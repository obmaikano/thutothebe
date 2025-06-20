package com.ohma.thutothebe.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Create JavaTimeModule with custom deserializer
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Custom LocalDateTime deserializer that handles both date-only and full datetime strings
        LocalDateTimeDeserializer localDateTimeDeserializer = new LocalDateTimeDeserializer(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        ) {
            @Override
            public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p, 
                                          com.fasterxml.jackson.databind.DeserializationContext ctxt) 
                    throws java.io.IOException {
                String text = p.getText();
                if (text == null || text.trim().isEmpty()) {
                    return null;
                }
                
                // Try different formats
                String[] formats = {
                    "yyyy-MM-dd HH:mm:ss",
                    "yyyy-MM-dd'T'HH:mm:ss",
                    "yyyy-MM-dd'T'HH:mm:ss.SSS",
                    "yyyy-MM-dd'T'HH:mm:ss.SSSSSS",
                    "yyyy-MM-dd"
                };
                
                for (String format : formats) {
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                        if (format.equals("yyyy-MM-dd")) {
                            // For date-only strings, assume time is 00:00:00
                            return LocalDateTime.parse(text + " 00:00:00", 
                                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        } else {
                            return LocalDateTime.parse(text, formatter);
                        }
                    } catch (DateTimeParseException e) {
                        // Continue to next format
                    }
                }
                
                // If none of the formats work, throw the original exception
                throw new DateTimeParseException("Unable to parse date/time: " + text, text, 0);
            }
        };
        
        javaTimeModule.addDeserializer(LocalDateTime.class, localDateTimeDeserializer);
        javaTimeModule.addSerializer(LocalDateTime.class, 
            new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        mapper.registerModule(javaTimeModule);
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return mapper;
    }
} 