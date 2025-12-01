// components/auth/ProtectedRoute.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ShieldAlert } from 'lucide-react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Check admin access if required
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorContainer, { backgroundColor: `${colors.error}10` }]}>
          <ShieldAlert size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.error }]}>
            Access Denied
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            You don't have permission to access this page.
          </Text>
          <Text style={[styles.errorHint, { color: colors.textSecondary }]}>
            This page is only accessible to administrators.
          </Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

// Usage Example in Settings Screen:
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
//
// export default function SettingsScreen() {
//   return (
//     <ProtectedRoute requireAdmin>
//       <View>
//         {/* Your settings content */}
//       </View>
//     </ProtectedRoute>
//   );
// }