# Testing OAuth Role Selection Fix

## What Changed

Added a `CustomAuthorizationRequestRepository` that properly captures the role parameter during the OAuth authorization flow and stores it in the session.

## Before Testing

1. **Delete the existing test user from database:**
   ```sql
   DELETE FROM users WHERE email = 'streamsnippets6@gmail.com';
   ```

2. **Restart the backend server** (stop and start again)

3. **Clear browser data:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Storage -> Clear site data
   - Or use Incognito/Private window

## Testing Steps

1. Go to http://localhost:5173
2. Click "Get Started" button
3. Select "Technician" role (the wrench icon)
4. Click "Sign up with Google"
5. Complete Google OAuth flow

## What to Check

### In Backend Console Logs:
You should see these messages in order:

```
=== Custom Authorization Repository ===
Request URI: /oauth2/authorization/google
Query String: role=TECHNICIAN
Role parameter: TECHNICIAN
State: [some-random-state]
Stored role 'TECHNICIAN' for state: [some-random-state]
======================================

=== OAuth2 Login Debug ===
Email: streamsnippets6@gmail.com
Name: Stream Snippets
Session ID in UserService: [session-id]
Role from session: TECHNICIAN
Role set to TECHNICIAN
Selected role for new user: TECHNICIAN
Creating new user with role: TECHNICIAN
Final user role: TECHNICIAN
===========================

=== OAuth2 Success Handler ===
User authenticated with authority: ROLE_TECHNICIAN
Mapped frontend role: technician
Redirecting to: http://localhost:5173/oauth-success?token=...&role=technician&userId=...
==============================
```

### In Browser:
- You should be redirected to the technician dashboard
- URL should be: http://localhost:5173/technician/dashboard

### In Database:
```sql
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'streamsnippets6@gmail.com';
```

Should show:
- role: `TECHNICIAN`

## If It Still Doesn't Work

Check the backend logs for:
1. Is the "Custom Authorization Repository" message appearing?
2. Is the role parameter being captured?
3. Is the role being retrieved from session in CustomOAuth2UserService?

Share the complete backend console output from the OAuth flow.

## Testing USER Role

To test the USER role:
1. Delete the user again
2. Select "Student" role instead of "Technician"
3. Should create user with role "USER" and redirect to student dashboard
