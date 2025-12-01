// components/AppHeader.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { Search, X, ArrowLeft } from 'lucide-react-native';

interface AppHeaderProps {
    variant?: 'search' | 'back';
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    searchPlaceholder?: string;
    title?: string;
    subtitle?: string; // Tambahkan subtitle
    onBackPress?: () => void;
    user?: {
        name?: string;
        avatar?: string;
        avatarId?: string;
    };
    onProfilePress?: () => void;
    colors: {
        primary: string;
        text: string;
        textSecondary: string;
        background: string;
    };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    variant = 'search',
    searchQuery = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    title,
    subtitle,
    onBackPress,
    user,
    onProfilePress,
    colors,
}) => {
    const avatarUrl = user?.avatar || `https://i.pravatar.cc/150?img=${user?.avatarId || 1}`;

    // Render header dengan search dan profile
    if (variant === 'search') {
        return (
            <View style={styles.header}>
                <View style={[styles.searchContainer, { backgroundColor: `${colors.primary}08` }]}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder={searchPlaceholder}
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={onSearchChange}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => onSearchChange?.('')}>
                            <X size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={onProfilePress}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    // Render header dengan back button, title, dan subtitle
    return (
        <View style={styles.backHeader}>
            <TouchableOpacity
                onPress={onBackPress}
                style={styles.backButton}
                activeOpacity={0.7}
            >
                <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        padding: 0,
    },
    profileContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    backHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
});