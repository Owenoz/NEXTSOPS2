# Next Education Solutions - Student Mobile App

A complete React Native Expo mobile application for students that connects seamlessly to the Next Education Solutions LMS backend.

## Features

### ✅ Implemented
- **Authentication**: Login with credentials created by admin, JWT token management, auto-refresh
- **Home Dashboard**: Overview of active courses, progress tracking, quick actions
- **Courses**: View enrolled courses, track progress, access curriculum
- **Course Details**: View course content, units, and lessons
- **Assessments**: View assignments, quizzes, exams, and projects
- **Profile Management**: View profile, logout functionality
- **Offline Support**: Secure token storage, network status detection
- **Modern UI**: Matches admin portal design with brand colors and gradients

### 🚧 Ready for Implementation
- Lesson content viewing (video, reading, interactive)
- Assessment submission and grading
- Real-time notifications with push notifications
- Messages and announcements
- Certificate viewing and downloading
- Attendance marking (offline capable)
- AI tools integration
- File uploads and downloads
- Offline content sync

## Tech Stack

- **Framework**: React Native with Expo SDK
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API
- **API Client**: Axios with interceptors
- **Storage**: Expo SecureStore for tokens, AsyncStorage for data
- **UI Components**: Custom components with Linear Gradients
- **Icons**: Ionicons from @expo/vector-icons

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for building): `npm install -g eas-cli`
- Android Studio (for Android development) or Xcode (for iOS development)

## Installation

### 1. Clone and Install Dependencies

```bash
cd student-mobile-app
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```env
API_BASE_URL=https://your-domain.com/api/v1
# For local development: http://192.168.1.x:3000/api/v1
```

**Important**: For local development, use your computer's local IP address (not localhost) so the mobile device can access it.

### 3. Update EAS Configuration

Edit `app.json` and update the `extra.eas.projectId`:

```bash
eas init
```

This will create a project ID and update your `app.json`.

## Running the App

### Development Mode

#### Using Expo Go (Easiest)

1. Start the development server:
```bash
npm start
```

2. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens in Expo Go)

#### Using Android Emulator

1. Start Android Studio and launch an emulator
2. Run:
```bash
npm run android
```

#### Using iOS Simulator (Mac only)

```bash
npm run ios
```

### Testing with Backend

1. Ensure your backend server is running
2. Update `API_BASE_URL` in `.env` to point to your backend
3. Create a test student user in the admin portal
4. Use those credentials to login in the mobile app

## Building for Production

### Prerequisites for Building

1. Create an Expo account: https://expo.dev/signup
2. Login to EAS:
```bash
eas login
```

### Build Android APK

#### Development Build
```bash
eas build --platform android --profile development
```

#### Preview Build (for testing)
```bash
eas build --platform android --profile preview
```

#### Production Build
```bash
eas build --platform android --profile production
```

The build process will:
1. Upload your code to Expo servers
2. Build the APK in the cloud
3. Provide a download link when complete

### Build iOS (Mac required for local builds)

```bash
eas build --platform ios --profile production
```

**Note**: iOS builds require an Apple Developer account ($99/year).

### Download and Install APK

1. After the build completes, you'll receive a download link
2. Download the APK file
3. Transfer to your Android device
4. Enable "Install from Unknown Sources" in Android settings
5. Install the APK

## Project Structure

```
student-mobile-app/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── package.json                # Dependencies
├── .env                        # Environment variables
├── assets/                     # Images, icons, splash screens
└── src/
    ├── config/
    │   ├── api.js             # API endpoints configuration
    │   └── theme.js           # Theme colors and styles
    ├── contexts/
    │   └── AuthContext.js     # Authentication context
    ├── navigation/
    │   └── AppNavigator.js    # Navigation configuration
    ├── screens/
    │   ├── LoginScreen.js     # Login screen
    │   ├── HomeScreen.js      # Dashboard
    │   ├── CoursesScreen.js   # Courses list
    │   ├── CourseDetailScreen.js
    │   ├── LessonScreen.js
    │   ├── AssessmentsScreen.js
    │   ├── AssessmentDetailScreen.js
    │   ├── ProfileScreen.js
    │   ├── NotificationsScreen.js
    │   ├── MessagesScreen.js
    │   ├── CertificatesScreen.js
    │   └── ForgotPasswordScreen.js
    └── services/
        └── api.js             # API service with Axios
