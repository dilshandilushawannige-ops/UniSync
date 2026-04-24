-- Create a test user with email/password for testing login
-- This user can login with email: test@example.com and password: password123

INSERT INTO users (full_name, email, password, role) 
VALUES ('Test User', 'test@example.com', 'password123', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Create a test admin user
INSERT INTO users (full_name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', 'admin123', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Create a test technician user
INSERT INTO users (full_name, email, password, role) 
VALUES ('Technician User', 'tech@example.com', 'tech123', 'TECHNICIAN')
ON CONFLICT (email) DO NOTHING;
