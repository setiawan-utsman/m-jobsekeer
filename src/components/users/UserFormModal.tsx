// components/users/UserFormModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { CreateUserInput, UpdateUserInput } from '@/types/user.types';
import Toast from 'react-native-toast-message';
import { FormInput } from '@/components/shared/FormInput';
import { RoleSelector } from '@/components/shared/RoleSelector';

interface UserFormModalProps {
  visible: boolean;
  title: string;
  initialData: CreateUserInput | UpdateUserInput;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  colors: any;
  isEdit?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  title,
  initialData,
  onClose,
  onSubmit,
  loading,
  colors,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    await onSubmit(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <FormInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Enter name"
              icon="user"
              colors={colors}
              required
            />

            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="Enter email"
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              colors={colors}
              required
            />

            {!isEdit && (
              <FormInput
                label="Password"
                value={formData.password || ''}
                onChangeText={(text) => updateField('password', text)}
                placeholder="Enter password"
                icon="lock"
                secureTextEntry
                colors={colors}
                required
              />
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Role <Text style={styles.required}>*</Text>
              </Text>
              <RoleSelector
                selectedRole={formData.role}
                onSelectRole={(role) => updateField('role', role)}
                colors={colors}
              />
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { 
                backgroundColor: loading ? colors.textSecondary : colors.primary 
              }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {isEdit ? 'Save Changes' : 'Add User'}
                </Text>
              )}
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
  modalBody: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  required: {
    color: '#ef4444',
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