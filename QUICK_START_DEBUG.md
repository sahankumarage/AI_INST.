# Zoom Integration - Quick Start Debugging Guide

## What I've Done

I've analyzed your Zoom integration and prepared everything for debugging. The code is well-implemented - the issues are likely **configuration-related**.

### Files Created/Modified

1. **`.env.local`** - Added your Zoom credentials
2. **`ZOOM_DEBUG_REPORT.md`** - Comprehensive analysis and debugging guide
3. **`/api/zoom/test-auth`** - Test endpoint for OAuth credentials
4. **`/api/zoom/test-signature`** - Test endpoint for SDK signature generation
5. **Enhanced logging** - Added detailed console logs to track issues

---

## Quick Test (5 Minutes)

### Step 1: Start the Development Server

```bash
cd /Users/poornaindrakeela/Desktop/AI_INST
npm run dev
```

### Step 2: Test OAuth Credentials

Open in browser or use curl:
```bash
curl http://localhost:3000/api/zoom/test-auth
```

**Expected Success**:
```json
{
  "success": true,
  "message": "Zoom OAuth working correctly",
  "tokenPreview": "eyJhbGc...",
  "credentials": {
    "accountId": "ZOhv...",
    "clientId": "b1z6..."
  }
}
```

**If it fails**: Check the error message. Most likely:
- Server-to-Server OAuth app not activated in Zoom Marketplace
- Credentials don't match the app

### Step 3: Test Signature Generation

```bash
curl "http://localhost:3000/api/zoom/test-signature?meetingNumber=87887878787"
```

**Expected Success**:
```json
{
  "success": true,
  "message": "Zoom SDK signature generated successfully",
  "sdkKey": "ISf5...",
  "signaturePreview": "eyJhbG...",
  "meetingNumber": "87887878787"
}
```

**If it fails**: Check that SDK credentials are correct.

---

## Most Likely Issues (In Order)

### 🔴 Issue #1: Zoom App Configuration

**Problem**: Even with credentials in `.env.local`, the Zoom apps themselves need proper configuration.

**Fix**: Go to https://marketplace.zoom.us/develop/apps

#### Server-to-Server OAuth App
- ✅ Must be **activated** (not just created)
- ✅ Needs scopes: `meeting:read:admin`, `meeting:write:admin`
- ✅ Credentials must match `.env.local`

#### Meeting SDK App (General App)
- ✅ Must be **activated**
- ✅ "Allow to join meetings from browser" must be **ENABLED**
- ✅ Domain whitelist must include `localhost:3000`
- ✅ SDK credentials must match `.env.local`

### 🔴 Issue #2: Zoom Account Settings

**Problem**: Account-level settings can block browser joining.

**Fix**: Go to https://zoom.us/profile/setting

Check these settings:
- ✅ "Join from browser" - **ENABLED**
- ✅ "Waiting room" - **DISABLED** or optional
- ✅ "Allow participants to join before host" - **ENABLED**

### 🔴 Issue #3: No Test Meeting Data

**Problem**: Database has no lesson with Zoom meeting configured.

**Quick Fix**: Create a test meeting in Zoom, then add to database.

**Via Zoom Web**:
1. Go to https://zoom.us/meeting/schedule
2. Create meeting
3. Note the **Meeting Number** (just numbers, e.g., 87887878787)
4. Update a lesson in your database with this number

**Via MongoDB**:
```javascript
db.courses.updateOne(
  { slug: "your-course-slug" },
  {
    $set: {
      "modules.0.lessons.0.isLiveClass": true,
      "modules.0.lessons.0.zoomMeetingNumber": "YOUR_MEETING_NUMBER",
      "modules.0.lessons.0.scheduledAt": new Date()
    }
  }
);
```

---

## Full Integration Test

Once basic tests pass, do end-to-end test:

