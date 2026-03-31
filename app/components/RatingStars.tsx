import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";

interface RatingStarsProps {
  rating: number;
}

export const RatingStars = ({ rating }: RatingStarsProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const value = rating - index;
    if (value >= 1) {
      return "star";
    }
    if (value >= 0.5) {
      return "star-half-full";
    }
    return "star-outline";
  });

  return (
    <View style={styles.row}>
      <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      <View style={styles.stars}>
        {stars.map((icon, index) => (
          <MaterialCommunityIcons
            key={`${icon}-${index}`}
            name={icon}
            size={14}
            color={colors.accent}
          />
        ))}
      </View>
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
      flexDirection: "row",
      alignItems: "center",
      gap: 2
    }
  });
