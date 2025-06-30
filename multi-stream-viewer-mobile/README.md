# Multi-Stream Viewer Mobile

A React Native Expo application for viewing multiple live streams simultaneously on mobile devices.

## Features

- 📱 **Multi-Stream Grid**: Watch multiple streams at once with customizable layouts
- 🔍 **Stream Discovery**: Browse and search for live streams across platforms
- 🎮 **Gesture Controls**: Swipe, pinch, and drag to control streams
- 🎨 **Dark Theme**: Optimized for viewing in low-light conditions
- 💾 **State Persistence**: Your streams and preferences are saved automatically
- 🎉 **Watch Party**: Watch streams together with friends in real-time
- 📊 **Analytics**: Track your viewing habits and statistics
- 🎵 **Audio Mixer**: Control volume for each stream independently

## Tech Stack

- **React Native** with **Expo SDK 52**
- **TypeScript** for type safety
- **React Navigation** for routing
- **Zustand** for state management
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for touch interactions
- **AsyncStorage** for data persistence
- **React Query** for data fetching

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code with Expo Go app

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── store/          # Zustand stores
├── types/          # TypeScript types
├── constants/      # Theme and constants
├── hooks/          # Custom hooks
├── services/       # API services
└── utils/          # Utility functions
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Features in Development

- [ ] Twitch/YouTube/Kick API integration
- [ ] Real-time chat overlay
- [ ] Stream notifications
- [ ] Clip creation
- [ ] Social sharing
- [ ] Custom themes
- [ ] Tablet optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.