```

## API Integration

The app connects to your existing backend using the following endpoints:

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset

### Courses & Enrollments
- `GET /enrollments` - Get student's enrolled courses
- `GET /courses/:id` - Get course details
- `GET /courses/:id/curriculum` - Get course curriculum
- `GET /enrollments/:id/progress` - Get enrollment progress
- `POST /lessons/:id/complete` - Mark lesson as complete

### Assessments
- `GET /assessments` - Get student's assessments
- `GET /assessments/:id` - Get assessment details
- `POST /assessments/:id/submit` - Submit assessment answers
- `GET /assessments/:id/submissions` - Get submission history

### Notifications & Messages
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark as read
- `GET /messages` - Get messages
- `GET /messages/announcements` - Get announcements

### Certificates
- `GET /certificates` - Get earned certificates
- `POST /certificates/:id/download` - Download certificate

## Authentication Flow

1. User enters credentials (created by admin)
2. App sends login request to backend
3. Backend returns JWT access token (15 min) and refresh token (7 days)
4. Tokens stored securely in Expo SecureStore
5. Access token included in all API requests
6. Auto-refresh when access token expires
7. Logout clears all stored tokens

## Offline Support

The app includes offline capabilities:

- Secure token storage persists across app restarts
- Network status detection
- Offline data caching (ready for implementation)
- Sync queue for offline actions (ready for implementation)

## Customization

### Brand Colors

Edit `src/config/theme.js` to match your branding:

```javascript
export const COLORS = {
  brandBlue: '#366888',
  brandOrange: '#f4981c',
  brandBeige: '#F5E3C3',
  brandSage: '#B5CDA3',
  // ... more colors
};
```

### App Name and Icon

1. Update `name` and `slug` in `app.json`
2. Replace images in `assets/` folder:
   - `icon.png` (1024x1024)
   - `splash.png` (1284x2778)
   - `adaptive-icon.png` (1024x1024)

## Testing

### Test User Setup

1. Login to admin portal
2. Navigate to Students section
3. Create a new student user
4. Note the email and password
5. Use these credentials in the mobile app

### Testing Checklist

- [ ] Login with student credentials
- [ ] View enrolled courses on home screen
- [ ] Navigate to courses list
- [ ] Open course details
- [ ] View course curriculum
- [ ] Check assessments list
- [ ] View profile information
- [ ] Test logout functionality
- [ ] Test forgot password flow

## Troubleshooting

### Cannot connect to backend

- Ensure backend server is running
- Use local IP address (not localhost) in `.env`
- Check firewall settings
- Verify API_BASE_URL is correct

### Build fails

- Run `npm install` to ensure all dependencies are installed
- Clear cache: `expo start -c`
- Check EAS build logs for specific errors
- Ensure you're logged in: `eas login`

### App crashes on startup

- Check console logs: `npx react-native log-android` or `npx react-native log-ios`
- Verify all required dependencies are installed
- Clear app data and reinstall

## Next Steps

To complete the full implementation:

1. **Lesson Viewing**: Implement video player, PDF viewer, interactive content
2. **Assessment Submission**: Build question UI, answer submission, file uploads
3. **Push Notifications**: Configure Expo Notifications, register device tokens
4. **Offline Sync**: Implement sync queue, conflict resolution
5. **AI Tools**: Integrate AI features from backend
6. **Attendance**: Build attendance marking UI with offline support
7. **Messages**: Implement real-time messaging
8. **Certificates**: Add PDF viewer and download functionality

## Support

For issues or questions:
- Check backend API documentation
- Review Expo documentation: https://docs.expo.dev
- Check React Navigation docs: https://reactnavigation.org

## License

Copyright © 2024 Next Education Solutions. All rights reserved.
