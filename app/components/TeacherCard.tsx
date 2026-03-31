import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Teacher } from "../types";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "./RatingStars";
import { useThemeColors } from "../theme/useTheme";

interface TeacherCardProps {
  teacher: Teacher;
  onPress: () => void;
}

export const TeacherCard = ({ teacher, onPress }: TeacherCardProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.985, duration: 120, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {teacher.name}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {teacher.title}
            </Text>
          </View>
          <View style={styles.rateBox}>
            <Feather name="clock" size={12} color={colors.muted} />
            <Text style={styles.rateText}>${teacher.hourlyRate}/hr</Text>
          </View>
        </View>
        <RatingStars rating={teacher.rating} />
        <View style={styles.tagRow}>
          {teacher.subjects.map((subject) => (
            <View key={subject} style={styles.tag}>
              <Text style={styles.tagText}>{subject}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const createStyles = (colors: {
  card: string;
  border: string;
  text: string;
  muted: string;
  chip: string;
  background: string;
}) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border
    },
    pressed: {
      opacity: 0.85
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm
    },
    name: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text
    },
    title: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4
    },
    rateBox: {
      backgroundColor: colors.chip,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs
    },
    rateText: {
      fontSize: 13,
      color: colors.text
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: spacing.sm
    },
    tag: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      marginRight: spacing.xs,
      marginBottom: spacing.xs
    },
    tagText: {
      fontSize: 12,
      color: colors.muted
    }
  });
