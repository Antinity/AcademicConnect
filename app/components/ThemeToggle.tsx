import React, { useEffect } from "react";
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { useThemeColors } from "../theme/useTheme";
import { spacing } from "../theme/spacing";

export const ThemeToggle = () => {
  const colors = useThemeColors();
  const mode = useAppStore((state) => state.themeMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        toggleTheme();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed
      ]}
    >
      <Feather name={mode === "dark" ? "sun" : "moon"} size={16} color={colors.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1
  },
  pressed: {
    opacity: 0.85
  }
});
