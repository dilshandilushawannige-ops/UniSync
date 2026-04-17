-- Update user roles based on email addresses
-- Run this script to set the correct roles for existing users

-- Set Admin role for ravinduthathsara38@gmail.com
UPDATE users 
SET role = 'ADMIN', full_name = 'Admin User'
WHERE email = 'ravinduthathsara38@gmail.com';

-- Set USER role for ravinduthathsara47@gmail.com (Student)
UPDATE users 
SET role = 'USER', full_name = 'Student User'
WHERE email = 'ravinduthathsara47@gmail.com';

-- Set TECHNICIAN role for nithakshidishara2002@gmail.com
UPDATE users 
SET role = 'TECHNICIAN', full_name = 'Technician User'
WHERE email = 'nithakshidishara2002@gmail.com';

-- Verify the updates
SELECT id, full_name, email, role FROM users 
WHERE email IN (
    'ravinduthathsara38@gmail.com',
    'ravinduthathsara47@gmail.com',
    'nithakshidishara2002@gmail.com'
);
