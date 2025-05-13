package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "question_responses")
@Data
@EqualsAndHashCode(callSuper = true)
public class QuestionResponse extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private QuizSubmission submission;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String textResponse; // For essay and short answer questions

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "response_selected_options",
        joinColumns = @JoinColumn(name = "response_id"),
        inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private Set<QuestionOption> selectedOptions = new HashSet<>();

    private Integer pointsAwarded;

    private String feedback;

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
} 