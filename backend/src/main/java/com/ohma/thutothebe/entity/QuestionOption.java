package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "question_options")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"question"})
@ToString(callSuper = true, exclude = {"question"})
public class QuestionOption extends BaseEntity {

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String text;

    @NotNull
    private boolean isCorrect;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
} 