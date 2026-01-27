# Zoom Live Class Integration - Debug Report

**Date**: January 27, 2026
**Branch**: `fix/zoom-live-class-integration`
**Status**: Debugging Phase

---

## Executive Summary

The Zoom integration code is **well-implemented** from a development perspective. The issue is likely with **configuration** rather than code. The integration may fail due to:

1. Missing environment variables
2. Zoom app configuration issues (permissions, domain whitelist)
3. Zoom account-level meeting settings
4. Missing or incorrectly formatted test data in database

---

## Current Implementation Analysis

### ✅ What's Implemented Correctly

1. **Complete Backend Infrastructure**
   - OAuth token management with caching (`/src/lib/zoom.ts`)
   - Signature generation API (`/src/app/api/zoom/signature/route.ts`)
   - Meeting status polling API (`/src/app/api/zoom/status/route.ts`)
   - Enrollment verification before allowing access

2. **Frontend Components**
   - Zoom embedding via iframe (`/src/components/ZoomMeetingEmbed.tsx`)
   - Static HTML page for SDK isolation (`/public/zoom-meeting.html`)
   - Alternative React-based embed (`/src/app/meeting/page.tsx`)
   - Meeting status polling every 30 seconds
   - Proper UI states (waiting, joining, joined, error)

3. **Database Schema**
   - Course model supports all Zoom fields
   - Lesson fields: `isLiveClass`, `zoomMeetingNumber`, `zoomPassword`, `scheduledAt`

4. **Dependencies**
   - `@zoom/meetingsdk` v3.5.2 installed
   - `jsrsasign` for JWT signature generation
   - `axios` for HTTP requests

### Code Flow

```
Student clicks "Join Live Class"
    ↓
Frontend: POST /api/zoom/signature
    ↓
Backend: Verifies enrollment
    ↓
Backend: Generates JWT signature using SDK credentials
    ↓
Frontend: Receives signature + meeting details
    ↓
Frontend: Loads /zoom-meeting.html in iframe with params
    ↓
HTML page: Initializes Zoom Meeting SDK
    ↓
HTML page: Calls client.join() with signature
    ↓
Success: Student joins meeting embedded in LMS
```

---

## Identified Issues & Root Causes

### 🔴 Issue #1: Missing Environment Variables

**Problem**: No `.env.local` file exists in the repository.

**Impact**: Without credentials, all Zoom API calls and signature generation will fail.

**Required Variables**:
```env
# Server-to-Server OAuth App (for API calls)
ZOOM_ACCOUNT_ID=ZOhvpZHyRg6Ed0HbN0LWtw
ZOOM_CLIENT_ID=b1z6bJB7TKS3bxuGFbQAHw
ZOOM_CLIENT_SECRET=PqZg2pralYyxtSuto6yYlaS1jD1LjI94

# Meeting SDK App (for embedding)
ZOOM_SDK_KEY=ISf5oJsmS2Ohvm30Kmzvfg
ZOOM_SDK_SECRET=BXkaDvkbuVw0fuGN3qPPx8abrX31zcBl
```

**Location**: Create `.env.local` in the root directory of the project.

---

### 🔴 Issue #2: Zoom App Configuration

**Two Zoom Apps Required**:

#### A. Server-to-Server OAuth App
- **Purpose**: Make API calls to Zoom (create meetings, check status)
- **Credentials**: `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_ACCOUNT_ID`
- **Required Scopes**:
  - `meeting:read:admin`
  - `meeting:write:admin`
  - Or at minimum: `meeting:read:meeting:admin`, `meeting:write:meeting:admin`

**Potential Issues**:
- App not activated
- Missing required scopes
- Credentials don't match

#### B. Meeting SDK App (General App)
- **Purpose**: Allow students to join meetings via browser embedding
- **Credentials**: `ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET`

**Required Configuration** (Check in Zoom Marketplace Dashboard):
- ✅ "Allow to join meetings from browser" must be **ENABLED**
- ✅ Domain whitelist must include:
  - `localhost:3000` (for development)
  - Your production domain (e.g., `yourdomain.com`)
