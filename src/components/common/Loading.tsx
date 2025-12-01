import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Loading({ text, size = 'large', fullScreen = false }: LoadingProps) {
  const { colors } = useTheme();

  const content = (
    <>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && (
        <Text className="mt-4 text-base" style={{ color: colors.textSecondary }}>
          {text}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View 
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        {content}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      {content}
    </View>
  );
}