https://www.youtube.com/watch?v=gc0yM8eqkV0

[![Build Docker Image and Deploy](https://github.com/niiicolai-apps/europa-celestial-quest/actions/workflows/main.yml/badge.svg)](https://github.com/niiicolai-apps/europa-celestial-quest/actions/workflows/main.yml)

# Install

```bash
$ npm run setup
```

# Usage

## Web
```bash
$ npm run dev-web
```

## PC
```bash
$ npm run dev-electron
```

## IOS
1. Ensure Xcode is installed (https://developer.apple.com/xcode/)

2. Set Capacitor env. variable:
```bash
$ export CAPACITOR_IOS_XCODE_PATH=/Applications/Xcode.app/Contents/MacOS/Xcode
```

3. Run the emulator
```bash
$ npm run dev-ios
```

## Android
1. Ensure Android Studio is installed (https://developer.android.com/studio).

2. Set Capacitor env. variable: 

**Windows:**
```bash
$ set CAPACITOR_ANDROID_STUDIO_PATH=C:\Program Files\Android\Android Studio\bin\studio64.exe
```

**Linux & Mac:**
```bash
$ export CAPACITOR_ANDROID_STUDIO_PATH=/path/to/your/android-studio/bin/studio.sh
```

3. Run the emulator
```bash
$ npm run dev-android
```

# Build

```bash
$ npm run build
```
