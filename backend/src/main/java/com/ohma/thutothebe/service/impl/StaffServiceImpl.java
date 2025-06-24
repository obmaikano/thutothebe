package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StaffDTO;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.mapper.StaffMapper;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffServiceImpl extends BaseServiceImpl<User, StaffDTO, Long> implements StaffService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private StaffMapper staffMapper;

    public StaffServiceImpl(UserRepository userRepository, StaffMapper staffMapper) {
        super(userRepository);
        this.userRepository = userRepository;
        this.staffMapper = staffMapper;
    }

    @Override
    protected User mapToEntity(StaffDTO dto) {
        return staffMapper.toEntity(dto);
    }

    @Override
    protected StaffDTO mapToDto(User entity) {
        return staffMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(User entity, StaffDTO dto) {
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setEmail(dto.email());
        entity.setRole(dto.role());
        entity.setQualification(dto.qualification());
        entity.setActive(dto.active());
    }

    @Override
    protected Long extractSchoolId(User entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(User entity) {
        return entity.getRegion() != null ? entity.getRegion().getId() : null;
    }

    @Override
    public List<StaffDTO> getStaffBySchoolId(Long schoolId) {
        List<User> staffUsers = userRepository.findBySchoolIdAndRoleAndActive(
            schoolId, 
            UserRole.TEACHER, 
            true
        );
        
        // Add other staff roles
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SENIOR_TEACHER, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.DEPARTMENT_HEAD, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SCHOOL_HEAD, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SCHOOL_ADMIN, true));
        
        return staffUsers.stream()
            .map(user -> {
                Teacher teacher = null;
                if (user.getRole() == UserRole.TEACHER || user.getRole() == UserRole.SENIOR_TEACHER) {
                    teacher = teacherRepository.findByUser_Id(user.getId()).orElse(null);
                }
                return staffMapper.toStaffDto(user, teacher);
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<StaffDTO> getStaffByRole(UserRole role) {
        List<User> staffUsers = userRepository.findByRole(role);
        
        return staffUsers.stream()
            .map(user -> {
                Teacher teacher = null;
                if (user.getRole() == UserRole.TEACHER || user.getRole() == UserRole.SENIOR_TEACHER) {
                    teacher = teacherRepository.findByUser_Id(user.getId()).orElse(null);
                }
                return staffMapper.toStaffDto(user, teacher);
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<StaffDTO> getActiveStaffBySchoolId(Long schoolId) {
        List<User> staffUsers = userRepository.findBySchoolIdAndRoleAndActive(
            schoolId, 
            UserRole.TEACHER, 
            true
        );
        
        // Add other staff roles
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SENIOR_TEACHER, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.DEPARTMENT_HEAD, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SCHOOL_HEAD, true));
        staffUsers.addAll(userRepository.findBySchoolIdAndRoleAndActive(schoolId, UserRole.SCHOOL_ADMIN, true));
        
        return staffUsers.stream()
            .map(user -> {
                Teacher teacher = null;
                if (user.getRole() == UserRole.TEACHER || user.getRole() == UserRole.SENIOR_TEACHER) {
                    teacher = teacherRepository.findByUser_Id(user.getId()).orElse(null);
                }
                return staffMapper.toStaffDto(user, teacher);
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<StaffDTO> getStaffByRegionId(Long regionId) {
        List<User> staffUsers = userRepository.findByRegionIdAndRoleAndActive(
            regionId, 
            UserRole.TEACHER, 
            true
        );
        
        // Add other staff roles
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.SENIOR_TEACHER, true));
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.DEPARTMENT_HEAD, true));
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.SCHOOL_HEAD, true));
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.SCHOOL_ADMIN, true));
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.REGIONAL_ADMIN, true));
        staffUsers.addAll(userRepository.findByRegionIdAndRoleAndActive(regionId, UserRole.REGIONAL_OFFICER, true));
        
        return staffUsers.stream()
            .map(user -> {
                Teacher teacher = null;
                if (user.getRole() == UserRole.TEACHER || user.getRole() == UserRole.SENIOR_TEACHER) {
                    teacher = teacherRepository.findByUser_Id(user.getId()).orElse(null);
                }
                return staffMapper.toStaffDto(user, teacher);
            })
            .collect(Collectors.toList());
    }

    @Override
    public StaffDTO toggleStaffStatus(Long staffId, boolean active) {
        User user = userRepository.findById(staffId)
            .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + staffId));
        
        user.setActive(active);
        User savedUser = userRepository.save(user);
        
        Teacher teacher = null;
        if (savedUser.getRole() == UserRole.TEACHER || savedUser.getRole() == UserRole.SENIOR_TEACHER) {
            teacher = teacherRepository.findByUser_Id(savedUser.getId()).orElse(null);
        }
        
        return staffMapper.toStaffDto(savedUser, teacher);
    }

    @Override
    public StaffDTO getStaffByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Staff member not found with email: " + email));
        
        Teacher teacher = null;
        if (user.getRole() == UserRole.TEACHER || user.getRole() == UserRole.SENIOR_TEACHER) {
            teacher = teacherRepository.findByUser_Id(user.getId()).orElse(null);
        }
        
        return staffMapper.toStaffDto(user, teacher);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
 