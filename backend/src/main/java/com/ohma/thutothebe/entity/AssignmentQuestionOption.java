package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "assignment_question_options")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"assignmentQuestion"})
@ToString(callSuper = true, exclude = {"assignmentQuestion"})
public class AssignmentQuestionOption extends BaseEntity {

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String text;

    @NotNull
    private boolean isCorrect;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_question_id")
    private AssignmentQuestion assignmentQuestion;

    @Column(name = "order_index")
    private Integer orderIndex;

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
} 