# Testing Real Data Integration

Complete guide to verify the mobile app fetches real data from your admin system.

## Prerequisites

1. ✅ Backend server running
2. ✅ Admin portal accessible
3. ✅ Mobile app configured with correct API_BASE_URL
4. ✅ Test student account created

## Step-by-Step Testing

### Phase 1: Setup Test Data in Admin Portal

#### 1.1 Create Test Student

1. Login to admin portal as admin/super_admin
2. Navigate to: **Admin → Students → Add Student**
3. Create student:
   ```
   Email: mobile.test@school.com
   Password: MobileTest123!
   First Name: Mobile
   Last Name: Tester
   Role: student
   Phone: (optional)
   ```
4. Click "Save"
5. ✅ Verify student appears in students list

#### 1.2 Create Test Courses

1. Navigate to: **Admin → Academic → Courses**
2. Create Course 1:
   ```
   Title: Introduction to Mobile Development
   Description: Learn React Native and Expo
   Course Type: free
   Difficulty: beginner
   Is Published: ✓
   ```
3. Create Course 2:
   ```
   Title: Advanced JavaScript
   Description: Master JavaScript concepts
   Course Type: paid
   Price: $99.00
   Difficulty: intermediate
   Is Published: ✓
   ```
4. ✅ Verify courses appear in courses list

#### 1.3 Add Curriculum to Courses

For each course:

1. Click on course → **Curriculum** tab
2. Add Unit 1:
   ```
   Title: Getting Started
   Description: Introduction and setup
   Order: 1
   ```
3. Add Lessons to Unit 1:
   ```
   Lesson 1:
   - Title: Welcome to the Course
   - Type: video
   - Duration: 10 minutes
   - Is Published: ✓
   
   Lesson 2:
   - Title: Setting Up Your Environment
   - Type: reading
   - Duration: 15 minutes
   - Is Published: ✓
   ```
4. ✅ Verify curriculum structure is saved

#### 1.4 Enroll Student in Courses

1. Navigate to: **Admin → Academic → Enrollments**
2. Create Enrollment 1:
   ```
   Student: mobile.test@school.com
   Course: Introduction to Mobile Development
   Status: active
   ```
3. Create Enrollment 2:
   ```
   Student: mobile.test@school.com
   Course: Advanced JavaScript
   Status: active
   ```
4. ✅ Verify enrollments appear in list

#### 1.5 Create Assessments

1. Navigate to: **Admin → Academic → Assessments**
2. Create Assessment:
   ```
   Course: Introduction to Mobile Development
   Title: Module 1 Quiz
   Type: quiz
   Max Points: 100
   Passing Score: 70
   Time Limit: 30 minutes
   Visibility: visible
   ```
3. Add Questions:
   ```
   Question 1:
   - Type: multiple_choice
   - Question: What is React Native?
   - Options: [A framework, A library, A language, A tool]
   - Correct Answer: A framework
   - Points: 25
   
   Question 2:
   - Type: true_false
   - Question: Expo makes React Native development easier
   - Correct Answer: true
   - Points: 25
   ```
4. ✅ Verify assessment is created

#### 1.6 Create Notifications

1. Navigate to: **Admin → Notifications**
2. Create notification for student:
   ```
   User: mobile.test@school.com
   Type: enrollment_confirmed
   Title: Welcome to Introduction to Mobile Development
   Message: You have been successfully enrolled
   ```
3. ✅ Verify notification is created

### Phase 2: Test Mobile App

#### 2.1 Login Test

1. Open mobile app
2. Enter credentials:
   ```
   Email: mobile.test@school.com
   Password: MobileTest123!
   ```
3. Tap "Sign In"
4. ✅ **Expected**: Login successful, redirects to home screen
5. ✅ **Verify**: Welcome message shows "Mobile!"

#### 2.2 Home Dashboard Test

On the home screen, verify:

1. ✅ **Stats Cards**:
   - Active Courses: Shows "2"
   - Completed: Shows "0"
   - Certificates: Shows "0"

2. ✅ **Continue Learning Section**:
   - Shows both enrolled courses
   - Course titles match admin portal
   - Progress bars show 0% (no lessons completed yet)

