-- ============================================
-- VERIFY LOGIN SETUP
-- ============================================
-- Run this to check if your login setup is correct
-- Command: mysql -u root -p smartcampus_db < verify-login-setup.sql
-- ============================================

USE smartcampus_db;

SELECT '🔍 Checking database setup...' as '';
SELECT '' as '';

-- Check if database exists
SELECT '✅ Database exists: smartcampus_db' as '';
SELECT '' as '';

-- Check if users table exists
SELECT '📋 Users table structure:' as '';
DESCRIBE users;
SELECT '' as '';

-- Check all users
SELECT '👥 Current users in database:' as '';
SELECT id, full_name, email, role, created_at FROM users;
SELECT '' as '';

-- Count users by role
SELECT '📊 Users by role:' as '';
SELECT role, COUNT(*) as count FROM users GROUP BY role;
SELECT '' as '';

-- Check for users with NULL roles (this is bad!)
SELECT '⚠️  Users with NULL roles (need to fix):' as '';
SELECT id, full_name, email, role FROM users WHERE role IS NULL;
SELECT '' as '';

-- Check for template emails (not replaced)
SELECT '⚠️  Template emails not replaced (need to fix):' as '';
SELECT id, full_name, email, role FROM users 
WHERE email LIKE '%your-%' OR email LIKE '%test.com%';
SELECT '' as '';

-- Summary
SELECT '📝 SUMMARY:' as '';
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ NO USERS FOUND! You need to add users first.'
        WHEN COUNT(*) > 0 THEN CONCAT('✅ Found ', COUNT(*), ' user(s)')
    END as status
FROM users;

SELECT '' as '';
SELECT '💡 NEXT STEPS:' as '';
SELECT '1. Make sure you replaced template emails with YOUR actual Google emails' as '';
SELECT '2. Start backend: ./mvnw.cmd spring-boot:run' as '';
SELECT '3. Start frontend: cd frontend && npm run dev' as '';
SELECT '4. Login at http://localhost:5173/login' as '';
