import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { Role } from "../types";
import { useThemeColors } from "../theme/useTheme";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export const RoleCard = ({ role, title, description, selected, onPress }: RoleCardProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const scale = useRef(new Animated.Value(1)).current;
  const iconName = role === "student" ? "book-open" : role === "teacher" ? "user" : "home";

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.98, duration: 120, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${role} role`}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Feather name={iconName} size={18} color={colors.text} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const createStyles = (colors: {
  border: string;
  card: string;
  text: string;
  muted: string;
}) =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      backgroundColor: colors.card,
      marginBottom: spacing.md
    },
    selected: {
      borderColor: colors.text,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 3
    },
    pressed: {
      opacity: 0.85
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
      marginBottom: spacing.xs
    },
    description: {
      fontSize: 14,
      color: colors.muted
    }
  });
