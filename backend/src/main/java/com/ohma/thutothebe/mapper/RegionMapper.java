package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.Region;

public interface RegionMapper extends BaseDtoMapper<Region, RegionDTO> {
    void updateEntityFromDto(RegionDTO dto, Region entity);
} 