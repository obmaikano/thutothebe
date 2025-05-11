package com.ohma.thutothebe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standard API response wrapper")
public class OhmaApiResponse<T> {

    @Schema(description = "Status of the response", example = "SUCCESS")
    private String status;

    @Schema(description = "Message describing the response", example = "Operation completed successfully")
    private String message;

    @Schema(description = "Response data payload")
    private T data;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Timestamp of the response", example = "2024-03-11 19:27:00")
    private LocalDateTime timestamp;

    public static <T> OhmaApiResponse<T> success(T data) {
        return new OhmaApiResponse<>("SUCCESS", "Operation completed successfully", data, LocalDateTime.now());
    }

    public static <T> OhmaApiResponse<T> error(int code, String message) {
        return new OhmaApiResponse<>("ERROR", message, null, LocalDateTime.now());
    }
} 