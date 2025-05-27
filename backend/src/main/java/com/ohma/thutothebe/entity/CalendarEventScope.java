package com.ohma.thutothebe.entity;

public enum CalendarEventScope {
    GLOBAL,      // Visible to all users across all regions and schools
    REGIONAL,    // Visible to all users within a specific region
    SCHOOL,      // Visible to all users within a specific school
    CLASS,       // Visible to all users within a specific class
    COURSE,      // Visible to all users enrolled in a specific course
    PERSONAL     // Visible only to specific attendees/organizers
} 