// components/users/FilterModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { UserFilters } from '@/types/user.types';

interface FilterModalProps {
  visible: boolean;
  filters: UserFilters;
  onClose: () => void;
  onApply: (filters: Partial<UserFilters>) => void;
  onClear: () => void;
  colors: any;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onClear,
  colors,
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<UserFilters>>({
    role: filters.role,
    status: filters.status,
    sortBy: filters.sortBy,
  });

  const updateFilter = (key: keyof UserFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      role: undefined,
      status: undefined,
      sortBy: 'latest',
    });
    onClear();
  };

  const FilterOption = ({ 
    label, 
    selected, 
    onPress 
  }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        {
          backgroundColor: selected ? colors.primary : `${colors.primary}10`,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterOptionText,
          {
            color: selected ? '#FFFFFF' : colors.text,
            fontWeight: selected ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters & Sort</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterModalBody}>
            {/* Role Filter */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Role</Text>
              <View style={styles.filterOptions}>
                <FilterOption
                  label="All"
                  selected={!localFilters.role}
                  onPress={() => updateFilter('role', undefined)}
                />
                <FilterOption
                  label="Admin"
                  selected={localFilters.role === 'admin'}
                  onPress={() => updateFilter('role', 'admin')}
                />
                <FilterOption
                  label="User"
                  selected={localFilters.role === 'user'}
                  onPress={() => updateFilter('role', 'user')}
                />
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Status</Text>
              <View style={styles.filterOptions}>
                <FilterOption
                  label="All"
                  selected={!localFilters.status}
                  onPress={() => updateFilter('status', undefined)}
                />
                <FilterOption
                  label="Active"
                  selected={localFilters.status === 'active'}
                  onPress={() => updateFilter('status', 'active')}
                />
                <FilterOption
                  label="Inactive"
                  selected={localFilters.status === 'inactive'}
                  onPress={() => updateFilter('status', 'inactive')}
                />
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Sort By</Text>
              <View style={styles.filterOptions}>
                <FilterOption
                  label="Latest"
                  selected={localFilters.sortBy === 'latest'}
                  onPress={() => updateFilter('sortBy', 'latest')}
                />
                <FilterOption
                  label="Oldest"
                  selected={localFilters.sortBy === 'oldest'}
                  onPress={() => updateFilter('sortBy', 'oldest')}
                />
                <FilterOption
                  label="Name"
                  selected={localFilters.sortBy === 'name'}
                  onPress={() => updateFilter('sortBy', 'name')}
                />
              </View>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClear}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  filterModalBody: {
    gap: 20,
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});