package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.mapper.ClassMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.service.ClassService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl extends BaseServiceImpl<Class, ClassDTO, Long> implements ClassService {

    private final ClassRepository classRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassMapper classMapper;

    @Autowired
    public ClassServiceImpl(ClassRepository classRepository, SchoolRepository schoolRepository, 
                          UserRepository userRepository, StudentRepository studentRepository, TeacherRepository teacherRepository, ClassMapper classMapper) {
        super(classRepository);
        this.classRepository = classRepository;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.classMapper = classMapper;
    }

    @Override
    protected Class mapToEntity(ClassDTO dto) {
        return classMapper.toEntity(dto);
    }

    @Override
    protected ClassDTO mapToDto(Class entity) {
        return classMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Class entity, ClassDTO dto) {
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setGradeLevel(dto.gradeLevel());
        entity.setCapacity(dto.capacity() != null ? dto.capacity() : 30);
        entity.setActive(dto.active());
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolId(Long schoolId) {
        return classRepository.findBySchoolIdWithTeachers(schoolId).stream()
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClasses() {
        return classRepository.findAllWithTeachersAndStudents().stream()
            .filter(Class::isActive)
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClassesBySchoolId(Long schoolId) {
        return classRepository.findBySchoolIdWithTeachers(schoolId).stream()
            .filter(Class::isActive)
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolIdAndTeacherId(Long schoolId, Long teacherId) {
        return classRepository.findBySchoolIdAndTeacherId(schoolId, teacherId).stream()
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesBySchoolIdAndStudentId(Long schoolId, Long studentId) {
        return classRepository.findBySchoolIdAndStudentId(schoolId, studentId).stream()
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getClassesByTeacherId(Long teacherId) {
        return classRepository.findByTeacherId(teacherId).stream()
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getActiveClassesByTeacherId(Long teacherId) {
        return classRepository.findByTeacherId(teacherId).stream()
            .filter(Class::isActive)
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClassDTO createClass(ClassDTO classDTO) {
        School school = schoolRepository.findById(classDTO.schoolId())
            .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + classDTO.schoolId()));
        
        final Class classEntity = classMapper.toEntity(classDTO);
        classEntity.setSchool(school);
        
        // Add teachers
        if (classDTO.teacherIds() != null) {
            classDTO.teacherIds().forEach(teacherId -> {
                Teacher teacher = teacherRepository.findById(teacherId)
                    .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
                classEntity.getTeachers().add(teacher);
            });
        }
        
        // Add students
        if (classDTO.studentIds() != null) {
            classDTO.studentIds().forEach(studentId -> {
                Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));
                classEntity.getStudents().add(student);
            });
        }
        
        return classMapper.toDto(classRepository.save(classEntity));
    }

    @Override
    @Transactional
    public ClassDTO updateClass(Long id, ClassDTO classDTO) {
        if (!classRepository.existsById(id)) {
            throw new EntityNotFoundException("Class not found with id: " + id);
        }
        return update(id, classDTO);
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        if (!classRepository.existsById(id)) {
            throw new EntityNotFoundException("Class not found with id: " + id);
        }
        delete(id);
    }

    @Override
    @Transactional
    public void deactivateClass(Long id) {
        Class classEntity = classRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        classEntity.setActive(false);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void activateClass(Long id) {
        Class classEntity = classRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        classEntity.setActive(true);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void addTeacherToClass(Long classId, Long teacherId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        
        classEntity.getTeachers().add(teacher);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void removeTeacherFromClass(Long classId, Long teacherId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        
        classEntity.getTeachers().remove(teacher);
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public void addStudentToClass(Long classId, Long studentId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));
        
        // Check if student is already in the join table
        if (classEntity.getStudents().contains(student)) {
            throw new IllegalArgumentException("Student is already enrolled in this class via join table");
        }
        
        // Add to the join table (class_students)
        classEntity.getStudents().add(student);
        classRepository.save(classEntity);
        
        // Also update the Student entity's classId for consistency
        if (student.getStudentClass() != null && !student.getStudentClass().getId().equals(classId)) {
            throw new IllegalArgumentException("Student is already enrolled in another class (ID: " + student.getStudentClass().getId() + ")");
        }
        student.setStudentClass(classEntity);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void removeStudentFromClass(Long classId, Long studentId) {
        Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));
        
        // Remove from the join table (class_students)
        classEntity.getStudents().remove(student);
        classRepository.save(classEntity);
        
        // Also update the Student entity's classId for consistency
        student.setStudentClass(null);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDTO getClassWithStudents(Long id) {
        Class classEntity = classRepository.findByIdWithStudents(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        return classMapper.toDto(classEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDTO> getAll() {
        return classRepository.findAllWithTeachersAndStudents().stream()
            .map(classMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDTO getById(Long id) {
        Class classEntity = classRepository.findByIdWithTeachers(id)
            .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
        return classMapper.toDto(classEntity);
    }
} 