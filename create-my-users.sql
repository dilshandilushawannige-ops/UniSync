-- ============================================
-- CREATE YOUR OWN TEST USERS
-- ============================================
-- 
-- IMPORTANT: Replace the email addresses below with YOUR ACTUAL Google email addresses!
-- 
-- INSTRUCTIONS:
-- 1. Edit this file and replace 'your-xxx-email@gmail.com' with your real emails
-- 2. Make sure backend is running first: ./mvnw.cmd spring-boot:run
-- 3. Run this script: mysql -u root -p smartcampus_db < create-my-users.sql
-- 4. Login at http://localhost:5173/login using Google OAuth
-- 
-- NOTE: The email you use to login MUST match the email in the database!
-- ============================================

USE smartcampus_db;

-- Admin user (full access to everything)
-- ⚠️ REPLACE 'your-admin-email@gmail.com' with YOUR actual Google email
INSERT INTO users (full_name, email, role) 
VALUES ('My Admin', 'your-admin-email@gmail.com', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN', full_name = 'My Admin';

-- Student user (can create tickets, book resources)
-- ⚠️ REPLACE 'your-student-email@gmail.com' with YOUR actual Google email
INSERT INTO users (full_name, email, role) 
VALUES ('My Student', 'your-student-email@gmail.com', 'USER')
ON DUPLICATE KEY UPDATE role = 'USER', full_name = 'My Student';

-- Technician user (can manage tickets)
-- ⚠️ REPLACE 'your-tech-email@gmail.com' with YOUR actual Google email
INSERT INTO users (full_name, email, role) 
VALUES ('My Technician', 'your-tech-email@gmail.com', 'TECHNICIAN')
ON DUPLICATE KEY UPDATE role = 'TECHNICIAN', full_name = 'My Technician';

-- Verify users were created successfully
SELECT '✅ Users created successfully!' as '';
SELECT id, full_name, email, role, created_at FROM users;

-- ============================================
-- AVAILABLE ROLES:
-- - ADMIN: Full system access (admin dashboard)
-- - USER: Student access (student dashboard)  
-- - TECHNICIAN: Technician access (technician dashboard)
-- ============================================
