# 🚀 QUICK LOGIN FIX - 2 MINUTES

## Your Friend Can't Login? Here's the Fast Fix:

### Step 1: Start Backend (if not running)
```bash
cd UniSync
./mvnw.cmd spring-boot:run
```
Wait for: `Started UnisyncApplication`

### Step 2: Add Their Email to Database
```sql
USE smartcampus_db;

-- Replace with THEIR actual Google email
INSERT INTO users (full_name, email, role) 
VALUES ('Their Name', 'their-google-email@gmail.com', 'ADMIN');
```

### Step 3: Login
Go to http://localhost:5173/login

**That's it!** ✅

---

## Admin Goes to Student Dashboard? Fix:

```sql
-- Check current role
SELECT email, role FROM users WHERE email = 'their-email@gmail.com';

-- Fix the role (must be UPPERCASE)
UPDATE users SET role = 'ADMIN' WHERE email = 'their-email@gmail.com';
```

Then logout and login again.

---

## Valid Roles (MUST be UPPERCASE in database):

| Database Role | Dashboard URL |
|--------------|---------------|
| `ADMIN` | /admin/dashboard |
| `USER` | /dashboard (student) |
| `TECHNICIAN` | /technician/dashboard |

---

## Quick Verify:
```bash
mysql -u root -p smartcampus_db < verify-login-setup.sql
```

---

## Still Broken?

1. Check backend logs for role value
2. Check browser console (F12) for role value  
3. Check localStorage (F12 → Application) for role value
4. Read `LOGIN-FIX-GUIDE.md` for detailed troubleshooting

---

## Common Mistakes:

❌ Using `admin` (lowercase) → ✅ Use `ADMIN` (uppercase)
❌ Email doesn't match Google account → ✅ Must match exactly
❌ Adding users before starting backend → ✅ Start backend first
❌ Not replacing template emails → ✅ Use real emails

---

**TL;DR:** Backend running → Add email to database → Login with that email 🎉
