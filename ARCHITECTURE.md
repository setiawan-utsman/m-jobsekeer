# Architecture Documentation

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                        Expo Router                           │
│                    (File-based Routing)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    React Components                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Screens    │  │  Components  │  │    Hooks     │      │
│  │  (Routes)    │  │   (Shared)   │  │   (Logic)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                  Context Providers                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │AuthContext   │  │ThemeContext  │  │SafeAreaView  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    Services Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ authService  │  │ userService  │  │productService│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      API Client                              │
│                   (Axios Instance)                           │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Request Interceptor  │  Response Interceptor    │       │
│  └──────────────────────────────────────────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    Backend API                               │
│              (Development: Mock Server)                      │
│             (Production: Real Backend)                       │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Architecture

### 1. Presentation Layer (UI)

#### Routing Architecture (Expo Router)
```
app/
├── _layout.tsx              # Root layout with providers
│
├── (auth)/                  # Auth route group (public)
│   ├── _layout.tsx          # Auth layout
│   ├── login.tsx            # Login screen
│   └── register.tsx         # Register screen
│
├── (protected)/             # Protected route group (authenticated)
│   ├── _layout.tsx          # Protected layout with guard
│   ├── home.tsx             # Home screen
│   └── settings.tsx         # Settings screen
│
└── (admin)/                 # Admin route group (role-based)
    ├── user-management.tsx  # User management screen
    └── profile.tsx          # Admin profile
```

**Route Group Strategy:**
- `(auth)`: Public routes, redirect to home if authenticated
- `(protected)`: Requires authentication, redirects to login if not
- `(admin)`: Requires admin role, additional role check

**Navigation Flow:**
```
User Opens App
    │
    ├─ Has Token? ──No──> (auth)/login
    │      │
    │     Yes
    │      │
    ├─ Token Valid? ──No──> (auth)/login
    │      │
    │     Yes
    │      │
    └─> Load User Data ──> (protected)/home
```

#### Component Architecture

**Component Hierarchy:**
```
src/components/
├── common/              # Generic, reusable UI components
│   ├── Button.tsx       # Button with variants
│   ├── Input.tsx        # Text input with validation
│   ├── Card.tsx         # Container component
│   └── Loading.tsx      # Loading indicator
│
├── shared/              # Business logic components
│   ├── ConfirmDialog.tsx    # Confirmation modal
│   ├── FormInput.tsx        # Form-specific input
│   ├── RoleSelector.tsx     # Role dropdown
│   └── LucideIcon.tsx       # Icon wrapper
│
├── auth/                # Authentication components
│   └── ProtectedRoute.tsx   # Route guard component
│
├── users/               # User domain components
│   └── UserCard.tsx         # User info display
│
├── header/              # Header components
│   └── ...
│
└── config/              # Configuration components
    └── ToastConfig.tsx      # Toast notification config
```

**Component Patterns:**

1. **Common Components** (UI-only, no business logic)
```typescript
// Generic, configurable, reusable
// No API calls, no context dependencies (except theme)
// Props-based configuration
// Example: Button, Input, Card
```

2. **Shared Components** (Reusable with some logic)
```typescript
// Can use contexts and hooks
// Reusable across multiple domains
// Example: ConfirmDialog, FormInput
```

3. **Domain Components** (Feature-specific)
```typescript
// Tied to specific feature/domain
// Can use services and contexts
// Example: UserCard, ProductCard
```

### 2. State Management Layer

#### Context Architecture

**AuthContext:**
```typescript
// Location: src/contexts/AuthContext.tsx
// Purpose: Global authentication state
// Provides:
interface AuthContextType {
  user: User | null;           // Current user data
  isLoading: boolean;          // Initial load state
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;    // Computed from user
}
```

**State Flow:**
```
App Start
    │
    └─> AuthProvider Mounted
           │
           └─> useEffect triggered
                  │
                  └─> loadUser() called
                         │
                         ├─> Get token from SecureStore
                         │
                         ├─> If token exists:
                         │   └─> Call authService.getCurrentUser()
                         │       └─> Set user data
                         │
                         └─> Set isLoading = false
```

**ThemeContext:**
```typescript
// Location: src/contexts/ThemeContext.tsx
// Purpose: Theme management (light/dark/auto)
// Provides:
interface ThemeContextType {
  theme: 'light' | 'dark';     // Current active theme
  themeMode: ThemeMode;        // User preference
  colors: ColorScheme;         // Current color palette
  setThemeMode: (mode) => void;
}
```

