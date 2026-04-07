# Build Retry Instructions

## Changes Made to Fix Build Issues

### 1. Added `cli.appVersionSource` to eas.json
- Set to "remote" to let EAS manage version numbers
- This removes the warning about missing field

### 2. Added Android Permissions
- INTERNET - for API calls
- ACCESS_NETWORK_STATE - for network status
- READ_EXTERNAL_STORAGE - for file access
- WRITE_EXTERNAL_STORAGE - for file downloads

### 3. Added Build Optimization
- Created metro.config.js for proper bundling
- Added .npmrc with legacy-peer-deps flag
- Added EAS_SKIP_AUTO_FINGERPRINT=1 to speed up builds

### 4. Added Prebuild Script
- Added "prebuild" script to package.json
- This ensures clean prebuild on EAS servers

## Retry Build Commands

### Option 1: Commit and Build (Recommended)
```bash
cd ~/LMS-main/student-mobile-app
git add .
git commit -m "Fix build configuration and add permissions"
eas build --platform android --profile preview
```

### Option 2: If Network Error Persists
The error "request to https://api.expo.dev/graphql failed" is usually temporary.
Wait 5-10 minutes and retry:

```bash
eas build --platform android --profile preview
```

### Option 3: Check Build Status
If build was queued before the error, check status:
```bash
eas build:list
```

### Option 4: View Build Logs
Check the previous build logs at:
https://expo.dev/accounts/owenoz/projects/next-education-student/builds/fa38128a-8247-42df-a304-84f11dff6d22

Look for specific errors in the "Prebuild" phase.

## Common Prebuild Errors and Fixes

### Error: Missing splash.png
- Fixed: Using splash-icon.png which exists

### Error: Plugin configuration
- Fixed: Removed problematic plugins, using minimal config

### Error: Dependency conflicts
- Fixed: Added .npmrc with legacy-peer-deps

### Error: Socket file
- Fixed: Added comprehensive .easignore

## Next Steps After Successful Build

1. Download the APK from EAS dashboard
2. Install on Android device: `adb install app.apk`
3. Test with real backend at http://YOUR_SERVER_IP:3000
4. Update API_BASE_URL in src/config/api.js if needed

## Troubleshooting

If build still fails:
1. Check build logs URL for specific error
2. Try building without fingerprint: Already added to eas.json
3. Simplify app.json further if needed
4. Contact Expo support if persistent issues