- ✅ SDK embedding must be enabled
- ✅ App must be activated/published

**Common Mistakes**:
- Domain not whitelisted → CORS errors
- Browser join disabled → SDK fails to initialize
- Using wrong credentials (OAuth creds instead of SDK creds for signature)

---

### 🔴 Issue #3: Zoom Account Meeting Settings

Even with correct app configuration, account-level settings can block browser embedding.

**Check these settings at**: `https://zoom.us/profile/setting`

**Required Settings**:
- ✅ "Join from browser" - **ENABLED**
- ✅ "Waiting room" - **DISABLED** (or make optional, not required)
- ✅ "Allow participants to join before host" - **ENABLED**
- ✅ "Embed meetings in website" - **ENABLED**
- ✅ "Meeting/Webinar embedding" domain restrictions - Include your domain

**Impact if misconfigured**:
- Students can't join via browser
- Students stuck waiting for host
- SDK initialization fails
- CORS errors

---

### 🔴 Issue #4: Meeting Configuration Issues

**Meeting-Level Settings** (when creating a meeting):
- ❌ "Waiting room" enabled → Students see waiting screen
- ❌ "Join before host" disabled → Students can't join until instructor joins
- ❌ Meeting requires authentication → Students need Zoom accounts
- ❌ Meeting is password protected but password not stored in DB

**Recommended Meeting Settings**:
```javascript
{
  settings: {
    join_before_host: true,        // Students can enter room
    waiting_room: false,            // No waiting room
    authentication_domains: "",     // No auth required
    audio: "both",                  // Computer and phone audio
    auto_recording: "cloud",        // Record automatically (optional)
    jbh_time: 0,                   // Join anytime before host
  }
}
```

---

### 🔴 Issue #5: Database/Test Data

**Problem**: No test meeting data may exist in the database.

**Required for Testing**:
- A lesson must have:
  ```javascript
  {
    isLiveClass: true,
    zoomMeetingNumber: "87887878787", // Numeric format
    zoomPassword: "optional",
    scheduledAt: new Date(),
  }
  ```

**Common Mistakes**:
- Using Meeting ID (alphanumeric like "123-456-789") instead of Meeting Number
- Meeting number has spaces or dashes (code strips these but better to store clean)
- Meeting doesn't actually exist in Zoom account

---

### 🟡 Issue #6: Potential Code Issues

#### A. CORS/CSP Headers
If deployment uses strict Content Security Policy:
```
Content-Security-Policy: frame-src https://source.zoom.us
```

#### B. Zoom SDK Version
Current: 3.5.2
Latest: May be newer version available

Check: https://developers.zoom.us/docs/meeting-sdk/web/component-view/

#### C. Signature Expiration
Signatures expire after 2 hours. If testing over long period, may need to regenerate.

---

## Debugging Action Plan

### Phase 1: Configuration Verification (Priority: HIGH)

**Task 1: Create .env.local file**
```bash
cd /Users/poornaindrakeela/Desktop/AI_INST
cat > .env.local << 'EOF'
# Zoom Server-to-Server OAuth
ZOOM_ACCOUNT_ID=ZOhvpZHyRg6Ed0HbN0LWtw
ZOOM_CLIENT_ID=b1z6bJB7TKS3bxuGFbQAHw
ZOOM_CLIENT_SECRET=PqZg2pralYyxtSuto6yYlaS1jD1LjI94

# Zoom Meeting SDK
ZOOM_SDK_KEY=ISf5oJsmS2Ohvm30Kmzvfg
ZOOM_SDK_SECRET=BXkaDvkbuVw0fuGN3qPPx8abrX31zcBl

# Add other existing env vars below
EOF
```

**Task 2: Verify Zoom Apps**
1. Go to: https://marketplace.zoom.us/develop/apps
2. Find Server-to-Server OAuth App
   - Check it's activated
   - Verify scopes include meeting read/write
   - Confirm credentials match
