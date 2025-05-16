package com.ohma.thutothebe.config;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import jakarta.persistence.OptimisticLockException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<OhmaApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        // Traverse causes to find an IllegalArgumentException (validation)
        Throwable cause = ex.getCause();
        while (cause != null && !(cause instanceof IllegalArgumentException)) {
            cause = cause.getCause();
        }
        String message = "Malformed JSON request";
        if (cause instanceof IllegalArgumentException) {
            message = cause.getMessage();
        }
        OhmaApiResponse<Void> response = new OhmaApiResponse<>(
                "FAILURE",
                message,
                null,
                java.time.LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Optional: Handle validation errors if you use @Valid in your controllers
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<OhmaApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        OhmaApiResponse<Void> response = new OhmaApiResponse<>(
                "FAILURE",
                message,
                null,
                java.time.LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Generic fallback handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<OhmaApiResponse<Void>> handleAllExceptions(Exception ex) {
        OhmaApiResponse<Void> response = new OhmaApiResponse<>(
                "ERROR",
                ex.getMessage(),
                null,
                java.time.LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(OptimisticLockException.class)
    public ResponseEntity<OhmaApiResponse<Void>> handleOptimisticLockException(OptimisticLockException ex) {
        OhmaApiResponse<Void> response = new OhmaApiResponse<>(
                "FAILURE",
                "The resource was modified by another user. Please refresh and try again.",
                null,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
