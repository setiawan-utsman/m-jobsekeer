import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { useRouter } from 'expo-router';
import { UpdateUserInput } from '@/types/user.types';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { users, loading, updateUser } = useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Profile data state - FIX: Separate state untuk setiap field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState('');
  const [joinDate, setJoinDate] = useState('');

  // Load current user data
  useEffect(() => {
    if (user && users.length > 0) {
      const userProfile = users.find(u => u.id === user.id || u.email === user.email);
      if (userProfile) {
        setCurrentUser(userProfile);
        setName(userProfile.name || '');
        setEmail(userProfile.email || '');
        setPhone(userProfile.phone || '');
        setLocation(userProfile.location || '');
        setAbout(userProfile.about || '');
        setAvatar(userProfile.avatar || '');
        setJoinDate(
          new Date(userProfile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        );
      }
    }
  }, [user, users]);

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      const updateData: UpdateUserInput = {
        id: currentUser.id,
        name,
        email,
        phone,
        location,
        about,
        role: currentUser.role,
        status: currentUser.status,
        avatar: currentUser.avatar,
      };

      const result = await updateUser(updateData);

      if (result.success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setLocation(currentUser.location || '');
      setAbout(currentUser.about || '');
    }
  };

  const InfoCard = ({ icon: Icon, label, value, editable = false, onChangeText }: any) => (
    <View style={[styles.infoCard, { backgroundColor: colors.card || colors.background }]}>
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
        {isEditing && editable ? (
          <TextInput
            style={[styles.infoInput, { color: colors.text, borderColor: `${colors.primary}30` }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={label}
            placeholderTextColor={colors.textSecondary}
            editable={!saving}
          />
        ) : (
          <Text style={[styles.infoValue, { color: colors.text }]}>{value || '-'}</Text>
        )}
      </View>
    </View>
  );

  const StatCard = ({ title, value, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: colors.card || colors.background }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  if (loading && !currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader
          variant="back"
          title="Profile"
          subtitle="Manage your personal information"
          onBackPress={() => router.back()}
          colors={colors}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader
          variant="back"
          title="Profile"
          subtitle="Manage your personal information"
          onBackPress={() => router.back()}
          colors={colors}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Profile not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        variant="back"
        title="Profile"
        subtitle="Manage your personal information"
        onBackPress={() => router.back()}
        colors={colors}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: `${colors.primary}20` }]}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={styles.avatarImage}
                defaultSource={require('@/assets/images/icon.png')}
              />
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {currentUser.role.toUpperCase()}
              </Text>
            </View>
            
            <View style={[
              styles.statusBadge,
              { backgroundColor: currentUser.status === 'active' ? '#10b98115' : '#ef444415' }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: currentUser.status === 'active' ? '#10b981' : '#ef4444' }
              ]} />
              <Text style={[
                styles.statusText,
                { color: currentUser.status === 'active' ? '#10b981' : '#ef4444' }
              ]}>
                {currentUser.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard title="Articles" value="127" color="#10b981" />
          <StatCard title="Favorites" value="34" color="#f59e0b" />
          <StatCard title="Comments" value="89" color="#3b82f6" />
        </View>

        {/* Edit Button */}
        {!isEditing ? (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
          >
            <Edit2 size={18} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { 
                borderColor: colors.border,
                backgroundColor: colors.card || colors.background
              }]}
              onPress={handleCancel}
              activeOpacity={0.7}
              disabled={saving}
            >
              <X size={18} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, { 
                backgroundColor: colors.primary,
                opacity: saving ? 0.7 : 1
              }]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Save size={18} color="#FFFFFF" />
              )}
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>

          <InfoCard
            icon={User}
            label="Full Name"
            value={name}
            editable
            onChangeText={setName}
          />
          <InfoCard
            icon={Mail}
            label="Email Address"
            value={email}
            editable
            onChangeText={setEmail}
          />
          <InfoCard
            icon={Phone}
            label="Phone Number"
            value={phone}
            editable
            onChangeText={setPhone}
          />
          <InfoCard
            icon={MapPin}
            label="Location"
            value={location}
            editable
            onChangeText={setLocation}
          />
          <InfoCard
            icon={Calendar}
            label="Member Since"
            value={joinDate}
          />
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
          <View style={[styles.bioCard, { backgroundColor: colors.card || colors.background }]}>
            {isEditing ? (
              <TextInput
                style={[styles.bioInput, { 
                  color: colors.text, 
                  borderColor: `${colors.primary}30`,
                  backgroundColor: colors.background
                }]}
                value={about}
                onChangeText={setAbout}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!saving}
              />
            ) : (
              <Text style={[styles.bioText, { color: colors.text }]}>
                {about || 'No bio available. Add your bio by editing your profile.'}
              </Text>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '800',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  bioCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
  },
  bioInput: {
    fontSize: 15,
    lineHeight: 24,
    minHeight: 120,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
});