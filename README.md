# Expo React Native Boilerplate

A comprehensive, production-ready boilerplate for building React Native applications with Expo. Features authentication, theming, clean architecture, and full TypeScript support.

## Documentation

This project includes comprehensive documentation for AI agents and developers:

- **[.clinerules](.clinerules)** - AI agent rules and coding standards
- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - Main project documentation and context
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep dive into technical architecture
- **[EXAMPLES.md](EXAMPLES.md)** - Practical code examples and patterns
- **[README.md](README.md)** - This file - Quick start and overview

## Features

- ✅ **Expo Router** - File-based routing with route groups
- ✅ **TypeScript** - Strict type-safe development
- ✅ **NativeWind (Tailwind CSS)** - Utility-first styling with dark mode
- ✅ **Authentication System** - Complete auth flow with JWT & role-based access
- ✅ **Theme Support** - Light/Dark/Auto mode with system preference
- ✅ **Mock API Server** - Development-ready mock data
- ✅ **Secure Storage** - Expo SecureStore for sensitive data
- ✅ **Path Aliases** - Clean imports with `@` prefix
- ✅ **Form Validation** - Built-in validation utilities
- ✅ **Reusable Components** - Production-ready UI components
- ✅ **API Services** - Axios with interceptors and error handling
- ✅ **Multi-Environment** - Development, Staging, Production configs

## Project Structure

```
.
├── app
│   ├── (admin)              # Halaman & route khusus admin
│   ├── (auth)               # Halaman auth (login, register, dsb)
│   ├── (protected)          # Halaman yang membutuhkan autentikasi
│   └── _layout.tsx          # Root layout untuk Expo Router
│
├── server
│   ├── db.json              # Mock data untuk JSON Server
│
├── src
│   ├── assets               # Gambar, font, dan aset statis
│   ├── components           # Komponen UI reusable
│   ├── contexts             # Context API (Auth, Theme, dsb)
│   ├── hooks                # Custom React hooks
│   ├── services             # API service (Axios, interceptors, dll)
│   ├── theme                # Konfigurasi tema (warna, dark mode)
│   ├── types                # TypeScript type definitions
│   └── utils                # Helper functions & constants
│
├── app.json                 # Konfigurasi Expo project
├── babel.config.js          # Konfigurasi Babel
├── expo-env.d.ts            # Type definitions untuk Expo environment
├── global.css               # Global style untuk Tailwind / NativeWind
├── index.ts                 # Entry point utama aplikasi
├── LICENSE                  # Lisensi project
├── metro.config.js          # Konfigurasi Metro bundler
├── nativewind-env.d.ts      # Type support untuk NativeWind
├── package.json             # Dependency & script project
├── package-lock.json        # Lock file npm
├── README.md                # Dokumentasi project
├── structure.txt            # Struktur folder (auto-generated)
├── tailwind.config.js       # Konfigurasi TailwindCSS
└── tsconfig.json            # Konfigurasi TypeScript

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

This will start both the Expo development server and the mock API server.

### Available Scripts

#### Development
- `npm start` - Start Expo development server
- `npm run start:staging` - Start with staging config
- `npm run start:prod` - Start with production config
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

#### Quality & Build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build development version (local)
- `npm run build:staging` - Build staging version
- `npm run build:prod` - Build production version
- `npm run clean` - Clean install (remove cache and reinstall)

## Configuration

### API Configuration

Edit `src/utils/constants.ts` to configure your API endpoints:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3001' : 'https://api.yourapp.com',
  TIMEOUT: 10000,
};
```

### Theme Configuration

Customize colors in `src/theme/colors.ts`:

```typescript
export const colors = {
  light: {
    primary: '#3b82f6',
    // ... other colors
  },
  dark: {
    primary: '#3b82f6',
    // ... other colors
  },
};
```

## Authentication

The boilerplate includes a complete authentication flow:

### Default Credentials

- **Admin**: developer@localhost.com / @developer
- **User**: user@localhost.com / @developer

### Using Authentication

```typescript
import { useAuth } from '@hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication methods
}
```

## Theming

Switch between light and dark themes:

```typescript
import { useTheme } from '@hooks/useTheme';

function MyComponent() {
  const { theme, colors, setThemeMode } = useTheme();
  
  // theme: 'light' | 'dark'
  // colors: current theme colors
  // setThemeMode: 'light' | 'dark' | 'auto'
}
```

## API Services

### Making API Calls

```typescript
import { newsService } from '@services/newsService';

// Get all news
const news = await newsService.getNews({ limit: 10 });

// Get single news item
const newsItem = await newsService.getNewsById('1');

// Create news
const newNews = await newsService.createNews({
  title: 'New Article',
  content: 'Content here',
  // ...
});
```

## Custom Hooks

### useAuth

Access authentication state and methods.

### useTheme

Access theme configuration and toggle themes.

## Components

### Button

```typescript
<Button
  title="Click Me"
  variant="primary"
  size="md"
  onPress={() => {}}
  loading={false}
  fullWidth
/>
```

### Input

```typescript
<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  secureTextEntry
/>
```

### Card

```typescript
<Card className="mb-4">
  <Text>Card content</Text>
</Card>
```

### Loading

```typescript
<Loading text="Loading..." fullScreen />
```

## Path Aliases

Use clean imports with configured path aliases:

```typescript
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
import { newsService } from '@services/newsService';
```

## Deployment

### Building for Production

```bash
# For Android
eas build --platform android

# For iOS
eas build --platform ios

# For both
eas build --platform all
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Tech Stack

### Core
- **React Native**: 0.81.4
- **React**: 19.1.0
- **Expo SDK**: ~54.0.0
- **TypeScript**: 5.9+
- **Expo Router**: 6.0.12

### Styling & UI
- **NativeWind**: 4.0.36
- **TailwindCSS**: 3.4.13
- **Lucide Icons**: 0.546.0
- **Reanimated**: 4.1.1

### State & Data
- **Context API**: Global state
- **Axios**: 1.7.2
- **SecureStore**: Encrypted storage

## Project Architecture

### Route Groups
```
app/
├── (auth)/          # Public routes (login, register)
├── (protected)/     # Authenticated routes
└── (admin)/         # Admin-only routes
```

### Component Categories
```
src/components/
├── common/          # Generic UI (Button, Input, Card)
├── shared/          # Business components (ConfirmDialog)
├── auth/            # Auth-specific components
└── users/           # User domain components
```

### Services Layer
```
src/services/
├── api.ts           # Axios instance with interceptors
├── authService.ts   # Authentication API calls
├── userService.ts   # User management API calls
└── productService.ts # Product API calls
```

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Code Examples

See [EXAMPLES.md](EXAMPLES.md) for comprehensive code examples including:
- Authentication flows
- API service usage
- Form handling with validation
- Custom hooks
- Theme implementation
- Navigation patterns

## Environment Configuration

### Development
```typescript
// Uses mock API server
API_URL: 'http://localhost:3001'
```

### Staging
```bash
npm run start:staging
# Uses app.staging.json
```

### Production
```bash
npm run start:prod
# Uses app.prod.json
```

Edit `src/utils/constants.ts` to configure API endpoints for each environment.

## License

MIT License - feel free to use this boilerplate for your projects!

## Support

For issues and questions, please open an issue on GitHub.

---

Made with Expo + React Native + TypeScript