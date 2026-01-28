# Zoom Integration - Configuration Checklist

Use this checklist to ensure everything is configured correctly.

---

## ✅ Quick Verification (Do These First)

### 1. Environment Setup
- [ ] `.env.local` file exists in project root
- [ ] Contains all 5 Zoom credentials (ACCOUNT_ID, CLIENT_ID, CLIENT_SECRET, SDK_KEY, SDK_SECRET)
- [ ] Dev server restarted after creating .env.local
- [ ] Run validation: `curl http://localhost:3000/api/zoom/validate-config`
- [ ] Validation returns "HEALTHY" status

**If validation fails, stop and fix before continuing.**

---

## 🔧 Zoom Marketplace Apps

### 2. Server-to-Server OAuth App

Go to: https://marketplace.zoom.us/develop/apps

- [ ] App exists and is **Activated** (not just created)
- [ ] App type is "Server-to-Server OAuth"
- [ ] **Account ID** matches .env.local `ZOOM_ACCOUNT_ID`
- [ ] **Client ID** matches .env.local `ZOOM_CLIENT_ID`
- [ ] **Client Secret** matches .env.local `ZOOM_CLIENT_SECRET`
- [ ] Scopes include: `meeting:read:admin` (or `meeting:read:meeting:admin`)
- [ ] Scopes include: `meeting:write:admin` (or `meeting:write:meeting:admin`)

**Test**: `curl http://localhost:3000/api/zoom/test-auth` should return success

---

### 3. Meeting SDK App (General App)

Still at: https://marketplace.zoom.us/develop/apps

- [ ] App exists and is **Activated**
- [ ] App type is "Meeting SDK" or "General"
- [ ] **SDK Key** (under App Credentials) matches .env.local `ZOOM_SDK_KEY`
- [ ] **SDK Secret** (under App Credentials) matches .env.local `ZOOM_SDK_SECRET`

**CRITICAL SETTINGS**:
- [ ] "Allow to join meetings from browser" is **ENABLED** ⚠️ This is the #1 issue!
- [ ] Under "Domain Whitelist", added:
  - [ ] `localhost:3000`
  - [ ] `localhost`
  - [ ] Your production domain (if deploying)

**Test**: `curl http://localhost:3000/api/zoom/test-signature` should return success

---

## 🌐 Zoom Account Settings

### 4. Browser Join Settings

Go to: https://zoom.us/profile/setting

Click "Meeting" tab:
- [ ] "Join from browser" is **ON** (toggle should be blue)
- [ ] "Waiting room" is **OFF** or set to "Optional" (not "Required")

Scroll down to find:
- [ ] "Allow participants to join before host" is **ON**

Click "In Meeting (Advanced)" tab:
- [ ] "Allow participants to join before host" is **ON**

---

## 🎯 Test Meeting & Database

### 5. Create Test Meeting

**Option A - Via API** (Recommended):
```bash
curl -X POST http://localhost:3000/api/zoom/create-meeting
```
- [ ] Meeting created successfully
- [ ] Saved the meeting number
- [ ] Saved the start URL (for instructor)
- [ ] Saved the password (if any)

**Option B - Via Zoom Web**:
- [ ] Created meeting at https://zoom.us/meeting/schedule
- [ ] Noted the meeting number (just digits)
- [ ] Settings: "Join before host" ON, "Waiting room" OFF

---

### 6. Configure Database

Find your course:
```bash
curl http://localhost:3000/api/admin/seed-zoom-test
```

Get course structure:
```bash
curl "http://localhost:3000/api/admin/seed-zoom-test?courseSlug=YOUR_SLUG"
```

Seed the meeting data:
```bash
curl -X POST http://localhost:3000/api/admin/seed-zoom-test \
  -H "Content-Type: application/json" \
  -d '{
    "courseSlug": "YOUR_COURSE_SLUG",
    "moduleIndex": 0,
    "lessonIndex": 0,
    "meetingNumber": "YOUR_MEETING_NUMBER"
  }'
```

- [ ] Seeding returned success
- [ ] Lesson now has `isLiveClass: true`
- [ ] Lesson has the correct `zoomMeetingNumber`

---

## 👥 User Setup

### 7. Ensure Test Users Exist

- [ ] Have a student account
- [ ] Student is **enrolled** in the test course
- [ ] Can login at http://localhost:3000/student-login
- [ ] Can access the course classroom

---

## 🧪 End-to-End Test

### 8. Run Full Integration Test

**Preparation**:
- [ ] Zoom desktop app installed
- [ ] Know the meeting start URL or meeting number
- [ ] Browser ready with console open (F12)

**Instructor Side**:
- [ ] Started Zoom meeting from desktop app
- [ ] Meeting is running

