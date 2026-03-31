import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "../components/RatingStars";
import { ReviewItem } from "../components/ReviewItem";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherHome">;

export const TeacherHomeScreen = ({ navigation }: Props) => {
  const user = useAppStore((state) => state.user);
  const teacher = useAppStore((state) => state.getTeacherById(user?.id || ""));

  if (!teacher) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profile not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>Keep your availability up to date.</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Messages</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.role}>{teacher.title}</Text>
          <RatingStars rating={teacher.rating} />
          <Text style={styles.bio}>{teacher.bio}</Text>
        </View>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {teacher.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg
  },
  header: {
    paddingVertical: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily,
    color: colors.text
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs
  },
  chatButton: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  chatButtonText: {
    color: colors.text,
    fontSize: 13
  },
  scrollContent: {
    paddingBottom: spacing.xl
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  name: {
    fontSize: 22,
    fontFamily: typography.fontFamily,
    color: colors.text
  },
  role: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    marginTop: spacing.md
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    color: colors.text,
    marginBottom: spacing.sm
  }
});
