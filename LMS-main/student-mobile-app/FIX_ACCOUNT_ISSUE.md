# Fix EAS Account Permission Issue

## Problem
The project was linked to account "owenoz" but you're logged in as "owenoz0".
Error: "Entity not authorized: AppEntity[10c9e7dd-4891-4794-815a-0cd7754f6afa]"

## Solution Applied
Removed the project link from app.json so you can create a new project under your current account (owenoz0).

## Steps to Fix

### 1. Initialize New Project
```bash
cd ~/LMS-main/student-mobile-app
eas init
```

This will:
- Create a new project under your account (owenoz0)
- Add the new projectId to app.json
- Link the app to your account

### 2. Commit Changes
```bash
git add app.json
git commit -m "Link to owenoz0 account"
```

### 3. Build
```bash
eas build --platform android --profile preview
```

## Alternative: Switch to Original Account

If you want to use the original "owenoz" account instead:

```bash
eas logout
eas login
# Enter credentials for "owenoz" account (not owenoz0)
```

Then restore the original app.json and build.

## Verify Current Account
```bash
eas whoami
```

Should show:
- Username: owenoz0
- Email: owenozmubb07@gmail.com

## Next Steps After Successful Init

1. The new projectId will be added to app.json automatically
2. Commit the change
3. Run the build command
4. Build should succeed without permission errors
