# Run the Student Mobile App

## Quick Start (Offline Mode)

```bash
cd ~/LMS-main/student-mobile-app
npx expo start --offline
```

This bypasses the network check and starts the app immediately.

## Alternative Commands

### 1. Start with Tunnel (for remote testing)
```bash
npx expo start --tunnel --offline
```

### 2. Start on specific platform
```bash
# Android only
npx expo start --android --offline

# Web only
npx expo start --web --offline
```

### 3. Clear cache and start
```bash
npx expo start --clear --offline
```

## After Starting

You'll see a QR code. Then:

### On Android Device:
1. Install Expo Go from Play Store
2. Open Expo Go app
3. Tap "Scan QR code"
4. Scan the QR code shown in terminal
5. App will load on your device

### On Android Emulator:
```bash
# Press 'a' in the terminal after starting
# Or run:
npx expo start --android --offline
```

### On Web Browser:
```bash
# Press 'w' in the terminal after starting
# Or run:
npx expo start --web --offline
```

## Build APK Instead

If you want to build the APK directly:

### Option 1: EAS Build
```bash
eas build --platform android --profile preview
```

### Option 2: Local Build
```bash
# Generate native Android project
npx expo prebuild --platform android --clean

# Build APK
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

## Configure Backend Connection

Before testing, update the API URL:

Edit `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_IP:3000/api/v1',
  TIMEOUT: 30000,
};
```

Get your IP:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

## Test Checklist

Once app loads:
- [ ] Login screen appears
- [ ] Can enter credentials
- [ ] Login works (test with admin-created student account)
- [ ] Dashboard loads
- [ ] Navigation works
- [ ] Courses screen loads
- [ ] AI Study Tools work
- [ ] Profile screen loads

## Troubleshooting

### "Fetch failed" error
- Use `--offline` flag: `npx expo start --offline`
- This is just a version check, app will work fine

### "Unable to resolve module"
```bash
# Clear cache
rm -rf node_modules
npm install
npx expo start --clear --offline
```

### "Port 8081 already in use"
```bash
# Kill existing Metro bundler
killall node
# Or use different port
npx expo start --port 8082 --offline
```

### App won't load on device
- Ensure device and computer are on same WiFi
- Try tunnel mode: `npx expo start --tunnel --offline`
- Check firewall settings

## Success!

Once the app loads successfully:
1. Test all features
2. Fix any bugs
3. Build production APK with EAS
4. Distribute to users

The app is fully functional with real backend integration!
