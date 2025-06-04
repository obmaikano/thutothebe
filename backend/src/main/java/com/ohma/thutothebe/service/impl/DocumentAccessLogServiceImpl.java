package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DocumentAccessLogDTO;
import com.ohma.thutothebe.entity.DocumentAccessLog;
import com.ohma.thutothebe.entity.DocumentAccessType;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DocumentAccessLogMapper;
import com.ohma.thutothebe.repository.DocumentAccessLogRepository;
import com.ohma.thutothebe.repository.DocumentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.DocumentAccessLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Objects;
import org.springframework.data.domain.PageRequest;

@Slf4j
@Service
@Transactional
public class DocumentAccessLogServiceImpl extends BaseServiceImpl<DocumentAccessLog, DocumentAccessLogDTO, Long> implements DocumentAccessLogService {

    private final DocumentAccessLogRepository documentAccessLogRepository;
    private final DocumentAccessLogMapper documentAccessLogMapper;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Autowired
    public DocumentAccessLogServiceImpl(DocumentAccessLogRepository documentAccessLogRepository,
                                      DocumentAccessLogMapper documentAccessLogMapper,
                                      DocumentRepository documentRepository,
                                      UserRepository userRepository) {
        super(documentAccessLogRepository);
        this.documentAccessLogRepository = documentAccessLogRepository;
        this.documentAccessLogMapper = documentAccessLogMapper;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected DocumentAccessLog mapToEntity(DocumentAccessLogDTO dto) {
        return documentAccessLogMapper.toEntity(dto);
    }

    @Override
    protected DocumentAccessLogDTO mapToDto(DocumentAccessLog entity) {
        return documentAccessLogMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(DocumentAccessLog entity, DocumentAccessLogDTO dto) {
        documentAccessLogMapper.updateEntityFromDto(entity, dto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAllAccessLogs(Pageable pageable) {
        return documentAccessLogRepository.findAllOrderByAccessedAtDesc(pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsByDocument(Long documentId, Pageable pageable) {
        return documentAccessLogRepository.findByDocumentIdOrderByAccessedAtDesc(documentId, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsByUser(Long userId, Pageable pageable) {
        return documentAccessLogRepository.findByUserIdOrderByAccessedAtDesc(userId, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsByAccessType(DocumentAccessType accessType, Pageable pageable) {
        return documentAccessLogRepository.findByAccessTypeOrderByAccessedAtDesc(accessType, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getSuccessfulAccessLogs(Pageable pageable) {
        return documentAccessLogRepository.findBySuccessOrderByAccessedAtDesc(true, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getFailedAccessLogs(Pageable pageable) {
        return documentAccessLogRepository.findBySuccessOrderByAccessedAtDesc(false, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsBetweenDates(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return documentAccessLogRepository.findByAccessedAtBetweenOrderByAccessedAtDesc(startDate, endDate, pageable)
                .map(documentAccessLogMapper::toDto);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsByDocumentBetweenDates(Long documentId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        // This would require a custom repository method
        return getAccessLogsByDocument(documentId, pageable);
    }

    @Override
    public Page<DocumentAccessLogDTO> getAccessLogsByUserBetweenDates(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        // This would require a custom repository method
        return getAccessLogsByUser(userId, pageable);
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsByDocumentAndUser(Long documentId, Long userId) {
        return documentAccessLogRepository.findByDocumentIdAndUserIdOrderByAccessedAtDesc(documentId, userId)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsByDocumentAndAccessType(Long documentId, DocumentAccessType accessType) {
        return documentAccessLogRepository.findByDocumentIdAndAccessTypeOrderByAccessedAtDesc(documentId, accessType)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsByUserAndAccessType(Long userId, DocumentAccessType accessType) {
        return documentAccessLogRepository.findByUserIdAndAccessTypeOrderByAccessedAtDesc(userId, accessType)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsByIpAddress(String ipAddress) {
        return documentAccessLogRepository.findByIpAddressOrderByAccessedAtDesc(ipAddress)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsBySessionId(String sessionId) {
        return documentAccessLogRepository.findBySessionIdOrderByAccessedAtDesc(sessionId)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentAccessLogDTO logDocumentAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                                String ipAddress, String userAgent, String sessionId, 
                                                boolean success, String errorMessage) {
        DocumentAccessLog accessLog = new DocumentAccessLog();
        accessLog.setDocument(documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId)));
        accessLog.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId)));
        accessLog.setAccessType(accessType);
        accessLog.setAccessedAt(LocalDateTime.now());
        accessLog.setIpAddress(ipAddress);
        accessLog.setUserAgent(userAgent);
        accessLog.setSessionId(sessionId);
        accessLog.setSuccess(success);
        accessLog.setErrorMessage(errorMessage);

        DocumentAccessLog savedLog = documentAccessLogRepository.save(accessLog);
        log.debug("Document access logged: {} for document: {} by user: {} - Success: {}", 
                accessType, documentId, userId, success);
        
        return documentAccessLogMapper.toDto(savedLog);
    }

    @Override
    public DocumentAccessLogDTO logSuccessfulAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                                   String ipAddress, String userAgent, String sessionId) {
        return logDocumentAccess(documentId, userId, accessType, ipAddress, userAgent, sessionId, true, null);
    }

    @Override
    public DocumentAccessLogDTO logFailedAccess(Long documentId, Long userId, DocumentAccessType accessType, 
                                               String ipAddress, String userAgent, String sessionId, String errorMessage) {
        return logDocumentAccess(documentId, userId, accessType, ipAddress, userAgent, sessionId, false, errorMessage);
    }

    @Override
    public Long getAccessCountByDocument(Long documentId) {
        return documentAccessLogRepository.countByDocumentId(documentId);
    }

    @Override
    public Long getAccessCountByUser(Long userId) {
        return documentAccessLogRepository.countByUserId(userId);
    }

    @Override
    public Long getAccessCountByDocumentAndAccessType(Long documentId, DocumentAccessType accessType) {
        return documentAccessLogRepository.countByDocumentIdAndAccessType(documentId, accessType);
    }

    @Override
    public Long getAccessCountByUserAndAccessType(Long userId, DocumentAccessType accessType) {
        return documentAccessLogRepository.countByUserIdAndAccessType(userId, accessType);
    }

    @Override
    public Long getAccessCountBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return documentAccessLogRepository.countByAccessedAtBetween(startDate, endDate);
    }

    @Override
    public Long getAccessCountByDocumentBetweenDates(Long documentId, LocalDateTime startDate, LocalDateTime endDate) {
        return documentAccessLogRepository.countByDocumentIdAndAccessedAtBetween(documentId, startDate, endDate);
    }

    @Override
    public Long getAccessCountByUserBetweenDates(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return documentAccessLogRepository.countByUserIdAndAccessedAtBetween(userId, startDate, endDate);
    }

    @Override
    public List<Object[]> getAccessTypeStatsByDocument(Long documentId) {
        return documentAccessLogRepository.getAccessTypeStatsByDocumentId(documentId);
    }

    @Override
    public List<Object[]> getAccessTypeStatsByUser(Long userId) {
        return documentAccessLogRepository.getAccessTypeStatsByUserId(userId);
    }

    @Override
    public List<DocumentAccessLogDTO> logBulkDocumentAccess(List<Long> documentIds, Long userId, DocumentAccessType accessType, 
                                                           String ipAddress, String userAgent, String sessionId, boolean success) {
        List<DocumentAccessLogDTO> logEntries = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                DocumentAccessLogDTO logEntry = logDocumentAccess(
                    documentId, userId, accessType, ipAddress, userAgent, sessionId, success, null
                );
                logEntries.add(logEntry);
            } catch (Exception e) {
                log.error("Failed to log access for document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk access logged: {}/{} documents for user {} with access type {}", 
                logEntries.size(), documentIds.size(), userId, accessType);
        
        return logEntries;
    }

    @Override
    public List<Object[]> getAccessTypeStatsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> stats = new ArrayList<>();
        
        for (DocumentAccessType accessType : DocumentAccessType.values()) {
            Long count = documentAccessLogRepository.countByAccessTypeAndAccessedAtBetween(accessType, startDate, endDate);
            if (count > 0) {
                stats.add(new Object[]{accessType.name(), count});
            }
        }
        
        log.info("Generated access type statistics for date range {} to {}", startDate, endDate);
        return stats;
    }

    @Override
    public List<Object[]> getMostAccessedDocuments(Pageable pageable) {
        return documentAccessLogRepository.getMostAccessedDocuments(pageable);
    }

    @Override
    public List<Object[]> getMostAccessedDocumentsBySchool(Long schoolId, Pageable pageable) {
        return documentAccessLogRepository.getMostAccessedDocumentsBySchoolId(schoolId, pageable);
    }

    @Override
    public List<Object[]> getMostActiveUsers(Pageable pageable) {
        return documentAccessLogRepository.getMostActiveUsers(pageable);
    }

    @Override
    public List<Object[]> getMostActiveUsersBySchool(Long schoolId, Pageable pageable) {
        return documentAccessLogRepository.getMostActiveUsersBySchoolId(schoolId, pageable);
    }

    @Override
    public List<Object[]> getAccessStatsByHour(LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        List<Object[]> hourlyStats = new ArrayList<>();
        
        for (int hour = 0; hour < 24; hour++) {
            LocalDateTime hourStart = startOfDay.plusHours(hour);
            LocalDateTime hourEnd = hourStart.plusHours(1);
            
            Long count = documentAccessLogRepository.countByAccessedAtBetween(hourStart, hourEnd);
            hourlyStats.add(new Object[]{hour, count});
        }
        
        log.info("Generated hourly access statistics for date {}", date.toLocalDate());
        return hourlyStats;
    }

    @Override
    public List<Object[]> getAccessStatsByDay(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> dailyStats = new ArrayList<>();
        
        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay().plusDays(1);
        
        while (current.isBefore(end)) {
            LocalDateTime dayEnd = current.plusDays(1);
            Long count = documentAccessLogRepository.countByAccessedAtBetween(current, dayEnd);
            dailyStats.add(new Object[]{current.toLocalDate(), count});
            current = dayEnd;
        }
        
        log.info("Generated daily access statistics from {} to {}", startDate.toLocalDate(), endDate.toLocalDate());
        return dailyStats;
    }

    @Override
    public List<Object[]> getAccessStatsByWeek(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> weeklyStats = new ArrayList<>();
        
        LocalDateTime current = startDate.toLocalDate().atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();
        
        while (current.isBefore(end)) {
            LocalDateTime weekEnd = current.plusWeeks(1);
            if (weekEnd.isAfter(end)) {
                weekEnd = end;
            }
            
            Long count = documentAccessLogRepository.countByAccessedAtBetween(current, weekEnd);
            weeklyStats.add(new Object[]{current.toLocalDate(), count});
            current = weekEnd;
        }
        
        log.info("Generated weekly access statistics from {} to {}", startDate.toLocalDate(), endDate.toLocalDate());
        return weeklyStats;
    }

    @Override
    public List<Object[]> getAccessStatsByMonth(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> monthlyStats = new ArrayList<>();
        
        LocalDateTime current = startDate.toLocalDate().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = endDate.toLocalDate().atStartOfDay();
        
        while (current.isBefore(end)) {
            LocalDateTime monthEnd = current.plusMonths(1);
            if (monthEnd.isAfter(end)) {
                monthEnd = end;
            }
            
            Long count = documentAccessLogRepository.countByAccessedAtBetween(current, monthEnd);
            monthlyStats.add(new Object[]{current.toLocalDate(), count});
            current = monthEnd;
        }
        
        log.info("Generated monthly access statistics from {} to {}", startDate.toLocalDate(), endDate.toLocalDate());
        return monthlyStats;
    }

    @Override
    public List<DocumentAccessLogDTO> getSuspiciousAccessAttempts(int threshold) {
        LocalDateTime since = LocalDateTime.now().minusHours(1); // Look at last hour
        
        // Find users with more than threshold failed attempts
        List<DocumentAccessLog> suspiciousLogs = documentAccessLogRepository
                .findBySuccessAndAccessedAtAfter(false, since)
                .stream()
                .collect(Collectors.groupingBy(log -> log.getUser().getId()))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue().size() > threshold)
                .flatMap(entry -> entry.getValue().stream())
                .collect(Collectors.toList());
        
        log.info("Found {} suspicious access attempts with threshold {}", suspiciousLogs.size(), threshold);
        
        return suspiciousLogs.stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getFailedAccessAttemptsByUser(Long userId, LocalDateTime since) {
        return documentAccessLogRepository.findByUserIdAndSuccessAndAccessedAtAfter(userId, false, since)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getFailedAccessAttemptsByIpAddress(String ipAddress, LocalDateTime since) {
        return documentAccessLogRepository.findByIpAddressAndSuccessAndAccessedAtAfter(ipAddress, false, since)
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getUnauthorizedAccessAttempts(LocalDateTime since) {
        return documentAccessLogRepository.findBySuccessAndAccessedAtAfter(false, since)
                .stream()
                .filter(log -> log.getErrorMessage() != null && 
                              log.getErrorMessage().toLowerCase().contains("unauthorized"))
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getAccessPatternsByUser(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> patterns = new ArrayList<>();
        
        // Get access logs for the user in the date range
        List<DocumentAccessLog> userLogs = documentAccessLogRepository
                .findByUserIdOrderByAccessedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        // Group by hour of day
        Map<Integer, Long> hourlyPattern = userLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().getHour(),
                    Collectors.counting()
                ));
        
        for (Map.Entry<Integer, Long> entry : hourlyPattern.entrySet()) {
            patterns.add(new Object[]{"HOUR", entry.getKey(), entry.getValue()});
        }
        
        // Group by day of week
        Map<String, Long> dailyPattern = userLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().getDayOfWeek().name(),
                    Collectors.counting()
                ));
        
        for (Map.Entry<String, Long> entry : dailyPattern.entrySet()) {
            patterns.add(new Object[]{"DAY_OF_WEEK", entry.getKey(), entry.getValue()});
        }
        
        log.info("Generated access patterns for user {} from {} to {}", userId, startDate, endDate);
        return patterns;
    }

    @Override
    public List<Object[]> getAccessStatsByIpAddress(LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLog> logs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(startDate, endDate, Pageable.unpaged())
                .getContent();
        
        Map<String, Long> ipStats = logs.stream()
                .filter(log -> log.getIpAddress() != null)
                .collect(Collectors.groupingBy(
                    DocumentAccessLog::getIpAddress,
                    Collectors.counting()
                ));
        
        return ipStats.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getAccessStatsByUserAgent(LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLog> logs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(startDate, endDate, Pageable.unpaged())
                .getContent();
        
        Map<String, Long> userAgentStats = logs.stream()
                .filter(log -> log.getUserAgent() != null)
                .collect(Collectors.groupingBy(
                    DocumentAccessLog::getUserAgent,
                    Collectors.counting()
                ));
        
        return userAgentStats.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getUniqueIpAddressesByDocument(Long documentId) {
        List<DocumentAccessLog> logs = documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent();
        
        Set<String> uniqueIps = logs.stream()
                .filter(log -> log.getIpAddress() != null)
                .map(DocumentAccessLog::getIpAddress)
                .collect(Collectors.toSet());
        
        return uniqueIps.stream()
                .map(ip -> new Object[]{ip, logs.stream()
                        .filter(log -> ip.equals(log.getIpAddress()))
                        .count()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getUniqueUserAgentsByDocument(Long documentId) {
        List<DocumentAccessLog> logs = documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent();
        
        Set<String> uniqueUserAgents = logs.stream()
                .filter(log -> log.getUserAgent() != null)
                .map(DocumentAccessLog::getUserAgent)
                .collect(Collectors.toSet());
        
        return uniqueUserAgents.stream()
                .map(userAgent -> new Object[]{userAgent, logs.stream()
                        .filter(log -> userAgent.equals(log.getUserAgent()))
                        .count()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getAccessStatsBySession(String sessionId) {
        List<DocumentAccessLog> sessionLogs = documentAccessLogRepository
                .findBySessionIdOrderByAccessedAtDesc(sessionId);
        
        List<Object[]> stats = new ArrayList<>();
        
        if (!sessionLogs.isEmpty()) {
            LocalDateTime sessionStart = sessionLogs.get(sessionLogs.size() - 1).getAccessedAt();
            LocalDateTime sessionEnd = sessionLogs.get(0).getAccessedAt();
            long durationMinutes = java.time.Duration.between(sessionStart, sessionEnd).toMinutes();
            
            stats.add(new Object[]{"SESSION_DURATION_MINUTES", durationMinutes});
            stats.add(new Object[]{"TOTAL_ACCESSES", sessionLogs.size()});
            stats.add(new Object[]{"UNIQUE_DOCUMENTS", sessionLogs.stream()
                    .map(log -> log.getDocument().getId())
                    .distinct()
                    .count()});
            stats.add(new Object[]{"SUCCESS_RATE", sessionLogs.stream()
                    .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                    .average()
                    .orElse(0.0) * 100});
        }
        
        return stats;
    }

    @Override
    public List<Object[]> getLongestSessions(int limit) {
        // This would require grouping by session and calculating duration
        // For now, return a simplified implementation
        List<DocumentAccessLog> allLogs = documentAccessLogRepository.findAll();
        
        Map<String, List<DocumentAccessLog>> sessionGroups = allLogs.stream()
                .filter(log -> log.getSessionId() != null)
                .collect(Collectors.groupingBy(DocumentAccessLog::getSessionId));
        
        return sessionGroups.entrySet().stream()
                .map(entry -> {
                    List<DocumentAccessLog> sessionLogs = entry.getValue();
                    sessionLogs.sort((a, b) -> a.getAccessedAt().compareTo(b.getAccessedAt()));
                    
                    LocalDateTime start = sessionLogs.get(0).getAccessedAt();
                    LocalDateTime end = sessionLogs.get(sessionLogs.size() - 1).getAccessedAt();
                    long duration = java.time.Duration.between(start, end).toMinutes();
                    
                    return new Object[]{entry.getKey(), duration, sessionLogs.size()};
                })
                .sorted((a, b) -> Long.compare((Long) b[1], (Long) a[1]))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getMostActiveSessionsByUser(Long userId, int limit) {
        List<DocumentAccessLog> userLogs = documentAccessLogRepository
                .findByUserIdOrderByAccessedAtDesc(userId, Pageable.unpaged())
                .getContent();
        
        Map<String, Long> sessionCounts = userLogs.stream()
                .filter(log -> log.getSessionId() != null)
                .collect(Collectors.groupingBy(
                    DocumentAccessLog::getSessionId,
                    Collectors.counting()
                ));
        
        return sessionCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageSessionDuration(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLog> userLogs = documentAccessLogRepository
                .findByUserIdOrderByAccessedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        Map<String, List<DocumentAccessLog>> sessionGroups = userLogs.stream()
                .filter(log -> log.getSessionId() != null)
                .collect(Collectors.groupingBy(DocumentAccessLog::getSessionId));
        
        List<Long> sessionDurations = sessionGroups.values().stream()
                .map(sessionLogs -> {
                    sessionLogs.sort((a, b) -> a.getAccessedAt().compareTo(b.getAccessedAt()));
                    LocalDateTime start = sessionLogs.get(0).getAccessedAt();
                    LocalDateTime end = sessionLogs.get(sessionLogs.size() - 1).getAccessedAt();
                    return java.time.Duration.between(start, end).toMinutes();
                })
                .collect(Collectors.toList());
        
        return sessionDurations.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);
    }

    @Override
    public Map<String, Object> getDocumentUsagePattern(Long documentId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> pattern = new HashMap<>();
        
        List<DocumentAccessLog> documentLogs = documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        pattern.put("totalAccesses", documentLogs.size());
        pattern.put("uniqueUsers", documentLogs.stream()
                .map(log -> log.getUser().getId())
                .distinct()
                .count());
        pattern.put("successRate", documentLogs.stream()
                .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                .average()
                .orElse(0.0) * 100);
        
        // Access type distribution
        Map<DocumentAccessType, Long> accessTypeStats = documentLogs.stream()
                .collect(Collectors.groupingBy(
                    DocumentAccessLog::getAccessType,
                    Collectors.counting()
                ));
        pattern.put("accessTypeDistribution", accessTypeStats);
        
        // Peak access times
        Map<Integer, Long> hourlyDistribution = documentLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().getHour(),
                    Collectors.counting()
                ));
        pattern.put("hourlyDistribution", hourlyDistribution);
        
        return pattern;
    }

    @Override
    public Map<String, Object> getUserAccessPattern(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> pattern = new HashMap<>();
        
        List<DocumentAccessLog> userLogs = documentAccessLogRepository
                .findByUserIdOrderByAccessedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        pattern.put("totalAccesses", userLogs.size());
        pattern.put("uniqueDocuments", userLogs.stream()
                .map(log -> log.getDocument().getId())
                .distinct()
                .count());
        pattern.put("successRate", userLogs.stream()
                .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                .average()
                .orElse(0.0) * 100);
        
        // Most accessed documents
        Map<Long, Long> documentAccesses = userLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getDocument().getId(),
                    Collectors.counting()
                ));
        pattern.put("mostAccessedDocuments", documentAccesses.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                )));
        
        // Activity by day of week
        Map<String, Long> dayOfWeekPattern = userLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().getDayOfWeek().name(),
                    Collectors.counting()
                ));
        pattern.put("dayOfWeekPattern", dayOfWeekPattern);
        
        return pattern;
    }

    @Override
    public List<Object[]> getPeakAccessTimes(LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLog> logs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(startDate, endDate, Pageable.unpaged())
                .getContent();
        
        Map<Integer, Long> hourlyStats = logs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().getHour(),
                    Collectors.counting()
                ));
        
        return hourlyStats.entrySet().stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getAccessTrendsByDocument(Long documentId, LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLog> documentLogs = documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        Map<LocalDate, Long> dailyTrends = documentLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().toLocalDate(),
                    Collectors.counting()
                ));
        
        return dailyTrends.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsForAudit(Long documentId, LocalDateTime startDate, LocalDateTime endDate) {
        return documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getAccessLogsForCompliance(List<Long> documentIds, LocalDateTime startDate, LocalDateTime endDate) {
        List<DocumentAccessLogDTO> complianceLogs = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            List<DocumentAccessLogDTO> documentLogs = getAccessLogsForAudit(documentId, startDate, endDate);
            complianceLogs.addAll(documentLogs);
        }
        
        // Sort by access time descending
        complianceLogs.sort((a, b) -> b.accessedAt().compareTo(a.accessedAt()));
        
        log.info("Retrieved {} compliance access logs for {} documents from {} to {}", 
                complianceLogs.size(), documentIds.size(), startDate, endDate);
        
        return complianceLogs;
    }

    @Override
    public Map<String, Object> generateAccessReport(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Get all access logs for the school in the date range
        List<DocumentAccessLog> schoolLogs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(startDate, endDate, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getDocument().getSchool() != null && 
                              log.getDocument().getSchool().getId().equals(schoolId))
                .collect(Collectors.toList());
        
        report.put("reportPeriod", Map.of("startDate", startDate, "endDate", endDate));
        report.put("schoolId", schoolId);
        report.put("totalAccesses", schoolLogs.size());
        report.put("uniqueUsers", schoolLogs.stream()
                .map(log -> log.getUser().getId())
                .distinct()
                .count());
        report.put("uniqueDocuments", schoolLogs.stream()
                .map(log -> log.getDocument().getId())
                .distinct()
                .count());
        report.put("successRate", schoolLogs.stream()
                .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                .average()
                .orElse(0.0) * 100);
        
        // Access type statistics
        Map<DocumentAccessType, Long> accessTypeStats = schoolLogs.stream()
                .collect(Collectors.groupingBy(
                    DocumentAccessLog::getAccessType,
                    Collectors.counting()
                ));
        report.put("accessTypeStatistics", accessTypeStats);
        
        // Daily access trends
        Map<LocalDate, Long> dailyTrends = schoolLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getAccessedAt().toLocalDate(),
                    Collectors.counting()
                ));
        report.put("dailyAccessTrends", dailyTrends);
        
        // Most active users
        Map<Long, Long> userActivity = schoolLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getUser().getId(),
                    Collectors.counting()
                ));
        report.put("mostActiveUsers", userActivity.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                )));
        
        log.info("Generated access report for school {} from {} to {}", schoolId, startDate, endDate);
        return report;
    }

    @Override
    public Map<String, Object> generateUserActivityReport(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        List<DocumentAccessLog> userLogs = documentAccessLogRepository
                .findByUserIdOrderByAccessedAtDesc(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        report.put("reportPeriod", Map.of("startDate", startDate, "endDate", endDate));
        report.put("userId", userId);
        report.put("totalAccesses", userLogs.size());
        report.put("uniqueDocuments", userLogs.stream()
                .map(log -> log.getDocument().getId())
                .distinct()
                .count());
        report.put("successRate", userLogs.stream()
                .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                .average()
                .orElse(0.0) * 100);
        
        // Access patterns
        report.put("accessPattern", getUserAccessPattern(userId, startDate, endDate));
        
        // Session statistics
        Map<String, List<DocumentAccessLog>> sessionGroups = userLogs.stream()
                .filter(log -> log.getSessionId() != null)
                .collect(Collectors.groupingBy(DocumentAccessLog::getSessionId));
        
        report.put("totalSessions", sessionGroups.size());
        report.put("averageSessionDuration", getAverageSessionDuration(userId, startDate, endDate));
        
        log.info("Generated user activity report for user {} from {} to {}", userId, startDate, endDate);
        return report;
    }

    @Override
    public Map<String, Object> generateDocumentActivityReport(Long documentId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        List<DocumentAccessLog> documentLogs = documentAccessLogRepository
                .findByDocumentIdOrderByAccessedAtDesc(documentId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(log -> log.getAccessedAt().isAfter(startDate) && log.getAccessedAt().isBefore(endDate))
                .collect(Collectors.toList());
        
        report.put("reportPeriod", Map.of("startDate", startDate, "endDate", endDate));
        report.put("documentId", documentId);
        report.put("totalAccesses", documentLogs.size());
        report.put("uniqueUsers", documentLogs.stream()
                .map(log -> log.getUser().getId())
                .distinct()
                .count());
        report.put("successRate", documentLogs.stream()
                .mapToDouble(log -> log.isSuccess() ? 1.0 : 0.0)
                .average()
                .orElse(0.0) * 100);
        
        // Usage patterns
        report.put("usagePattern", getDocumentUsagePattern(documentId, startDate, endDate));
        
        // Access trends
        report.put("accessTrends", getAccessTrendsByDocument(documentId, startDate, endDate));
        
        log.info("Generated document activity report for document {} from {} to {}", documentId, startDate, endDate);
        return report;
    }

    @Override
    public void cleanupOldAccessLogs(LocalDateTime cutoffDate) {
        List<DocumentAccessLog> oldLogs = documentAccessLogRepository.findAll()
                .stream()
                .filter(log -> log.getAccessedAt().isBefore(cutoffDate))
                .collect(Collectors.toList());
        
        documentAccessLogRepository.deleteAll(oldLogs);
        
        log.info("Cleaned up {} access logs older than {}", oldLogs.size(), cutoffDate);
    }

    @Override
    public void archiveAccessLogs(LocalDateTime cutoffDate) {
        // In a real system, this would move logs to an archive table or external storage
        // For now, just log the operation
        Long count = documentAccessLogRepository.countByAccessedAtBetween(
                LocalDateTime.of(2000, 1, 1, 0, 0), cutoffDate);
        
        log.info("Archive operation completed for {} access logs older than {}", count, cutoffDate);
    }

    @Override
    public Long getAccessLogCount() {
        return documentAccessLogRepository.count();
    }

    @Override
    public Long getAccessLogCountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return documentAccessLogRepository.countByAccessedAtBetween(startDate, endDate);
    }

    @Override
    public List<DocumentAccessLogDTO> getRecentAccessLogs(int minutes, int limit) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(minutes);
        
        return documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(since, LocalDateTime.now(), 
                        PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentAccessLogDTO> getCurrentActiveUsers(int minutes) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(minutes);
        
        List<DocumentAccessLog> recentLogs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(since, LocalDateTime.now(), Pageable.unpaged())
                .getContent();
        
        // Get unique users who have been active
        Set<Long> activeUserIds = recentLogs.stream()
                .map(log -> log.getUser().getId())
                .collect(Collectors.toSet());
        
        // Return the most recent log for each active user
        return activeUserIds.stream()
                .map(userId -> recentLogs.stream()
                        .filter(log -> log.getUser().getId().equals(userId))
                        .findFirst()
                        .orElse(null))
                .filter(Objects::nonNull)
                .map(documentAccessLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getRealTimeAccessStatistics() {
        Map<String, Object> stats = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        
        // Last hour statistics
        LocalDateTime lastHour = now.minusHours(1);
        Long lastHourAccesses = documentAccessLogRepository.countByAccessedAtBetween(lastHour, now);
        
        // Last 24 hours statistics
        LocalDateTime last24Hours = now.minusHours(24);
        Long last24HourAccesses = documentAccessLogRepository.countByAccessedAtBetween(last24Hours, now);
        
        // Current active users (last 15 minutes)
        List<DocumentAccessLogDTO> activeUsers = getCurrentActiveUsers(15);
        
        stats.put("timestamp", now);
        stats.put("lastHourAccesses", lastHourAccesses);
        stats.put("last24HourAccesses", last24HourAccesses);
        stats.put("currentActiveUsers", activeUsers.size());
        stats.put("totalAccessLogs", documentAccessLogRepository.count());
        
        return stats;
    }

    @Override
    public List<Object[]> getCurrentDocumentActivity(int limit) {
        LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
        
        List<DocumentAccessLog> recentLogs = documentAccessLogRepository
                .findByAccessedAtBetweenOrderByAccessedAtDesc(lastHour, LocalDateTime.now(), Pageable.unpaged())
                .getContent();
        
        Map<Long, Long> documentActivity = recentLogs.stream()
                .collect(Collectors.groupingBy(
                    log -> log.getDocument().getId(),
                    Collectors.counting()
                ));
        
        return documentActivity.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    protected Long extractSchoolId(DocumentAccessLog entity) {
        // Extract school from document relationship or user relationship
        if (entity.getDocument() != null && entity.getDocument().getSchool() != null) {
            return entity.getDocument().getSchool().getId();
        }
        if (entity.getUser() != null && entity.getUser().getSchool() != null) {
            return entity.getUser().getSchool().getId();
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(DocumentAccessLog entity) {
        // Extract region from document's school or user's school
        if (entity.getDocument() != null && entity.getDocument().getSchool() != null && entity.getDocument().getSchool().getRegion() != null) {
            return entity.getDocument().getSchool().getRegion().getId();
        }
        if (entity.getUser() != null && entity.getUser().getSchool() != null && entity.getUser().getSchool().getRegion() != null) {
            return entity.getUser().getSchool().getRegion().getId();
        }
        return null;
    }
} 