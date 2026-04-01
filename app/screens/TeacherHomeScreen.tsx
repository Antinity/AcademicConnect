import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { School } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherHome">;

export const TeacherHomeScreen = ({ navigation }: Props) => {
  const user = useAppStore((state) => state.user);
  const teacher = useAppStore((state) => state.getTeacherById(user?.id || ""));
  const schools = useAppStore((state) => state.schools);
  const fetchTeachers = useAppStore((state) => state.fetchTeachers);
  const fetchSchools = useAppStore((state) => state.fetchSchools);
  const fetchConversations = useAppStore((state) => state.fetchConversations);
  const conversations = useAppStore((state) => state.conversations);
  const startConversation = useAppStore((state) => state.startConversation);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchTeachers();
    fetchSchools();
    fetchConversations();
  }, [fetchTeachers, fetchSchools, fetchConversations]);

  const handleMessageSchool = async (schoolId: string) => {
    const convId = await startConversation(schoolId);
    if (convId) navigation.navigate("ChatThread", { conversationId: convId });
  };

  const renderSchoolCard = ({ item }: { item: School }) => (
    <View style={styles.schoolCard}>
      <View style={styles.schoolIconWrap}>
        <Feather name="briefcase" size={20} color={colors.primary} />
      </View>
      <View style={styles.schoolInfo}>
        <Text style={styles.schoolName} numberOfLines={1}>{item.name}</Text>
        {item.location ? (
          <View style={styles.schoolMeta}>
            <Feather name="map-pin" size={11} color={colors.muted} />
            <Text style={styles.schoolMetaText}>{item.location}</Text>
          </View>
        ) : null}
        {item.hiringFocus ? (
          <Text style={styles.schoolFocus} numberOfLines={2}>{item.hiringFocus}</Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => handleMessageSchool(item.id)}
        style={({ pressed }) => [styles.msgBtn, pressed && styles.msgBtnPressed]}
      >
        <Feather name="message-circle" size={14} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(route) => navigation.navigate(route)}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
          <Feather name="menu" size={16} color={colors.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>Welcome back{user?.name ? `, ${user.name}` : ""}!</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.iconButton}>
          <Feather name="message-circle" size={16} color={colors.text} />
          {conversations.length > 0 && <View style={styles.redDot} />}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Profile Card ── */}
        {teacher ? (
          <View style={styles.profileCard}>
            {/* Avatar row */}
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {teacher.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={styles.profileName}>{teacher.name}</Text>
                <Text style={styles.profileTitle}>{teacher.title}</Text>
                <RatingStars rating={teacher.rating} />
              </View>
            </View>

            {/* Stats strip */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{teacher.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{teacher.subjects.length}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${teacher.hourlyRate}</Text>
                <Text style={styles.statLabel}>/ hr</Text>
              </View>
            </View>

            {/* Subject chips */}
            {teacher.subjects.length > 0 && (
              <View style={styles.chipRow}>
                {teacher.subjects.map((s) => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Bio */}
            {teacher.bio ? <Text style={styles.bio}>{teacher.bio}</Text> : null}

            {/* Edit profile shortcut */}
            <Pressable
              onPress={() => navigation.navigate("EditProfile")}
              style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
            >
              <Feather name="edit-2" size={13} color={colors.primary} />
              <Text style={styles.editBtnText}>Edit profile</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <Text style={styles.emptyText}>Profile not set up yet.</Text>
            <Pressable
              onPress={() => navigation.navigate("EditProfile")}
              style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
            >
              <Feather name="edit-2" size={13} color={colors.primary} />
              <Text style={styles.editBtnText}>Set up your profile</Text>
            </Pressable>
          </View>
        )}

        {/* ── Schools Hiring ── */}
        <Text style={styles.sectionTitle}>Schools Hiring</Text>
        {schools.length === 0 ? (
          <View style={styles.emptyCard}>
            <Feather name="briefcase" size={28} color={colors.muted} />
            <Text style={styles.emptyCard_text}>No schools hiring right now.</Text>
          </View>
        ) : (
          schools.map((school) => (
            <View key={school.id}>
              {renderSchoolCard({ item: school })}
            </View>
          ))
        )}
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
  chip: string;
  primary: string;
  success: string;
}) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.sm,
    },
    iconButton: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      position: "relative",
    },
    redDot: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#EF4444",
    },
    titleBlock: { flex: 1 },
    headerTitle: {
      fontSize: 20,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    headerSub: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    scroll: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },

    // ── Profile card ──
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    profileTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.chip,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 20,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    profileMeta: { flex: 1 },
    profileName: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    profileTitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
      marginBottom: 4,
    },

    statsRow: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderRadius: 14,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
    },
    statItem: { flex: 1, alignItems: "center" },
    statValue: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },

    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    chip: {
      backgroundColor: colors.chip,
      borderRadius: 10,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
    },
    chipText: { fontSize: 12, color: colors.muted },

    bio: { fontSize: 13, color: colors.text, lineHeight: 19, marginBottom: spacing.md },

    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      alignSelf: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    editBtnText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: typography.fontFamilyBold,
    },
    emptyText: { fontSize: 14, color: colors.muted, marginBottom: spacing.md },

    // ── Schools hiring ──
    sectionTitle: {
      fontSize: 17,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    schoolCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    schoolIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.chip,
      alignItems: "center",
      justifyContent: "center",
    },
    schoolInfo: { flex: 1 },
    schoolName: {
      fontSize: 15,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    schoolMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 3,
    },
    schoolMetaText: { fontSize: 12, color: colors.muted },
    schoolFocus: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 4,
      lineHeight: 16,
    },
    msgBtn: {
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    msgBtnPressed: { opacity: 0.8 },
    emptyCard: {
      alignItems: "center",
      paddingVertical: spacing.xl,
      gap: spacing.sm,
    },
    emptyCard_text: { fontSize: 14, color: colors.muted },
  });
