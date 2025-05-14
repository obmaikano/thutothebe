package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.mapper.RegionMapper;
import com.ohma.thutothebe.repository.RegionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegionServiceImplTest {

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private RegionMapper regionMapper;

    @InjectMocks
    private RegionServiceImpl regionService;

    private Region region;
    private RegionDTO regionDTO;

    @BeforeEach
    void setUp() {
        region = new Region();
        region.setId(1L);
        region.setCode("REG001");
        region.setName("Test Region");
        region.setDescription("Test Description");
        region.setActive(true);

        regionDTO = new RegionDTO(
            1L,
            "REG001",
            "Test Region",
            "Test Description",
            true
        );
    }

    @Test
    void getRegionById_ShouldReturnRegion_WhenExists() {
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        RegionDTO result = regionService.getById(1L);

        assertNotNull(result);
        assertEquals(regionDTO, result);
        verify(regionRepository).findById(1L);
        verify(regionMapper).toDto(region);
    }

    @Test
    void getRegionById_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> regionService.getById(1L));
        verify(regionRepository).findById(1L);
        verify(regionMapper, never()).toDto(any());
    }

    @Test
    void getRegionByCode_ShouldReturnRegion_WhenExists() {
        when(regionRepository.findByCode("REG001")).thenReturn(Optional.of(region));
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        RegionDTO result = regionService.getRegionByCode("REG001");

        assertNotNull(result);
        assertEquals(regionDTO, result);
        verify(regionRepository).findByCode("REG001");
        verify(regionMapper).toDto(region);
    }

    @Test
    void getRegionByCode_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findByCode("REG001")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> regionService.getRegionByCode("REG001"));
        verify(regionRepository).findByCode("REG001");
        verify(regionMapper, never()).toDto(any());
    }

    @Test
    void getAllRegions_ShouldReturnAllRegions() {
        List<Region> regions = Arrays.asList(region);
        when(regionRepository.findAll()).thenReturn(regions);
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        List<RegionDTO> result = regionService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(regionDTO, result.get(0));
        verify(regionRepository).findAll();
        verify(regionMapper).toDto(region);
    }

    @Test
    void getActiveRegions_ShouldReturnActiveRegions() {
        List<Region> regions = Arrays.asList(region);
        when(regionRepository.findByActive(true)).thenReturn(regions);
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        List<RegionDTO> result = regionService.getActiveRegions();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(regionDTO, result.get(0));
        verify(regionRepository).findByActive(true);
        verify(regionMapper).toDto(region);
    }

    @Test
    void createRegion_ShouldCreateNewRegion() {
        when(regionRepository.existsByCode("REG001")).thenReturn(false);
        when(regionMapper.toEntity(regionDTO)).thenReturn(region);
        when(regionRepository.save(region)).thenReturn(region);
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        RegionDTO result = regionService.create(regionDTO);

        assertNotNull(result);
        assertEquals(regionDTO, result);
        verify(regionRepository).existsByCode("REG001");
        verify(regionMapper).toEntity(regionDTO);
        verify(regionRepository).save(region);
        verify(regionMapper).toDto(region);
    }

    @Test
    void createRegion_ShouldThrowException_WhenCodeExists() {
        when(regionRepository.existsByCode("REG001")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> regionService.create(regionDTO));
        verify(regionRepository).existsByCode("REG001");
        verify(regionMapper, never()).toEntity(any());
        verify(regionRepository, never()).save(any());
    }

    @Test
    void updateRegion_ShouldUpdateExistingRegion() {
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionRepository.existsByCode("REG001")).thenReturn(false);
        when(regionRepository.save(any(Region.class))).thenReturn(region);
        when(regionMapper.toDto(region)).thenReturn(regionDTO);

        RegionDTO result = regionService.update(1L, regionDTO);

        assertNotNull(result);
        assertEquals(regionDTO, result);
        verify(regionRepository).findById(1L);
        verify(regionRepository).existsByCode("REG001");
        verify(regionRepository).save(any(Region.class));
        verify(regionMapper).toDto(region);
    }

    @Test
    void updateRegion_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> regionService.update(1L, regionDTO));
        verify(regionRepository).findById(1L);
        verify(regionRepository, never()).save(any());
    }

    @Test
    void deleteRegion_ShouldDeleteRegion() {
        when(regionRepository.existsById(1L)).thenReturn(true);

        regionService.delete(1L);

        verify(regionRepository).existsById(1L);
        verify(regionRepository).deleteById(1L);
    }

    @Test
    void deleteRegion_ShouldThrowException_WhenNotFound() {
        when(regionRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> regionService.delete(1L));
        verify(regionRepository).existsById(1L);
        verify(regionRepository, never()).deleteById(any());
    }

    @Test
    void deactivateRegion_ShouldDeactivateRegion() {
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionRepository.save(region)).thenReturn(region);

        regionService.deactivateRegion(1L);

        assertFalse(region.isActive());
        verify(regionRepository).findById(1L);
        verify(regionRepository).save(region);
    }

    @Test
    void activateRegion_ShouldActivateRegion() {
        region.setActive(false);
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionRepository.save(region)).thenReturn(region);

        regionService.activateRegion(1L);

        assertTrue(region.isActive());
        verify(regionRepository).findById(1L);
        verify(regionRepository).save(region);
    }

    @Test
    void existsByCode_ShouldReturnTrue_WhenCodeExists() {
        when(regionRepository.existsByCode("REG001")).thenReturn(true);

        boolean result = regionService.existsByCode("REG001");

        assertTrue(result);
        verify(regionRepository).existsByCode("REG001");
    }

    @Test
    void existsByCode_ShouldReturnFalse_WhenCodeDoesNotExist() {
        when(regionRepository.existsByCode("REG001")).thenReturn(false);

        boolean result = regionService.existsByCode("REG001");

        assertFalse(result);
        verify(regionRepository).existsByCode("REG001");
    }
} 