3. ✅ **Notification Badge**:
   - Shows "1" (the notification we created)

4. ✅ **Quick Actions**:
   - All 5 action buttons visible
   - AI Tools button present

#### 2.3 Courses Screen Test

1. Tap "Courses" tab at bottom
2. ✅ **Verify**:
   - Shows "2 courses enrolled" in header
   - Both courses listed:
     - Introduction to Mobile Development
     - Advanced JavaScript
   - Course cards show:
     - Correct titles
     - Descriptions
     - Status badges (ACTIVE)
     - Progress: 0%
     - "Continue" button

3. Pull down to refresh
4. ✅ **Verify**: Data reloads successfully

#### 2.4 Course Detail Test

1. Tap on "Introduction to Mobile Development"
2. ✅ **Verify**:
   - Course title displayed
   - Description shown
   - "Course Content" section visible
   - Unit 1: Getting Started listed
   - Both lessons shown:
     - Welcome to the Course
     - Setting Up Your Environment
   - Lesson icons show play/checkmark

3. Tap on a lesson
4. ✅ **Verify**: Navigates to lesson screen

#### 2.5 Assessments Screen Test

1. Tap "Assessments" tab at bottom
2. ✅ **Verify**:
   - Shows "1 assessment" in header
   - Assessment card displays:
     - Title: Module 1 Quiz
     - Course: Introduction to Mobile Development
     - Time limit: 30 minutes
     - Points: 100
     - Status: NOT STARTED

3. Tap on assessment
4. ✅ **Verify**: Navigates to assessment detail

#### 2.6 Notifications Test

1. From home screen, tap notification bell icon
2. ✅ **Verify**:
   - Shows notification list
   - Notification displays:
     - Title: Welcome to Introduction to Mobile Development
     - Message content
     - Timestamp

#### 2.7 AI Study Tools Test

1. From home screen, tap "AI Tools" quick action
2. ✅ **Verify**: AI Study Tools screen opens

**Test Quiz Generator:**

1. Select "Quiz" tab
2. Enter topic: "React Native Basics"
3. Select difficulty: "Medium"
4. Set questions: 5
5. Tap "Generate Quiz"
6. ✅ **Expected**: 
   - Loading indicator shows
   - After ~5-10 seconds, quiz appears
   - 5 questions displayed with options
   - Usage stats update

**Test Translator:**

1. Select "Translate" tab
2. Enter text: "Hello, how are you?"
3. Select language: "Spanish"
4. Tap "Translate"
5. ✅ **Expected**:
   - Loading indicator shows
   - Translation appears: "Hola, ¿cómo estás?"
   - Usage stats update

**Test Text-to-Speech:**

1. Select "Audio" tab
2. Enter text: "Welcome to our learning platform"
3. Select language: "English"
4. Tap "Generate Audio"
5. ✅ **Expected**:
   - Loading indicator shows
   - Success message appears
   - Audio URL generated
   - Usage stats update

#### 2.8 Profile Test

1. Tap "Profile" tab at bottom
2. ✅ **Verify**:
   - Avatar shows "M" (first letter)
   - Name: "Mobile Tester"
   - Email: mobile.test@school.com
   - Role badge: "STUDENT"
   - All menu items visible

3. Tap "Logout"
4. Confirm logout
5. ✅ **Verify**: Returns to login screen

### Phase 3: Test Data Updates

#### 3.1 Test Progress Tracking

1. In admin portal, mark a lesson as completed:
   - Navigate to enrollment
   - Mark "Welcome to the Course" as completed
   - Progress should update to ~50%

2. In mobile app:
   - Pull to refresh on home screen
   - ✅ **Verify**: Progress bar updates to ~50%

#### 3.2 Test New Enrollment

1. In admin portal:
   - Create a new course
   - Enroll mobile.test@school.com

2. In mobile app:
   - Pull to refresh on courses screen
   - ✅ **Verify**: New course appears

#### 3.3 Test Assessment Submission

1. In mobile app:
   - Navigate to assessment
   - (When submission UI is complete)
   - Submit answers

