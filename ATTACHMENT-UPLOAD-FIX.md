# Attachment Upload & Comments Fix

## Issues Fixed

### 1. Authentication Token Not Included
The API requests were not including the JWT authentication token in headers.

**Fix:** Added request interceptor to `frontend/src/services/api.js` to automatically include the Bearer token from localStorage in all API requests.

### 2. Poor Error Messages
Upload errors were showing generic "Upload failed" message without details.

**Fix:** Updated `AttachmentUpload.jsx` to display actual error messages from the backend.

### 3. Missing File Size Validation
Frontend wasn't validating file size before upload, causing backend errors.

**Fix:** Added 5MB file size validation in the frontend before attempting upload.

## How to Test

### Upload Attachments
1. Log in as a user (student, technician, or admin)
2. Navigate to a ticket details page
3. Scroll to "Upload Attachments" section
4. Click "Choose Files" and select 1-3 image files (JPG, JPEG, or PNG)
5. Ensure each file is under 5MB
6. Click "Upload" button
7. Files should upload successfully and appear in the attachments preview

### Add Comments
1. On the same ticket details page
2. Scroll to the "Comments" section
3. Type your comment in the text area
4. Click "Post Comment"
5. Comment should appear immediately in the list

## Common Issues & Solutions

### Issue: "Upload failed. Please try again."
**Possible Causes:**
1. File is larger than 5MB
2. File type is not JPG, JPEG, or PNG
3. Ticket already has 3 attachments (maximum allowed)
4. Backend server is not running
5. Authentication token is missing or expired

**Solutions:**
- Check file size (must be under 5MB)
- Check file type (only images allowed)
- Check browser console for detailed error message
- Ensure backend is running on port 8081
- Try logging out and logging back in to refresh token

### Issue: "Only JPG, JPEG, and PNG files are allowed."
**Solution:** Select only image files with .jpg, .jpeg, or .png extensions

### Issue: "File is too large. Maximum size is 5MB."
**Solution:** Compress or resize the image before uploading

### Issue: "Maximum 3 attachments allowed per ticket"
**Solution:** Delete existing attachments before uploading new ones

### Issue: Comments not posting
**Possible Causes:**
1. Not logged in
2. Backend server not running
3. Network error

**Solutions:**
- Check if you're logged in (token in localStorage)
- Verify backend is running
- Check browser console for errors
- Check network tab in DevTools

## Backend Configuration

### File Upload Settings
Location: `src/main/resources/application.properties`

```properties
# File upload settings
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=15MB
```

### Upload Directory
Files are saved to: `uploads/` folder in the project root

Make sure this directory exists and has write permissions:
```bash
mkdir -p uploads
chmod 755 uploads
```

## API Endpoints

### Attachments
- `POST /api/tickets/{ticketId}/attachments` - Upload file
- `GET /api/tickets/{ticketId}/attachments` - Get all attachments for a ticket
- `DELETE /api/attachments/{attachmentId}` - Delete an attachment

### Comments
- `POST /api/tickets/{ticketId}/comments?userId={userId}` - Add comment
- `GET /api/tickets/{ticketId}/comments` - Get all comments for a ticket
- `PUT /api/comments/{commentId}?content={content}&userId={userId}` - Update comment
- `DELETE /api/comments/{commentId}?userId={userId}` - Delete comment

## Testing Checklist

- [ ] Backend server is running on port 8081
- [ ] Frontend server is running on port 5173
- [ ] User is logged in (check localStorage for token)
- [ ] Ticket exists and ID is valid
- [ ] File is under 5MB
- [ ] File is JPG, JPEG, or PNG format
- [ ] Ticket has less than 3 attachments
- [ ] uploads/ directory exists with write permissions
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API responses

## Technician Workflow

As a technician, after fixing an issue:

1. Navigate to the assigned ticket
2. Update ticket status to "RESOLVED"
3. Add resolution notes in the status update
4. Upload photos of the fixed issue (before/after)
5. Add comments explaining what was done
6. Ticket is now marked as resolved with documentation

## User Permissions

- **Students:** Can upload attachments and comment on their own tickets
- **Technicians:** Can upload attachments and comment on assigned tickets
- **Admins:** Can upload attachments and comment on any ticket

All roles can delete their own attachments and comments.
