package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.DocumentAccessLogDTO;
import com.ohma.thutothebe.entity.DocumentAccessType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface DocumentAccessLogService extends BaseService<DocumentAccessLogDTO, Long> {

    // Access log retrieval methods
    Page<DocumentAccessLogDTO> getAllAccessLogs(Pageable pageable);
    Page<DocumentAccessLogDTO> getAccessLogsByDocument(Long documentId, Pageable pageable);
    Page<DocumentAccessLogDTO> getAccessLogsByUser(Long userId, Pageable pageable);
    Page<DocumentAccessLogDTO> getAccessLogsByAccessType(DocumentAccessType accessType, Pageable pageable);
    Page<DocumentAccessLogDTO> getSuccessfulAccessLogs(Pageable pageable);
    Page<DocumentAccessLogDTO> getFailedAccessLogs(Pageable pageable);
    
    // Date range queries
    Page<DocumentAccessLogDTO> getAccessLogsBetweenDates(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    Page<DocumentAccessLogDTO> getAccessLogsByDocumentBetweenDates(Long documentId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    Page<DocumentAccessLogDTO> getAccessLogsByUserBetweenDates(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Specific access log queries
    List<DocumentAccessLogDTO> getAccessLogsByDocumentAndUser(Long documentId, Long userId);
    List<DocumentAccessLogDTO> getAccessLogsByDocumentAndAccessType(Long documentId, DocumentAccessType accessType);
    List<DocumentAccessLogDTO> getAccessLogsByUserAndAccessType(Long userId, DocumentAccessType accessType);
    List<DocumentAccessLogDTO> getAccessLogsByIpAddress(String ipAddress);
    List<DocumentAccessLogDTO> getAccessLogsBySessionId(String sessionId);
    
    // Access logging methods
    DocumentAccessLogDTO logDocumentAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                          String ipAddress, String userAgent, String sessionId, boolean success, String errorMessage);
    DocumentAccessLogDTO logSuccessfulAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                           String ipAddress, String userAgent, String sessionId);
    DocumentAccessLogDTO logFailedAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                       String ipAddress, String userAgent, String sessionId, String errorMessage);
    
    // Bulk access logging
    List<DocumentAccessLogDTO> logBulkDocumentAccess(List<Long> documentIds, Long userId, DocumentAccessType accessType, 
                                                    String ipAddress, String userAgent, String sessionId, boolean success);
    
    // Access statistics and analytics
    Long getAccessCountByDocument(Long documentId);
    Long getAccessCountByUser(Long userId);
    Long getAccessCountByDocumentAndAccessType(Long documentId, DocumentAccessType accessType);
    Long getAccessCountByUserAndAccessType(Long userId, DocumentAccessType accessType);
    Long getAccessCountBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    Long getAccessCountByDocumentBetweenDates(Long documentId, LocalDateTime startDate, LocalDateTime endDate);
    Long getAccessCountByUserBetweenDates(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Access type statistics
    List<Object[]> getAccessTypeStatsByDocument(Long documentId);
    List<Object[]> getAccessTypeStatsByUser(Long userId);
    List<Object[]> getAccessTypeStatsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Popular documents and users
    List<Object[]> getMostAccessedDocuments(int limit);
    List<Object[]> getMostAccessedDocumentsBySchool(Long schoolId, int limit);
    List<Object[]> getMostActiveUsers(int limit);
    List<Object[]> getMostActiveUsersBySchool(Long schoolId, int limit);
    
    // Time-based analytics
    List<Object[]> getAccessStatsByHour(LocalDateTime date);
    List<Object[]> getAccessStatsByDay(LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getAccessStatsByWeek(LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getAccessStatsByMonth(LocalDateTime startDate, LocalDateTime endDate);
    
    // Security and monitoring
    List<DocumentAccessLogDTO> getSuspiciousAccessAttempts(int threshold);
    List<DocumentAccessLogDTO> getFailedAccessAttemptsByUser(Long userId, LocalDateTime since);
    List<DocumentAccessLogDTO> getFailedAccessAttemptsByIpAddress(String ipAddress, LocalDateTime since);
    List<DocumentAccessLogDTO> getUnauthorizedAccessAttempts(LocalDateTime since);
    List<Object[]> getAccessPatternsByUser(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Geographic and device analytics
    List<Object[]> getAccessStatsByIpAddress(LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getAccessStatsByUserAgent(LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getUniqueIpAddressesByDocument(Long documentId);
    List<Object[]> getUniqueUserAgentsByDocument(Long documentId);
    
    // Session analytics
    List<Object[]> getAccessStatsBySession(String sessionId);
    List<Object[]> getLongestSessions(int limit);
    List<Object[]> getMostActiveSessionsByUser(Long userId, int limit);
    Double getAverageSessionDuration(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Document usage patterns
    Map<String, Object> getDocumentUsagePattern(Long documentId, LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> getUserAccessPattern(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getPeakAccessTimes(LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getAccessTrendsByDocument(Long documentId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Compliance and audit reporting
    List<DocumentAccessLogDTO> getAccessLogsForAudit(Long documentId, LocalDateTime startDate, LocalDateTime endDate);
    List<DocumentAccessLogDTO> getAccessLogsForCompliance(List<Long> documentIds, LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> generateAccessReport(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> generateUserActivityReport(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    Map<String, Object> generateDocumentActivityReport(Long documentId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Data retention and cleanup
    void cleanupOldAccessLogs(LocalDateTime cutoffDate);
    void archiveAccessLogs(LocalDateTime cutoffDate);
    Long getAccessLogCount();
    Long getAccessLogCountByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Real-time monitoring
    List<DocumentAccessLogDTO> getRecentAccessLogs(int minutes, int limit);
    List<DocumentAccessLogDTO> getCurrentActiveUsers(int minutes);
    Map<String, Object> getRealTimeAccessStatistics();
    List<Object[]> getCurrentDocumentActivity(int limit);
} 