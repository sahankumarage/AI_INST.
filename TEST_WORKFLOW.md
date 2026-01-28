# Zoom Integration Testing Workflow

## Complete Step-by-Step Testing Guide

Follow these steps in order to test and verify your Zoom integration.

---

## Phase 1: Validate Configuration (5 minutes)

### Step 1: Start Development Server

```bash
cd /Users/poornaindrakeela/Desktop/AI_INST
npm run dev
```

**Expected**: Server starts on http://localhost:3000

---

### Step 2: Run Comprehensive Validation

```bash
curl http://localhost:3000/api/zoom/validate-config
```

or open in browser: http://localhost:3000/api/zoom/validate-config

**Expected Output**:
```json
{
  "overallStatus": "HEALTHY",
  "summary": {
    "totalChecks": 6,
    "passed": 6,
    "failed": 0,
    "passRate": "100%"
  },
  "checks": [
    { "name": "Environment Variables", "status": "PASS" },
    { "name": "OAuth Token Generation", "status": "PASS" },
    { "name": "SDK Key", "status": "PASS" },
    { "name": "Signature Generation", "status": "PASS" },
    { "name": "Zoom API Access", "status": "PASS" },
    { "name": "Meeting API Permissions", "status": "PASS" }
  ]
}
```

**If any checks FAIL**:
- Read the error messages in the response
- Follow the "recommendations" array
- Fix the issues
- Run validation again

**Common failures and fixes**:
- Environment Variables FAIL → Restart dev server after creating .env.local
- OAuth Token FAIL → Check Server-to-Server OAuth app is activated
- Zoom API Access FAIL → Verify credentials match Zoom app
- Meeting API Permissions FAIL → Add meeting:read and meeting:write scopes

---

## Phase 2: Create Test Meeting (2 minutes)

### Step 3: Create a Zoom Meeting via API

```bash
curl -X POST http://localhost:3000/api/zoom/create-meeting \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test LMS Integration",
    "duration": 60
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Test meeting created successfully",
  "meeting": {
    "meetingNumber": "87887878787",
    "topic": "Test LMS Integration",
    "joinUrl": "https://zoom.us/j/87887878787",
    "startUrl": "https://zoom.us/s/87887878787?zak=...",
    "password": "abc123"
  },
  "instructions": {
    "forDatabase": {
      "zoomMeetingNumber": "87887878787",
      "zoomPassword": "abc123",
      "isLiveClass": true
    }
  }
}
```

**Save these values**:
- `meetingNumber` - You'll need this for the next step
- `startUrl` - Use this to start meeting from Zoom app later
- `password` - If present, save it

**If it fails**:
- Check OAuth app has meeting:write scope
- Verify ZOOM_ACCOUNT_ID is correct
- Ensure OAuth app is activated

---

## Phase 3: Configure Database (2 minutes)

### Step 4: Find Your Course Structure

```bash
curl http://localhost:3000/api/admin/seed-zoom-test
```

**Response shows all courses**. Pick one and get its structure:

```bash
curl "http://localhost:3000/api/admin/seed-zoom-test?courseSlug=YOUR_COURSE_SLUG"
```

**Example Response**:
```json
{
  "success": true,
  "course": {
    "slug": "ai-fundamentals",
    "title": "AI Fundamentals",
    "modules": [
      {
        "index": 0,
        "title": "Introduction",
        "lessons": [
          { "index": 0, "title": "Welcome", "isLiveClass": false },
          { "index": 1, "title": "Course Overview", "isLiveClass": false }
        ]
      }
    ]
  }
}
```

**Note the indices** of the module and lesson you want to use for testing.

---

### Step 5: Seed Zoom Meeting Data

Use the meeting number from Step 3 and indices from Step 4:

```bash
curl -X POST http://localhost:3000/api/admin/seed-zoom-test \
  -H "Content-Type: application/json" \
  -d '{
    "courseSlug": "YOUR_COURSE_SLUG",
    "moduleIndex": 0,
    "lessonIndex": 0,
    "meetingNumber": "87887878787",
    "meetingPassword": "abc123",
    "scheduledAt": "2026-01-27T15:00:00Z"
  }'
```

