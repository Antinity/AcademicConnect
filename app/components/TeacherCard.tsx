import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Teacher } from "../types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "./RatingStars";

interface TeacherCardProps {
  teacher: Teacher;
  onPress: () => void;
}

export const TeacherCard = ({ teacher, onPress }: TeacherCardProps) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.title}>{teacher.title}</Text>
        </View>
        <View style={styles.rateBox}>
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: typography.fontFamily,
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
    alignSelf: "flex-start"
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
