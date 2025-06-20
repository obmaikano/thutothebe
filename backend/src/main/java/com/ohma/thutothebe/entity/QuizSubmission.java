package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quiz_submissions")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"quiz", "student", "responses"})
@ToString(callSuper = true, exclude = {"quiz", "student", "responses"})
public class QuizSubmission extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @NotNull
    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    private LocalDateTime gradedAt;

    private Integer score;

    private String feedback;

    @NotNull
    @Enumerated(EnumType.STRING)
    private QuizSubmissionStatus status = QuizSubmissionStatus.IN_PROGRESS;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<QuestionResponse> responses = new HashSet<>();

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (status == null) {
            status = QuizSubmissionStatus.IN_PROGRESS;
        }
    }
} 