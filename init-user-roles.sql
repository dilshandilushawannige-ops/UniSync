-- Initialize user roles for testing
-- Run this script after the application starts to set up test users

-- Create or update Admin user
INSERT INTO users (full_name, email, role) 
VALUES ('Admin User', 'ravinduthathsara38@gmail.com', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN', full_name = 'Admin User';

-- Create or update Student user
INSERT INTO users (full_name, email, role) 
VALUES ('Student User', 'ravinduthathsara47@gmail.com', 'USER')
ON DUPLICATE KEY UPDATE role = 'USER', full_name = 'Student User';

-- Create or update Technician user
INSERT INTO users (full_name, email, role) 
VALUES ('Technician User', 'munasinghethathsara74@gmail.com', 'TECHNICIAN')
ON DUPLICATE KEY UPDATE role = 'TECHNICIAN', full_name = 'Technician User';

-- Verify the users
SELECT id, full_name, email, role FROM users 
WHERE email IN (
    'ravinduthathsara38@gmail.com',
    'ravinduthathsara47@gmail.com',
    'munasinghethathsara74@gmail.com'
);
