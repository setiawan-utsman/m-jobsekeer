// app/(admin)/users-management.tsx - IMPROVED VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Search, UserPlus, Filter, X } from 'lucide-react-native';
import { useTheme } from '@hooks/useTheme';
import { CreateUserInput, UpdateUserInput } from '@/types/user.types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

// Custom Hook
import { useUsers } from '@/hooks/useUsers';

// Components
import { UserCard } from '@/components/users/UserCard';
import { EmptyState } from '@/components/users/EmptyState';
import { ErrorState } from '@/components/users/ErrorState';
import { FilterModal } from '@/components/users/FilterModal';
import { UserFormModal } from '@/components/users/UserFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Use custom hook
  const {
    users,
    loading,
    refreshing,
    loadingMore,
    error,
    filters,
    refreshUsers,
    loadMoreUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateFilters,
    clearFilters,
    getActiveFilterCount,
  } = useUsers();

  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserInput | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);

  const newUserInitial: CreateUserInput = {
    name: '',
    password: '',
    status: 'active',
    email: '',
    role: 'user',
  };

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        updateFilters({ search: searchQuery });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handlers
  const handleAddUser = async (userData: CreateUserInput) => {
    const result = await createUser(userData);
    if (result.success) {
      setShowAddModal(false);
    }
  };

  const handleEditUser = (user: UpdateUserInput) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowOptionsMenu(null);
  };

  const handleUpdateUser = async (userData: UpdateUserInput) => {
    const result = await updateUser(userData);
    if (result.success) {
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
    setShowOptionsMenu(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    const result = await deleteUser(userToDelete);
    if (result.success) {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setShowOptionsMenu(null);
    await toggleUserStatus(userId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    clearFilters();
    setShowFilterModal(false);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const hasActiveFilters = !!(filters.role || filters.status || (filters.sortBy && filters.sortBy !== 'latest'));

  // Loading state
  if (loading && users.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading users...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && users.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          variant="back"
          title="User Management"
          onBackPress={() => router.back()}
          colors={colors}
        />
        <ErrorState error={error} onRetry={refreshUsers} colors={colors} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <AppHeader
        variant="back"
        title="User Management"
        subtitle={`${users.length} ${users.length === 1 ? 'user' : 'users'} • Manage users and permissions`}
        onBackPress={() => router.back()}
        colors={colors}
      />

      {/* Search and Actions - IMPROVED */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.surface || `${colors.primary}08`,
          borderWidth: 1,
          borderColor: searchQuery ? colors.primary : 'transparent',
        }]}>
          <Search size={20} color={searchQuery ? colors.primary : colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name or email..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.filterButton, {
              backgroundColor: hasActiveFilters ? colors.primary : colors.surface || `${colors.primary}10`,
              borderWidth: hasActiveFilters ? 0 : 1,
              borderColor: colors.border || `${colors.primary}20`,
            }]}
            onPress={() => setShowFilterModal(true)}
            activeOpacity={0.7}
          >
            <Filter size={20} color={hasActiveFilters ? '#FFFFFF' : colors.text} />
            {getActiveFilterCount() > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.error || '#ef4444' }]}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, { 
              backgroundColor: colors.primary,
            }]}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters - IMPROVED */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersContainer}
          >
            {filters.role && (
              <View style={[styles.activeFilterChip, { 
                backgroundColor: colors.surface || `${colors.primary}15`,
                borderWidth: 1,
                borderColor: colors.primary,
              }]}>
                <Text style={[styles.activeFilterLabel, { color: colors.textSecondary }]}>
                  Role:
                </Text>
                <Text style={[styles.activeFilterValue, { color: colors.primary }]}>
                  {filters.role.charAt(0).toUpperCase() + filters.role.slice(1)}
                </Text>
                <TouchableOpacity 
                  onPress={() => updateFilters({ role: undefined })}
                  style={styles.chipCloseButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {filters.status && (
              <View style={[styles.activeFilterChip, { 
                backgroundColor: colors.surface || `${colors.primary}15`,
                borderWidth: 1,
                borderColor: colors.primary,
              }]}>
                <Text style={[styles.activeFilterLabel, { color: colors.textSecondary }]}>
                  Status:
                </Text>
                <Text style={[styles.activeFilterValue, { color: colors.primary }]}>
                  {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                </Text>
                <TouchableOpacity 
                  onPress={() => updateFilters({ status: undefined })}
                  style={styles.chipCloseButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {filters.sortBy && filters.sortBy !== 'latest' && (
              <View style={[styles.activeFilterChip, { 
                backgroundColor: colors.surface || `${colors.primary}15`,
                borderWidth: 1,
                borderColor: colors.primary,
              }]}>
                <Text style={[styles.activeFilterLabel, { color: colors.textSecondary }]}>
                  Sort:
                </Text>
                <Text style={[styles.activeFilterValue, { color: colors.primary }]}>
                  {filters.sortBy === 'name' ? 'Name' : 'Oldest'}
                </Text>
                <TouchableOpacity 
                  onPress={() => updateFilters({ sortBy: 'latest' })}
                  style={styles.chipCloseButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handleClearFilters}
              style={[styles.clearAllButton, { 
                backgroundColor: colors.surface || `${colors.error || '#ef4444'}10`,
                borderWidth: 1,
                borderColor: colors.error || '#ef4444',
              }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.clearAllText, { color: colors.error || '#ef4444' }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            colors={colors}
            showOptionsMenu={showOptionsMenu === item.id}
            onToggleMenu={() => setShowOptionsMenu(showOptionsMenu === item.id ? null : item.id)}
            onEdit={() => handleEditUser(item)}
            onDelete={() => handleDeleteUser(item.id)}
            onToggleStatus={() => handleToggleStatus(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.usersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshUsers}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            searchQuery={searchQuery}
            hasFilters={!!(filters.role || filters.status)}
            onClearFilters={handleClearFilters}
            colors={colors}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingMoreText, { color: colors.textSecondary }]}>
                Loading more...
              </Text>
            </View>
          ) : null
        }
      />

      {/* Modals */}
      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={(newFilters) => {
          updateFilters(newFilters);
          setShowFilterModal(false);
        }}
        onClear={handleClearFilters}
        colors={colors}
      />

      <UserFormModal
        visible={showAddModal}
        title="Add New User"
        initialData={newUserInitial}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
        loading={loading}
        colors={colors}
      />

      {selectedUser && (
        <UserFormModal
          visible={showEditModal}
          title="Edit User"
          initialData={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUser}
          loading={loading}
          colors={colors}
          isEdit
        />
      )}

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setUserToDelete(null);
        }}
        loading={loading}
        colors={colors}
        destructive
      />

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Search Section - IMPROVED
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  
  // Action Buttons - IMPROVED
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  
  // Active Filters - IMPROVED
  activeFiltersWrapper: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilterLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeFilterValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipCloseButton: {
    marginLeft: 2,
    padding: 2,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  
  usersList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
});