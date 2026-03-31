import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { Role } from "../types";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export const RoleCard = ({ role, title, description, selected, onPress }: RoleCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${role} role`}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.card,
    marginBottom: spacing.md
  },
  selected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3
  },
  pressed: {
    opacity: 0.85
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    color: colors.text,
    marginBottom: spacing.xs
  },
  description: {
    fontSize: 14,
    color: colors.muted
  }
});
