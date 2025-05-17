package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SubjectDTO;

import java.util.List;

public interface SubjectService extends BaseService<SubjectDTO, Long> {
    
    SubjectDTO getSubjectByCode(String code);
    
    List<SubjectDTO> getActiveSubjects();
    
    SubjectDTO createSubject(SubjectDTO subjectDTO);
    
    SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO);
    
    void deleteSubject(Long id);
    
    void activateSubject(Long id);
    
    void deactivateSubject(Long id);
    
    boolean existsByCode(String code);
} 