package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.entity.BaseEntity;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.service.BaseService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Transactional
public abstract class BaseServiceImpl<E extends BaseEntity, D, ID> implements BaseService<D, ID> {

    protected final JpaRepository<E, ID> repository;

    protected BaseServiceImpl(JpaRepository<E, ID> repository) {
        this.repository = repository;
    }

    protected abstract E mapToEntity(D dto);
    protected abstract D mapToDto(E entity);
    protected abstract void updateEntity(E entity, D dto);

    @Override
    public D create(D dto) {
        E entity = mapToEntity(dto);
        beforeCreate(entity);
        E savedEntity = repository.save(entity);
        return mapToDto(savedEntity);
    }

    protected void beforeCreate(E entity) {
        // Hook method for subclasses to override
        entity.setCreatedAt(LocalDateTime.now());
        entity.setModifiedAt(LocalDateTime.now());
    }

    @Override
    public D getById(ID id) {
        return mapToDto(repository.findById(id)
            .orElseThrow(() -> notFoundException((Long) id)));
    }

    @Override
    public D findById(ID id) {
        E entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return mapToDto(entity);
    }

    @Override
    public List<D> getAll() {
        return repository.findAll().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public Page<D> getAll(Pageable pageable) {
        return repository.findAll(pageable)
            .map(this::mapToDto);
    }

    @Override
    @Transactional
    public D update(ID id, D dto) {
        E entity = repository.findById(id)
            .orElseThrow(() -> notFoundException((Long) id));
        
        updateEntity(entity, dto);
        entity.setModifiedAt(LocalDateTime.now());
        
        E savedEntity = repository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public void delete(ID id) {
        if (!repository.existsById(id)) {
            throw notFoundException((Long) id);
        }
        repository.deleteById(id);
    }

    protected RuntimeException notFoundException(Long id) {
        return new ResourceNotFoundException("Resource not found with id: " + id);
    }
} 