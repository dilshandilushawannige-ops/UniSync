# Setup Checklist ✅

Use this checklist to make sure you've completed all setup steps.

## Prerequisites
- [ ] Java 17+ installed (`java -version`)
- [ ] MySQL 8.0+ installed and running
- [ ] Node.js 18+ installed (`node -v`)
- [ ] Maven installed (or use included `mvnw.cmd`)

## Backend Setup
- [ ] Cloned the repository
- [ ] Created MySQL database: `CREATE DATABASE smartcampus_db;`
- [ ] Copied `.env.example` to `.env`
- [ ] Updated `.env` with your MySQL password
- [ ] Updated `.env` with Google OAuth credentials (or use test values)
- [ ] Updated `.env` with JWT secret (or use default)
- [ ] Started backend: `./mvnw.cmd spring-boot:run`
- [ ] Backend started successfully (check for "Started UnisyncApplication" in logs)
- [ ] Tables created automatically in database (check with `SHOW TABLES;`)

## User Creation (CRITICAL!)
- [ ] Edited `create-my-users.sql` with your email addresses
- [ ] Ran SQL script: `mysql -u root -p smartcampus_db < create-my-users.sql`
- [ ] Verified users exist: `SELECT * FROM users;`
- [ ] At least one user with your Google email exists

## Frontend Setup
- [ ] Navigated to frontend folder: `cd frontend`
- [ ] Installed dependencies: `npm install`
- [ ] Started frontend: `npm run dev`
- [ ] Frontend accessible at http://localhost:5173

## Testing
- [ ] Opened http://localhost:5173 in browser
- [ ] Clicked "Login with Google"
- [ ] Logged in with Google account matching email in database
- [ ] Successfully logged in and see dashboard

## Common Issues

### ❌ "User not found" when logging in
**Solution:** Your Google email doesn't exist in the `users` table. Add it:
```sql
INSERT INTO users (full_name, email, role) 
VALUES ('Your Name', 'your-google-email@gmail.com', 'ADMIN');
```

### ❌ Backend won't start
**Solution:** Check:
- MySQL is running
- Database `smartcampus_db` exists
- `.env` file has correct credentials
- Port 8081 is not in use

### ❌ Frontend won't start
**Solution:** 
- Run `npm install` in frontend folder
- Check Node.js version is 18+
- Port 5173 is not in use

### ❌ Tables not created
**Solution:**
- Check `application.properties` has `spring.jpa.hibernate.ddl-auto=update`
- Check backend logs for errors
- Verify database connection

## Success! 🎉

If all checkboxes are checked, you're ready to develop!

- Backend: http://localhost:8081
- Frontend: http://localhost:5173
- Database: smartcampus_db

## Next Steps

- Explore the codebase
- Check existing tickets, bookings, resources
- Create test data
- Start developing!
