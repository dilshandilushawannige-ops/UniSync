# UniSync Setup Guide

## Prerequisites
- Java 17+
- MySQL 8.0+
- Node.js 18+
- Maven

## Backend Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/UniSync.git
cd UniSync
```

### 2. Configure environment variables

Copy the example file:
```bash
copy .env.example .env
```

Edit `.env` with your credentials:
- Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
- Set your MySQL password
- Generate a random JWT secret

### 3. Set environment variables in Windows

Open PowerShell as Administrator and run:
```powershell
[System.Environment]::SetEnvironmentVariable('GOOGLE_CLIENT_ID', 'your-value', 'User')
[System.Environment]::SetEnvironmentVariable('GOOGLE_CLIENT_SECRET', 'your-value', 'User')
[System.Environment]::SetEnvironmentVariable('DB_USERNAME', 'root', 'User')
[System.Environment]::SetEnvironmentVariable('DB_PASSWORD', 'your-password', 'User')
[System.Environment]::SetEnvironmentVariable('JWT_SECRET', 'your-secret', 'User')
```

**Important:** Restart your IDE/terminal after setting environment variables!

### 4. Create MySQL database
```sql
CREATE DATABASE smartcampus_db;
```

### 5. Run the backend
```bash
./mvnw.cmd spring-boot:run
```

Backend will start on: http://localhost:8081

### 6. Create test users in database

**Important:** After the application starts, you need to add users to login!

See [DATABASE-SETUP.md](DATABASE-SETUP.md) for detailed instructions.

Quick command:
```bash
mysql -u root -p smartcampus_db < init-user-roles.sql
```

Or create your own users with your email addresses - see DATABASE-SETUP.md

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the frontend
```bash
npm run dev
```

Frontend will start on: http://localhost:5173

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8081/login/oauth2/code/google`
6. Copy Client ID and Client Secret to your `.env` file

## Troubleshooting

### Port already in use
```bash
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process
taskkill /F /PID <process-id>
```

### Environment variables not working
- Make sure you restarted your IDE/terminal after setting them
- Check if variables are set: `echo $env:GOOGLE_CLIENT_ID` (PowerShell)

### Database connection failed
- Verify MySQL is running
- Check database name, username, and password in `.env`
- Ensure database `smartcampus_db` exists

## Need Help?
Contact the team or check the project documentation.
