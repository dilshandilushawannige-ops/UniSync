-- Update existing user to TECHNICIAN role
-- Replace the email with your actual Google account email

UPDATE users 
SET role = 'TECHNICIAN' 
WHERE email = 'streamsnippets6@gmail.com';

-- Verify the update
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'streamsnippets6@gmail.com';
