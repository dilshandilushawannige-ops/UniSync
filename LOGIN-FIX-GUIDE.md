# 🔥 LOGIN ISSUE - COMPLETE FIX GUIDE

## The Two Main Problems

### Problem 1: Your Friend Can't Login At All ❌
**Cause:** No users in their database
**Symptom:** Login fails, or creates a new user with default USER role

### Problem 2: Admin Redirects to Student Dashboard ❌  
**Cause:** Role mismatch or database has wrong role value
**Symptom:** Admin user sees student dashboard instead of admin dashboard

---

## 🎯 SOLUTION FOR PROBLEM 1: Can't Login

Your friend needs to add their email to the database BEFORE logging in.

### Step-by-Step Fix:

1. **Make sure backend is running:**
```bash
cd UniSync
./mvnw.cmd spring-boot:run
```
Wait until you see: `Started UnisyncApplication`

2. **Open MySQL and add your user:**
```sql
USE smartcampus_db;

-- Replace with YOUR actual Google email
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-email@gmail.com', 'ADMIN');
```

3. **Verify user was created:**
```sql
SELECT * FROM users;
```

4. **Now login** at http://localhost:5173/login with that Google account

---

## 🎯 SOLUTION FOR PROBLEM 2: Admin → Student Dashboard

This happens when the role in the database doesn't match what the backend expects.

### Debug Steps:

1. **Check what role is in the database:**
```sql
SELECT id, email, role FROM users WHERE email = 'your-email@gmail.com';
```

Expected result:
```
| id | email                | role  |
|----|----------------------|-------|
| 1  | your-email@gmail.com | ADMIN |
```

2. **Check browser console after login:**
- Press F12 to open DevTools
- Go to Console tab
- Login and look for:
```
=== OAuth Success Page ===
Role: admin  <-- Should say "admin" not "student"
```

3. **Check localStorage:**
- Press F12 → Application tab → Local Storage
- Look at `role` value
- Should be: `admin` (lowercase)

### If Role is Wrong in Database:

```sql
-- Fix the role
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@gmail.com';
```

### If Role is Correct but Still Wrong Dashboard:

Check backend logs when you login. You should see:
```
=== OAuth2 Login Debug ===
Email: your-email@gmail.com
Existing user found with role: ADMIN
Final user role: ADMIN
=========================

=== OAuth2 Success Handler ===
User authenticated with authority: ROLE_ADMIN
Mapped frontend role: admin
Redirecting to: http://localhost:5173/oauth-success?token=...&role=admin
```

If you see `role=student` in the redirect URL, there's a bug in the backend!

---

## 🔍 ROLE MAPPING EXPLAINED

The system uses THREE different role formats:

### 1. Database (UserRole enum):
```
ADMIN
USER
TECHNICIAN
```

### 2. Spring Security (with ROLE_ prefix):
```
ROLE_ADMIN
ROLE_USER
ROLE_TECHNICIAN
```

### 3. Frontend (lowercase):
```
admin
student  (maps from USER)
technician
```

### The Mapping Flow:

```
Database: ADMIN
    ↓
CustomUserPrincipal adds "ROLE_" prefix
    ↓
Spring Security: ROLE_ADMIN
    ↓
OAuth2LoginSuccessHandler converts to frontend format
    ↓
Frontend: admin
    ↓
Redirects to: /admin/dashboard
```

---

## 🧪 TEST ALL ROLES

Create test users for each role:

```sql
USE smartcampus_db;

-- Admin user
INSERT INTO users (full_name, email, role) 
VALUES ('Test Admin', 'admin@test.com', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Student user  
INSERT INTO users (full_name, email, role) 
VALUES ('Test Student', 'student@test.com', 'USER')
ON DUPLICATE KEY UPDATE role = 'USER';

-- Technician user
INSERT INTO users (full_name, email, role) 
VALUES ('Test Tech', 'tech@test.com', 'TECHNICIAN')
ON DUPLICATE KEY UPDATE role = 'TECHNICIAN';
```

Then test each one:
- `admin@test.com` → Should go to `/admin/dashboard`
- `student@test.com` → Should go to `/dashboard`
- `tech@test.com` → Should go to `/technician/dashboard`

---

## 📋 COMPLETE SETUP CHECKLIST FOR NEW DEVELOPERS

When someone clones your repo, they need to:

### 1. Environment Setup
```bash
# Copy environment template
copy .env.example .env

# Edit .env with their credentials
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET  
# - DB_PASSWORD
# - JWT_SECRET
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE smartcampus_db;
```

### 3. Start Backend (creates tables)
```bash
cd UniSync
./mvnw.cmd spring-boot:run
```

### 4. Add Their User
```sql
USE smartcampus_db;

-- Use THEIR Google email address
INSERT INTO users (full_name, email, role) 
VALUES ('Their Name', 'their-google-email@gmail.com', 'ADMIN');
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. Login
Go to http://localhost:5173/login

---

## 🚨 COMMON MISTAKES

### Mistake 1: Using wrong email
❌ Database has: `admin@test.com`
❌ Logging in with: `myemail@gmail.com`
✅ They must match exactly!

### Mistake 2: Wrong role format
❌ `INSERT INTO users ... VALUES (..., 'admin')`
✅ `INSERT INTO users ... VALUES (..., 'ADMIN')`

Role must be UPPERCASE in database!

### Mistake 3: Not starting backend first
❌ Adding users before starting backend
✅ Start backend first (it creates tables), then add users

### Mistake 4: Using template emails
❌ Using `your-admin-email@gmail.com` from the template
✅ Replace with actual Google email address

---

## 🔧 QUICK FIX SCRIPT

Create this file: `fix-my-login.sql`

```sql
USE smartcampus_db;

-- Check current users
SELECT 'Current users:' as '';
SELECT id, full_name, email, role FROM users;

-- Fix: Update your email and role here
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-actual-email@gmail.com';

-- If user doesn't exist, create them
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-actual-email@gmail.com', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Verify fix
SELECT 'After fix:' as '';
SELECT id, full_name, email, role FROM users;
```

Run it:
```bash
mysql -u root -p smartcampus_db < fix-my-login.sql
```

---

## 📞 STILL NOT WORKING?

### Enable Full Debug Mode:

1. **Backend:** Check console output for these logs:
   - `OAuth2 Login Debug`
   - `OAuth2 Success Handler`
   - Look for the role values

2. **Frontend:** Open browser console (F12) and check:
   - OAuth success page logs
   - localStorage values
   - Network tab for the redirect URL

3. **Database:** Verify data:
```sql
SELECT id, full_name, email, role, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Send This Info for Help:

1. Database role: `SELECT role FROM users WHERE email = 'your-email@gmail.com';`
2. Backend log: Copy the "OAuth2 Success Handler" section
3. Frontend console: Copy the "OAuth Success Page" logs
4. localStorage: Screenshot of Application → Local Storage

---

## 💡 PRO TIP

Add this to your project README:

```markdown
## First Time Setup

After cloning:
1. Copy `.env.example` to `.env` and fill in your credentials
2. Create database: `CREATE DATABASE smartcampus_db;`
3. Start backend: `./mvnw.cmd spring-boot:run`
4. Add your user:
   ```sql
   USE smartcampus_db;
   INSERT INTO users (full_name, email, role) 
   VALUES ('Your Name', 'your-google-email@gmail.com', 'ADMIN');
   ```
5. Start frontend: `cd frontend && npm install && npm run dev`
6. Login at http://localhost:5173/login
```

This will save everyone time! 🚀