**Replace**:
- `YOUR_COURSE_SLUG` - from Step 4
- `87887878787` - your meeting number from Step 3
- `abc123` - your meeting password from Step 3 (if any)
- `2026-01-27T15:00:00Z` - scheduled time (use current or future)

**Expected Response**:
```json
{
  "success": true,
  "message": "Lesson updated with Zoom meeting data",
  "lesson": {
    "title": "Welcome",
    "isLiveClass": true,
    "zoomMeetingNumber": "87887878787"
  },
  "nextSteps": [
    "Ensure student is enrolled in this course",
    "Start Zoom meeting from desktop app",
    "Login as student and navigate to this lesson",
    "Click 'Join Live Class' button"
  ]
}
```

---

## Phase 4: Verify Zoom Marketplace Settings (5 minutes)

### Step 6: Check Server-to-Server OAuth App

1. Go to: https://marketplace.zoom.us/develop/apps
2. Find your **Server-to-Server OAuth** app
3. Verify:
   - [ ] Status is "Activated"
   - [ ] Scopes include `meeting:read:admin` or `meeting:read:meeting:admin`
   - [ ] Scopes include `meeting:write:admin` or `meeting:write:meeting:admin`
   - [ ] Account ID, Client ID, Client Secret match your .env.local

---

### Step 7: Check Meeting SDK App

1. Still at: https://marketplace.zoom.us/develop/apps
2. Find your **Meeting SDK** app (might be called "General App")
3. **CRITICAL SETTINGS**:
   - [ ] Status is "Activated"
   - [ ] Under "App Credentials": SDK Key and SDK Secret match your .env.local
   - [ ] Under "Embedding": **"Allow to join meetings from browser" is ENABLED**
   - [ ] Under "Domain Whitelist": Add these domains:
     - `localhost:3000`
     - `localhost`
     - Your production domain (if deploying)

**This is the #1 reason for failures!**

---

## Phase 5: Check Zoom Account Settings (2 minutes)

### Step 8: Verify Account-Level Settings

1. Go to: https://zoom.us/profile/setting
2. Under "Meeting" tab:
   - [ ] "Join from browser" → **ON** (blue/enabled)
   - [ ] "Waiting room" → **OFF** (or at least optional, not required)
3. Scroll down to "Allow participants to join before host":
   - [ ] → **ON** (enabled)
4. Check "In Meeting (Advanced)" tab:
   - [ ] "Allow participants to join before host" → **ON**

---

## Phase 6: End-to-End Test (5 minutes)

### Step 9: Prepare Test Environment

**You'll need**:
- Zoom desktop app installed
- Browser with console open (F12)
- Student account credentials (enrolled in the test course)
- Meeting start URL from Step 3

---

### Step 10: Start Zoom Meeting (Instructor Side)

**Option A**: Use start URL from Step 3
- Open the `startUrl` in browser
- It will launch Zoom desktop app
- Start the meeting

**Option B**: Start from Zoom desktop app
- Open Zoom desktop app
- Go to Meetings
- Find the meeting by number (87887878787)
- Click "Start"

**Meeting should now be running**

---

### Step 11: Join as Student (Student Side)

