#!/bin/bash

echo "========================================="
echo "EAS Build Status Checker"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Not in student-mobile-app directory"
    echo "Run: cd ~/LMS-main/student-mobile-app"
    exit 1
fi

echo "✅ In correct directory"
echo ""

# Check git status
echo "📦 Git Status:"
git status --short
echo ""

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes"
    echo "Run: git add . && git commit -m 'Fix build config'"
    echo ""
else
    echo "✅ All changes committed"
    echo ""
fi

# Check EAS login
echo "🔐 Checking EAS login..."
eas whoami
echo ""

# List recent builds
echo "📋 Recent builds:"
eas build:list --limit 3
echo ""

echo "========================================="
echo "Ready to build!"
echo "========================================="
echo ""
echo "Run one of these commands:"
echo ""
echo "1. Build with current config:"
echo "   eas build --platform android --profile preview"
echo ""
echo "2. Check specific build logs:"
echo "   Visit: https://expo.dev/accounts/owenoz/projects/next-education-student/builds"
echo ""
echo "3. View build queue status:"
echo "   eas build:list"
echo ""