3. Find Meeting SDK App
   - Check "Allow join from browser" is ON
   - Add `localhost:3000` to domain whitelist
   - Add production domain if deploying

**Task 3: Check Account Settings**
1. Go to: https://zoom.us/profile/setting
2. Under "Meeting" tab:
   - Enable "Join from browser"
   - Disable "Waiting room" (or make optional)
   - Enable "Allow participants to join before host"
3. Under "In Meeting (Advanced)":
   - Enable "Allow participants to join before host"

---

### Phase 2: Test Basic Connectivity

**Task 4: Test OAuth Token**

Create test endpoint: `/src/app/api/zoom/test-auth/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getZoomAccessToken } from '@/lib/zoom';

export async function GET() {
  try {
    const token = await getZoomAccessToken();
    return NextResponse.json({
      success: true,
      tokenPreview: token.substring(0, 20) + '...'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

**Test**: Visit `http://localhost:3000/api/zoom/test-auth`
**Expected**: `{ "success": true, "tokenPreview": "..." }`

---

**Task 5: Create Test Meeting**

Option A: Via Zoom Web Interface
1. Go to https://zoom.us/meeting/schedule
2. Create a meeting
3. Note the Meeting Number (just numbers)

Option B: Via API (preferred for automation)
```typescript
// Create endpoint: /api/zoom/create-test-meeting
const response = await axios.post(
  'https://api.zoom.us/v2/users/me/meetings',
  {
    topic: 'Test LMS Integration',
    type: 2, // Scheduled meeting
    start_time: new Date().toISOString(),
    duration: 60,
    settings: {
      join_before_host: true,
      waiting_room: false,
      authentication_domains: '',
    }
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log('Meeting Number:', response.data.id); // This is the meeting number
```

---

**Task 6: Add Test Data to Database**

Option A: Via MongoDB shell
```javascript
db.courses.updateOne(
  { slug: "your-test-course-slug" },
  {
    $set: {
      "modules.0.lessons.0.isLiveClass": true,
      "modules.0.lessons.0.zoomMeetingNumber": "87887878787",
      "modules.0.lessons.0.scheduledAt": new Date(),
    }
  }
);
```

Option B: Via API endpoint (create admin endpoint for this)

---

### Phase 3: Enhanced Debugging

**Task 7: Add Debug Logging**

Update `/src/app/api/zoom/signature/route.ts`:
```typescript
// Add at the beginning of POST function
console.log('=== ZOOM SIGNATURE REQUEST ===');
console.log('User ID:', userId);
console.log('Course:', courseSlug);
console.log('Lesson:', lessonId);

// After finding lesson
console.log('Meeting Number:', targetLesson.zoomMeetingNumber);
console.log('SDK Key:', getZoomSdkKey().substring(0, 10) + '...');

// After generating signature
console.log('Signature Generated:', signature.substring(0, 50) + '...');
console.log('=== END ZOOM SIGNATURE REQUEST ===');
```

Update `/public/zoom-meeting.html`:
```javascript
// Add more detailed error logging
console.log('=== ZOOM SDK INITIALIZATION ===');
console.log('Meeting Number:', meetingNumber);
console.log('SDK Key:', sdkKey?.substring(0, 10) + '...');
console.log('Signature:', signature?.substring(0, 50) + '...');

// In catch block
console.error('=== ZOOM SDK ERROR ===');
console.error('Error Code:', error.errorCode);
console.error('Error Message:', error.message);
console.error('Error Reason:', error.reason);
console.error('Full Error:', error);
```

---

### Phase 4: End-to-End Testing

**Task 8: Complete Integration Test**

1. **Start dev server**: `npm run dev`
2. **Open browser console** (F12)
3. **Login as student** enrolled in test course
4. **Navigate to classroom** with Zoom-enabled lesson
5. **Start Zoom meeting** from desktop app (as instructor account)
6. **Click "Join Live Class"** button
7. **Observe console logs** at each step:
   - Signature API call
   - Response with meeting details
   - Iframe loading
   - Zoom SDK initialization
   - Join attempt
