# Student App Login Guide

## ✅ Fixed: API Connection

The API URL has been updated to use your network IP: `http://192.168.1.9:3000`

## 🔐 Student Login Credentials

**Email:** student@lms.com  
**Password:** password

## 🚀 How to Test Login

### 1. Make Sure Backend is Running

In a terminal:
```bash
cd ~/LMS-main
npm run dev
```

Backend should be running at: http://192.168.1.9:3000

### 2. Start the Mobile App

In another terminal:
```bash
cd ~/LMS-main/student-mobile-app
npx expo start --offline
```

### 3. Open on Your Device

**Option A: Expo Go (Recommended for Testing)**
1. Install Expo Go from Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

**Option B: Android Emulator**
- Press 'a' in the terminal after starting

**Option C: Web Browser**
- Press 'w' in the terminal after starting

### 4. Login

1. App opens to Login screen
2. Enter:
   - Email: `student@lms.com`
   - Password: `password`
3. Tap "Login"
4. You should be redirected to the Home/Dashboard

## 🔧 Troubleshooting

### "Network Error" when logging in

**Check 1: Backend is running**
```bash
# In browser, visit:
http://192.168.1.9:3000/api/v1/health

# Should return: {"status":"ok"}
```

**Check 2: Device and computer on same WiFi**
- Both must be on the same network
- Check WiFi settings on both devices

**Check 3: Firewall not blocking**
```bash
# Allow port 3000
sudo ufw allow 3000
# Or temporarily disable firewall
sudo ufw disable
```

**Check 4: Test API from device browser**
- Open browser on your phone
- Visit: http://192.168.1.9:3000
- Should see the LMS homepage

### Wrong IP Address

If your IP changed, update it:

1. Get current IP:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

2. Update `src/config/api.js`:
```javascript
BASE_URL: 'http://YOUR_NEW_IP:3000/api/v1',
```

3. Reload app (press 'r' in Expo terminal)

### Login button not responding

- Check console for errors (press 'j' for debugger)
- Verify credentials are correct
- Try reloading app (press 'r')

### "Invalid credentials" error

The student account might not exist. Create it:

```bash
cd ~/LMS-main
node scripts/create-student-user.js
```

Or use the admin portal to create a student:
1. Login as admin: http://localhost:3000/login
2. Go to Students section
3. Add new student with email: student@lms.com

## ✅ What Should Work After Login

Once logged in, you should see:

- ✅ Home/Dashboard with welcome message
- ✅ Bottom navigation (Home, Courses, Assessments, Profile)
- ✅ Courses screen with enrolled courses
- ✅ Course details when tapping a course
- ✅ Assessments screen
- ✅ AI Study Tools (Quiz Generator, Translator, Text-to-Speech)
- ✅ Profile screen with user info

## 📱 Test All Features

### Home Screen
- View enrolled courses
- See upcoming assessments
- Check recent activity

### Courses Screen
- Browse available courses
- View course details
- Access lessons
- Track progress

### Assessments Screen
- View assigned assessments
- Take assessments
- View grades

### AI Study Tools
- Generate practice quizzes
- Translate text
- Text-to-speech for lessons

### Profile Screen
- View personal information
- Change password
- Logout

## 🎯 Success Indicators

✅ Login successful
✅ Dashboard loads with data
✅ Navigation works smoothly
✅ Courses load from backend
✅ Can view course details
✅ AI tools function
✅ Profile displays correctly

## 📝 Notes

- **Development Mode**: Using Expo Go for testing
- **Real Data**: App fetches from PostgreSQL database
- **Network Required**: Device must reach backend server
- **Same WiFi**: Device and server on same network

## 🚀 Next Steps

After successful login:
1. Test all screens and features
2. Report any bugs
3. Build production APK: `eas build --platform android --profile production`
4. Distribute to students

---

**The student app is now fully configured and ready to use!** 🎓
