// hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { CreateUserInput, UpdateUserInput, UserData, UserFilters } from '@/types/user.types';
import Toast from 'react-native-toast-message';

const ITEMS_PER_PAGE = 10;

export const useUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: ITEMS_PER_PAGE,
        sortBy: 'latest',
    });

    // Load users
    const loadUsers = useCallback(async (reset: boolean = false) => {
        try {
            if (reset) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const data = await userService.getAll(filters);

            if (reset) {
                setUsers(data);
            } else {
                setUsers(prev => [...prev, ...data]);
            }

            setHasMore(data.length === ITEMS_PER_PAGE);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
            setError(errorMessage);
            console.error('Error loading users:', err);

            if (reset) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMessage,
                });
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters]);

    // Refresh users
    const refreshUsers = useCallback(async () => {
        setRefreshing(true);
        setFilters(prev => ({ ...prev, page: 1 }));
        await loadUsers(true);
        setRefreshing(false);
    }, [loadUsers]);

    // Load more users
    const loadMoreUsers = useCallback(() => {
        if (!loadingMore && hasMore) {
            setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
    }, [loadingMore, hasMore]);

    // Create user
    const createUser = useCallback(async (userData: CreateUserInput) => {
        try {
            setLoading(true);
            await userService.create(userData);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User added successfully',
            });

            await refreshUsers();
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add user';

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            console.error('Error creating user:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [refreshUsers]);

    // Update user
    const updateUser = useCallback(async (userData: UpdateUserInput) => {
        try {
            setLoading(true);
            await userService.update(userData);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User updated successfully',
            });

            await refreshUsers();
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user';

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            console.error('Error updating user:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [refreshUsers]);

    // Delete user
    const deleteUser = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            await userService.delete(userId);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User deleted successfully',
            });

            await refreshUsers();
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            console.error('Error deleting user:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [refreshUsers]);

    // Toggle user status
    const toggleUserStatus = useCallback(async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return { success: false, error: 'User not found' };

        try {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            await userService.update({
                ...user,
                status: newStatus,
            });

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
            });

            await refreshUsers();
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });

            console.error('Error toggling status:', err);
            return { success: false, error: errorMessage };
        }
    }, [users, refreshUsers]);

    // Update filters
    const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: ITEMS_PER_PAGE,
            sortBy: 'latest',
        });
    }, []);

    // Get active filter count
    const getActiveFilterCount = useCallback(() => {
        let count = 0;
        if (filters.role) count++;
        if (filters.status) count++;
        if (filters.sortBy && filters.sortBy !== 'latest') count++;
        return count;
    }, [filters]);

    // Load users when filters change
    useEffect(() => {
        loadUsers(true);
    }, [filters]);

    return {
        // State
        users,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        error,
        filters,

        // Actions
        loadUsers,
        refreshUsers,
        loadMoreUsers,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        updateFilters,
        clearFilters,
        getActiveFilterCount,
    };
};

// Usage Example:
// const {
//   users,
//   loading,
//   refreshing,
//   createUser,
//   updateUser,
//   deleteUser,
//   refreshUsers,
//   updateFilters,
// } = useUsers();