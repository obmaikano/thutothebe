package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.entity.Student;
import org.springframework.stereotype.Component;

@Component
public interface StudentMapper extends BaseDtoMapper<Student, StudentDTO> {
} 