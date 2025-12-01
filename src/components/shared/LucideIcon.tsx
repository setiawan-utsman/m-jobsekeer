import React from "react";
import * as Icons from "lucide-react-native";

type LucideIconProps = {
  name: string;
  size?: number;
  color?: string;
};

export function LucideIcon({ name }: LucideIconProps) {
  // Ubah string jadi PascalCase (apple → Apple)
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);

  // Ambil komponen icon dari lucide-react-native
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;

  return <IconComponent />;
}