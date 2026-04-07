# Complete Build Instructions for Student Mobile App

## Quick Start Guide

Follow these steps to build and deploy the student mobile app.

## Step 1: Initial Setup (One-time)

### Install Required Tools

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI for building
npm install -g eas-cli

# Verify installations
expo --version
eas --version
```

### Create Expo Account

1. Go to https://expo.dev/signup
2. Create a free account
3. Verify your email

## Step 2: Project Configuration

### Navigate to Project

```bash
cd student-mobile-app
```

### Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Navigation
- Axios
- Expo modules (SecureStore, Notifications, etc.)
- UI libraries

### Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Set your backend URL:
```env
API_BASE_URL=https://your-domain.com/api/v1
```

**For local testing**, use your computer's local IP:
```env
API_BASE_URL=http://192.168.1.100:3000/api/v1
```

To find your local IP:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` or `ip addr` (look for inet)

### Initialize EAS

```bash
# Login to Expo
eas login

# Initialize EAS in your project
eas init

# This creates a project and updates app.json with projectId
```

## Step 3: Test in Development

### Option A: Test with Expo Go (Recommended for Quick Testing)

1. Install Expo Go on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Start development server:
```bash
npm start
```

3. Scan QR code:
   - **Android**: Use Expo Go app to scan
   - **iOS**: Use Camera app to scan (opens in Expo Go)

### Option B: Test with Android Emulator

1. Install Android Studio: https://developer.android.com/studio

2. Create an Android Virtual Device (AVD):
   - Open Android Studio
   - Tools → Device Manager
   - Create Device → Select a phone model
   - Download a system image (API 30 or higher)
   - Finish setup

3. Start emulator and run:
```bash
npm run android
```

### Option C: Test with iOS Simulator (Mac only)

1. Install Xcode from Mac App Store

2. Install Command Line Tools:
```bash
xcode-select --install
```

3. Run:
```bash
npm run ios
```

## Step 4: Build Production APK

### Configure Build Profile

The `eas.json` file is already configured with three profiles:
- **development**: For development builds with debugging
- **preview**: For testing (generates APK)
- **production**: For final release

### Build APK for Testing

```bash
# Build preview APK (recommended for testing)
eas build --platform android --profile preview
```

This will:
1. Upload your code to Expo's build servers
2. Build the APK in the cloud
3. Provide a download link when complete

**Build time**: Usually 10-20 minutes

### Build Production APK

```bash
# Build production APK
eas build --platform android --profile production
```

### Monitor Build Progress

```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## Step 5: Download and Install APK

### Download APK

1. When build completes, you'll see a download link in terminal
2. Or visit: https://expo.dev/accounts/[your-account]/projects/[project-name]/builds
3. Click on the build to download APK

### Install on Android Device

#### Method 1: Direct Download on Device

1. Open the download link on your Android device
2. Download the APK
3. Tap the downloaded file
4. If prompted, enable "Install from Unknown Sources"
5. Tap "Install"

#### Method 2: Transfer from Computer

1. Download APK to your computer
2. Connect Android device via USB
3. Enable "File Transfer" mode on device
4. Copy APK to device's Download folder
5. On device, open Files app → Downloads
6. Tap the APK file
7. Enable "Install from Unknown Sources" if prompted
8. Tap "Install"

#### Method 3: Using ADB

```bash
# Install ADB (Android Debug Bridge)
# Included with Android Studio

# Connect device via USB and enable USB debugging
# Then run:
adb install path/to/your-app.apk
```

## Step 6: Test the App

### Create Test Student Account

1. Login to your admin portal
2. Navigate to Students section
3. Click "Add Student"
4. Fill in details:
   - Email: student@test.com
   - Password: Test123!
   - First Name: Test
   - Last Name: Student
5. Save the student

### Test Login

1. Open the mobile app
2. Enter credentials:
   - Email: student@test.com
   - Password: Test123!
3. Tap "Sign In"

### Verify Features

- [ ] Login successful
- [ ] Home dashboard loads
- [ ] Can view enrolled courses
- [ ] Can navigate to course details
- [ ] Can view assessments
- [ ] Profile shows correct information
- [ ] Logout works

## Step 7: Build for iOS (Optional)

### Prerequisites

- Mac computer with macOS
- Xcode installed
- Apple Developer account ($99/year)

### Build iOS App

```bash
# Build for iOS
eas build --platform ios --profile production

