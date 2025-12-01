# Code Examples

## Table of Contents
- [Components](#components)
- [Authentication](#authentication)
- [API Services](#api-services)
- [Routing & Navigation](#routing--navigation)
- [Theming](#theming)
- [Form Handling](#form-handling)
- [Custom Hooks](#custom-hooks)
- [State Management](#state-management)

---

## Components

### Button Component

#### Basic Usage
```typescript
import { Button } from '@components/common/Button';

function MyScreen() {
  return (
    <Button
      title="Click Me"
      onPress={() => console.log('Pressed')}
    />
  );
}
```

#### Button Variants
```typescript
// Primary (default)
<Button
  title="Primary"
  variant="primary"
  onPress={handleSubmit}
/>

// Secondary
<Button
  title="Secondary"
  variant="secondary"
  onPress={handleSecondary}
/>

// Outline
<Button
  title="Outline"
  variant="outline"
  onPress={handleOutline}
/>

// Ghost
<Button
  title="Ghost"
  variant="ghost"
  onPress={handleGhost}
/>
```

#### Button Sizes & States
```typescript
// Small button
<Button
  title="Small"
  size="sm"
  onPress={handlePress}
/>

// Medium button (default)
<Button
  title="Medium"
  size="md"
  onPress={handlePress}
/>

// Large button
<Button
  title="Large"
  size="lg"
  onPress={handlePress}
/>

// Loading state
<Button
  title="Submit"
  loading={isLoading}
  onPress={handleSubmit}
/>

// Disabled
<Button
  title="Disabled"
  disabled={true}
  onPress={handlePress}
/>

// Full width
<Button
  title="Full Width"
  fullWidth
  onPress={handlePress}
/>
```

### Input Component

#### Basic Input
```typescript
import { Input } from '@components/common/Input';

function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
}
```

#### Input with Validation
```typescript
import { Input } from '@components/common/Input';
import { validation } from '@utils/validation';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null); // Clear error on change
  };

  const validateEmail = () => {
    const error = validation.email(email);
    setEmailError(error);
    return !error;
  };

  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      value={email}
      onChangeText={handleEmailChange}
      onBlur={validateEmail}
      error={emailError}
      keyboardType="email-address"
    />
  );
}
```

#### Password Input
```typescript
<Input
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  error={passwordError}
/>
```

### Card Component

```typescript
import { Card } from '@components/common/Card';
import { Text } from 'react-native';

function MyScreen() {
  return (
    <Card className="mb-4 p-4">
      <Text className="text-lg font-bold">Card Title</Text>
      <Text className="text-gray-600">Card content goes here</Text>
    </Card>
  );
}
```

### Loading Component

```typescript
import { Loading } from '@components/common/Loading';

// Full screen loading
<Loading fullScreen />

// With custom text
<Loading text="Loading data..." />

// Inline loading
<Loading />
```

### Custom Dialog

```typescript
import { ConfirmDialog } from '@components/shared/ConfirmDialog';

function MyScreen() {
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    // Perform action
    console.log('Confirmed');
    setShowDialog(false);
  };

  return (
    <>
      <Button
        title="Delete"
        onPress={() => setShowDialog(true)}
      />

      <ConfirmDialog
        visible={showDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
```

---

## Authentication

### Login Flow

```typescript
import { useState } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login({ email, password });
      // Navigation handled by AuthContext
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center">
      <Text className="text-2xl font-bold mb-6">Login</Text>

      <Input
        label="Email"
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        fullWidth
      />
    </View>
  );
}
```

### Register Flow

```typescript
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { validation } from '@utils/validation';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors: Record<string, string | null> = {
      name: validation.name(formData.name),
      email: validation.email(formData.email),
      password: validation.password(formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await register(formData);
      // Navigation handled by AuthContext
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center">
      <Input
        label="Name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
        error={errors.name}
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        error={errors.email}
        keyboardType="email-address"
      />

      <Input
        label="Password"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        error={errors.password}
        secureTextEntry
      />

      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        fullWidth
      />
    </View>
  );
}
```

### Logout

```typescript
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';

function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigation handled by AuthContext
  };

  return (
    <Button
      title="Logout"
      variant="outline"
      onPress={handleLogout}
    />
  );
}
```

### Protected Route

```typescript
// app/(protected)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/common/Loading';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
```

### Role-Based Access

```typescript
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export default function AdminScreen() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Redirect href="/(protected)/home" />;
  }

  return (
    <View>
      <Text>Admin Only Content</Text>
    </View>
  );
}
```

---

## API Services

### Using Auth Service

```typescript
import { authService } from '@services/authService';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});
// Returns: { user: User, token: string }

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
});

// Get current user
const user = await authService.getCurrentUser();
```

### Using User Service

```typescript
import { userService } from '@services/userService';

// Get all users
const users = await userService.getUsers({
  page: 1,
  limit: 10,
  role: 'user', // Optional filter
});

// Get single user
const user = await userService.getUserById('user-id');

// Update user
const updatedUser = await userService.updateUser('user-id', {
  name: 'New Name',
  email: 'newemail@example.com',
});

// Delete user
await userService.deleteUser('user-id');

// Update user role
await userService.updateUserRole('user-id', 'admin');
```

### Using Product Service

```typescript
import { productService } from '@services/productService';

// Get products
const products = await productService.getProducts({
  page: 1,
  limit: 20,
  category: 'electronics', // Optional
});

// Get single product
const product = await productService.getProductById('product-id');

// Create product
const newProduct = await productService.createProduct({
  name: 'New Product',
  price: 99.99,
  description: 'Product description',
  category: 'electronics',
});

// Update product
const updated = await productService.updateProduct('product-id', {
  price: 89.99,
});

// Delete product
await productService.deleteProduct('product-id');
```

### Creating Custom Service

```typescript
// src/services/orderService.ts
import { api } from './api';
import { Order, CreateOrderData } from '@types/order.types';

class OrderService {
  async getOrders(): Promise<Order[]> {
    return api.get<Order[]>('/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return api.get<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    return api.post<Order>('/orders', data);
  }

  async cancelOrder(id: string): Promise<void> {
    return api.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
```

### Error Handling in Services

```typescript
import { userService } from '@services/userService';
import Toast from 'react-native-toast-message';

async function loadUsers() {
  try {
    const users = await userService.getUsers();
    setUsers(users);
  } catch (error: any) {
    // Error already formatted by interceptor
    Toast.show({
      type: 'error',
      text1: 'Failed to load users',
      text2: error.message,
    });

    // Check specific error types
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.status === 422) {
      // Handle validation errors
      console.log(error.errors); // Field-specific errors
    }
  }
}
```

---

## Routing & Navigation

### Basic Navigation

```typescript
import { router } from 'expo-router';
import { Button } from '@components/common/Button';

function HomeScreen() {
  return (
    <>
      {/* Push new screen */}
      <Button
        title="Go to Settings"
        onPress={() => router.push('/(protected)/settings')}
      />

      {/* Replace current screen */}
      <Button
        title="Go to Login"
        onPress={() => router.replace('/(auth)/login')}
      />

      {/* Go back */}
      <Button
        title="Go Back"
        onPress={() => router.back()}
      />
    </>
  );
}
```

### Navigation with Params

```typescript
// Navigate with params
router.push({
  pathname: '/user/[id]',
  params: { id: 'user-123' },
});

// Access params in target screen
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();

  return <Text>User ID: {id}</Text>;
}
```

### Programmatic Navigation After Action

```typescript
import { router } from 'expo-router';
import { userService } from '@services/userService';

async function createUser(data: CreateUserData) {
  try {
    const newUser = await userService.createUser(data);

    Toast.show({
      type: 'success',
      text1: 'User created',
    });

    // Navigate to user detail
    router.push({
      pathname: '/user/[id]',
      params: { id: newUser.id },
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to create user',
      text2: error.message,
    });
  }
}
```

---

## Theming

### Using Theme Hook

```typescript
import { View, Text } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export default function ThemedScreen() {
  const { theme, colors, setThemeMode } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Current theme: {theme}
      </Text>

      {/* Theme switcher */}
      <Button
        title="Light Mode"
        onPress={() => setThemeMode('light')}
      />

      <Button
        title="Dark Mode"
        onPress={() => setThemeMode('dark')}
      />

      <Button
        title="Auto Mode"
        onPress={() => setThemeMode('auto')}
      />
    </View>
  );
}
```

### Using NativeWind with Theme

```typescript
import { View, Text } from 'react-native';

export default function StyledScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Text className="text-gray-900 dark:text-gray-100 text-xl">
        This text adapts to theme automatically
      </Text>

      <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <Text className="text-gray-700 dark:text-gray-300">
          Card content
        </Text>
      </View>
    </View>
  );
}
```

### Custom Themed Component

```typescript
import { View, Text, ViewProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface ThemedCardProps extends ViewProps {
  title: string;
  children: React.ReactNode;
}

export function ThemedCard({ title, children, ...props }: ThemedCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      }}
      {...props}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
```

---

## Form Handling

### Complete Form Example

```typescript
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { validation } from '@utils/validation';
import Toast from 'react-native-toast-message';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Name validation
    const nameError = validation.name(formData.name);
    if (nameError) newErrors.name = nameError;

    // Email validation
    const emailError = validation.email(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validation.password(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors in the form',
      });
      return;
    }

    try {
      setLoading(true);
      // Submit form
      await submitRegistration(formData);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration completed',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <Input
        label="Full Name"
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
        error={errors.name}
      />

      <Input
        label="Email"
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password"
        placeholder="Enter password"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        error={errors.password}
        secureTextEntry
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange('confirmPassword', value)}
        error={errors.confirmPassword}
        secureTextEntry
      />

      <Button
        title="Register"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </ScrollView>
  );
}
```

---

## Custom Hooks

### Creating a Data Fetching Hook

```typescript
// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { userService } from '@services/userService';
import { User } from '@types/user.types';
import Toast from 'react-native-toast-message';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load users',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      Toast.show({
        type: 'success',
        text1: 'User deleted',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete user',
        text2: err.message,
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: loadUsers,
    deleteUser,
  };
}
```

### Using the Custom Hook

```typescript
import { View, FlatList } from 'react-native';
import { useUsers } from '@hooks/useUsers';
import { Loading } from '@components/common/Loading';
import { UserCard } from '@components/users/UserCard';

export default function UsersScreen() {
  const { users, loading, refetch, deleteUser } = useUsers();

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onDelete={() => deleteUser(item.id)}
          />
        )}
        refreshing={loading}
        onRefresh={refetch}
      />
    </View>
  );
}
```

---

## State Management

### Local State Example

```typescript
import { useState } from 'react';
import { View, Text, Switch } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <Text>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
      </View>
    </View>
  );
}
```

### Global State with Context

```typescript
// Custom context example
import { createContext, useState, useContext, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

This guide provides practical, ready-to-use code examples for common scenarios in the Expo boilerplate project.
