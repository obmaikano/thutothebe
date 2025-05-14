package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.RegionDTO;
import java.util.List;

public interface RegionService extends BaseService<RegionDTO, Long> {
    RegionDTO getRegionByCode(String code);
    List<RegionDTO> getActiveRegions();
    void deactivateRegion(Long id);
    void activateRegion(Long id);
    boolean existsByCode(String code);
} 