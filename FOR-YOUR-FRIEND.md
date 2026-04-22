# Hey! Can't Login? Here's the Fix 👋

## The Problem
You cloned the project, set up your database, but can't login because there are NO USERS in your database yet!

**Why this happens:** The app uses Google OAuth. When you login with Google, it checks if your email exists in the database. If not found = can't login!

## The Solution (2 minutes)

### Step 1: Make sure your app is running
```bash
./mvnw.cmd spring-boot:run
```
Wait for it to finish starting. It will create all the database tables automatically.

### Step 2: Create users in your database

**IMPORTANT:** Replace the template emails with YOUR ACTUAL Google email addresses!

**Option A - Quick (use the template):**

1. Open the file `create-my-users.sql`
2. Replace `your-admin-email@gmail.com` with YOUR actual Google email
3. Save the file
4. Run this command:
```bash
mysql -u root -p smartcampus_db < create-my-users.sql
```

**Option B - Manual (if you prefer):**

Open MySQL and run:
```sql
USE smartcampus_db;

-- ⚠️ Replace with YOUR actual Google email address
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-actual-email@gmail.com', 'ADMIN');
```

**CRITICAL:** The role must be UPPERCASE: `ADMIN`, `USER`, or `TECHNICIAN`

### Step 3: Login
Now go to http://localhost:5173 and login with Google using the email you just added!

## Why This Happens

The application uses Google OAuth for authentication. When you login with Google, the system checks if your email exists in the `users` table. If it doesn't exist, you can't login.

So you need to manually add your email to the database first!

## Available Roles

When creating users, you can use these roles (MUST be UPPERCASE in database):
- `ADMIN` - Full access to everything → redirects to `/admin/dashboard`
- `USER` - Student access (create tickets, book resources) → redirects to `/dashboard`
- `TECHNICIAN` - Can manage and resolve tickets → redirects to `/technician/dashboard`

**Common Mistake:** Using lowercase `admin` instead of uppercase `ADMIN` ❌

## Still Having Issues?

### Issue 1: "User not found" or login fails
- Make sure the email in database matches EXACTLY with your Google account email
- Check: `SELECT * FROM users WHERE email = 'your-email@gmail.com';`

### Issue 2: Admin redirects to student dashboard
- Check role in database: `SELECT email, role FROM users;`
- Role must be UPPERCASE: `ADMIN` not `admin`
- Fix: `UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';`

### Issue 3: Can't see any users
- Run: `SELECT * FROM users;`
- If empty, you need to add users first (see Step 2 above)

Check these files for more help:
- **QUICK-LOGIN-FIX.md** - 2-minute fix guide
- **LOGIN-FIX-GUIDE.md** - Complete troubleshooting guide
- **DATABASE-SETUP.md** - Detailed database instructions
- **SETUP.md** - Complete setup guide

## Quick Verification

To check if users exist in your database:
```sql
SELECT * FROM users;
```

You should see at least one user with your email address!

---

**TL;DR:** Run the app first, then add your email to the database using `create-my-users.sql`, then login! 🚀
