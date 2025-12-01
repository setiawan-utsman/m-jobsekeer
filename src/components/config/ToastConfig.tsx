// config/toastConfig.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <CheckCircle size={24} color="#10b981" />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.toastMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
  error: (props) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <XCircle size={24} color="#ef4444" />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.toastMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
  warning: (props) => (
    <View style={[styles.toastContainer, styles.warningToast]}>
      <AlertCircle size={24} color="#f59e0b" />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.toastMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
  info: (props) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <Info size={24} color="#3b82f6" />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.toastMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  successToast: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  errorToast: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  warningToast: {
    backgroundColor: '#fffbeb',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoToast: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
});

// Usage in App.tsx or _layout.tsx:
// import Toast from 'react-native-toast-message';
// import { toastConfig } from '@/config/toastConfig';
//
// export default function RootLayout() {
//   return (
//     <>
//       <Stack />
//       <Toast config={toastConfig} />
//     </>
//   );
// }