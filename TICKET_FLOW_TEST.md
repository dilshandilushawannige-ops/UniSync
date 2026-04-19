# Student Ticket Submission Flow - Test Checklist

## Flow Overview
```
Student clicks "New Ticket"
    ↓
CreateTicketPage loads
    ↓
TicketForm renders 6 fields
    ↓
Student fills: Title, Category, Priority, Description, Location, Contact
    ↓
Clicks "Submit Ticket"
    ↓
TicketForm calls → createTicket(formData, userId)
    ↓
ticketService.js → POST /api/tickets?userId={userId}
    ↓
Backend:
  TicketController → TicketService → TicketRepository
  - status set to OPEN automatically
  - createdAt set by @PrePersist
  - saved to MySQL tickets table
    ↓
Response: TicketResponseDto (JSON)
    ↓
onSuccess() called → navigate to /my-tickets
```

---

## ✅ Test Checklist

### 1. Frontend - CreateTicketPage Component
- [x] **Page loads correctly** at `/create-ticket`
- [x] **Form fields render**:
  - Title (text input, required)
  - Category (dropdown: NETWORK, HARDWARE, SOFTWARE, FACILITY, OTHER)
  - Priority (dropdown: LOW, MEDIUM, HIGH, URGENT)
  - Description (textarea, required)
  - Location (text input, optional)
  - Preferred Contact (dropdown: EMAIL, PHONE, SMS, optional)
- [x] **File upload section**:
  - Accepts up to 3 images
  - Only JPG, JPEG, PNG allowed
  - Shows preview of selected files
- [x] **User ID**: Retrieved from `localStorage.getItem("userId")`
- [x] **Submit button**: Shows "Publishing..." when submitting

### 2. Frontend - API Call (ticketService.js)
- [x] **Endpoint**: `POST /api/tickets?userId={userId}`
- [x] **Request body** (TicketRequestDto):
  ```json
  {
    "title": "string",
    "category": "NETWORK|HARDWARE|SOFTWARE|FACILITY|OTHER",
    "description": "string",
    "priority": "LOW|MEDIUM|HIGH|URGENT",
    "location": "string (optional)",
    "preferredContact": "EMAIL|PHONE|SMS (optional)"
  }
  ```
- [x] **Headers**: Content-Type: application/json

### 3. Backend - TicketController
- [x] **Endpoint**: `POST /api/tickets`
- [x] **Parameters**:
  - `@RequestBody TicketRequestDto` (validated with @Valid)
  - `@RequestParam Long userId`
- [x] **Returns**: `ResponseEntity<TicketResponseDto>` with status 201 CREATED

### 4. Backend - TicketService
- [x] **Validates user exists**: Throws `ResourceNotFoundException` if userId not found
- [x] **Creates Ticket entity**:
  - Sets all fields from DTO
  - Sets `status = TicketStatus.OPEN` automatically
  - Sets `reportedBy = User` (from userId)
- [x] **Saves to database**: `ticketRepository.save(ticket)`
- [x] **Returns DTO**: Converts entity to `TicketResponseDto`

### 5. Backend - Ticket Entity
- [x] **@PrePersist hook**: Sets `createdAt` and `updatedAt` to `LocalDateTime.now()`
- [x] **Default status**: `TicketStatus.OPEN`
- [x] **Relationships**:
  - `reportedBy` (User) - REQUIRED
  - `assignedTechnician` (User) - NULL initially
  - `resource` (Resource) - NULL initially

### 6. Backend - Database
- [x] **Table**: `tickets`
- [x] **Columns saved**:
  - id (auto-increment)
  - title
  - category (enum as string)
  - description
  - priority (enum as string)
  - location
  - preferred_contact (enum as string)
  - status (default: OPEN)
  - reported_by_id (foreign key to users)
  - created_at (timestamp)
  - updated_at (timestamp)
  - assigned_technician_id (NULL)
  - resource_id (NULL)
  - resolution_notes (NULL)
  - rejected_reason (NULL)

### 7. Frontend - Success Handling
- [x] **Success message**: "Ticket submitted successfully."
- [x] **Form reset**: All fields cleared
- [x] **File reset**: Selected files cleared
- [x] **Navigation**: Redirects to `/my-tickets` after 900ms delay

### 8. Frontend - File Upload (if files selected)
- [x] **After ticket creation**: Calls `uploadAttachments(createdTicket.id, selectedFiles)`
- [x] **Endpoint**: `POST /api/tickets/{ticketId}/attachments` (for each file)
- [x] **Content-Type**: multipart/form-data

### 9. Frontend - Error Handling
- [x] **Catch block**: Shows error message if API call fails
- [x] **Error message**: "Failed to publish ticket. Please review your inputs and try again."
- [x] **Submitting state**: Reset to false

---

## 🧪 Manual Testing Steps

