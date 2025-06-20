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
@Table(name = "questions")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"options"})
@ToString(callSuper = true, exclude = {"options"})
public class Question extends BaseEntity {

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
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<QuestionOption> options = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String correctAnswer; // For essay questions

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
} 