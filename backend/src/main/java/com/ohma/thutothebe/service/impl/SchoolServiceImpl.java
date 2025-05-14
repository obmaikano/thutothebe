package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.mapper.SchoolMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.service.SchoolService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolServiceImpl extends BaseServiceImpl<School, SchoolDTO, Long> implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final RegionRepository regionRepository;
    private final SchoolMapper schoolMapper;

    @Autowired
    public SchoolServiceImpl(SchoolRepository schoolRepository, RegionRepository regionRepository, SchoolMapper schoolMapper) {
        super(schoolRepository);
        this.schoolRepository = schoolRepository;
        this.regionRepository = regionRepository;
        this.schoolMapper = schoolMapper;
    }

    @Override
    protected School mapToEntity(SchoolDTO dto) {
        return schoolMapper.toEntity(dto);
    }

    @Override
    protected SchoolDTO mapToDto(School entity) {
        return schoolMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(School entity, SchoolDTO dto) {
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
        if (dto.regionId() != null) {
            Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new EntityNotFoundException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolDTO getSchoolByCode(String code) {
        return schoolRepository.findByCode(code)
            .map(schoolMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("School not found with code: " + code));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchoolDTO> getSchoolsByRegionId(Long regionId) {
        return schoolRepository.findByRegionId(regionId).stream()
            .map(schoolMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchoolDTO> getActiveSchoolsByRegionId(Long regionId) {
        return schoolRepository.findByRegionIdAndActive(regionId, true).stream()
            .map(schoolMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SchoolDTO createSchool(SchoolDTO schoolDTO) {
        if (schoolRepository.existsByCode(schoolDTO.code())) {
            throw new IllegalArgumentException("School with code " + schoolDTO.code() + " already exists");
        }
        if (schoolDTO.regionId() != null) {
            Region region = regionRepository.findById(schoolDTO.regionId())
                .orElseThrow(() -> new EntityNotFoundException("Region not found with id: " + schoolDTO.regionId()));
            School school = schoolMapper.toEntity(schoolDTO);
            school.setRegion(region);
            school = schoolRepository.save(school);
            return schoolMapper.toDto(school);
        }
        return create(schoolDTO);
    }

    @Override
    @Transactional
    public SchoolDTO updateSchool(Long id, SchoolDTO schoolDTO) {
        if (!schoolRepository.existsById(id)) {
            throw new EntityNotFoundException("School not found with id: " + id);
        }
        if (schoolRepository.existsByCode(schoolDTO.code())) {
            throw new IllegalArgumentException("School with code " + schoolDTO.code() + " already exists");
        }
        return update(id, schoolDTO);
    }

    @Override
    @Transactional
    public void deleteSchool(Long id) {
        if (!schoolRepository.existsById(id)) {
            throw new EntityNotFoundException("School not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void deactivateSchool(Long id) {
        School school = schoolRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + id));
        school.setActive(false);
        schoolRepository.save(school);
    }

    @Override
    @Transactional
    public void activateSchool(Long id) {
        School school = schoolRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + id));
        school.setActive(true);
        schoolRepository.save(school);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return schoolRepository.existsByCode(code);
    }
} 