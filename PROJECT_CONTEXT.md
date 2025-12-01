# Project Context

## Overview
Expo React Native Boilerplate adalah template siap pakai untuk membangun aplikasi mobile cross-platform dengan fitur authentication, theming, dan arsitektur yang clean. Project ini dirancang untuk mempercepat development dengan menyediakan struktur folder yang terorganisir dan komponen-komponen reusable.

## Tech Stack

### Core Technologies
- **React Native**: 0.81.4
- **React**: 19.1.0
- **Expo SDK**: ~54.0.0
- **TypeScript**: 5.9+
- **Expo Router**: 6.0.12 (File-based routing)

### Styling & UI
- **NativeWind**: 4.0.36 (Tailwind CSS untuk React Native)
- **TailwindCSS**: 3.4.13
- **Lucide React Native**: 0.546.0 (Icon library)
- **React Native Reanimated**: 4.1.1 (Animations)

### State Management & Data
- **React Context API**: AuthContext, ThemeContext
- **Axios**: 1.7.2 (HTTP client)
- **Expo SecureStore**: 15.0.7 (Secure storage)

### Development Tools
- **Expo CLI**: Development server
- **ESLint**: 9.12.0 (Linting)
- **Prettier**: 3.3.3 (Code formatting)
- **Metro**: 0.83.3 (Bundler)

## Project Goals

### Primary Goals
1. **Rapid Development**: Provide ready-to-use components and patterns
2. **Type Safety**: Full TypeScript support with strict mode
3. **Clean Architecture**: Organized folder structure and separation of concerns
4. **Developer Experience**: Path aliases, hot reload, clear documentation
5. **Production Ready**: Authentication, error handling, environment configs

### Design Principles
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **Single Responsibility**: Each module has one clear purpose
- **Separation of Concerns**: Clear boundaries between layers
- **Convention Over Configuration**: Consistent patterns throughout
- **Progressive Enhancement**: Start simple, add complexity when needed

## Feature Set

### Authentication System
- Login/Register flows
- JWT token management
- Secure token storage
- Auto token injection in API calls
- Protected routes
- Role-based access (User/Admin)
- Session persistence

### Theming System
- Light/Dark mode support
- System preference detection
- Custom color schemes
- Theme-aware components
- Smooth transitions

### UI Components
#### Common Components
- Button (multiple variants: primary, secondary, outline, ghost)
- Input (with validation, icons, error states)
- Card (container component)
- Loading (spinner with optional text)

#### Shared Components
- ConfirmDialog (modal confirmations)
- FormInput (form-specific input wrapper)
- RoleSelector (dropdown for user roles)
- LucideIcon (icon wrapper)

#### Domain Components
- UserCard (display user info)
- ProtectedRoute (route guard)
- Header components

### Routing Structure
```
app/
├── (auth)/          # Public authentication screens
│   ├── login.tsx
│   ├── register.tsx
│   └── _layout.tsx
├── (protected)/     # Authenticated user screens
│   ├── home.tsx
│   ├── settings.tsx
│   └── _layout.tsx
├── (admin)/         # Admin-only screens
│   ├── user-management.tsx
│   ├── profile.tsx
│   └── _layout.tsx
└── _layout.tsx      # Root layout
```

### API Services
- **authService**: Authentication operations
- **userService**: User CRUD operations
- **productService**: Product management
- Mock API data for development

## Development Workflow

### Environment Setup
1. Install Node.js 18+
2. Install dependencies: `npm install`
3. Start dev server: `npm start`
4. Run on device/emulator

### Multi-Environment Support
- **Development**: `npm start` (uses app.json)
- **Staging**: `npm run start:staging` (uses app.staging.json)
- **Production**: `npm run start:prod` (uses app.prod.json)

### Quality Checks
- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Build test**: `npm run build`

### Build Process
- **Local builds**: Uses EAS CLI with `--local` flag
- **Platform builds**: Separate Android/iOS builds
- **Environment builds**: Development, Staging, Production profiles

## Key Patterns

### Component Pattern
```typescript
interface ComponentProps {
  // Props definition
}

export function Component({ props }: ComponentProps) {
  const { colors } = useTheme();
  // Component logic
  return (
    <View className="...">
      {/* JSX */}
    </View>
  );
}
```

### Service Pattern
```typescript
class ServiceName {
  async method(params: Type): Promise<ReturnType> {
    return api.get<ReturnType>('/endpoint', params);
  }
}

export const serviceName = new ServiceName();
```

