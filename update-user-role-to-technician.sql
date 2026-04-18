-- Update user role to TECHNICIAN for testing
-- Replace the email with your actual test user email

UPDATE users 
SET role = 'TECHNICIAN' 
WHERE email = 'munasinghethathsara74@gmail.com';

-- Verify the update
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'munasinghethathsara74@gmail.com';
