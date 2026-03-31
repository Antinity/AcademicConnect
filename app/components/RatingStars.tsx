import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";

interface RatingStarsProps {
  rating: number;
}

const buildStars = (rating: number) => {
  const rounded = Math.round(rating);
  const filled = "*".repeat(rounded);
  const empty = "-".repeat(Math.max(0, 5 - rounded));
  return `${filled}${empty}`;
};

export const RatingStars = ({ rating }: RatingStarsProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      <Text style={styles.stars}>{buildStars(rating)}</Text>
    </View>
  );
};

const createStyles = (colors: { text: string; accent: string }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs
    },
    rating: {
      fontSize: 14,
      color: colors.text,
      marginRight: spacing.sm
    },
    stars: {
      fontSize: 12,
      color: colors.accent,
      letterSpacing: 1
    }
  });
