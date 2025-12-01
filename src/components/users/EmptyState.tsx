// components/users/EmptyState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';

interface EmptyStateProps {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  colors: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  hasFilters,
  onClearFilters,
  colors,
}) => {
  return (
    <View style={styles.emptyState}>
      <User size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No users found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery || hasFilters
          ? 'Try adjusting your filters or search query'
          : 'Add your first user to get started'}
      </Text>
      {(searchQuery || hasFilters) && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.primary }]}
          onPress={onClearFilters}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  clearButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});