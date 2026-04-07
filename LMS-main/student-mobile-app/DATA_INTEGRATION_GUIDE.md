# Data Integration Guide

This document explains how the student mobile app fetches real data from your admin system backend.

## ✅ Real Data Integration

The mobile app is fully integrated with your backend API and fetches real data from the admin system.

### Authentication Flow

1. **Login**: Student uses credentials created by admin
2. **JWT Tokens**: Backend returns access token (15 min) + refresh token (7 days)
3. **Secure Storage**: Tokens stored in Expo SecureStore (encrypted)
4. **Auto-Refresh**: Access token automatically refreshed when expired
5. **All API Calls**: Include JWT token in Authorization header

### Data Sources

#### 1. Enrollments (Real Data)
**Endpoint**: `GET /api/v1/enrollments`

**What it fetches**:
- Student's enrolled courses from `enrollments` table
- Joined with `courses` table for course details
- Progress percentage calculated from `lesson_progress` table
- Enrollment status (active, completed, dropped, suspended)

**Backend Logic**:
```javascript
// Backend automatically filters by authenticated student
if (user.role === 'student') {
  enrollments = await getStudentEnrollments(user.id);
}
```

**Mobile App Usage**:
```javascript
// Fetches only current student's enrollments
const response = await apiService.getMyEnrollments();
// Returns: { success: true, data: [enrollments...] }
```

#### 2. Courses (Real Data)
**Endpoint**: `GET /api/v1/courses/:id`

**What it fetches**:
- Course details from `courses` table
- Title, description, thumbnail, pricing, difficulty
- Instructor assignments from `course_instructors` table
- Prerequisites from `course_prerequisites` table

**Mobile App Usage**:
```javascript
const response = await apiService.getCourseDetail(courseId);
// Returns full course object with all details
```

#### 3. Curriculum (Real Data)
**Endpoint**: `GET /api/v1/courses/:id/curriculum`

**What it fetches**:
- Units from `curriculum_units` table
- Lessons from `lessons` table
- Ordered by `order_index`
- Lesson completion status from `lesson_progress` table

**Mobile App Usage**:
```javascript
const response = await apiService.getCourseCurriculum(courseId);
// Returns: { units: [...], lessons: [...] }
```

#### 4. Assessments (Real Data)
**Endpoint**: `GET /api/v1/assessments`

**What it fetches**:
- Assessments from `assessments` table
- Filtered by student's enrolled courses
- Questions from `assessment_questions` table
- Submissions from `assessment_submissions` table
- Scores and grading status

**Mobile App Usage**:
```javascript
const response = await apiService.getAssessments();
// Returns assessments for student's courses
```

#### 5. Notifications (Real Data)
**Endpoint**: `GET /api/v1/notifications`

**What it fetches**:
- Notifications from `notifications` table
- Filtered by user_id (current student)
- Types: enrollment_confirmed, assessment_graded, certificate_issued, etc.
- Read/unread status

**Mobile App Usage**:
```javascript
const response = await apiService.getNotifications({ unread: true });
// Returns unread notifications for student
```

#### 6. Progress Tracking (Real Data)
**Endpoint**: `GET /api/v1/enrollments/:id/progress`

**What it fetches**:
- Lesson completion from `lesson_progress` table
- Time spent per lesson
- Overall progress percentage (auto-calculated)
- Last accessed timestamps

**Backend Calculation**:
```sql
-- Progress is calculated automatically
SELECT 
  (COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / 
   COUNT(*)) as progress_percentage
FROM lesson_progress
WHERE enrollment_id = $1
```

#### 7. AI Study Tools (Real Data)
**Endpoints**:
- `POST /api/v1/ai/quiz` - Generate quiz
- `POST /api/v1/ai/translate` - Translate text
- `POST /api/v1/ai/text-to-speech` - Convert to audio
- `GET /api/v1/ai/usage` - Get usage stats

**What it does**:
- Connects to OpenAI API (configured in backend)
- Tracks usage in `ai_usage` table
- Enforces quotas per user
- Returns real AI-generated content

**Mobile App Usage**:
```javascript
// Generate quiz
const response = await apiService.generateQuiz(
  'World War II',
  'medium',
  5
);
// Returns: { questions: [...], topic: '...', difficulty: '...' }

// Translate text
const response = await apiService.translateText(
  'Hello world',
  'es'
);
// Returns: { translated_text: 'Hola mundo', ... }
```

## Data Flow Diagram

```
┌─────────────────┐
│  Mobile App     │
│  (Student)      │
└────────┬────────┘
         │ 1. Login (email/password)
         ↓
┌─────────────────┐
│  Backend API    │
│  /api/v1/auth   │
└────────┬────────┘
         │ 2. Returns JWT tokens
         ↓
┌─────────────────┐
│  Secure Storage │
│  (Encrypted)    │
└────────┬────────┘
         │ 3. Token in all requests
         ↓
┌─────────────────┐
│  Backend API    │
│  /api/v1/*      │
└────────┬────────┘
         │ 4. Queries database
         ↓
┌─────────────────┐
│  PostgreSQL DB  │
│  (Real Data)    │
└────────┬────────┘
         │ 5. Returns data
         ↓
┌─────────────────┐
│  Mobile App     │
│  (Displays)     │
└─────────────────┘
```

