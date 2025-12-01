// components/users/UserCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MoreVertical, Edit2, Shield, Trash2 } from 'lucide-react-native';
import { UserData } from '@/types/user.types';

interface UserCardProps {
    user: UserData;
    colors: any;
    showOptionsMenu: boolean;
    onToggleMenu: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
}

const RoleChip = ({ role }: { role: string }) => (
    <View style={[
        styles.roleChip,
        { backgroundColor: role === 'admin' ? '#ef444410' : '#3b82f610' }
    ]}>
        <Text style={[
            styles.roleText,
            { color: role === 'admin' ? '#ef4444' : '#3b82f6' }
        ]}>
            {role.toUpperCase()}
        </Text>
    </View>
);

const StatusBadge = ({ status }: { status: string }) => (
    <View style={[
        styles.statusBadge,
        { backgroundColor: status === 'active' ? '#10b98110' : '#6b728010' }
    ]}>
        <View style={[
            styles.statusDot,
            { backgroundColor: status === 'active' ? '#10b981' : '#6b7280' }
        ]} />
        <Text style={[
            styles.statusText,
            { color: status === 'active' ? '#10b981' : '#6b7280' }
        ]}>
            {status}
        </Text>
    </View>
);

export const UserCard: React.FC<UserCardProps> = ({
    user,
    colors,
    showOptionsMenu,
    onToggleMenu,
    onEdit,
    onDelete,
    onToggleStatus,
}) => {

    return (
        <View
            style={[
                styles.userCard, 
                {
                    backgroundColor: colors.card || colors.background,
                    shadowColor: colors.text,
                    zIndex: showOptionsMenu ? 1000 : 1,
                    elevation: showOptionsMenu ? 10 : 2,
                }
            ]}
        >
            <View style={styles.userInfo}>
                <Image 
                    source={{ uri: user.avatar }}
                    style={styles.userAvatar}
                    defaultSource={require('@/assets/images/icon.png')} // optional fallback
                />
                <View style={styles.userDetails}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                        {user.email}
                    </Text>
                    <View style={styles.userMeta}>
                        <RoleChip role={user.role} />
                        <StatusBadge status={user.status} />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.optionsButton}
                onPress={onToggleMenu}
                activeOpacity={0.7}
            >
                <MoreVertical size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {showOptionsMenu && (
                <View style={[styles.optionsMenu, {
                    backgroundColor: colors.card || colors.background,
                    shadowColor: colors.text,
                }]}>
                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={onEdit}
                        activeOpacity={0.7}
                    >
                        <Edit2 size={16} color={colors.text} />
                        <Text style={[styles.optionText, { color: colors.text }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={onToggleStatus}
                        activeOpacity={0.7}
                    >
                        <Shield size={16} color={colors.text} />
                        <Text style={[styles.optionText, { color: colors.text }]}>
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={onDelete}
                        activeOpacity={0.7}
                    >
                        <Trash2 size={16} color="#ef4444" />
                        <Text style={[styles.optionText, { color: '#ef4444' }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        position: 'relative',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        marginBottom: 6,
        fontWeight: '500',
    },
    userMeta: {
        flexDirection: 'row',
        gap: 8,
    },
    roleChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    optionsButton: {
        padding: 8,
    },
    optionsMenu: {
        position: 'absolute',
        top: 60,
        right: 16,
        borderRadius: 12,
        padding: 8,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        zIndex: 1001,
        minWidth: 150,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 10,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});