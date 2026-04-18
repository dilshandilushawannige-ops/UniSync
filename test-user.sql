-- Insert a test user for ticket creation
-- Run this in your MySQL database (smartcampus_db)

INSERT INTO users (id, name, email, role, created_at, updated_at) 
VALUES (1, 'Test Student', 'student@test.com', 'STUDENT', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = 'Test Student';