8. **Document any errors** with full error messages

---

## Expected Error Messages & Solutions

### Error: "Failed to get Zoom access token"
**Cause**: OAuth credentials incorrect or app not activated
**Solution**: Verify Server-to-Server OAuth app credentials and activation

### Error: "Zoom SDK credentials missing"
**Cause**: SDK key or secret not in .env
**Solution**: Add ZOOM_SDK_KEY and ZOOM_SDK_SECRET to .env.local

### Error: "Invalid signature" or signature verification failed
**Cause**: Wrong SDK secret, or using OAuth credentials instead of SDK credentials
**Solution**: Ensure signature uses ZOOM_SDK_SECRET, not ZOOM_CLIENT_SECRET

### Error Code 200: "Meeting has not started yet"
**Cause**: Instructor hasn't started the meeting from Zoom desktop app
**Solution**: Start meeting from Zoom app, or enable "join before host"

### Error Code 3712: "Invalid meeting number"
**Cause**: Meeting doesn't exist or wrong format
**Solution**: Verify meeting exists in Zoom account, check meeting number is correct

### CORS Error in console
**Cause**: Domain not whitelisted in Meeting SDK app
**Solution**: Add domain to SDK app's allowed domains list

### "Join from browser not available"
**Cause**: Account setting disabled
**Solution**: Enable in Zoom account settings

---

## Quick Start Checklist

Use this checklist to ensure everything is configured:

- [ ] `.env.local` file created with all 5 credentials
- [ ] Server-to-Server OAuth app is activated
- [ ] OAuth app has meeting:read and meeting:write scopes
- [ ] Meeting SDK app exists and is activated
- [ ] Meeting SDK app has "Join from browser" enabled
- [ ] `localhost:3000` added to SDK app domain whitelist
- [ ] Zoom account has "Join from browser" enabled
- [ ] Zoom account has "Waiting room" disabled or optional
- [ ] Zoom account has "Join before host" enabled
- [ ] Test meeting created in Zoom account
- [ ] Test meeting number added to database lesson
- [ ] Student is enrolled in the test course
- [ ] Dev server is running
- [ ] Browser console is open for debugging

---

## Testing Script

```bash
# 1. Create .env.local (copy credentials above)

# 2. Install dependencies if needed
npm install

# 3. Start dev server
npm run dev

# 4. In another terminal, test auth
curl http://localhost:3000/api/zoom/test-auth

# 5. Open browser
open http://localhost:3000/student-login

# 6. Login and navigate to classroom with Zoom lesson

# 7. Check console for any errors
```

---

## Next Steps After Configuration

Once basic configuration is verified and working:

1. **Test recording URLs** - Verify past meetings show recordings
2. **Test meeting status polling** - Ensure UI updates when instructor starts
3. **Test with multiple students** - Verify concurrent joins work
4. **Add attendance tracking** - Record who joined and for how long
5. **Add error notifications** - Better user feedback for failures
6. **Production deployment** - Update domain whitelist for prod domain

---

## Support Resources

- **Zoom SDK Documentation**: https://developers.zoom.us/docs/meeting-sdk/web/
- **Zoom API Documentation**: https://developers.zoom.us/docs/api/
- **Server-to-Server OAuth**: https://developers.zoom.us/docs/internal-apps/s2s-oauth/
- **Meeting SDK Sample App**: https://github.com/zoom/meetingsdk-sample-signature-node.js

---

## Conclusion

The code implementation is solid. The integration failure is almost certainly due to configuration issues. Follow the checklist and debugging steps above to identify and resolve the specific configuration problem.

**Most Common Fix**: Create `.env.local` with credentials + enable "Join from browser" in both SDK app and account settings + whitelist localhost domain.

After configuration is correct, the integration should work as designed.
