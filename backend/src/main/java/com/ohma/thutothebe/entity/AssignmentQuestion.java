package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "assignment_questions")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"assignment", "options"})
@ToString(callSuper = true, exclude = {"assignment", "options"})
public class AssignmentQuestion extends BaseEntity {

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String text;

    @NotNull
    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @NotNull
    private Integer points;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Column(name = "auto_gradable", nullable = false)
    private boolean autoGradable = false;

    @OneToMany(mappedBy = "assignmentQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AssignmentQuestionOption> options = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String correctAnswer; // For essay questions or text-based answers

    @Column(name = "order_index")
    private Integer orderIndex;

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        // Auto-gradable if it's MCQ, True/False, or has predefined correct answers
        if (type == QuestionType.MULTIPLE_CHOICE || type == QuestionType.TRUE_FALSE) {
            this.autoGradable = true;
        }
    }
} 