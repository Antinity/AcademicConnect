import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "../components/RatingStars";
import { ReviewItem } from "../components/ReviewItem";
import { useThemeColors } from "../theme/useTheme";
import { ThemeToggle } from "../components/ThemeToggle";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherHome">;

export const TeacherHomeScreen = ({ navigation }: Props) => {
  const user = useAppStore((state) => state.user);
  const teacher = useAppStore((state) => state.getTeacherById(user?.id || ""));
  const colors = useThemeColors();
  const styles = createStyles(colors);

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
        <View style={styles.headerActions}>
          <ThemeToggle />
          <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
            <Feather name="message-circle" size={16} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>14</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Response</Text>
            <Text style={styles.statValue}>2h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>{teacher.rating.toFixed(1)}</Text>
          </View>
        </View>
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

const createStyles = (colors: {
  background: string;
  card: string;
  border: string;
  text: string;
  muted: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg
    },
    header: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    },
    title: {
      fontSize: 24,
      fontFamily: typography.fontFamilyBold,
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
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs
    },
    scrollContent: {
      paddingBottom: spacing.xl
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border
    },
    statLabel: {
      fontSize: 12,
      color: colors.muted
    },
    statValue: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
      marginTop: spacing.xs
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
      fontFamily: typography.fontFamilyBold,
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
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
      marginBottom: spacing.sm
    }
  });
