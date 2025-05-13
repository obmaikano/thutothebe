package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ThreadDTO;
import com.ohma.thutothebe.entity.Thread;
import com.ohma.thutothebe.mapper.ThreadMapper;
import com.ohma.thutothebe.repository.ThreadRepository;
import com.ohma.thutothebe.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThreadServiceImpl extends BaseServiceImpl<Thread, ThreadDTO, Long> implements ThreadService {
    
    private final ThreadRepository threadRepository;
    private final ThreadMapper threadMapper;
    
    @Autowired
    public ThreadServiceImpl(ThreadRepository repository, ThreadMapper mapper) {
        super(repository);
        this.threadRepository = repository;
        this.threadMapper = mapper;
    }
    
    @Override
    protected Thread mapToEntity(ThreadDTO dto) {
        return threadMapper.toEntity(dto);
    }
    
    @Override
    protected ThreadDTO mapToDto(Thread entity) {
        return threadMapper.toDto(entity);
    }
    
    @Override
    protected void updateEntity(Thread entity, ThreadDTO dto) {
        threadMapper.updateEntityFromDto(dto, entity);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ThreadDTO> findByForumId(Long forumId) {
        return threadRepository.findByForumId(forumId).stream()
            .map(threadMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ThreadDTO> findByForumIdAndActive(Long forumId, boolean active) {
        return threadRepository.findByForumIdAndActive(forumId, active).stream()
            .map(threadMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ThreadDTO> findByAuthorId(Long authorId) {
        return threadRepository.findByAuthorId(authorId).stream()
            .map(threadMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ThreadDTO> findByAuthorIdAndActive(Long authorId, boolean active) {
        return threadRepository.findByAuthorIdAndActive(authorId, active).stream()
            .map(threadMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ThreadDTO findByIdWithComments(Long id) {
        Thread thread = threadRepository.findByIdWithComments(id);
        return thread == null ? null : threadMapper.toDto(thread);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ThreadDTO> findByForumIdWithComments(Long forumId) {
        return threadRepository.findByForumIdWithComments(forumId).stream()
            .map(threadMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ThreadDTO> findByForumIdOrderByPinnedAndLastActivity(Long forumId, Pageable pageable) {
        return threadRepository.findByForumIdOrderByPinnedAndLastActivity(forumId, pageable)
            .map(threadMapper::toDto);
    }
} 