-- ============================================
-- SQL Script to Test Announcements Feature
-- ============================================

USE unisync_db;

-- 1. View all announcements
SELECT * FROM announcements ORDER BY created_at DESC;

-- 2. View announcements with formatted output
SELECT 
    id,
    title,
    LEFT(message, 50) AS message_preview,
    target,
    priority,
    status,
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated
FROM announcements
ORDER BY created_at DESC;

-- 3. Count announcements by status
SELECT 
    status,
    COUNT(*) AS count
FROM announcements
GROUP BY status;

-- 4. Count announcements by priority
SELECT 
    priority,
    COUNT(*) AS count
FROM announcements
GROUP BY priority;

-- 5. Count announcements by target role
SELECT 
    CASE 
        WHEN target LIKE '%ALL%' THEN 'ALL'
        WHEN target LIKE '%STUDENT%' THEN 'STUDENT'
        WHEN target LIKE '%LECTURER%' THEN 'LECTURER'
        WHEN target LIKE '%TECHNICIAN%' THEN 'TECHNICIAN'
        ELSE 'OTHER'
    END AS target_role,
    COUNT(*) AS count
FROM announcements
GROUP BY target_role;

-- 6. Find ACTIVE and IMPORTANT announcements
SELECT 
    id,
    title,
    message,
    target,
    created_at
FROM announcements
WHERE status = 'ACTIVE' AND priority = 'IMPORTANT'
ORDER BY created_at DESC;

-- 7. Find announcements for STUDENTS
SELECT 
    id,
    title,
    message,
    priority,
    created_at
FROM announcements
WHERE status = 'ACTIVE' 
  AND (target LIKE '%ALL%' OR target LIKE '%STUDENT%')
ORDER BY created_at DESC;

-- 8. Insert sample announcement (for testing)
INSERT INTO announcements (title, message, target, priority, status, created_at, updated_at)
VALUES 
    ('System Maintenance', 'The system will be down for maintenance on Sunday 2-6 AM.', 'ALL', 'IMPORTANT', 'ACTIVE', NOW(), NOW());

-- 9. Update an announcement (change ID as needed)
-- UPDATE announcements 
-- SET priority = 'IMPORTANT', updated_at = NOW()
-- WHERE id = 1;

-- 10. Delete an announcement (change ID as needed)
-- DELETE FROM announcements WHERE id = 1;

-- 11. View table structure
DESCRIBE announcements;

-- 12. Count total announcements
SELECT COUNT(*) AS total_announcements FROM announcements;

-- 13. Get latest 5 announcements
SELECT 
    id,
    title,
    target,
    priority,
    status,
    created_at
FROM announcements
ORDER BY created_at DESC
LIMIT 5;

-- 14. Search announcements by keyword in title or message
-- SELECT * FROM announcements 
-- WHERE title LIKE '%maintenance%' OR message LIKE '%maintenance%';

-- 15. Clear all announcements (USE WITH CAUTION!)
-- DELETE FROM announcements;
-- ALTER TABLE announcements AUTO_INCREMENT = 1;
