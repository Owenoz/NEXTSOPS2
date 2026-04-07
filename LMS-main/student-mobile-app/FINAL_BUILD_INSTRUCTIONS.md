# Final Build Instructions - EAS Build Fix

## Issue Resolved
The "Bundle JavaScript" build phase was failing due to missing babel dependencies.

## Changes Made
1. ✅ Added `babel.config.js` with proper configuration
2. ✅ Added `@babel/core` and `babel-preset-expo` to devDependencies
3. ✅ Installed all dependencies with `npm install`
4. ✅ Removed `runtimeVersion` policy (requires SDK 46+, we're on SDK 54)
5. ✅ Added proper metro.config.js
6. ✅ Committed all changes to git

## Build Now

Run this command to build:

```bash
cd ~/LMS-main/student-mobile-app
eas build --platform android --profile preview
```

## What to Expect

The build should now:
1. ✅ Upload successfully
2. ✅ Compute fingerprint
3. ✅ Bundle JavaScript (previously failing here)
4. ✅ Build Android project
5. ✅ Generate APK

Build time: ~10-15 minutes on free tier

## After Successful Build

1. Download APK from EAS dashboard:
   ```
   https://expo.dev/accounts/owenoz0/projects/next-education-student/builds
   ```

2. Install on Android device:
   ```bash
   adb install app.apk
   ```

3. Configure backend URL:
   - Open `student-mobile-app/src/config/api.js`
   - Update `API_BASE_URL` to your server IP
   - Rebuild if needed

## Alternative: Local Build (If EAS Still Fails)

If EAS continues to have issues, build locally:

```bash
cd ~/LMS-main/student-mobile-app

# Generate native Android code
npx expo prebuild --platform android --clean

# Build APK
cd android
./gradlew assembleRelease

# APK location
# android/app/build/outputs/apk/release/app-release.apk
```

## Testing the App

1. Make sure backend is running:
   ```bash
   cd ~/LMS-main
   npm run dev
   ```

2. Get your server IP:
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```

3. Update API_BASE_URL in `src/config/api.js` to `http://YOUR_IP:3000`

4. Test login with credentials from admin portal

## Troubleshooting

### If build still fails at Bundle JavaScript:
- Check build logs at the URL provided
- Look for specific JavaScript syntax errors
- Verify all imports are correct

### If build fails at Android build phase:
- Check for missing Android permissions
- Verify gradle configuration

### If app crashes on launch:
- Check if backend is accessible from mobile device
- Verify API_BASE_URL is correct
- Check device logs: `adb logcat`

## Success Indicators

✅ Build completes without errors
✅ APK downloads successfully
✅ App installs on device
✅ Login screen appears
✅ Can connect to backend
✅ Can login with valid credentials
✅ Dashboard loads with real data

## Next Steps After Successful Build

1. Test all features:
   - Login/Logout
   - View courses
   - View assessments
   - AI Study Tools
   - Profile management

2. Fix any bugs found during testing

3. Build production version:
   ```bash
   eas build --platform android --profile production
   ```

4. Distribute to users or upload to Play Store