1. **Open browser** with console open (Press F12)
2. **Clear console** so you can see new logs
3. **Login** as student (http://localhost:3000/student-login)
4. **Navigate to** Portal → Courses → Your Test Course → Classroom
5. **Select the lesson** you configured in Step 5
6. **You should see**:
   - Live class indicator (red dot + "Live")
   - "Join Live Class" button (green)
7. **Click "Join Live Class"**

---

### Step 12: Watch Console Logs

**Successful flow looks like this**:

```
=== ZOOM SIGNATURE REQUEST ===
Request params: { userId: "...", courseSlug: "...", lessonId: "..." }
Verifying user and enrollment...
✅ User found: student@example.com
✅ User is enrolled or is admin
✅ Course found: Your Course Name
✅ Lesson found: Your Lesson Name
✅ Meeting number: 87887878787
Generating Zoom signature...
✅ Signature generated successfully
SDK Key: ISf5oJsmS2...
=== END ZOOM SIGNATURE REQUEST ===

=== ZOOM SDK INITIALIZATION ===
Meeting Number: 87887878787
SDK Key: ISf5oJsmS2...
Signature preview: eyJhbGc...
User Name: John Doe
SDK Inited, Joining...
Joined successfully
Connection Status: Connected
```

**Student should now be in the meeting!**

---

## Troubleshooting

### Error: "Failed to get Zoom access token"
**Console shows**: 401 Unauthorized
**Fix**:
- Go to Zoom Marketplace → Server-to-Server OAuth app
- Click "Activate" if not activated
- Verify credentials in .env.local match

---

### Error: "Invalid signature" or signature verification failed
**Console shows**: Signature error from Zoom SDK
**Fix**:
- Verify ZOOM_SDK_SECRET in .env.local is correct
- Make sure you're using SDK credentials, not OAuth credentials
- Check Meeting SDK app is activated

---

### Error: "Meeting has not started yet" (Error Code 200)
**Console shows**: Error code 200
**Fix**:
- Start meeting from Zoom desktop app first
- OR enable "join before host" in meeting settings
- OR enable it account-wide (Step 8)

---

### Error: "Invalid meeting number" (Error Code 3712)
**Console shows**: Error code 3712
**Fix**:
- Verify meeting exists in Zoom account
- Check meeting number in database matches actual meeting
- Ensure format is just digits (no spaces or dashes)

---

### Error: CORS errors in console
**Console shows**: "Blocked by CORS policy" or "iframe refused to connect"
**Fix**:
- Go to Meeting SDK app settings
- Add `localhost:3000` to domain whitelist
- Make sure "Allow to join meetings from browser" is enabled

---

### Error: "Join from browser not available"
**Console shows**: Error about browser join not allowed
**Fix**:
- Go to https://zoom.us/profile/setting
- Enable "Join from browser"
- Restart the meeting

---

### Student can't see "Join Live Class" button
**Possible reasons**:
1. Lesson doesn't have `isLiveClass: true` → Run Step 5 again
2. No `zoomMeetingNumber` in database → Run Step 5 again
3. Student not enrolled → Enroll student in course
4. Meeting status showing "waiting" → Start meeting from Zoom app

---

## Success Criteria

You know it's working when:

- [ ] Validation endpoint returns "HEALTHY" status
- [ ] Test meeting created successfully via API
- [ ] Database lesson shows `isLiveClass: true` with meeting number
- [ ] Zoom Marketplace apps both activated with correct settings
- [ ] Domain whitelist includes localhost:3000
- [ ] Account settings allow browser join
- [ ] Student can click "Join Live Class" button
- [ ] Console shows all green checkmarks
- [ ] Student joins Zoom meeting embedded in LMS
- [ ] Video/audio/chat all work
- [ ] Student appears in instructor's participant list

---

## After Successful Test

Once everything works:

1. **Document the configuration** that worked
2. **For production deployment**:
   - Add production domain to Meeting SDK app whitelist
   - Update .env variables in production environment
   - Test again in production
3. **Create more meetings** via the API or Zoom interface
4. **Configure real lessons** with Zoom data
5. **Train instructors** on starting meetings
6. **Consider adding**:
   - Attendance tracking
   - Recording management
   - Meeting history

---

## Quick Reference: All Test Endpoints

```bash
# Validate entire configuration
curl http://localhost:3000/api/zoom/validate-config

# Test OAuth only
curl http://localhost:3000/api/zoom/test-auth

# Test signature only
curl http://localhost:3000/api/zoom/test-signature

# Create test meeting
curl -X POST http://localhost:3000/api/zoom/create-meeting

# List courses
curl http://localhost:3000/api/admin/seed-zoom-test

# Get course structure
curl "http://localhost:3000/api/admin/seed-zoom-test?courseSlug=YOUR_SLUG"

# Seed Zoom data
curl -X POST http://localhost:3000/api/admin/seed-zoom-test \
  -H "Content-Type: application/json" \
  -d '{"courseSlug":"...","moduleIndex":0,"lessonIndex":0,"meetingNumber":"..."}'
```

---

## Need Help?

If you're stuck:
1. Share the output from `/api/zoom/validate-config`
2. Share browser console logs
3. Screenshot of Meeting SDK app settings
4. Describe exactly which step failed

The detailed logs will show exactly what's wrong!
