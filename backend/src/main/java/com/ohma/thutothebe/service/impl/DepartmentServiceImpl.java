package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.entity.Department;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DepartmentMapper;
import com.ohma.thutothebe.repository.DepartmentRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DepartmentServiceImpl extends BaseServiceImpl<Department, DepartmentDTO, Long> implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            DepartmentMapper departmentMapper,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository) {
        super(departmentRepository);
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    protected Department mapToEntity(DepartmentDTO dto) {
        return departmentMapper.toEntity(dto);
    }

    @Override
    protected DepartmentDTO mapToDto(Department entity) {
        return departmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Department entity, DepartmentDTO dto) {
        departmentMapper.updateEntityFromDto(entity, dto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsBySchoolId(Long schoolId) {
        log.info("Retrieving departments for school ID: {}", schoolId);
        return departmentRepository.findBySchoolId(schoolId).stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartmentsBySchoolId(Long schoolId) {
        log.info("Retrieving active departments for school ID: {}", schoolId);
        return departmentRepository.findBySchoolIdAndActiveTrue(schoolId).stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getActiveDepartments() {
        log.info("Retrieving all active departments");
        return departmentRepository.findByActiveTrue().stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentByNameAndSchoolId(String name, Long schoolId) {
        log.info("Retrieving department by name '{}' and school ID: {}", name, schoolId);
        return departmentRepository.findByNameAndSchoolId(name, schoolId)
                .map(departmentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with name '" + name + "' in school " + schoolId));
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentByDepartmentHeadId(Long departmentHeadId) {
        log.info("Retrieving department by department head ID: {}", departmentHeadId);
        return departmentRepository.findByDepartmentHeadId(departmentHeadId)
                .map(departmentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with department head ID: " + departmentHeadId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsByTeacherId(Long teacherId) {
        log.info("Retrieving departments by teacher ID: {}", teacherId);
        return departmentRepository.findByTeacherId(teacherId).stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentBySubjectId(Long subjectId) {
        log.info("Retrieving department by subject ID: {}", subjectId);
        return departmentRepository.findBySubjectId(subjectId)
                .map(departmentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with subject ID: " + subjectId));
    }

    @Override
    @Transactional
    public DepartmentDTO assignDepartmentHead(Long departmentId, Long teacherId) {
        log.info("Assigning teacher {} as department head for department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Validate teacher role
        if (teacher.getUser() != null) {
            UserRole role = teacher.getUser().getRole();
            if (role != UserRole.DEPARTMENT_HEAD && role != UserRole.TEACHER && role != UserRole.SENIOR_TEACHER) {
                throw new IllegalArgumentException("Teacher must have DEPARTMENT_HEAD, SENIOR_TEACHER, or TEACHER role");
            }
        }
        
        // Check if teacher is already a department head elsewhere
        if (departmentRepository.existsByDepartmentHeadId(teacherId)) {
            throw new IllegalArgumentException("Teacher is already a department head of another department");
        }
        
        // Promote teacher role if necessary
        if (teacher.getUser() != null && teacher.getUser().getRole() == UserRole.TEACHER) {
            teacher.getUser().setRole(UserRole.DEPARTMENT_HEAD);
            teacherRepository.save(teacher);
            log.info("Promoted teacher {} to DEPARTMENT_HEAD role", teacherId);
        }
        
        department.setDepartmentHead(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned teacher {} as department head for department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeDepartmentHead(Long departmentId) {
        log.info("Removing department head from department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher currentHead = department.getDepartmentHead();
        if (currentHead != null) {
            // Demote role back to TEACHER if they're not head of another department
            if (currentHead.getUser() != null && currentHead.getUser().getRole() == UserRole.DEPARTMENT_HEAD) {
                // Check if they're head of any other department by checking all departments with this head
                // and seeing if any have a different ID than the current department
                Optional<Department> otherDeptWithSameHead = departmentRepository.findByDepartmentHeadId(currentHead.getId());
                boolean isHeadElsewhere = otherDeptWithSameHead.isPresent() && 
                    !otherDeptWithSameHead.get().getId().equals(departmentId);
                
                if (!isHeadElsewhere) {
                    currentHead.getUser().setRole(UserRole.TEACHER);
                    teacherRepository.save(currentHead);
                    log.info("Demoted teacher {} back to TEACHER role", currentHead.getId());
                }
            }
        }
        
        department.setDepartmentHead(null);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed department head from department {}", departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO assignTeacherToDepartment(Long departmentId, Long teacherId) {
        log.info("Assigning teacher {} to department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Validate teacher role
        if (teacher.getUser() != null) {
            UserRole role = teacher.getUser().getRole();
            if (role != UserRole.TEACHER && role != UserRole.DEPARTMENT_HEAD && role != UserRole.SENIOR_TEACHER) {
                throw new IllegalArgumentException("User must have TEACHER, SENIOR_TEACHER, or DEPARTMENT_HEAD role");
            }
        }
        
        department.addTeacher(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned teacher {} to department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeTeacherFromDepartment(Long departmentId, Long teacherId) {
        log.info("Removing teacher {} from department {}", teacherId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        // Check if teacher is the department head
        if (department.getDepartmentHead() != null && department.getDepartmentHead().getId().equals(teacherId)) {
            throw new IllegalArgumentException("Cannot remove department head from teachers. Remove department head first.");
        }
        
        department.removeTeacher(teacher);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed teacher {} from department {}", teacherId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO assignSubjectToDepartment(Long departmentId, Long subjectId) {
        log.info("Assigning subject {} to department {}", subjectId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        // Check if subject is already assigned to another department
        if (subject.getDepartment() != null && !subject.getDepartment().getId().equals(departmentId)) {
            throw new IllegalArgumentException("Subject is already assigned to another department");
        }
        
        department.addSubject(subject);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully assigned subject {} to department {}", subjectId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDTO removeSubjectFromDepartment(Long departmentId, Long subjectId) {
        log.info("Removing subject {} from department {}", subjectId, departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        department.removeSubject(subject);
        Department savedDepartment = departmentRepository.save(department);
        
        log.info("Successfully removed subject {} from department {}", subjectId, departmentId);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional
    public void activateDepartment(Long departmentId) {
        log.info("Activating department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        department.setActive(true);
        departmentRepository.save(department);
        
        log.info("Successfully activated department {}", departmentId);
    }

    @Override
    @Transactional
    public void deactivateDepartment(Long departmentId) {
        log.info("Deactivating department {}", departmentId);
        
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        department.setActive(false);
        departmentRepository.save(department);
        
        log.info("Successfully deactivated department {}", departmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActiveDepartmentsBySchoolId(Long schoolId) {
        log.info("Counting active departments for school ID: {}", schoolId);
        return departmentRepository.countBySchoolIdAndActiveTrue(schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndSchoolId(String name, Long schoolId) {
        return departmentRepository.existsByNameAndSchoolId(name, schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByDepartmentHeadId(Long departmentHeadId) {
        return departmentRepository.existsByDepartmentHeadId(departmentHeadId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithoutHead(Long schoolId) {
        log.info("Retrieving departments without head for school ID: {}", schoolId);
        return departmentRepository.findBySchoolIdAndActiveTrue(schoolId).stream()
                .filter(department -> department.getDepartmentHead() == null)
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getDepartmentsWithSubjects(Long schoolId) {
        log.info("Retrieving departments with subjects for school ID: {}", schoolId);
        return departmentRepository.findBySchoolIdAndActiveTrue(schoolId).stream()
                .filter(department -> department.getSubjects() != null && !department.getSubjects().isEmpty())
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DepartmentDTO create(DepartmentDTO dto) {
        log.info("Creating new department: {}", dto.name());
        
        // Check if department name already exists in the school
        if (existsByNameAndSchoolId(dto.name(), dto.schoolId())) {
            throw new IllegalArgumentException("Department with name '" + dto.name() + "' already exists in this school");
        }
        
        return super.create(dto);
    }

    @Override
    @Transactional
    public DepartmentDTO update(Long id, DepartmentDTO dto) {
        log.info("Updating department with ID: {}", id);
        
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        // Check if new name conflicts with existing departments (excluding current one)
        if (!existingDepartment.getName().equals(dto.name()) && 
            existsByNameAndSchoolId(dto.name(), dto.schoolId())) {
            throw new IllegalArgumentException("Department with name '" + dto.name() + "' already exists in this school");
        }
        
        return super.update(id, dto);
    }
} 