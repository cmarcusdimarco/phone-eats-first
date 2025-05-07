# Phone Eats First

A modern mobile application built with React Native and Expo that helps users obtain low-fidelity calorie estimates by leveraging the power of generative AI. The app features a UI powered by NativeWind (Tailwind CSS for React Native) and uses Supabase for backend services.

## 🚀 Features

- Modern, responsive UI with NativeWind styling
- Authentication system
- Camera integration for food photos
- Real-time data synchronization with Supabase
- Cross-platform support (iOS and Android)
- Type-safe development with TypeScript

## 🛠️ Tech Stack

- **Frontend Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase
- **State Management**: React Context API
- **Navigation**: Expo Router
- **UI Components**: React Native Elements
- **Type Safety**: TypeScript
- **Build Tool**: Expo

## 📋 Prerequisites

- Node.js (LTS version)
- Bun package manager
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd phone-eats-first
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   # For iOS
   bun run ios

   # For Android
   bun run android
   ```

## 📱 Available Scripts

- `bun run dev` - Start the Expo development server
- `bun run dev:web` - Start the web version
- `bun run dev:android` - Start the Android version
- `bun run ios` - Start the iOS version
- `bun run clean` - Clean the project (remove node_modules and .expo)
- `bun run web` - Start the web version

## 🏗️ Project Structure

```
phone-eats-first/
├── app/                 # Main application code
│   ├── (auth)/         # Auth-restricted screens
│   ├── context/        # React Context providers
│   ├── _layout.tsx     # Root layout component
|   └── index.tsx       # Main entrypoint
├── components/         # Reusable UI components
├── services/          # API and service integrations
├── lib/               # Utility functions and helpers
├── assets/            # Static assets (images, fonts)
└── ...
```

## 🔧 Configuration

The project uses several configuration files:

- `tailwind.config.js` - Tailwind CSS configuration
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `eas.json` - EAS Build configuration

## 📦 Dependencies

Key dependencies include:

- `@react-navigation/native` - Navigation
- `@supabase/supabase-js` - Backend services
- `nativewind` - Styling
- `expo-camera` - Camera functionality
- `react-native-reanimated` - Animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is not licensed for reuse by any unauthorized entity.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- NativeWind team for bringing Tailwind to React Native
- Supabase for the backend services
- React Native Reusables for easy-to-implement, yet still highly customizable UI components
