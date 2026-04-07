# Fix EAS Build Socket Error

The error is caused by EAS trying to copy socket files from your system's snap directory.

## Solution 1: Use --non-interactive flag

```bash
eas build --platform android --profile preview --non-interactive
```

## Solution 2: Build from a clean location

The issue is that EAS is scanning directories it shouldn't. Try building from a different location:

```bash
# Go to parent directory
cd ~/LMS-main

# Create a clean copy (without node_modules)
rsync -av --exclude='node_modules' --exclude='.expo' --exclude='snap' student-mobile-app/ student-mobile-app-clean/

# Go to clean directory
cd student-mobile-app-clean

# Install dependencies
npm install

# Build
eas build --platform android --profile preview
```

## Solution 3: Use .easignore (Already Done)

I've already added `snap/` to your `.easignore` file. Try building again:

```bash
eas build --platform android --profile preview
```

## Solution 4: Clear EAS cache

```bash
# Clear EAS cache
rm -rf ~/.expo
rm -rf .expo

# Try again
eas build --platform android --profile preview
```

## Solution 5: Use Git (Recommended)

EAS works best with Git repositories:

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Build (EAS will use git files only)
eas build --platform android --profile preview
```

## Quick Fix (Try This First)

```bash
# Clear local cache
rm -rf .expo

# Build with clean flag
eas build --platform android --profile preview --clear-cache
```

## Alternative: Use Expo's Web Build Service

If EAS keeps failing, you can use the web interface:

1. Go to: https://expo.dev/accounts/owenoz/projects/next-education-student
2. Click "Builds" tab
3. Click "Create a build"
4. Select Android
5. Select "preview" profile
6. Upload your code via web interface

## Why This Happens

EAS creates a shallow clone of your project in `/tmp/` and sometimes includes system directories like `snap/` which contain socket files that can't be copied.

The `.easignore` file should prevent this, but sometimes EAS's file scanner picks up system directories anyway.

## Recommended Approach

**Use Git** - This is the most reliable method:

```bash
cd ~/LMS-main/student-mobile-app

# Initialize git
git init

# Add .gitignore (already created)
# Add files
git add .

# Commit
git commit -m "Student mobile app ready for build"

# Build (EAS will only include git-tracked files)
eas build --platform android --profile preview
```

This ensures EAS only uploads files tracked by Git, avoiding system directories entirely.
