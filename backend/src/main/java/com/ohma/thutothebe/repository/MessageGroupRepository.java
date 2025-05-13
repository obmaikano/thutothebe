package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.MessageGroup;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageGroupRepository extends JpaRepository<MessageGroup, Long> {
    
    @Query("SELECT mg FROM MessageGroup mg WHERE mg.creator.id = :userId")
    List<MessageGroup> findByCreatorId(@Param("userId") Long userId);
    
    @Query("SELECT mg FROM MessageGroup mg WHERE mg.creator.id = :userId AND mg.active = :active")
    List<MessageGroup> findByCreatorIdAndActive(@Param("userId") Long userId, @Param("active") boolean active);
    
    @Query("SELECT mg FROM MessageGroup mg JOIN mg.members m WHERE m.id = :userId")
    List<MessageGroup> findByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT mg FROM MessageGroup mg JOIN mg.members m WHERE m.id = :userId AND mg.active = :active")
    List<MessageGroup> findByMemberIdAndActive(@Param("userId") Long userId, @Param("active") boolean active);
    
    @EntityGraph(attributePaths = {"members", "messages"})
    @Query("SELECT mg FROM MessageGroup mg WHERE mg.id = :id")
    MessageGroup findByIdWithMembersAndMessages(@Param("id") Long id);
} 