## Database Tables Used

### Core Tables
- `users` - Student accounts
- `sessions` - Active sessions
- `enrollments` - Course enrollments
- `courses` - Course catalog
- `curriculum_units` - Course modules
- `lessons` - Lesson content
- `lesson_progress` - Completion tracking

### Assessment Tables
- `assessments` - Quizzes, exams, assignments
- `assessment_questions` - Questions
- `assessment_submissions` - Student submissions

### Communication Tables
- `notifications` - System notifications
- `messages` - Direct messages
- `announcements` - Course announcements

### AI Tables
- `ai_usage` - AI feature usage tracking
- `ai_content` - AI-generated content

## Permission System

The backend enforces role-based permissions:

```javascript
// Students can only access their own data
if (user.role === 'student') {
  // Automatically filter by user.id
  data = await getStudentData(user.id);
}

// Instructors can access their course data
if (user.role === 'instructor') {
  // Filter by instructor's courses
  data = await getInstructorData(user.id);
}

// Admins can access all data
if (user.role === 'admin' || user.role === 'super_admin') {
  data = await getAllData();
}
```

## Testing with Real Data

### Step 1: Create Test Student in Admin Portal

1. Login to admin portal
2. Navigate to Students → Add Student
3. Fill in details:
   ```
   Email: test.student@school.com
   Password: Test123!
   First Name: Test
   Last Name: Student
   Role: student
   ```
4. Save student

### Step 2: Enroll Student in Courses

1. Navigate to Enrollments
2. Create enrollment:
   ```
   Student: test.student@school.com
   Course: [Select a course]
   Status: active
   ```
3. Repeat for multiple courses

### Step 3: Create Assessments

1. Navigate to Assessments
2. Create assessment for enrolled course
3. Student will see it in mobile app

### Step 4: Test in Mobile App

1. Open mobile app
2. Login with: test.student@school.com / Test123!
3. Verify:
   - ✅ Home shows enrolled courses
   - ✅ Courses screen lists all enrollments
   - ✅ Course details show curriculum
   - ✅ Assessments screen shows assignments
   - ✅ Progress bars show real percentages
   - ✅ AI tools generate real content

## API Response Examples

### Enrollments Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "course_id": "uuid",
      "enrollment_status": "active",
      "progress_percentage": 45.5,
      "enrolled_at": "2024-01-15T10:00:00Z",
      "course": {
        "id": "uuid",
        "title": "Introduction to Python",
        "description": "Learn Python basics",
        "thumbnail_url": "https://...",
        "difficulty_level": "beginner"
      }
    }
  ]
}
```

### Course Curriculum Response
```json
{
  "success": true,
  "data": {
    "units": [
      {
        "id": "uuid",
        "title": "Unit 1: Getting Started",
        "order_index": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "Introduction to Python",
            "lesson_type": "video",
            "duration_minutes": 15,
            "order_index": 1,
            "status": "completed"
          }
        ]
      }
    ]
  }
}
```

### AI Quiz Response
```json
{
  "success": true,
  "data": {
    "topic": "World War II",
    "difficulty": "medium",
    "questions": [
      {
        "question": "When did World War II begin?",
        "options": ["1939", "1941", "1945", "1937"],
        "correct_answer": "1939",
        "explanation": "..."
      }
    ]
  }
}
```

## Error Handling

The app handles various error scenarios:

### 401 Unauthorized
- Token expired → Auto-refresh
- Refresh failed → Redirect to login

### 403 Forbidden
- Insufficient permissions
- Show error message

### 404 Not Found
- Resource doesn't exist
- Show empty state

### 500 Server Error
- Backend error
- Show retry option

## Offline Support (Coming Soon)

The app is ready for offline support:

1. **Data Caching**: Store fetched data locally
2. **Offline Queue**: Queue actions when offline
3. **Sync on Reconnect**: Sync when back online
4. **Conflict Resolution**: Handle data conflicts

## Performance Optimization

### Current Optimizations
- ✅ Pagination (limit/offset)
- ✅ Selective field loading
- ✅ Response caching
- ✅ Lazy loading

### Future Optimizations
- 🚧 Image optimization
- 🚧 Data prefetching
- 🚧 Background sync
- 🚧 Incremental updates

## Monitoring & Analytics

Ready to integrate:
- Sentry for crash reporting
- Firebase Analytics for usage tracking
- Custom events for feature usage
- Performance monitoring

## Security

### Data Protection
- ✅ HTTPS only
- ✅ JWT authentication
- ✅ Encrypted token storage
- ✅ Automatic token refresh
- ✅ Session timeout

### Privacy
- ✅ Students see only their data
- ✅ No cross-student data access
- ✅ Audit logging on backend
- ✅ GDPR-ready architecture

---

**Summary**: The mobile app fetches 100% real data from your admin system backend. No mock data, no placeholders - everything is connected to the actual PostgreSQL database through the Next.js API routes.
