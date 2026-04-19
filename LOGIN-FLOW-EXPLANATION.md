# Login Flow and Dashboard Routing

## Overview
The application uses Google OAuth2 for authentication and automatically routes users to their respective dashboards based on their role stored in the database.

## Test Users

| Email | Role | Dashboard Route |
|-------|------|----------------|
| ravinduthathsara38@gmail.com | ADMIN | /admin/dashboard |
| ravinduthathsara47@gmail.com | USER (Student) | /dashboard |
| munasinghethathsara74@gmail.com | TECHNICIAN | /technician/dashboard |

## How It Works

### 1. User Clicks "Continue with Google"
- Frontend redirects to: `http://localhost:8081/oauth2/authorization/google`
- User authenticates with Google

### 2. Backend Processes Authentication
- `CustomOAuth2UserService` receives user info from Google
- Checks if user exists in database by email
- If exists: Uses role from database (ADMIN, USER, or TECHNICIAN)
- If new: Creates user with default role (USER)

### 3. Role Mapping
- Backend roles: `USER`, `ADMIN`, `TECHNICIAN`
- Spring Security adds "ROLE_" prefix: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_TECHNICIAN`
- Frontend roles: `student`, `admin`, `technician`

### 4. Redirect to Frontend
- `OAuth2LoginSuccessHandler` maps roles:
  - `ROLE_ADMIN` → `admin`
  - `ROLE_TECHNICIAN` → `technician`
  - `ROLE_USER` → `student`
- Redirects to: `http://localhost:5173/oauth-success?token=...&role=...`

### 5. Frontend Routes to Dashboard
- `OAuthSuccess.jsx` receives token and role
- Stores in localStorage
- Routes based on role:
  - `admin` → `/admin/dashboard`
  - `technician` → `/technician/dashboard`
  - `student` → `/dashboard`

## Data Initialization

The `DataInitializer` class automatically creates/updates the three test users when the application starts. This ensures:
- Users exist in database before first login
- Correct roles are assigned
- No manual SQL script execution needed

## Testing the Flow

1. Start backend: `mvn spring-boot:run` (from UniSync directory)
2. Start frontend: `npm run dev` (from UniSync/frontend directory)
3. Go to: `http://localhost:5173/login`
4. Click "Continue with Google"
5. Login with one of the test emails
6. You should be redirected to the correct dashboard

## Admin Dashboard Features

The admin dashboard includes:
- Dashboard (📊) - Overview and statistics
- Ticket Manage (🎫) - Manage support tickets
- Booking Manage (📅) - Manage resource bookings
- Resource Manager (📦) - Manage resources
- Announcement (📢) - Manage notifications
- Profile (👤) - Admin profile
- Logout (🚪) - Sign out

## Troubleshooting

If redirected to wrong dashboard:
1. Check backend logs for user role
2. Verify user exists in database with correct role
3. Clear browser localStorage and try again
4. Check console logs in browser developer tools
