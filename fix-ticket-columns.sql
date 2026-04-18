-- Fix the ticket table columns to accommodate enum values
-- Run this in your MySQL database (smartcampus_db)

-- Modify the category column to allow longer enum values
ALTER TABLE tickets MODIFY COLUMN category VARCHAR(50) NOT NULL;

-- Also fix other enum columns to be safe
ALTER TABLE tickets MODIFY COLUMN priority VARCHAR(50) NOT NULL;
ALTER TABLE tickets MODIFY COLUMN status VARCHAR(50) NOT NULL;
ALTER TABLE tickets MODIFY COLUMN preferred_contact VARCHAR(50);

-- Verify the changes
DESCRIBE tickets;