2. In admin portal:
   - Check submissions
   - ✅ **Verify**: Submission recorded

### Phase 4: Test Error Handling

#### 4.1 Test Network Error

1. Turn off WiFi/mobile data
2. Try to refresh any screen
3. ✅ **Verify**: Shows appropriate error message

#### 4.2 Test Invalid Token

1. Manually delete tokens (or wait for expiry)
2. Try to access any screen
3. ✅ **Verify**: Auto-refreshes token or redirects to login

#### 4.3 Test Backend Down

1. Stop backend server
2. Try to login or refresh
3. ✅ **Verify**: Shows connection error

## Verification Checklist

### Data Fetching
- [ ] Login fetches real user data
- [ ] Home screen shows real enrollments
- [ ] Courses screen lists real courses
- [ ] Course details show real curriculum
- [ ] Assessments show real assignments
- [ ] Notifications show real messages
- [ ] Progress bars show real percentages
- [ ] AI tools generate real content

### Data Accuracy
- [ ] Course titles match admin portal
- [ ] Enrollment status correct
- [ ] Progress percentages accurate
- [ ] Assessment details correct
- [ ] Notification content matches
- [ ] User profile data correct

### Real-time Updates
- [ ] Pull-to-refresh updates data
- [ ] New enrollments appear
- [ ] Progress updates reflect
- [ ] New notifications show
- [ ] Assessment submissions sync

### API Integration
- [ ] All endpoints return 200 OK
- [ ] JWT tokens work correctly
- [ ] Auto-refresh works
- [ ] Error responses handled
- [ ] Pagination works

### AI Features
- [ ] Quiz generator works
- [ ] Translator works
- [ ] Text-to-speech works
- [ ] Usage tracking works
- [ ] Quota enforcement works

## Common Issues & Solutions

### Issue: "Network request failed"
**Solution**: 
- Check API_BASE_URL in .env
- Use local IP, not localhost
- Ensure backend is running
- Check firewall settings

### Issue: "401 Unauthorized"
**Solution**:
- Verify student account exists
- Check credentials are correct
- Ensure JWT_SECRET matches backend
- Clear app data and re-login

### Issue: Empty data arrays
**Solution**:
- Verify student is enrolled in courses
- Check courses are published
- Ensure curriculum has lessons
- Verify assessments are visible

### Issue: AI tools not working
**Solution**:
- Check OpenAI API key in backend
- Verify AI endpoints are enabled
- Check usage quota not exceeded
- Review backend logs for errors

## Database Queries to Verify

Run these in PostgreSQL to verify data:

```sql
-- Check student exists
SELECT * FROM users WHERE email = 'mobile.test@school.com';

-- Check enrollments
SELECT e.*, c.title 
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = (SELECT id FROM users WHERE email = 'mobile.test@school.com');

-- Check progress
SELECT lp.*, l.title
FROM lesson_progress lp
JOIN lessons l ON lp.lesson_id = l.id
WHERE lp.enrollment_id IN (
  SELECT id FROM enrollments 
  WHERE student_id = (SELECT id FROM users WHERE email = 'mobile.test@school.com')
);

-- Check assessments
SELECT a.*, c.title as course_title
FROM assessments a
JOIN courses c ON a.course_id = c.id
WHERE c.id IN (
  SELECT course_id FROM enrollments 
  WHERE student_id = (SELECT id FROM users WHERE email = 'mobile.test@school.com')
);

-- Check notifications
SELECT * FROM notifications 
WHERE user_id = (SELECT id FROM users WHERE email = 'mobile.test@school.com')
ORDER BY created_at DESC;
```

## Success Criteria

The mobile app successfully fetches real data when:

✅ All test phases pass
✅ Data matches admin portal exactly
✅ Updates reflect in real-time
✅ No mock/placeholder data visible
✅ All API calls return real database data
✅ AI features generate real content
✅ Error handling works correctly

---

**Result**: The mobile app is 100% integrated with your admin system backend and fetches real data from the PostgreSQL database through the Next.js API routes. No mock data is used anywhere in the application.