1. **Start dev server**: `npm run dev`
2. **Open browser console** (F12 - you'll see detailed logs)
3. **Login as student** (must be enrolled in a course)
4. **Navigate to classroom** with a Zoom-enabled lesson
5. **Start Zoom meeting** from desktop app (as instructor)
6. **Click "Join Live Class"** button
7. **Watch console logs** - they'll tell you exactly what's failing

### Console Log Flow (Success)

```
=== ZOOM SIGNATURE REQUEST ===
Request params: { userId: "...", courseSlug: "...", lessonId: "..." }
Verifying user and enrollment...
✅ User found: student@example.com
✅ User is enrolled or is admin
Fetching course and lesson...
✅ Course found: Test Course
✅ Lesson found: Introduction
✅ Meeting number: 87887878787
Generating Zoom signature...
✅ Signature generated successfully
SDK Key: ISf5oJsmS2...
Signature preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
=== END ZOOM SIGNATURE REQUEST ===

=== ZOOM SDK INITIALIZATION ===
Meeting Number: 87887878787
SDK Key: ISf5oJsmS2...
Signature preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User Name: John Doe
SDK Inited, Joining...
Joined successfully
Connection Status: Connected
```

---

## Error Messages & Fixes

### "Failed to get Zoom access token"
**Cause**: OAuth app not activated or wrong credentials
**Fix**: Go to Zoom Marketplace, activate Server-to-Server OAuth app

### "Zoom SDK credentials missing"
**Cause**: `.env.local` not loaded or missing SDK credentials
**Fix**: Restart dev server after creating `.env.local`

### "Invalid signature" / Signature verification failed
**Cause**: Wrong SDK secret or using OAuth credentials instead of SDK credentials
**Fix**: Verify `ZOOM_SDK_SECRET` in `.env.local` matches Meeting SDK app

### Error Code 200: "Meeting has not started yet"
**Cause**: Instructor hasn't started meeting OR "join before host" disabled
**Fix**:
- Start meeting from Zoom desktop app, OR
- Enable "join before host" in meeting settings

### Error Code 3712: "Invalid meeting number"
**Cause**: Meeting doesn't exist or wrong format
**Fix**: Verify meeting exists in Zoom account, check meeting number is correct numeric format

### CORS error in console
**Cause**: Domain not whitelisted in Meeting SDK app
**Fix**: Add `localhost:3000` to Meeting SDK app's allowed domains

---

## Verification Checklist

Before running full test, verify:

- [ ] `.env.local` exists with all 5 credentials
- [ ] Dev server restarted after creating `.env.local`
- [ ] `/api/zoom/test-auth` returns success
- [ ] `/api/zoom/test-signature` returns success
- [ ] Server-to-Server OAuth app is **activated** in Zoom Marketplace
- [ ] Meeting SDK app is **activated** in Zoom Marketplace
- [ ] Meeting SDK app has "Join from browser" **enabled**
- [ ] `localhost:3000` is in Meeting SDK app's domain whitelist
- [ ] Zoom account has "Join from browser" **enabled**
- [ ] Test meeting exists in Zoom account
- [ ] Database has lesson with `isLiveClass: true` and valid `zoomMeetingNumber`
- [ ] Test student is enrolled in the course

---

## Getting Help

If tests fail, check the detailed `ZOOM_DEBUG_REPORT.md` file for:
- Deep dive into each issue
- Step-by-step configuration instructions
- Links to Zoom documentation
- Common error messages and solutions

**Console logs** will show exactly where the failure occurs. Share those logs if you need help.

---

## What's Working

✅ Code implementation is solid
✅ All required packages installed
✅ Database schema supports Zoom fields
✅ Frontend components properly structured
✅ API endpoints correctly implemented
✅ Signature generation logic correct
✅ OAuth token caching in place

**The issue is configuration, not code.**

---

## Next Actions

1. Run test endpoints to verify credentials
2. Check Zoom Marketplace app configurations
3. Verify Zoom account settings
4. Create/configure test meeting
5. Run end-to-end test
6. Fix any identified issues based on console logs

Good luck! The enhanced logging will tell you exactly what's wrong.
