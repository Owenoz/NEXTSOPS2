# Fix EAS Build Error

You're getting an "Invalid UUID appId" error because the project needs to be properly initialized with EAS.

## Quick Fix

Run this command to properly initialize the project:

```bash
eas init --id
```

This will:
1. Create a new project on Expo servers
2. Generate a valid project ID
3. Update your `app.json` with the correct ID

## Then Build

After initialization, run:

```bash
eas build --platform android --profile preview
```

## Alternative: Manual Fix

If `eas init --id` doesn't work, try:

```bash
# Remove the extra.eas section from app.json (already done)
# Then run init without --id flag
eas init

# Follow the prompts to create a new project
# It will ask:
# - Project name: next-education-student
# - Confirm: yes

# Then build
eas build --platform android --profile preview
```

## What Happened

The `app.json` had a placeholder `"projectId": "your-project-id"` which is invalid. EAS needs a real UUID that's generated when you create a project on their servers.

## Verification

After running `eas init`, your `app.json` should have something like:

```json
{
  "expo": {
    ...
    "extra": {
      "eas": {
        "projectId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      }
    }
  }
}
```

## Build Again

Once the project ID is set, you can build:

```bash
# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production

# Check build status
eas build:list
```

## Expected Timeline

- Project initialization: < 1 minute
- Build process: 10-20 minutes
- Download APK: Instant (link provided)

## Troubleshooting

### "Project already exists"
If you get this error, the project was already created. Just run:
```bash
eas build --platform android --profile preview
```

### "Not logged in"
Run:
```bash
eas login
```

### "Invalid credentials"
Make sure you're using your Expo account credentials.

---

**TL;DR**: Run `eas init` first, then `eas build --platform android --profile preview`
