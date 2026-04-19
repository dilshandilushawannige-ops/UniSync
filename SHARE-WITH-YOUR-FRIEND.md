# 📧 Send This to Your Friend

Hey! Here's how to fix your login issues:

## Problem 1: Can't Login At All

You need to add your email to the database first!

### Quick Fix:
1. Make sure backend is running: `./mvnw.cmd spring-boot:run`
2. Open MySQL and run:
```sql
USE smartcampus_db;
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-google-email@gmail.com', 'ADMIN');
```
3. Login at http://localhost:5173/login

**Important:** Use YOUR actual Google email address!

---

## Problem 2: Admin Email Goes to Student Dashboard

The role in your database is wrong or lowercase.

### Quick Fix:
```sql
-- Check current role
SELECT email, role FROM users;

-- Fix it (role must be UPPERCASE)
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

Then logout and login again.

---

## Valid Roles (MUST be UPPERCASE):
- `ADMIN` → Admin dashboard
- `USER` → Student dashboard
- `TECHNICIAN` → Technician dashboard

---

## Complete Setup for New Clone:

1. **Copy environment file:**
```bash
copy .env.example .env
```

2. **Edit `.env` with your credentials:**
- Google OAuth credentials
- Database password
- JWT secret

3. **Create database:**
```sql
CREATE DATABASE smartcampus_db;
```

4. **Start backend** (creates tables):
```bash
./mvnw.cmd spring-boot:run
```

5. **Add your user:**
```sql
USE smartcampus_db;
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-google-email@gmail.com', 'ADMIN');
```

6. **Start frontend:**
```bash
cd frontend
npm install
npm run dev
```

7. **Login:** http://localhost:5173/login

---

## Verify Setup:
```bash
mysql -u root -p smartcampus_db < verify-login-setup.sql
```

---

## More Help:

Read these files in order:
1. `QUICK-LOGIN-FIX.md` - 2-minute fix
2. `FOR-YOUR-FRIEND.md` - Detailed setup
3. `LOGIN-FIX-GUIDE.md` - Complete troubleshooting

---

## Common Mistakes to Avoid:

❌ Using lowercase `admin` → ✅ Use uppercase `ADMIN`
❌ Email doesn't match Google account → ✅ Must match exactly
❌ Using template emails like `your-email@gmail.com` → ✅ Replace with real email
❌ Adding users before starting backend → ✅ Start backend first

---

**TL;DR:** Start backend → Add your email to database → Login with that email ✅

Good luck! 🚀
