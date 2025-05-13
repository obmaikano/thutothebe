package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ForumDTO;
import com.ohma.thutothebe.entity.Forum;
import com.ohma.thutothebe.mapper.ForumMapper;
import com.ohma.thutothebe.repository.ForumRepository;
import com.ohma.thutothebe.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForumServiceImpl extends BaseServiceImpl<Forum, ForumDTO, Long> implements ForumService {
    
    private final ForumRepository forumRepository;
    private final ForumMapper forumMapper;
    
    @Autowired
    public ForumServiceImpl(ForumRepository repository, ForumMapper mapper) {
        super(repository);
        this.forumRepository = repository;
        this.forumMapper = mapper;
    }
    
    @Override
    protected Forum mapToEntity(ForumDTO dto) {
        return forumMapper.toEntity(dto);
    }
    
    @Override
    protected ForumDTO mapToDto(Forum entity) {
        return forumMapper.toDto(entity);
    }
    
    @Override
    protected void updateEntity(Forum entity, ForumDTO dto) {
        forumMapper.updateEntityFromDto(dto, entity);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ForumDTO findByCourseId(Long courseId) {
        List<Forum> forums = forumRepository.findByCourseId(courseId);
        return forums.isEmpty() ? null : forumMapper.toDto(forums.get(0));
    }
    
    @Override
    @Transactional(readOnly = true)
    public ForumDTO findByCourseIdAndActive(Long courseId, boolean active) {
        List<Forum> forums = forumRepository.findByCourseIdAndActive(courseId, active);
        return forums.isEmpty() ? null : forumMapper.toDto(forums.get(0));
    }
    
    @Override
    @Transactional(readOnly = true)
    public ForumDTO findByIdWithThreads(Long id) {
        Forum forum = forumRepository.findByIdWithThreads(id);
        return forum == null ? null : forumMapper.toDto(forum);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ForumDTO findByCourseIdWithThreads(Long courseId) {
        List<Forum> forums = forumRepository.findByCourseIdWithThreads(courseId);
        return forums.isEmpty() ? null : forumMapper.toDto(forums.get(0));
    }
} 