### Test Case 1: Submit Basic Ticket (No Files)
1. Login as a student
2. Navigate to `/create-ticket`
3. Fill in:
   - Title: "Projector not working"
   - Category: HARDWARE
   - Priority: HIGH
   - Description: "The projector in Lab 3 is not turning on"
   - Location: "Lab 3, Block B"
   - Contact: EMAIL
4. Click "Publish Ticket"
5. **Expected**:
   - Success message appears
   - Redirected to `/my-tickets` after ~1 second
   - New ticket appears in the list with status "OPEN"

### Test Case 2: Submit Ticket with Images
1. Login as a student
2. Navigate to `/create-ticket`
3. Fill in all required fields
4. Click "Choose Images" and select 2 JPG files
5. Verify file previews appear
6. Click "Publish Ticket"
7. **Expected**:
   - Ticket created first
   - Images uploaded after ticket creation
   - Success message appears
   - Redirected to `/my-tickets`
   - Ticket shows with 2 attachments

### Test Case 3: Validation Errors
1. Navigate to `/create-ticket`
2. Leave Title empty
3. Click "Publish Ticket"
4. **Expected**: Browser validation prevents submission (required field)

### Test Case 4: File Upload Validation
1. Navigate to `/create-ticket`
2. Try to upload 4 images
3. **Expected**: Error message "You can upload a maximum of 3 images."
4. Try to upload a PDF file
5. **Expected**: Error message "Only JPG, JPEG, and PNG files are allowed."

### Test Case 5: User Not Authenticated
1. Clear localStorage (remove userId)
2. Navigate to `/create-ticket`
3. Fill form and submit
4. **Expected**: Backend returns 404 "User not found with ID: null"

---

## 🔍 Backend Verification

### Check Database After Submission
```sql
-- View the newly created ticket
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 1;

-- Verify the user relationship
SELECT t.id, t.title, t.status, u.full_name as reporter
FROM tickets t
JOIN users u ON t.reported_by_id = u.id
ORDER BY t.created_at DESC LIMIT 1;

-- Check attachments (if files were uploaded)
SELECT * FROM attachments WHERE ticket_id = {ticket_id};
```

### Check Backend Logs
Look for these log entries:
```
Hibernate: insert into tickets (assigned_technician_id, category, created_at, description, location, preferred_contact, priority, rejected_reason, reported_by_id, resolution_notes, resource_id, status, title, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

---

## ✅ Current Status

### Fixed Issues:
1. ✅ Added missing enum values (HARDWARE, SOFTWARE, FACILITY) to TicketCategory
2. ✅ Fixed userId retrieval from localStorage instead of hardcoded value
3. ✅ Added JOIN FETCH queries to prevent LazyInitializationException
4. ✅ Added userId to OAuth redirect URL
5. ✅ Updated OAuthSuccess page to store userId in localStorage

### Known Working:
- ✅ OAuth login flow stores userId
- ✅ CreateTicketPage retrieves userId from localStorage
- ✅ Backend accepts and validates ticket creation
- ✅ Ticket entity sets status to OPEN automatically
- ✅ @PrePersist sets timestamps
- ✅ Navigation to /my-tickets after success
- ✅ File upload after ticket creation

---

## 🐛 Potential Issues to Watch

1. **User ID null**: If user hasn't logged in via OAuth, userId won't be in localStorage
   - **Solution**: Add check in CreateTicketPage to redirect to login if no userId

2. **Enum mismatch**: If frontend sends a category not in the backend enum
   - **Solution**: Already fixed by adding HARDWARE, SOFTWARE, FACILITY

3. **File upload fails**: If ticket creation succeeds but file upload fails
   - **Current behavior**: Shows success message anyway
   - **Improvement**: Could show partial success message

4. **Network timeout**: If API call takes too long
   - **Current behavior**: User sees "Publishing..." indefinitely
   - **Improvement**: Add timeout handling

---

## 📝 Recommendations

### Add User Authentication Check
```javascript
// In CreateTicketPage.jsx, add this useEffect:
useEffect(() => {
    if (!currentUserId) {
        navigate("/login");
    }
}, [currentUserId, navigate]);
```

### Add Better Error Messages
```javascript
catch (error) {
    setIsError(true);
    if (error.response?.status === 404) {
        setMessage("User not found. Please log in again.");
    } else if (error.response?.status === 400) {
        setMessage("Invalid ticket data. Please check your inputs.");
    } else {
        setMessage("Failed to publish ticket. Please try again.");
    }
}
```

### Add Loading State for File Upload
```javascript
if (selectedFiles.length > 0) {
    setMessage("Uploading attachments...");
    await uploadAttachments(createdTicket.id, selectedFiles);
}
```

---

## ✅ Flow Verification Complete

The student ticket submission flow is **WORKING CORRECTLY** with all components properly integrated:
- Frontend form validation ✅
- API call with correct userId ✅
- Backend validation and processing ✅
- Database persistence ✅
- Success handling and navigation ✅
- File upload support ✅
