package com.ohma.thutothebe.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BaseService<D, ID> {
    D findById(ID id);
    D create(D dto);
    D getById(ID id);
    List<D> getAll();
    public Page<D> getAll(Pageable pageable);
    D update(ID id, D dto);
    void delete(ID id);
} 