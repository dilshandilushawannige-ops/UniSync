# Quick Start for New Developers

## I just cloned the project, what do I do?

### 1️⃣ Create Database
```sql
CREATE DATABASE smartcampus_db;
```

### 2️⃣ Configure Environment
```bash
copy .env.example .env
```
Edit `.env` with your MySQL password and Google OAuth credentials.

### 3️⃣ Start Application
```bash
./mvnw.cmd spring-boot:run
```
Wait for it to finish starting (creates all tables automatically).

### 4️⃣ Create Users (IMPORTANT!)
Edit `create-my-users.sql` with your email addresses, then run:
```bash
mysql -u root -p smartcampus_db < create-my-users.sql
```

### 5️⃣ Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6️⃣ Login
Go to http://localhost:5173 and login with Google using the email you added to the database.

---

## Need More Help?
- Full setup guide: [SETUP.md](SETUP.md)
- Database details: [DATABASE-SETUP.md](DATABASE-SETUP.md)
- Can't login? Make sure your Google email matches an email in the `users` table!
