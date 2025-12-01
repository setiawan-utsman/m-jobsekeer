// components/shared/RoleSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RoleSelectorProps {
	selectedRole: 'admin' | 'user' | any;
	onSelectRole: (role: 'admin' | 'user') => void;
	colors: any;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
	selectedRole,
	onSelectRole,
	colors,
}) => {
	return (
		<View style={styles.roleSelector}>
			{(['user', 'admin'] as const).map((role) => (
				<TouchableOpacity
					key={role}
					style={[
						styles.roleOption,
						{
							backgroundColor: selectedRole === role
								? colors.primary
								: `${colors.primary}10`,
						},
					]}
					onPress={() => onSelectRole(role)}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.roleOptionText,
							{
								color: selectedRole === role ? '#FFFFFF' : colors.text,
								fontWeight: selectedRole === role ? '700' : '500',
							},
						]}
					>
						{role.charAt(0).toUpperCase() + role.slice(1)}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	roleSelector: {
		flexDirection: 'row',
		gap: 12,
	},
	roleOption: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: 'center',
	},
	roleOptionText: {
		fontSize: 14,
	},
});
