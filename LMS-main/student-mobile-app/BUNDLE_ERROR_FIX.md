# Bundle JavaScript Build Phase Error Fix

## Issue
Build failed at "Bundle JavaScript" phase with "Unknown error"

## Root Causes
1. Missing babel.config.js
2. Missing devDependencies (@babel/core, babel-preset-expo)
3. React Native Reanimated plugin not configured
4. No app.config.js (dynamic config)

## Changes Applied

### 1. Added babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### 2. Added devDependencies to package.json
- @babel/core: ^7.25.0
- babel-preset-expo: ^12.0.0

### 3. Created app.config.js
- Dynamic configuration file
- Allows for environment-specific settings
- Better for EAS builds

## Next Steps

### Step 1: Install Dependencies
```bash
cd ~/LMS-main/student-mobile-app
npm install
```

### Step 2: Commit Changes
```bash
git add .
git commit -m "Add babel config and fix bundling"
```

### Step 3: Retry Build
```bash
eas build --platform android --profile preview
```

## Alternative: Local Build (Recommended)

Since EAS keeps having issues, try building locally:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Generate native code
npx expo prebuild --platform android --clean

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## Check Build Logs

Visit the build logs to see exact error:
https://expo.dev/accounts/owenoz0/projects/next-education-student/builds/8d3c7d42-35be-4a18-8c00-8ed...

Look for:
- JavaScript syntax errors
- Missing dependencies
- Import/export issues
- Babel transformation errors

## Common Bundle Errors

### Error: Cannot find module
- Solution: npm install missing package

### Error: Unexpected token
- Solution: Check babel.config.js is present

### Error: Reanimated plugin
- Solution: Add 'react-native-reanimated/plugin' to babel plugins

### Error: React 19 compatibility
- Solution: Downgrade to React 18 if needed

## Downgrade React (If Needed)

If React 19 is causing issues:

```bash
npm install react@18.2.0 react-native@0.74.0
npm install
git add package.json package-lock.json
git commit -m "Downgrade to React 18"
eas build --platform android --profile preview
```

## Test Locally First

Before building, test the app locally:

```bash
npm start
# Scan QR with Expo Go
# Check for any runtime errors
```

## Success Indicators

Build should show:
- ✔ Bundle JavaScript
- ✔ Build Android project
- ✔ Upload artifacts
- 🎉 Build successful

Then download APK from EAS dashboard.