# Or build for both platforms
eas build --platform all --profile production
```

### Install on iOS

1. Download IPA file from build
2. Use Apple Configurator or Xcode to install
3. Or submit to TestFlight for testing

## Advanced: Continuous Deployment

### Automatic Updates with EAS Update

```bash
# Install EAS Update
npm install expo-updates

# Configure in app.json
# Then publish updates:
eas update --branch production --message "Bug fixes"
```

Users will receive updates automatically without reinstalling.

### Submit to Google Play Store

```bash
# Build for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

You'll need:
- Google Play Developer account ($25 one-time fee)
- App signing key
- Store listing details

## Troubleshooting

### Build Fails

**Error: "Unable to resolve module"**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

**Error: "Build failed with unknown error"**
- Check build logs: `eas build:view [BUILD_ID]`
- Ensure all dependencies are compatible
- Try building with `--clear-cache` flag

### Cannot Connect to Backend

**Issue: "Network request failed"**
- Verify backend is running
- Check API_BASE_URL in .env
- Ensure device and backend are on same network (for local testing)
- Check firewall settings

**Issue: "401 Unauthorized"**
- Verify student account exists in admin portal
- Check credentials are correct
- Ensure backend authentication is working

### App Crashes

**On Android:**
```bash
# View logs
adb logcat | grep ReactNative
```

**On iOS:**
```bash
# View logs
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "YourApp"'
```

### Build Takes Too Long

- Normal build time: 10-20 minutes
- If stuck, cancel and retry: `eas build:cancel`
- Check Expo status: https://status.expo.dev

## Production Checklist

Before releasing to users:

- [ ] Update app version in `app.json`
- [ ] Set production API_BASE_URL
- [ ] Test all features thoroughly
- [ ] Test on multiple devices
- [ ] Test with slow/no internet connection
- [ ] Update app icons and splash screen
- [ ] Review and update app permissions
- [ ] Test login with real student accounts
- [ ] Verify data syncs correctly with backend
- [ ] Test logout and re-login
- [ ] Check error handling
- [ ] Verify all navigation works
- [ ] Test on different screen sizes

## Distribution Options

### Option 1: Direct APK Distribution

- Build APK as shown above
- Share download link with students
- Students install manually

**Pros**: Quick, no store approval needed
**Cons**: Manual updates, security warnings

### Option 2: Google Play Store

- Submit to Play Store
- Students install from store
- Automatic updates

**Pros**: Professional, trusted, automatic updates
**Cons**: $25 fee, approval process

### Option 3: Internal Testing

- Use Google Play Internal Testing
- Share with up to 100 testers
- No approval needed

**Pros**: Easy testing, automatic updates
**Cons**: Limited to 100 users

## Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **React Navigation**: https://reactnavigation.org
- **Expo Forums**: https://forums.expo.dev

## Next Steps

After successful build:

1. Distribute APK to students
2. Gather feedback
3. Implement additional features:
   - Lesson content viewing
   - Assessment submissions
   - Push notifications
   - Offline sync
   - Messages and announcements
4. Submit to app stores
5. Set up analytics and crash reporting

## Quick Reference Commands

```bash
# Development
npm start                                    # Start dev server
npm run android                              # Run on Android
npm run ios                                  # Run on iOS

# Building
eas build -p android --profile preview       # Build test APK
eas build -p android --profile production    # Build production APK
eas build -p ios --profile production        # Build iOS app

# Deployment
eas submit -p android                        # Submit to Play Store
eas update --branch production               # Push OTA update

# Utilities
eas build:list                               # List all builds
eas build:cancel                             # Cancel current build
expo start -c                                # Start with cleared cache
```

---

**Ready to build?** Start with Step 1 and follow through each step carefully. The entire process from setup to APK should take about 30-60 minutes for first-time setup.
