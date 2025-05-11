package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserMapper implements BaseDtoMapper<User, UserDTO> {

    @Override
    public UserDTO toDto(User entity) {
        if (entity == null) return null;

        return new UserDTO(
            entity.getId(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getEmail(),
            entity.getPassword(),
            entity.getRole()
        );
    }

    @Override
    public User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User entity = new User();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(User entity, UserDTO dto) {
        entity.setFirstName(dto.firstName());
        entity.setLastName(dto.lastName());
        entity.setEmail(dto.email());
        entity.setPassword(dto.password());
        entity.setRole(dto.role());
        entity.setUsername(dto.email());
    }

    /**
     * Updates an existing entity with data from the DTO
     * @param entity The entity to update
     * @param dto The DTO containing the new data
     */
    public void updateEntityFromDto(User entity, UserDTO dto) {
        updateEntity(entity, dto);
    }

} 