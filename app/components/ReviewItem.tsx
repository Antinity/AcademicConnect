import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Review } from "../types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { RatingStars } from "./RatingStars";

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.reviewer}>{review.reviewer}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <RatingStars rating={review.rating} />
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },
  reviewer: {
    fontSize: 14,
    color: colors.text
  },
  date: {
    fontSize: 12,
    color: colors.muted
  },
  comment: {
    fontSize: 13,
    color: colors.text,
    marginTop: spacing.xs
  }
});
