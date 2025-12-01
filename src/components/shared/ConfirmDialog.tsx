// components/shared/ConfirmDialog.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  colors: any;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  colors,
  destructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.dialogOverlay}>
        <View style={[styles.dialogContent, { backgroundColor: colors.background }]}>
          {destructive && (
            <View style={styles.iconContainer}>
              <AlertTriangle size={48} color="#ef4444" />
            </View>
          )}
          
          <Text style={[styles.dialogTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.dialogMessage, { color: colors.textSecondary }]}>
            {message}
          </Text>

          <View style={styles.dialogActions}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={[styles.dialogButtonText, { color: colors.text }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dialogButton,
                styles.confirmButton,
                {
                  backgroundColor: destructive ? '#ef4444' : colors.primary,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={onConfirm}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.dialogButtonText, { color: '#FFFFFF' }]}>
                  {confirmText}
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
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dialogButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
