# Login Issues - Troubleshooting Guide 🔧

## Problem 1: Users Can't Login After Pulling Code

### Root Cause
Your friend's database doesn't have any users yet! The application requires users to exist in the database BEFORE they can login with Google OAuth.

### Solution
After pulling the code and starting the application, your friend needs to:

1. **Start the backend** (this creates the database tables):
```bash
cd UniSync
./mvnw.cmd spring-boot:run
```

2. **Wait for it to finish starting** (look for "Started UnisyncApplication" in logs)

3. **Add their email to the database**:

Open MySQL and run:
```sql
USE smartcampus_db;

-- Replace with YOUR actual email address
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-actual-email@gmail.com', 'ADMIN');
```

Or use the provided script:
```bash
# Edit create-my-users.sql first with your email addresses
mysql -u root -p smartcampus_db < create-my-users.sql
```

4. **Now login** at http://localhost:5173/login

---

## Problem 2: Admin Email Redirects to Student Dashboard

### Root Cause
There's a **CRITICAL BUG** in the role mapping! The database stores roles as:
- `ADMIN`
- `USER` 
- `TECHNICIAN`

But the backend adds `ROLE_` prefix, making them:
- `ROLE_ADMIN`
- `ROLE_USER`
- `ROLE_TECHNICIAN`

However, the frontend expects lowercase roles:
- `admin`
- `student`
- `technician`

### The Bug Location

In `OAuth2LoginSuccessHandler.java`, the role mapping is correct, BUT there's a case-sensitivity issue in the frontend!

**Backend sends:** `role=admin` (lowercase)
**Frontend checks:** `if (role === "admin")` (lowercase)

This should work, but let's verify the actual issue...

### Debug Steps

1. **Check what's in the database:**
```sql
SELECT id, full_name, email, role FROM users;
```

Expected output:
```
| id | full_name  | email                | role  |
|----|------------|----------------------|-------|
| 1  | Admin User | admin@test.com       | ADMIN |
```

2. **Check browser console** when logging in:
- Open DevTools (F12)
- Go to Console tab
- Login and look for these logs:
```
=== OAuth Success Page ===
Token: google-oauth-success
Role: admin  <-- Should be "admin" not "student"
User ID: 1
```

3. **Check localStorage** after login:
- Open DevTools (F12)
- Go to Application tab → Local Storage → http://localhost:5173
- Check these values:
  - `role` should be `admin` (not `student`)
  - `token` should exist
  - `userId` should exist

---

## Common Issues & Fixes

### Issue 1: Role is NULL in database
```sql
-- Check for NULL roles
SELECT * FROM users WHERE role IS NULL;

-- Fix NULL roles
UPDATE users SET role = 'USER' WHERE role IS NULL;
```

### Issue 2: Wrong role in database
```sql
-- Update user role
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

### Issue 3: User doesn't exist
```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'your-email@gmail.com';

-- If not found, insert them
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-email@gmail.com', 'ADMIN');
```

### Issue 4: Backend not reading from database
Check the backend logs when logging in. You should see:
```
=== OAuth2 Login Debug ===
Email: your-email@gmail.com
Name: Your Name
Existing user found with role: ADMIN
Final user role: ADMIN
=========================
```

If you see "Creating new user with default role: USER", it means the user wasn't found in the database!

---

## Quick Verification Checklist

✅ Backend is running on http://localhost:8081
✅ Frontend is running on http://localhost:5173
✅ Database `smartcampus_db` exists
✅ User with your email exists in database
✅ User has correct role (ADMIN, USER, or TECHNICIAN)
✅ Google OAuth credentials are configured in `.env`
✅ Browser console shows correct role after login
✅ localStorage has correct role value

---

## Still Not Working?

### Enable Debug Mode

1. **Backend logs:** Already enabled, check console output

2. **Frontend logs:** Check browser console (F12) for:
   - OAuth success page logs
   - Role value
   - Redirect destination

3. **Database verification:**
```sql
-- See all users and their roles
SELECT id, full_name, email, role, created_at FROM users ORDER BY id;
```

### Test with Different Roles

Create test users for each role:
```sql
USE smartcampus_db;

INSERT INTO users (full_name, email, role) VALUES 
('Test Admin', 'admin-test@gmail.com', 'ADMIN'),
('Test Student', 'student-test@gmail.com', 'USER'),
('Test Tech', 'tech-test@gmail.com', 'TECHNICIAN');
```

Then login with each email and verify:
- Admin → redirects to `/admin/dashboard`
- Student → redirects to `/dashboard`
- Technician → redirects to `/technician/dashboard`

---

## Environment Setup Checklist for New Developers

When your friend clones the repo, they need:

1. **Copy environment file:**
```bash
copy .env.example .env
```

2. **Edit `.env` with their values:**
```env
GOOGLE_CLIENT_ID=their-google-client-id
GOOGLE_CLIENT_SECRET=their-google-client-secret
DB_USERNAME=root
DB_PASSWORD=their-mysql-password
JWT_SECRET=any-random-string-here
```

3. **Create database:**
```sql
CREATE DATABASE smartcampus_db;
```

4. **Start backend** (creates tables automatically):
```bash
./mvnw.cmd spring-boot:run
```

5. **Add their user to database:**
```sql
USE smartcampus_db;
INSERT INTO users (full_name, email, role) 
VALUES ('Their Name', 'their-email@gmail.com', 'ADMIN');
```

6. **Start frontend:**
```bash
cd frontend
npm install
npm run dev
```

7. **Login** at http://localhost:5173/login

---

## Need More Help?

Check these files:
- `FOR-YOUR-FRIEND.md` - Quick setup guide
- `DATABASE-SETUP.md` - Detailed database instructions
- `SETUP.md` - Complete setup guide
- `create-my-users.sql` - Template for creating users
