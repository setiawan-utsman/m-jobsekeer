// components/shared/FormInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { User, Mail, Lock } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: 'user' | 'mail' | 'lock';
  colors: any;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  colors,
  required = false,
  ...textInputProps
}) => {
  const IconComponent = icon === 'user' ? User : icon === 'mail' ? Mail : Lock;

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: `${colors.primary}08` }]}>
        {icon && <IconComponent size={18} color={colors.textSecondary} />}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          {...textInputProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});



