package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.entity.UserRole;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class UserCreationPermissionService {
    private static final Map<UserRole, Set<UserRole>> ROLE_CREATION_MATRIX = Map.of(
        UserRole.SUPER_ADMIN, Set.of(
            UserRole.MINISTRY_EXECUTIVE,
            UserRole.MINISTRY_STAFF,
            UserRole.DATA_PROTECTION_OFFICER,
            UserRole.DIRECTOR,
            UserRole.REGIONAL_ADMIN,
            UserRole.REGIONAL_OFFICER,
            UserRole.SCHOOL_ADMIN,
            UserRole.SCHOOL_HEAD,
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        ),
        UserRole.REGIONAL_ADMIN, Set.of(
            UserRole.REGIONAL_OFFICER,
            UserRole.SCHOOL_ADMIN,
            UserRole.SCHOOL_HEAD,
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        )
    );
    
    public boolean canCreateRole(UserRole creatorRole, UserRole targetRole) {
        return ROLE_CREATION_MATRIX.getOrDefault(creatorRole, Set.of())
            .contains(targetRole);
    }
} 