**Theme Resolution:**
```
themeMode === 'auto'
    │
    ├─> Get system preference (Appearance.getColorScheme())
    │   └─> Use system theme
    │
    └─> Use explicit themeMode (light/dark)
```

#### Component State Patterns

1. **Local State** (useState)
```typescript
// For component-specific UI state
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

2. **Context State** (useContext)
```typescript
// For global/shared state
const { user, login } = useAuth();
const { theme, colors } = useTheme();
```

3. **Derived State** (useMemo)
```typescript
// For computed values
const filteredUsers = useMemo(
  () => users.filter(u => u.role === selectedRole),
  [users, selectedRole]
);
```

### 3. Business Logic Layer

#### Services Architecture

**Service Pattern:**
```typescript
// Each service handles one domain
class ServiceName {
  async method(params: ParamType): Promise<ReturnType> {
    // Business logic
    const data = await api.get<ReturnType>('/endpoint', params);
    // Transform if needed
    return data;
  }
}

export const serviceName = new ServiceName();
```

**Available Services:**

1. **authService** (src/services/authService.ts)
```typescript
- login(credentials)        // Authenticate user
- register(data)            // Create new user
- getCurrentUser()          // Get authenticated user data
- logout()                  // Clear session
```

2. **userService** (src/services/userService.ts)
```typescript
- getUsers(params)          // List users with filters
- getUserById(id)           // Get single user
- updateUser(id, data)      // Update user
- deleteUser(id)            // Delete user
- updateUserRole(id, role)  // Change user role
```

3. **productService** (src/services/productService.ts)
```typescript
- getProducts(params)       // List products
- getProductById(id)        // Get single product
- createProduct(data)       // Create product
- updateProduct(id, data)   // Update product
- deleteProduct(id)         // Delete product
```

**Service Layer Benefits:**
- Centralized API calls
- Consistent error handling
- Easy to mock for testing
- Type-safe with TypeScript
- Reusable across components

### 4. Data Access Layer

#### API Client Architecture

**API Service** (src/services/api.ts)

**Axios Instance Configuration:**
```typescript
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,    // From constants
  timeout: API_CONFIG.TIMEOUT,     // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor:**
```typescript
// Automatically inject auth token
api.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```typescript
// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Transform error
    const apiError = handleError(error);

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await storage.removeToken();
      // Redirect to login handled by context
    }

    return Promise.reject(apiError);
  }
);
```

**Error Handling:**
```typescript
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Network error
{ message: 'Network error', status: 0 }

// Server error
{ message: 'Server error', status: 500 }

// Validation error
{
  message: 'Validation failed',
  status: 422,
  errors: { email: ['Invalid email'] }
}
```

#### Storage Architecture

**SecureStore Wrapper** (src/utils/storage.ts)

```typescript
// Abstraction over Expo SecureStore
export const storage = {
  async setToken(token: string): Promise<void>
  async getToken(): Promise<string | null>
  async removeToken(): Promise<void>
  // Other secure data operations
};
```

**Storage Strategy:**
- Sensitive data: SecureStore (encrypted)
- User preferences: AsyncStorage (can be added)
- Temporary data: In-memory state

### 5. Utilities & Helpers

#### Validation Layer (src/utils/validation.ts)

**Validation Functions:**
```typescript
export const validation = {
  email(email: string): string | null {
    // Returns error message or null
  },

  password(password: string): string | null {
    // Check min length
  },

  required(value: any, fieldName: string): string | null {
    // Generic required check
  },

  minLength(value: string, min: number, field: string): string | null {
    // Generic min length
  }
};
```

**Usage Pattern:**
```typescript
const emailError = validation.email(email);
if (emailError) {
  setError(emailError);
  return;
}
```

#### Constants (src/utils/constants.ts)

**Configuration Constants:**
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3001'
    : 'https://api.production.com',
  TIMEOUT: 10000,
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check connection.',
  SERVER_ERROR: 'Server error. Please try again.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
};
```

### 6. Type System

#### TypeScript Type Organization

**Type Files Structure:**
```
src/types/
├── auth.types.ts      # Authentication-related types
├── user.types.ts      # User domain types
├── product.types.ts   # Product domain types
└── api.types.ts       # API response types
```

**Type Categories:**

1. **Domain Types** (entities)
```typescript
// src/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}
```

