package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.Message;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.mapper.MessageMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.MessageRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.StudentRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MessageServiceImpl extends BaseServiceImpl<Message, MessageDTO, Long> implements MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final MessageMapper messageMapper;
    private final UserMapper userMapper;
    
    @Autowired
    public MessageServiceImpl(
            MessageRepository messageRepository, 
            UserRepository userRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            CourseInstructorRepository courseInstructorRepository,
            MessageMapper messageMapper,
            UserMapper userMapper) {
        super(messageRepository);
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.messageMapper = messageMapper;
        this.userMapper = userMapper;
    }
    
    @Override
    protected MessageDTO mapToDto(Message entity) {
        return messageMapper.toDto(entity);
    }
    
    @Override
    protected Message mapToEntity(MessageDTO dto) {
        Message message = messageMapper.toEntity(dto);
        if (dto.senderId() != null) {
            User sender = userRepository.findById(dto.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            message.setSender(sender);
        }
        if (dto.recipientId() != null) {
            User recipient = userRepository.findById(dto.recipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
            message.setRecipient(recipient);
        }
        return message;
    }
    
    @Override
    protected void updateEntity(Message entity, MessageDTO dto) {
        messageMapper.updateEntityFromDto(dto, entity);
        if (dto.senderId() != null) {
            User sender = userRepository.findById(dto.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            entity.setSender(sender);
        }
        if (dto.recipientId() != null) {
            User recipient = userRepository.findById(dto.recipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
            entity.setRecipient(recipient);
        }
    }
    
    @Override
    public List<MessageDTO> findByUserId(Long userId) {
        return messageRepository.findByUserId(userId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByUserIdAndActive(Long userId, boolean active) {
        return messageRepository.findByUserIdAndActive(userId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findBySenderAndRecipient(Long senderId, Long recipientId) {
        return messageRepository.findBySenderAndRecipient(senderId, recipientId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findBySenderAndRecipientAndActive(Long senderId, Long recipientId, boolean active) {
        return messageRepository.findBySenderAndRecipientAndActive(senderId, recipientId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByGroupId(Long groupId) {
        return messageRepository.findByGroupId(groupId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByGroupIdAndActive(Long groupId, boolean active) {
        return messageRepository.findByGroupIdAndActive(groupId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean isMessageOwner(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        return message.getSender().getId().equals(userId);
    }

    @Override
    public List<UserDTO> getContactsForStudent(Long studentId) {
        log.info("Getting contacts for student with id: {}", studentId);
        
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));
        
        Set<User> contacts = new HashSet<>();
        
        // Get teachers from student's courses
        if (student.getStudentClass() != null) {
            List<Course> studentCourses = courseRepository.findByClassEntityIdAndActive(
                student.getStudentClass().getId(), true);
            
            for (Course course : studentCourses) {
                // Get course instructors
                List<CourseInstructor> instructors = courseInstructorRepository.findByCourseId(course.getId());
                for (CourseInstructor instructor : instructors) {
                    if (instructor.getTeacher() != null && instructor.getTeacher().getUser() != null) {
                        User teacherUser = instructor.getTeacher().getUser();
                        // Only add active teachers
                        if (teacherUser.isActive()) {
                            contacts.add(teacherUser);
                        }
                    }
                }
            }
        }
        
        // Get administrators (users with admin roles) - only active ones
        List<User> admins = userRepository.findByRoleAndActive(UserRole.SCHOOL_ADMIN, true);
        contacts.addAll(admins);
        
        // Get super admins - only active ones
        List<User> superAdmins = userRepository.findByRoleAndActive(UserRole.SUPER_ADMIN, true);
        contacts.addAll(superAdmins);
        
        log.info("Found {} contacts for student {}: {} teachers, {} school admins, {} super admins", 
            contacts.size(), studentId, 
            contacts.stream().filter(u -> u.getRole() == UserRole.TEACHER).count(),
            contacts.stream().filter(u -> u.getRole() == UserRole.SCHOOL_ADMIN).count(),
            contacts.stream().filter(u -> u.getRole() == UserRole.SUPER_ADMIN).count());
        
        return contacts.stream()
            .map(userMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<Object> getConversationsForUser(Long userId) {
        log.info("Getting conversations for user with id: {}", userId);
        
        // Get all messages where user is sender or recipient
        List<Message> userMessages = messageRepository.findByUserId(userId);
        
        // Group messages by conversation partner
        Map<Long, Object> conversations = new HashMap<>();
        
        for (Message message : userMessages) {
            Long partnerId = null;
            String partnerName = "Unknown";
            
            if (message.getSender().getId().equals(userId) && message.getRecipient() != null) {
                // User is sender, partner is recipient
                partnerId = message.getRecipient().getId();
                partnerName = message.getRecipient().getFirstName() + " " + message.getRecipient().getLastName();
            } else if (message.getRecipient() != null && message.getRecipient().getId().equals(userId)) {
                // User is recipient, partner is sender
                partnerId = message.getSender().getId();
                partnerName = message.getSender().getFirstName() + " " + message.getSender().getLastName();
            }
            
            if (partnerId != null) {
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("id", partnerId.toString());
                conversation.put("name", partnerName);
                conversation.put("lastMessage", message.getContent());
                conversation.put("lastMessageTime", formatTimeAgo(message.getCreatedAt()));
                conversation.put("unreadCount", 0); // TODO: Implement unread count
                conversation.put("type", "individual");
                conversation.put("participantId", partnerId);
                
                conversations.put(partnerId, conversation);
            }
        }
        
        return conversations.values().stream().collect(Collectors.toList());
    }
    
    private String formatTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long hours = java.time.Duration.between(dateTime, now).toHours();
        
        if (hours < 1) {
            return "Just now";
        } else if (hours < 24) {
            return hours + " hours ago";
        } else {
            long days = hours / 24;
            return days + " days ago";
        }
    }
} 