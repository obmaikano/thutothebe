package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradingType;

/**
 * Interface for entities that can be graded
 */
public interface Gradable {
    
    /**
     * Gets the grading type for this gradable item
     * @return the grading type
     */
    GradingType getGradingType();
    
    /**
     * Checks if this item supports automatic grading
     * @return true if auto-grading is supported
     */
    boolean supportsAutoGrading();
    
    /**
     * Checks if this item supports manual grading
     * @return true if manual grading is supported
     */
    boolean supportsManualGrading();
    
    /**
     * Gets the total points for this gradable item
     * @return the total points
     */
    Integer getTotalPoints();
} 