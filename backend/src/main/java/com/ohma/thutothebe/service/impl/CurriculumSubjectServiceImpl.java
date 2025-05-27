package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumSubjectDTO;
import com.ohma.thutothebe.entity.CurriculumSubject;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CurriculumSubjectMapper;
import com.ohma.thutothebe.repository.CurriculumSubjectRepository;
import com.ohma.thutothebe.service.CurriculumSubjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumSubjectServiceImpl extends BaseServiceImpl<CurriculumSubject, CurriculumSubjectDTO, Long> implements CurriculumSubjectService {

    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final CurriculumSubjectMapper curriculumSubjectMapper;

    @Autowired
    public CurriculumSubjectServiceImpl(
            CurriculumSubjectRepository curriculumSubjectRepository,
            CurriculumSubjectMapper curriculumSubjectMapper) {
        super(curriculumSubjectRepository);
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.curriculumSubjectMapper = curriculumSubjectMapper;
    }

    @Override
    protected CurriculumSubject mapToEntity(CurriculumSubjectDTO dto) {
        return curriculumSubjectMapper.toEntity(dto);
    }

    @Override
    protected CurriculumSubjectDTO mapToDto(CurriculumSubject entity) {
        return curriculumSubjectMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumSubject entity, CurriculumSubjectDTO dto) {
        entity.setCore(dto.isCore());
        entity.setAllocatedHours(dto.allocatedHours());
        entity.setWeightPercentage(dto.weightPercentage());
        entity.setObjectives(dto.objectives());
        entity.setActive(dto.active());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumSubjectDTO> findByCurriculumId(Long curriculumId) {
        return curriculumSubjectRepository.findByCurriculumId(curriculumId).stream()
            .map(curriculumSubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumSubjectDTO> findBySubjectId(Long subjectId) {
        return curriculumSubjectRepository.findBySubjectId(subjectId).stream()
            .map(curriculumSubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CurriculumSubjectDTO findByCurriculumIdAndSubjectId(Long curriculumId, Long subjectId) {
        CurriculumSubject curriculumSubject = curriculumSubjectRepository.findByCurriculumIdAndSubjectId(curriculumId, subjectId)
            .orElseThrow(() -> new ResourceNotFoundException("CurriculumSubject not found for curriculum: " + curriculumId + " and subject: " + subjectId));
        return curriculumSubjectMapper.toDto(curriculumSubject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumSubjectDTO> findByCurriculumIdAndIsCore(Long curriculumId, boolean isCore) {
        return curriculumSubjectRepository.findByCurriculumIdAndIsCore(curriculumId, isCore).stream()
            .map(curriculumSubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumSubjectDTO> findAllCoreSubjects() {
        return curriculumSubjectRepository.findAllCoreSubjects().stream()
            .map(curriculumSubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumSubjectDTO> findAllElectiveSubjects() {
        return curriculumSubjectRepository.findAllElectiveSubjects().stream()
            .map(curriculumSubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getTotalAllocatedHoursByCurriculumId(Long curriculumId) {
        return curriculumSubjectRepository.getTotalAllocatedHoursByCurriculumId(curriculumId);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getTotalWeightPercentageByCurriculumId(Long curriculumId) {
        return curriculumSubjectRepository.getTotalWeightPercentageByCurriculumId(curriculumId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCurriculumIdAndSubjectId(Long curriculumId, Long subjectId) {
        return curriculumSubjectRepository.existsByCurriculumIdAndSubjectId(curriculumId, subjectId);
    }
} 