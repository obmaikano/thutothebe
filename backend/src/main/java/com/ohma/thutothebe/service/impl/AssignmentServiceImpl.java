package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.AssignmentNotFoundException;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.mapper.AssignmentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.AssignmentRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl extends BaseServiceImpl<Assignment, AssignmentDTO, Long> implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentMapper assignmentMapper;
    private final CourseService courseService;
    private final UserService userService;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final UserMapper userMapper;

    @Autowired
    public AssignmentServiceImpl(AssignmentRepository assignmentRepository, AssignmentMapper assignmentMapper,
                                 CourseService courseService, UserService userService, CourseRepository courseRepository,
                                 UserMapper userMapper, CourseMapper courseMapper) {
        super(assignmentRepository);
        this.assignmentRepository = assignmentRepository;
        this.assignmentMapper = assignmentMapper;
        this.courseService = courseService;
        this.userService = userService;
        this.courseRepository = courseRepository;
        this.userMapper = userMapper;
        this.courseMapper = courseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentDTO getById(Long id) {
        return assignmentRepository.findById(id)
            .map(assignmentMapper::toDto)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAll() {
        return assignmentRepository.findAll().stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    protected Assignment mapToEntity(AssignmentDTO dto) {
        return assignmentMapper.toEntity(dto);
    }

    @Override
    protected AssignmentDTO mapToDto(Assignment entity) {
        return assignmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Assignment entity, AssignmentDTO dto) {

    }

    @Override
    @Transactional
    public AssignmentDTO create(AssignmentDTO dto) {
        Assignment assignment = assignmentMapper.toEntity(dto);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public AssignmentDTO update(Long id, AssignmentDTO dto) {
        Assignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found with id: " + id));
        assignment = assignmentMapper.toEntity(dto);
        assignment.setId(id);
        assignment = assignmentRepository.save(assignment);
        return assignmentMapper.toDto(assignment);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new AssignmentNotFoundException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return assignmentRepository.findByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getByStatus(AssignmentStatus status) {
        return assignmentRepository.findByStatus(status).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActive() {
        return assignmentRepository.findByActive(true).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDTO> getActiveByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return assignmentRepository.findActiveByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    public AssignmentDTO getAssignmentByCode(String code) {
        Assignment assignment = assignmentRepository.findByCode(code)
            .orElseThrow(() -> AssignmentNotFoundException.withCode(code));
        return assignmentMapper.toDto(assignment);
    }

    public List<AssignmentDTO> getAssignmentsByCourse(Course course) {
        return assignmentRepository.findByCourse(course).stream()
            .map(assignmentMapper::toDto)
            .collect(Collectors.toList());
    }

    public boolean existsByCode(String code) {
        return assignmentRepository.existsByCode(code);
    }

    protected RuntimeException notFoundException(Long id) {
        return AssignmentNotFoundException.withId(id);
    }
} 