import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/config/ToastConfig';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="(admin)" />
            {/* <Stack.Screen name="report" /> */}
          </Stack>
          <Toast config={toastConfig} />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}