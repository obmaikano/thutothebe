package com.ohma.thutothebe.entity;

public enum CalendarEventType {
    // Academic Events
    ACADEMIC_TERM_START,
    ACADEMIC_TERM_END,
    SEMESTER_START,
    SEMESTER_END,
    ACADEMIC_YEAR_START,
    ACADEMIC_YEAR_END,
    
    // Examination Events
    EXAM_PERIOD,
    MIDTERM_EXAM,
    FINAL_EXAM,
    ENTRANCE_EXAM,
    ASSESSMENT,
    
    // Class and Course Events
    CLASS_SESSION,
    LECTURE,
    TUTORIAL,
    PRACTICAL_SESSION,
    LAB_SESSION,
    FIELD_TRIP,
    
    // Administrative Events
    STAFF_MEETING,
    PARENT_MEETING,
    BOARD_MEETING,
    FACULTY_MEETING,
    DEPARTMENT_MEETING,
    ORIENTATION,
    GRADUATION,
    ENROLLMENT_PERIOD,
    REGISTRATION_DEADLINE,
    
    // Holiday and Break Events
    PUBLIC_HOLIDAY,
    SCHOOL_HOLIDAY,
    TERM_BREAK,
    SEMESTER_BREAK,
    STUDY_BREAK,
    
    // Extracurricular Events
    SPORTS_EVENT,
    CULTURAL_EVENT,
    COMPETITION,
    CLUB_ACTIVITY,
    ASSEMBLY,
    CEREMONY,
    WORKSHOP,
    SEMINAR,
    CONFERENCE,
    
    // Special Events
    EMERGENCY_CLOSURE,
    MAINTENANCE,
    INSPECTION,
    TRAINING,
    PROFESSIONAL_DEVELOPMENT,
    
    // Personal Events
    PERSONAL_APPOINTMENT,
    PERSONAL_MEETING,
    
    // Other
    CUSTOM,
    GENERAL
} 