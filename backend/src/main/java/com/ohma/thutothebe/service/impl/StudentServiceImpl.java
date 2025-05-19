package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl extends BaseServiceImpl<Student, StudentDTO, Long> implements StudentService {

    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;

    @Autowired
    public StudentServiceImpl(
            StudentRepository studentRepository,
            SchoolRepository schoolRepository,
            UserRepository userRepository,
            StudentMapper studentMapper) {
        super(studentRepository);
        this.studentRepository = studentRepository;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.studentMapper = studentMapper;
    }

    @Override
    protected Student mapToEntity(StudentDTO dto) {
        return studentMapper.toEntity(dto);
    }

    @Override
    protected StudentDTO mapToDto(Student entity) {
        return studentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Student entity, StudentDTO dto) {
        entity.setStudentId(dto.studentId());
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setEmail(dto.email());
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
    public StudentDTO getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with student ID: " + studentId));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByUserId(Long userId) {
        return studentRepository.findByUser_Id(userId)
            .map(studentMapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with user ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getActiveStudents() {
        return studentRepository.findByActive(true).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsBySchoolId(Long schoolId) {
        return studentRepository.findBySchool_Id(schoolId).stream()
            .map(studentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.existsByStudentId(studentDTO.studentId())) {
            throw new IllegalArgumentException("Student with student ID " + studentDTO.studentId() + " already exists");
        }
        
        if (studentRepository.existsByEmail(studentDTO.email())) {
            throw new IllegalArgumentException("Student with email " + studentDTO.email() + " already exists");
        }
        
        schoolRepository.findById(studentDTO.schoolId())
            .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + studentDTO.schoolId()));
        
        return create(studentDTO);
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        var existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Check if the student ID exists but belongs to a different student
        if (!existingStudent.getStudentId().equals(studentDTO.studentId()) && 
            studentRepository.existsByStudentId(studentDTO.studentId())) {
            throw new IllegalArgumentException("Student with student ID " + studentDTO.studentId() + " already exists");
        }
        
        // Check if the email exists but belongs to a different student
        if (!existingStudent.getEmail().equals(studentDTO.email()) && 
            studentRepository.existsByEmail(studentDTO.email())) {
            throw new IllegalArgumentException("Student with email " + studentDTO.email() + " already exists");
        }
        
        // Verify school exists
        schoolRepository.findById(studentDTO.schoolId())
            .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + studentDTO.schoolId()));
        
        return update(id, studentDTO);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void activateStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setActive(true);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void deactivateStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setActive(false);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByStudentId(String studentId) {
        return studentRepository.existsByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public StudentDTO linkToUser(Long studentId, Long userId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        student.setUser(user);
        Student savedStudent = studentRepository.save(student);
        
        return studentMapper.toDto(savedStudent);
    }
} 