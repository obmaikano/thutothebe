package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.mapper.RegionMapper;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.service.RegionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegionServiceImpl extends BaseServiceImpl<Region, RegionDTO, Long> implements RegionService {

    private final RegionRepository regionRepository;
    private final RegionMapper regionMapper;

    @Autowired
    public RegionServiceImpl(RegionRepository regionRepository, RegionMapper regionMapper) {
        super(regionRepository);
        this.regionRepository = regionRepository;
        this.regionMapper = regionMapper;
    }

    @Override
    protected Region mapToEntity(RegionDTO dto) {
        return regionMapper.toEntity(dto);
    }

    @Override
    protected RegionDTO mapToDto(Region entity) {
        return regionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Region entity, RegionDTO dto) {
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
    }

    @Override
    @Transactional(readOnly = true)
    public RegionDTO getRegionByCode(String code) {
        return regionRepository.findByCode(code)
            .map(regionMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Region not found with code: " + code));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegionDTO> getActiveRegions() {
        return regionRepository.findByActive(true).stream()
            .map(regionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RegionDTO create(RegionDTO regionDTO) {
        if (regionRepository.existsByCode(regionDTO.code())) {
            throw new IllegalArgumentException("Region with code " + regionDTO.code() + " already exists");
        }

        if (regionRepository.existsByName(regionDTO.name())) {
            throw new IllegalArgumentException("Region with name " + regionDTO.name() + " already exists");
        }

        Region region = regionMapper.toEntity(regionDTO);
        region.setActive(true);
        beforeCreate(region);
        region = regionRepository.save(region);
        return mapToDto(region);
    }

    @Override
    @Transactional
    public RegionDTO update(Long id, RegionDTO regionDTO) {
        if (!regionRepository.existsById(id)) {
            throw new EntityNotFoundException("Region not found with id: " + id);
        }
        if (regionRepository.existsByCode(regionDTO.code())) {
            throw new IllegalArgumentException("Region with code " + regionDTO.code() + " already exists");
        }

        Region region = regionRepository.findById(id)
                .orElseThrow(() -> notFoundException((long) id));

        updateEntity(region, regionDTO);
        region.setVersion(region.getVersion() + 1);

        try {
            region = regionRepository.save(region);
            return mapToDto(region);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new IllegalStateException("The resource was modified by another user. Please refresh and try again.");
        }
    }

    @Override
    @Transactional
    public void deactivateRegion(Long id) {
        Region region = regionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Region not found with id: " + id));
        region.setActive(false);
        regionRepository.save(region);
    }

    @Override
    @Transactional
    public void activateRegion(Long id) {
        Region region = regionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Region not found with id: " + id));
        region.setActive(true);
        regionRepository.save(region);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return regionRepository.existsByCode(code);
    }
} 