2. **Request/Response Types**
```typescript
// src/types/auth.types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

3. **API Types**
```typescript
// src/types/api.types.ts
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### 7. Styling Architecture

#### NativeWind Integration

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
};
```

**Usage Pattern:**
```typescript
// Utility classes with dark mode support
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-gray-100">
    Content
  </Text>
</View>
```

**Theme Colors Access:**
```typescript
// For programmatic access
const { colors } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Content</Text>
</View>
```

### 8. Security Architecture

#### Authentication Flow

**Login Sequence:**
```
1. User submits credentials
   └─> Component calls authContext.login()
      └─> Calls authService.login()
         └─> API request to /auth/login
            └─> Receives { user, token }
               └─> Stores token in SecureStore
                  └─> Updates AuthContext.user
                     └─> Navigates to /home
```

**Token Management:**
```
Every API Request:
1. Request interceptor runs
2. Gets token from SecureStore
3. Adds Authorization header
4. Sends request

On 401 Response:
1. Response interceptor catches
2. Removes token from SecureStore
3. Rejects with error
4. Component/Context handles redirect
```

#### Protected Routes

**Route Protection Pattern:**
```typescript
// app/(protected)/_layout.tsx
export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack>...</Stack>;
}
```

**Role-Based Access:**
```typescript
// For admin-only features
if (user?.role !== 'admin') {
  return <Redirect href="/(protected)/home" />;
}
```

### 9. Error Handling Architecture

#### Error Propagation Flow

```
Component Level:
  │
  ├─> Try/Catch in async functions
  │   └─> Display error to user (Toast/Alert)
  │
  └─> Service Level:
      │
      ├─> API errors caught
      │   └─> Throw formatted error
      │
      └─> API Client Level:
          │
          └─> Interceptor catches all errors
              └─> Format and reject
```

#### Error Display Strategy

1. **Toast Notifications** (non-blocking)
```typescript
Toast.show({
  type: 'error',
  text1: 'Error',
  text2: error.message,
});
```

2. **Inline Errors** (forms)
```typescript
<Input
  value={email}
  error={emailError}  // Displayed below input
  onChangeText={setEmail}
/>
```

3. **Modal Dialogs** (critical errors)
```typescript
<ConfirmDialog
  visible={showError}
  title="Error"
  message={error.message}
/>
```

### 10. Performance Considerations

#### Optimization Strategies

1. **Lazy Loading**
```typescript
// Expo Router handles code splitting automatically
// Each route is loaded on demand
```

2. **Memoization**
```typescript
// Expensive computations
const filteredData = useMemo(
  () => data.filter(condition),
  [data, condition]
);

// Callback stability
const handlePress = useCallback(() => {
  // handler logic
}, [dependencies]);
```

3. **Conditional Rendering**
```typescript
// Avoid rendering until data ready
if (isLoading) return <Loading />;
if (error) return <Error />;
return <Content data={data} />;
```

### 11. Development vs Production

#### Environment Configuration

**Development:**
- API: localhost:3001 (mock server)
- Detailed error messages
- Console logging enabled
- Hot reload active

**Production:**
- API: Production backend URL
- Generic error messages
- Console logging disabled
- Optimized bundles

**Configuration:**
```typescript
// src/utils/constants.ts
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3001'     // Development
    : 'https://api.yourapp.com',  // Production
};
```

### 12. Dependency Graph

```
Components
    │
    ├─> Hooks (useAuth, useTheme)
    │      │
    │      └─> Contexts (AuthContext, ThemeContext)
    │             │
    │             └─> Services (authService, etc.)
    │                    │
    │                    └─> API Client (axios instance)
    │                           │
    │                           └─> Storage (SecureStore)
    │
    └─> Types (interfaces/types)
```

**Dependency Rules:**
- Components can import hooks, contexts, types
- Hooks can import contexts, utilities
- Services import API client, types
- Utils have no internal dependencies
- Types have no dependencies

### 13. Build & Bundle Architecture

**Metro Bundler Configuration:**
```javascript
// metro.config.js
- Asset resolution
- Module resolution
- Transform options
- NativeWind CSS compilation
```

**Build Profiles:**
```
Development:
  - Source maps enabled
  - Fast refresh
  - Debug symbols

Production:
  - Minification
  - Tree shaking
  - Optimized bundles
  - No source maps
```

This architecture provides:
- Clear separation of concerns
- Scalable structure
- Type safety
- Testability
- Maintainability
- Performance optimization
