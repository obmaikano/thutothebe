package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SubjectMapper;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl extends BaseServiceImpl<Subject, SubjectDTO, Long> implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;

    @Autowired
    public SubjectServiceImpl(SubjectRepository subjectRepository, SubjectMapper subjectMapper) {
        super(subjectRepository);
        this.subjectRepository = subjectRepository;
        this.subjectMapper = subjectMapper;
    }

    @Override
    protected Subject mapToEntity(SubjectDTO dto) {
        return subjectMapper.toEntity(dto);
    }

    @Override
    protected SubjectDTO mapToDto(Subject entity) {
        return subjectMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Subject entity, SubjectDTO dto) {
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectDTO getSubjectByCode(String code) {
        return subjectRepository.findByCode(code)
            .map(subjectMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with code: " + code));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDTO> getActiveSubjects() {
        return subjectRepository.findByActive(true).stream()
            .map(subjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectDTO createSubject(SubjectDTO subjectDTO) {
        if (subjectRepository.existsByCode(subjectDTO.code())) {
            throw new IllegalArgumentException("Subject with code " + subjectDTO.code() + " already exists");
        }
        return create(subjectDTO);
    }

    @Override
    @Transactional
    public SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO) {
        var existingSubject = subjectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        
        // Check if the code exists but belongs to a different subject
        if (!existingSubject.getCode().equals(subjectDTO.code()) && 
            subjectRepository.existsByCode(subjectDTO.code())) {
            throw new IllegalArgumentException("Subject with code " + subjectDTO.code() + " already exists");
        }
        
        return update(id, subjectDTO);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void activateSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        subject.setActive(true);
        subjectRepository.save(subject);
    }

    @Override
    @Transactional
    public void deactivateSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        subject.setActive(false);
        subjectRepository.save(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return subjectRepository.existsByCode(code);
    }

    @Override
    protected Long extractSchoolId(Subject entity) {
        return entity.getDepartment() != null && entity.getDepartment().getSchool() != null 
            ? entity.getDepartment().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Subject entity) {
        return entity.getDepartment() != null && entity.getDepartment().getSchool() != null && entity.getDepartment().getSchool().getRegion() != null 
            ? entity.getDepartment().getSchool().getRegion().getId() : null;
    }
} 