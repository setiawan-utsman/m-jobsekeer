import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Moon,
  Sun,
  Bell,
  Shield,
  Users,
  LogOut,
  ChevronRight,
  Trash2,
  Lock,
  Globe,
  User,
} from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/header/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colors, theme, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Success', 'Account deletion initiated');
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, {
        backgroundColor: colors.card || colors.background,
        shadowColor: colors.text,
      }]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightElement, showBorder = true }: any) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !showBorder && styles.noBorder,
        { borderBottomColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Icon size={20} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <AppHeader
        variant="back"
        title="Settings"
        subtitle="Manage your account and preferences"
        onBackPress={() => router.back()}
        colors={colors}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

      {/* My Profile */}
        <SettingSection title="MY PROFILE">
          <SettingItem
            icon={User}
            title="My Profile"
            subtitle="Manage your personal information"
            onPress={() => router.push('/(admin)/profile')}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="APPEARANCE">
          <SettingItem
            icon={isDarkMode ? Moon : Sun}
            title="Theme Mode"
            subtitle={themeMode === 'auto' ? 'System default' : themeMode === 'dark' ? 'Dark theme' : 'Light theme'}
            onPress={() => {
              // Cycle through theme modes: auto -> light -> dark -> auto
              const modes: ('auto' | 'light' | 'dark')[] = ['auto', 'light', 'dark'];
              const currentIndex = modes.indexOf(themeMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setThemeMode(modes[nextIndex]);
            }}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="NOTIFICATIONS">
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive news updates and alerts"
            showBorder={false}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </SettingSection>

        {/* Security */}
        <SettingSection title="SECURITY">
          <SettingItem
            icon={Lock}
            title="Change Password"
            subtitle="Update your password"
            onPress={() => Alert.alert('Change Password', 'Password change feature')}
          />
          <SettingItem
            icon={Shield}
            title="Two-Factor Authentication"
            subtitle={twoFactor ? 'Enabled' : 'Disabled'}
            showBorder={false}
            rightElement={
              <Switch
                value={twoFactor}
                onValueChange={setTwoFactor}
                trackColor={{ false: '#d1d5db', true: colors.primary }}
                thumbColor="#ffffff"
              />
            }
          />
        </SettingSection>

        {/* Admin Only Section */}
        {isAdmin && (
          <SettingSection title="ADMIN">
            <SettingItem
              icon={Users}
              title="User Management"
              subtitle="Manage users and permissions"
              onPress={() => router.push('/(admin)/user-management')}
            />
            <SettingItem
              icon={Globe}
              title="System Settings"
              subtitle="Configure system preferences"
              onPress={() => Alert.alert('System Settings', 'System settings feature')}
              showBorder={false}
            />
          </SettingSection>
        )}

        {/* Account */}
        <SettingSection title="ACCOUNT">
          <SettingItem
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
          />
          <SettingItem
            icon={Trash2}
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            showBorder={false}
            rightElement={<ChevronRight size={20} color="#ef4444" />}
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            © 2024 News App
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 13,
    marginBottom: 4,
  },
});