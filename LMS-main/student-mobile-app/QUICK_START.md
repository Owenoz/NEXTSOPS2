# Quick Start Guide - Student Mobile App

Get the app running in 5 minutes!

## Prerequisites

- Node.js installed
- Backend server running
- Admin portal accessible

## Step 1: Install Dependencies (2 minutes)

```bash
cd student-mobile-app
npm install
```

## Step 2: Configure Backend URL (1 minute)

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```env
# For production
API_BASE_URL=https://your-domain.com/api/v1

# For local testing (use your computer's IP, not localhost)
API_BASE_URL=http://192.168.1.100:3000/api/v1
```

**Find your local IP:**
- Windows: Run `ipconfig` in Command Prompt
- Mac/Linux: Run `ifconfig` or `ip addr` in Terminal

## Step 3: Create Test Student (1 minute)

1. Open admin portal
2. Go to Students → Add Student
3. Create a student:
   - Email: `student@test.com`
   - Password: `Test123!`
   - First Name: Test
   - Last Name: Student
4. Save

## Step 4: Run the App (1 minute)

### Option A: Test on Your Phone (Recommended)

1. Install Expo Go on your phone:
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Start the app:
```bash
npm start
```

3. Scan the QR code:
   - Android: Use Expo Go app
   - iOS: Use Camera app (opens Expo Go)

### Option B: Test on Emulator

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

## Step 5: Login and Test

1. App opens → Login screen
2. Enter credentials:
   - Email: `student@test.com`
   - Password: `Test123!`
3. Tap "Sign In"
4. You should see the home dashboard!

## Troubleshooting

### "Network request failed"

**Problem**: App can't connect to backend

**Solution**:
1. Ensure backend is running
2. Check `.env` has correct IP address
3. Make sure phone and computer are on same WiFi
4. Try disabling firewall temporarily

### "Invalid credentials"

**Problem**: Login fails

**Solution**:
1. Verify student exists in admin portal
2. Check email and password are correct
3. Ensure student role is set correctly

### QR code won't scan

**Problem**: Can't scan QR code

**Solution**:
1. Make sure Expo Go is installed
2. Try typing the URL manually in Expo Go
3. Or use `npm run android` to run on emulator

## Next Steps

Now that it's running:

1. **Enroll student in courses** (via admin portal)
2. **Test course viewing** in mobile app
3. **Create assessments** and test in app
4. **Build APK** when ready (see BUILD_INSTRUCTIONS.md)

## Build APK (When Ready)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Initialize project
eas init

# Build APK
npm run build:android:preview
```

Download link will appear when build completes (~15 minutes).

## Common Commands

```bash
npm start              # Start development server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run build:android:preview  # Build test APK
```

## Need Help?

- Check `README.md` for detailed documentation
- See `BUILD_INSTRUCTIONS.md` for complete build guide
- Review backend API documentation

---

**That's it!** You should now have the student app running and connected to your backend. 🎉
