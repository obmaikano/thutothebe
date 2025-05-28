package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.entity.Document;
import org.springframework.stereotype.Component;

@Component
public interface DocumentMapper extends BaseDtoMapper<Document, DocumentDTO> {
    
    /**
     * Maps Document entity to DocumentDTO with all related entities
     * @param document The document entity to map
     * @return The mapped DocumentDTO
     */
    @Override
    DocumentDTO toDto(Document document);
    
    /**
     * Maps DocumentDTO to Document entity
     * @param documentDTO The DocumentDTO to map
     * @return The mapped Document entity
     */
    @Override
    Document toEntity(DocumentDTO documentDTO);
    
    /**
     * Maps Document entity to DocumentDTO with minimal information (for lists)
     * @param document The document entity to map
     * @return The mapped DocumentDTO with minimal information
     */
    DocumentDTO toDtoMinimal(Document document);
    
    /**
     * Maps Document entity to DocumentDTO without child documents and access logs (to avoid circular references)
     * @param document The document entity to map
     * @return The mapped DocumentDTO without circular references
     */
    DocumentDTO toDtoWithoutCircularReferences(Document document);
    
    /**
     * Updates an existing Document entity with data from DocumentDTO
     * @param document The existing document entity to update
     * @param documentDTO The DocumentDTO containing updated data
     */
    void updateEntityFromDto(Document document, DocumentDTO documentDTO);
} 