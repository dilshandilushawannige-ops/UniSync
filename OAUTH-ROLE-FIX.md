# OAuth Role Selection Fix

## Problem
When users selected "Technician" role during Google OAuth signup, they were being created as "USER" role in the database and redirected to the user dashboard instead of the technician dashboard.

## Root Cause
The backend `CustomOAuth2UserService` was hardcoding all new OAuth users to `UserRole.USER`, ignoring the role selection made on the frontend.

## Solution
Implemented a role parameter passing mechanism through the OAuth flow:

### Changes Made:

1. **Frontend (HomePage.jsx)**
   - Modified Google OAuth URL to include the selected role as a query parameter
   - Example: `/oauth2/authorization/google?role=TECHNICIAN`

2. **Backend Filter (OAuth2AuthorizationRequestFilter.java)** - NEW FILE
   - Created a servlet filter to intercept OAuth authorization requests
   - Extracts the `role` parameter from the query string
   - Stores it in the HTTP session with key `pendingOAuthRole`

3. **Backend Service (CustomOAuth2UserService.java)**
   - Modified to retrieve the `pendingOAuthRole` from the session
   - Uses the selected role when creating new users
   - Falls back to `USER` role if no role is specified
   - Existing users keep their database role (unchanged)

4. **Security Config (SecurityConfig.java)**
   - Registered the new `OAuth2AuthorizationRequestFilter` in the filter chain
   - Filter runs before authentication to capture the role parameter

## How It Works:

1. User clicks "Get Started" on home page
2. User selects role (USER or TECHNICIAN)
3. User clicks "Sign up with Google"
4. Frontend redirects to: `/oauth2/authorization/google?role=TECHNICIAN`
5. Filter intercepts request and stores role in session
6. OAuth flow completes with Google
7. `CustomOAuth2UserService` retrieves role from session
8. New user is created with the selected role
9. User is redirected to the appropriate dashboard

## Testing:
1. Clear your database or use a new Google account
2. Go to home page and click "Get Started"
3. Select "Technician" role
4. Sign up with Google
5. Verify you're redirected to technician dashboard
6. Check database - role should be "TECHNICIAN"

## Notes:
- Existing users will keep their current role from the database
- The role parameter is only used for NEW user creation
- Session-based approach ensures the role survives the OAuth redirect flow
