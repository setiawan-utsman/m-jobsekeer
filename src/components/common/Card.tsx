import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', style, ...props }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      className={`rounded-lg p-4 ${className}`}
      style={[
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}