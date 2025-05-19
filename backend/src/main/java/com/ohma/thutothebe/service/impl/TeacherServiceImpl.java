package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl extends BaseServiceImpl<Teacher, TeacherDTO, Long> implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final TeacherMapper teacherMapper;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    @Autowired
    public TeacherServiceImpl(
            TeacherRepository teacherRepository,
            CourseInstructorRepository courseInstructorRepository,
            TeacherMapper teacherMapper,
            SchoolRepository schoolRepository,
            UserRepository userRepository) {
        super(teacherRepository);
        this.teacherRepository = teacherRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.teacherMapper = teacherMapper;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected Teacher mapToEntity(TeacherDTO dto) {
        return teacherMapper.toEntity(dto);
    }

    @Override
    protected TeacherDTO mapToDto(Teacher entity) {
        return teacherMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Teacher entity, TeacherDTO dto) {
        entity.setStaffId(dto.staffId());
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setEmail(dto.email());
        entity.setQualification(dto.qualification());
        entity.setActive(dto.active());
        
        if (dto.schoolId() != null && (entity.getSchool() == null || !entity.getSchool().getId().equals(dto.schoolId()))) {
            schoolRepository.findById(dto.schoolId())
                .ifPresent(entity::setSchool);
        }
        
        if (dto.userId() != null && (entity.getUser() == null || !entity.getUser().getId().equals(dto.userId()))) {
            userRepository.findById(dto.userId())
                .ifPresent(entity::setUser);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByStaffId(String staffId) {
        return teacherRepository.findByStaffId(staffId)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with staff ID: " + staffId));
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByEmail(String email) {
        return teacherRepository.findByEmail(email)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getActiveTeachers() {
        return teacherRepository.findByActive(true).stream()
            .map(teacherMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        if (teacherRepository.existsByStaffId(teacherDTO.staffId())) {
            throw new IllegalArgumentException("Teacher with staff ID " + teacherDTO.staffId() + " already exists");
        }
        
        if (teacherRepository.existsByEmail(teacherDTO.email())) {
            throw new IllegalArgumentException("Teacher with email " + teacherDTO.email() + " already exists");
        }
        
        return create(teacherDTO);
    }

    @Override
    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO) {
        var existingTeacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        
        // Check if the staff ID exists but belongs to a different teacher
        if (!existingTeacher.getStaffId().equals(teacherDTO.staffId()) && 
            teacherRepository.existsByStaffId(teacherDTO.staffId())) {
            throw new IllegalArgumentException("Teacher with staff ID " + teacherDTO.staffId() + " already exists");
        }
        
        // Check if the email exists but belongs to a different teacher
        if (!existingTeacher.getEmail().equals(teacherDTO.email()) && 
            teacherRepository.existsByEmail(teacherDTO.email())) {
            throw new IllegalArgumentException("Teacher with email " + teacherDTO.email() + " already exists");
        }
        
        return update(id, teacherDTO);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void activateTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(true);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional
    public void deactivateTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setActive(false);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByStaffId(String staffId) {
        return teacherRepository.existsByStaffId(staffId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersByCourseId(Long courseId) {
        return courseInstructorRepository.findByCourseId(courseId).stream()
            .map(ci -> teacherMapper.toDto(ci.getTeacher()))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherByUserId(Long userId) {
        return teacherRepository.findByUser_Id(userId)
            .map(teacherMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with user ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getTeachersBySchoolId(Long schoolId) {
        return teacherRepository.findBySchool_Id(schoolId).stream()
            .map(teacherMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherDTO linkToUser(Long teacherId, Long userId) {
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        teacher.setUser(user);
        Teacher savedTeacher = teacherRepository.save(teacher);
        
        return teacherMapper.toDto(savedTeacher);
    }
} 