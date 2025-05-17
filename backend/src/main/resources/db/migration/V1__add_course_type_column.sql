-- Add course_type column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS type VARCHAR(10) NOT NULL DEFAULT 'CORE';

-- Update existing records to use CORE as default
UPDATE courses SET type = 'CORE' WHERE type IS NULL; 