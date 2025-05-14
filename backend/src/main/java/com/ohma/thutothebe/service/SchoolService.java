package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SchoolDTO;
import java.util.List;

public interface SchoolService extends BaseService<SchoolDTO, Long> {
    SchoolDTO getSchoolByCode(String code);
    List<SchoolDTO> getSchoolsByRegionId(Long regionId);
    List<SchoolDTO> getActiveSchoolsByRegionId(Long regionId);
    SchoolDTO createSchool(SchoolDTO schoolDTO);
    SchoolDTO updateSchool(Long id, SchoolDTO schoolDTO);
    void deleteSchool(Long id);
    void deactivateSchool(Long id);
    void activateSchool(Long id);
    boolean existsByCode(String code);
} 