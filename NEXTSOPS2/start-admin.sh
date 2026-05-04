#!/bin/bash

# Next Shops Admin Portal - Quick Start Script
# This script helps you start the admin portal quickly

echo "🚀 Next Shops Admin Portal - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js 20+ from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if we're in the right directory
if [ ! -d "admin" ]; then
    echo "❌ Error: 'admin' directory not found!"
    echo "📁 Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "admin/node_modules" ]; then
    echo "📦 Installing admin dependencies..."
    cd admin
    npm install
    cd ..
    echo "✅ Dependencies installed!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Start the admin portal
echo "🎨 Starting Admin Portal..."
echo "📍 URL: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

cd admin
npm run dev
