package com.ohma.thutothebe.mapper;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Base interface for mapping between entities and DTOs
 * @param <E> Entity type
 * @param <D> DTO type
 */
public interface BaseDtoMapper<E, D> {

    /**
     * Converts an entity to its corresponding DTO
     * @param entity The entity to convert
     * @return The corresponding DTO
     */
    D toDto(E entity);

    /**
     * Converts a DTO to its corresponding entity
     * @param dto The DTO to convert
     * @return The corresponding entity
     */
    E toEntity(D dto);

    /**
     * Converts a list of entities to a list of DTOs
     * @param entities The list of entities to convert
     * @return The list of corresponding DTOs
     */
    default List<D> toDtoList(List<E> entities) {
        return entities.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Converts a list of DTOs to a list of entities
     * @param dtos The list of DTOs to convert
     * @return The list of corresponding entities
     */
    default List<E> toEntityList(List<D> dtos) {
        return dtos.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
} 