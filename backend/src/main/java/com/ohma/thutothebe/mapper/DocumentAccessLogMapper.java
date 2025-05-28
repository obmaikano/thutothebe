package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.DocumentAccessLogDTO;
import com.ohma.thutothebe.entity.DocumentAccessLog;
import org.springframework.stereotype.Component;

@Component
public interface DocumentAccessLogMapper extends BaseDtoMapper<DocumentAccessLog, DocumentAccessLogDTO> {
    
    @Override
    DocumentAccessLogDTO toDto(DocumentAccessLog documentAccessLog);
    
    @Override
    DocumentAccessLog toEntity(DocumentAccessLogDTO documentAccessLogDTO);
    
    DocumentAccessLogDTO toDtoMinimal(DocumentAccessLog documentAccessLog);
    
    void updateEntityFromDto(DocumentAccessLog documentAccessLog, DocumentAccessLogDTO documentAccessLogDTO);
} 