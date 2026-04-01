import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "../components/RatingStars";
import { useThemeColors } from "../theme/useTheme";
import { Sidebar } from "../components/Sidebar";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherHome">;

export const TeacherHomeScreen = ({ navigation }: Props) => {
  const user = useAppStore((state) => state.user);
  const teacher = useAppStore((state) => state.getTeacherById(user?.id || ""));
  const fetchTeachers = useAppStore((state) => state.fetchTeachers);
  const conversations = useAppStore((state) => state.conversations);
  const fetchConversations = useAppStore((state) => state.fetchConversations);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchTeachers();
    fetchConversations();
  }, [fetchTeachers, fetchConversations]);

  if (!teacher) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profile not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(route) => navigation.navigate(route)}
      />
      <View style={styles.header}>
        <Pressable onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
          <Feather name="menu" size={16} color={colors.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>Keep your availability up to date.</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.iconButton}>
          <Feather name="message-circle" size={16} color={colors.text} />
          {conversations.length > 0 && <View style={styles.redDot} />}
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
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
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    },
    titleBlock: {
      flex: 1,
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
    iconButton: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      position: "relative"
    },
    redDot: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#EF4444"
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
    }
  });
