# Database Setup Guide for New Developers

## Quick Start - Setting Up Your Database

After cloning the project, follow these steps to set up your local database and create test users.

### Step 1: Create the Database

Open MySQL and run:
```sql
CREATE DATABASE smartcampus_db;
USE smartcampus_db;
```

### Step 2: Configure Your Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with YOUR credentials:
   ```
   DB_USERNAME=root
   DB_PASSWORD=your-mysql-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   JWT_SECRET=any-random-long-string
   ```

### Step 3: Start the Application

The application will automatically create all database tables when you first run it:

```bash
./mvnw.cmd spring-boot:run
```

Wait for the application to start completely (you'll see "Started UnisyncApplication" in the logs).

### Step 4: Create Test Users

After the application has started and created the tables, you need to add users to your database.

**Option A: Use the provided SQL script (Recommended)**

Open MySQL and run the `init-user-roles.sql` script:

```bash
mysql -u root -p smartcampus_db < init-user-roles.sql
```

Or manually in MySQL Workbench/command line:
```sql
USE smartcampus_db;

-- Admin user
INSERT INTO users (full_name, email, role) 
VALUES ('Admin User', 'admin@test.com', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Student user
INSERT INTO users (full_name, email, role) 
VALUES ('Student User', 'student@test.com', 'USER')
ON DUPLICATE KEY UPDATE role = 'USER';

-- Technician user
INSERT INTO users (full_name, email, role) 
VALUES ('Technician User', 'technician@test.com', 'TECHNICIAN')
ON DUPLICATE KEY UPDATE role = 'TECHNICIAN';
```

**Option B: Create users with your own email addresses**

Replace the email addresses with your own (or any test emails):

```sql
USE smartcampus_db;

-- Replace with your email addresses
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-email@gmail.com', 'ADMIN');

INSERT INTO users (full_name, email, role) 
VALUES ('Test Student', 'student-email@gmail.com', 'USER');

INSERT INTO users (full_name, email, role) 
VALUES ('Test Technician', 'tech-email@gmail.com', 'TECHNICIAN');
```

### Step 5: Login

Now you can login using Google OAuth with the email addresses you created in the database.

**Important:** The email you use to login with Google MUST match an email in the `users` table.

## Test Accounts

After running `init-user-roles.sql`, you'll have these test accounts:

| Role | Email | Purpose |
|------|-------|---------|
| ADMIN | ravinduthathsara38@gmail.com | Full system access |
| USER | ravinduthathsara47@gmail.com | Student access |
| TECHNICIAN | munasinghethathsara74@gmail.com | Technician access |

**Note:** You can only login if you have access to these Google accounts. For your own testing, create users with your own email addresses using Option B above.

## Troubleshooting

### "User not found" or "Access denied"
- Make sure the email in the database matches exactly with your Google account email
- Check that the user was actually inserted: `SELECT * FROM users;`

### Tables not created
- Make sure the application started successfully
- Check `application.properties` has `spring.jpa.hibernate.ddl-auto=update`
- Check database connection settings in `.env`

### Can't connect to database
- Verify MySQL is running
- Check database name is `smartcampus_db`
- Verify username and password in `.env` are correct

## Adding More Users

To add more users later, just insert them into the database:

```sql
INSERT INTO users (full_name, email, role) 
VALUES ('New User Name', 'newemail@example.com', 'USER');
```

Available roles: `ADMIN`, `USER`, `TECHNICIAN`
