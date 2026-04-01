import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { useThemeColors } from "../theme/useTheme";
import { spacing } from "../theme/spacing";

export const ThemeToggle = () => {
  const colors = useThemeColors();
  const mode = useAppStore((state) => state.themeMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  // 0 = light (moon icon), 1 = dark (sun icon)
  const progress = useSharedValue(mode === "dark" ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(mode === "dark" ? 1 : 0, {
      damping: 14,
      stiffness: 180,
    });
  }, [mode, progress]);

  const handlePress = () => {
    // Quick spin + bounce before state updates
    progress.value = withSequence(
      withTiming(mode === "dark" ? 0.4 : 0.6, { duration: 120 }),
      withSpring(mode === "dark" ? 0 : 1, { damping: 12, stiffness: 200 })
    );
    toggleTheme();
  };

  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0.65, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    const bgProgress = interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    // Interpolate between light-card and slightly tinted dark-card feel
    return {
      opacity: withSpring(1),
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Animated.View style={[iconStyle, containerStyle]}>
        <Feather
          name={mode === "dark" ? "sun" : "moon"}
          size={16}
          color={colors.text}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