**Student Side**:
- [ ] Browser console open (F12)
- [ ] Logged in as student
- [ ] Navigated to course classroom
- [ ] Selected the lesson with Zoom meeting
- [ ] Can see "Live" indicator
- [ ] "Join Live Class" button is visible and enabled

**Join Test**:
- [ ] Clicked "Join Live Class"
- [ ] Console shows `✅ User found`
- [ ] Console shows `✅ User is enrolled`
- [ ] Console shows `✅ Signature generated`
- [ ] Console shows `SDK Inited, Joining...`
- [ ] Console shows `Joined successfully`
- [ ] Zoom interface appears in LMS
- [ ] Can see/hear instructor
- [ ] Appears in instructor's participant list

---

## 🎉 Success Indicators

You know everything is working when:

- [ ] `/api/zoom/validate-config` returns "HEALTHY"
- [ ] All 6 validation checks pass
- [ ] Student can join meeting without errors
- [ ] Meeting embedded in LMS (not opening new window)
- [ ] Video, audio, chat all functional
- [ ] Student sees instructor and vice versa
- [ ] No CORS errors in console
- [ ] No authentication errors

---

## 🔴 Common Failures & Quick Fixes

### "Failed to get Zoom access token"
- [ ] Verified Server-to-Server OAuth app is **Activated**
- [ ] Credentials in .env.local match Zoom app exactly
- [ ] Dev server restarted after adding credentials

### "Invalid signature"
- [ ] Using SDK credentials (not OAuth credentials) for signature
- [ ] ZOOM_SDK_SECRET in .env.local is correct
- [ ] Meeting SDK app is activated

### "Meeting has not started yet" (Error 200)
- [ ] Started meeting from Zoom desktop app
- [ ] "Join before host" enabled in meeting settings
- [ ] "Join before host" enabled in account settings

### "Invalid meeting number" (Error 3712)
- [ ] Meeting exists in Zoom account
- [ ] Meeting number in database is correct
- [ ] Meeting number is numeric format (no spaces/dashes)

### CORS errors
- [ ] `localhost:3000` in Meeting SDK app domain whitelist
- [ ] "Allow to join meetings from browser" is enabled
- [ ] No typos in domain whitelist

### Button disabled or shows "Please wait"
- [ ] Meeting started from Zoom desktop app
- [ ] Meeting status API working (check console)
- [ ] Meeting number in database is correct

---

## 📊 Debug Commands Reference

Run these if you encounter issues:

```bash
# Full validation (run this first!)
curl http://localhost:3000/api/zoom/validate-config

# Test OAuth credentials
curl http://localhost:3000/api/zoom/test-auth

# Test SDK credentials
curl http://localhost:3000/api/zoom/test-signature

# Create test meeting
curl -X POST http://localhost:3000/api/zoom/create-meeting

# List all courses
curl http://localhost:3000/api/admin/seed-zoom-test

# Get course structure
curl "http://localhost:3000/api/admin/seed-zoom-test?courseSlug=SLUG"

# Seed meeting data
curl -X POST http://localhost:3000/api/admin/seed-zoom-test \
  -H "Content-Type: application/json" \
  -d '{"courseSlug":"...","moduleIndex":0,"lessonIndex":0,"meetingNumber":"..."}'
```

---

## 📝 When Everything Works

- [ ] Documented working configuration
- [ ] Tested with multiple students (if possible)
- [ ] Tested instructor controls
- [ ] Verified recording settings (if using auto-record)
- [ ] Prepared for production:
  - [ ] Added production domain to SDK app whitelist
  - [ ] Set up production environment variables
  - [ ] Tested in production environment

---

## 🆘 Getting Help

If stuck after following checklist:

1. Run: `curl http://localhost:3000/api/zoom/validate-config`
2. Copy the entire response
3. Open browser console (F12) during join attempt
4. Copy all console logs
5. Screenshot Meeting SDK app settings page
6. Share all of the above

The logs will show exactly what's wrong!

---

## 📚 Additional Resources

- **Full Details**: See `ZOOM_DEBUG_REPORT.md`
- **Quick Start**: See `QUICK_START_DEBUG.md`
- **Test Workflow**: See `TEST_WORKFLOW.md`
- **Summary**: See `IMPLEMENTATION_SUMMARY.md`

---

## ✨ Final Check

Before considering it "done":

- [ ] Validation endpoint: **HEALTHY** ✅
- [ ] OAuth test: **PASS** ✅
- [ ] Signature test: **PASS** ✅
- [ ] Meeting created: **SUCCESS** ✅
- [ ] Database seeded: **SUCCESS** ✅
- [ ] Student can join: **SUCCESS** ✅
- [ ] No console errors: **CLEAN** ✅
- [ ] Meeting embedded (not popup): **CONFIRMED** ✅

**If all checked, you're done! 🎉**
