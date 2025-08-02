#!/bin/bash

# React Native Car Pooling App - Dependency Installation Script
# This script installs compatible versions of all required dependencies

echo "🚀 Installing React Native Car Pooling App Dependencies..."
echo "================================================="

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a React Native/Expo project
if [ ! -f "package.json" ]; then
    print_error "No package.json found. Please run this in your project root directory."
    exit 1
fi

# Clear any existing node_modules and lock files for clean install
print_warning "Cleaning existing installations..."
rm -rf node_modules
rm -f package-lock.json yarn.lock

# Core Dependencies (React 18 - stable and compatible)
print_status "Installing Core Dependencies..."
npx expo install expo@~53.0.20
npx expo install react@18.3.1 react-dom@18.3.1 react-native@0.79.5

# Router
print_status "Installing Expo Router..."
npx expo install expo-router@~5.1.4

# Firebase (Use ONLY React Native Firebase - don't mix with web Firebase)
print_status "Installing Firebase..."
npm install @react-native-firebase/app@22.4.0
npm install @react-native-firebase/crashlytics@22.4.0
npm install @react-native-firebase/auth@22.4.0
npm install @react-native-firebase/firestore@22.4.0

# Navigation & UI
print_status "Installing Navigation & UI..."
npx expo install @react-navigation/native@7.1.16
npx expo install react-native-screens@~4.11.1 
npx expo install react-native-safe-area-context@5.4.0
npm install react-native-paper@5.14.5
npx expo install @expo/vector-icons@14.1.0

# Animation (Simplified - use either Moti OR Framer Motion, not both)
print_status "Installing Animation Libraries..."
npx expo install react-native-reanimated@~3.6.2 
npx expo install react-native-gesture-handler@~2.14.0
npm install moti@0.30.0
# Lottie for JSON animations
npx expo install lottie-react-native@~6.7.0
# Note: Removed framer-motion to avoid conflicts

# Styling (NativeWind)
print_status "Installing Styling..."
npm install nativewind@4.1.23 
npm install tailwindcss@3.4.17

# Date/Time & Utilities
print_status "Installing Utilities..."
npx expo install @react-native-community/datetimepicker@8.4.1
npm install dayjs@1.11.13

# Expo Modules
print_status "Installing Expo Modules..."
npx expo install expo-constants@~15.4.6 
npx expo install expo-font@~13.3.2 
npx expo install expo-linking@~7.1.7
npx expo install expo-splash-screen@0.30.10 
npx expo install expo-status-bar@~2.2.3
npx expo install expo-system-ui@~5.0.10 
npx expo install expo-web-browser@~14.2.0

# Maps & Location
print_status "Installing Maps & Location..."
npx expo install react-native-maps
npx expo install expo-location

# Dev Dependencies
print_status "Installing Dev Dependencies..."
npm install --save-dev @babel/core@7.25.0
npm install --save-dev @types/react@18.3.12
npm install --save-dev jest@29.7.0 
npm install --save-dev jest-expo@~53.0.9 
npm install --save-dev react-test-renderer@18.3.1
npm install --save-dev typescript@5.6.0

# Additional useful dependencies for car pooling app
print_status "Installing Additional Utilities..."
npm install react-native-web@~0.19.12  # For web compatibility

print_status "All dependencies installed successfully!"
echo "================================================="
echo "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Configure NativeWind: npx tailwindcss init"
echo "2. Set up Firebase configuration"
echo "3. Configure Babel for Reanimated"
echo ""
print_warning "Don't forget to:"
echo "- Add reanimated plugin to babel.config.js (must be last)"
echo "- Configure Firebase with your project credentials"
echo "- Set up NativeWind in your tailwind.config.js"