### Hook Pattern
```typescript
export function useCustomHook() {
  // Hook logic
  return {
    // Exposed values/methods
  };
}
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)
- Strict mode enabled
- Path aliases configured
- Expo base config extended
- NativeWind types included

### Babel Configuration (babel.config.js)
- Expo preset with NativeWind
- Module resolver for path aliases
- Reanimated plugin

### Tailwind Configuration (tailwind.config.js)
- Content paths configured
- Custom theme extensions
- Dark mode support

### Metro Configuration (metro.config.js)
- NativeWind integration
- Custom resolver settings

## Data Flow

### Authentication Flow
1. User submits credentials
2. Service calls API endpoint
3. Token saved to SecureStore
4. User data set in AuthContext
5. Navigate to protected route
6. Token auto-injected in subsequent requests

### API Request Flow
1. Component calls service method
2. Service uses api instance
3. Request interceptor adds auth token
4. Request sent to backend
5. Response interceptor handles errors
6. Data returned to component
7. Component updates UI

### Theme Flow
1. User selects theme preference
2. ThemeContext updates state
3. Components read colors from context
4. UI re-renders with new theme
5. Preference saved to storage

## Storage Strategy

### Secure Storage (SecureStore)
- Authentication tokens
- Sensitive user data
- Encryption keys

### Regular Storage (AsyncStorage pattern)
- Theme preferences
- User settings
- Non-sensitive cache

## Error Handling

### API Errors
- Network errors
- Server errors (5xx)
- Client errors (4xx)
- Validation errors
- Timeout errors

### UI Error Display
- Toast notifications
- Inline form errors
- Error boundaries (can be added)
- Loading states

## Security Measures

### Current Implementation
- Secure token storage
- Token expiration handling
- Request/response interceptors
- Input validation
- Protected routes

### Best Practices
- No sensitive data in logs
- Environment variables for configs
- HTTPS in production
- Token refresh mechanism (can be implemented)
- Rate limiting (backend)

## Performance Considerations

### Optimizations
- Lazy loading routes
- Memoized components (where needed)
- Optimized re-renders
- Image optimization (expo-image)
- Bundle size management

### Monitoring
- Console error tracking
- Network request logging (dev mode)
- Performance profiling (React DevTools)

## Testing Strategy (Recommended)

### Unit Tests
- Utility functions
- Validation logic
- Service methods

### Integration Tests
- API service integration
- Context providers
- Custom hooks

### E2E Tests
- Authentication flow
- Critical user journeys
- Navigation flows

## Deployment

### Build Profiles (eas.json)
- Development: For testing
- Staging: Pre-production
- Production: Release builds

### Platform-Specific
- Android: APK/AAB builds
- iOS: IPA builds
- Web: Expo web support

## Future Enhancements (Recommendations)

### Features to Add
- Push notifications
- Deep linking
- Offline support
- Analytics integration
- Error reporting (Sentry)
- Internationalization (i18n)
- Accessibility improvements
- Unit/E2E tests

### Architecture Improvements
- State management library (Redux/Zustand) if needed
- GraphQL support
- Real-time features (WebSocket)
- Caching strategy
- Background tasks

## Common Use Cases

### Adding a New Feature
1. Define types in `src/types/`
2. Create service if needed
3. Build components
4. Add routing
5. Integrate with contexts
6. Add validation
7. Handle errors
8. Test thoroughly

### Integrating Backend API
1. Update API_CONFIG in constants
2. Adjust API response types
3. Update service methods
4. Handle authentication flow
5. Test error scenarios

### Customizing Theme
1. Modify `src/theme/colors.ts`
2. Update tailwind.config.js if needed
3. Test in light/dark modes
4. Verify all components

### Adding Third-Party Library
1. Install package: `npm install package`
2. Update imports
3. Configure if needed
4. Update types
5. Test compatibility

## Troubleshooting

### Common Issues
- **Metro bundler errors**: Run `npm run clean`
- **Type errors**: Run `npm run type-check`
- **Build failures**: Clear cache, rebuild
- **Path alias issues**: Check tsconfig.json and babel.config.js match

### Debug Tips
- Use Expo DevTools
- Check network tab for API calls
- Use React DevTools
- Console.log strategically
- Check Expo documentation

## Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [NativeWind Docs](https://www.nativewind.dev)
- [Expo Router Docs](https://expo.github.io/router)

### Community
- Expo Discord
- React Native Community
- Stack Overflow
- GitHub Issues

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update Expo SDK periodically
- Review and refactor code
- Update documentation

### Code Quality
- Run type-check regularly
- Fix linting warnings
- Remove unused code
- Optimize bundle size
- Review performance
