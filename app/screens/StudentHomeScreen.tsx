import React, { useMemo, useState, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TeacherCard } from "../components/TeacherCard";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchBar } from "../components/SearchBar";

type Props = NativeStackScreenProps<RootStackParamList, "StudentHome">;

export const StudentHomeScreen = ({ navigation }: Props) => {
  const teachers = useAppStore((state) => state.teachers);
  const user = useAppStore((state) => state.user);
  const fetchTeachers = useAppStore((state) => state.fetchTeachers);
  const conversations = useAppStore((state) => state.conversations);
  const fetchConversations = useAppStore((state) => state.fetchConversations);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchTeachers();
    fetchConversations();
  }, [fetchTeachers, fetchConversations]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    let list = teachers;
    if (normalized) {
      list = list.filter((teacher) =>
        [teacher.name, teacher.title, ...teacher.subjects].some((value) =>
          value.toLowerCase().includes(normalized)
        )
      );
    }
    if (filter === "top") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    if (filter === "budget") {
      list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    }
    return list;
  }, [teachers, query, filter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Browse Teachers</Text>
          <Text style={styles.subtitle}>{user ? `Welcome, ${user.name}` : ""}</Text>
        </View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
            <Feather name="message-circle" size={16} color={colors.text} />
            {conversations.length > 0 && <View style={styles.redDot} />}
          </Pressable>
        </View>
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search teachers or subjects" />
      <View style={styles.filterRow}>
        {[
          { key: "all", label: "All" },
          { key: "top", label: "Top rated" },
          { key: "budget", label: "Budget" }
        ].map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setFilter(item.key)}
            style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TeacherCard
            teacher={item}
            onPress={() => navigation.navigate("TeacherProfile", { teacherId: item.id })}
          />
        )}
      />
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
      gap: spacing.xs,
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
    filterRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md
    },
    filterChip: {
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border
    },
    filterChipActive: {
      borderColor: colors.text
    },
    filterText: {
      fontSize: 12,
      color: colors.muted
    },
    filterTextActive: {
      color: colors.text,
      fontFamily: typography.fontFamilyBold
    },
    listContent: {
      paddingBottom: spacing.xl
    }
  });
