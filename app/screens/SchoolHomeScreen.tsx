import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchBar } from "../components/SearchBar";
import { TeacherCard } from "../components/TeacherCard";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";
import { ThemeToggle } from "../components/ThemeToggle";

type Props = NativeStackScreenProps<RootStackParamList, "SchoolHome">;

export const SchoolHomeScreen = ({ navigation }: Props) => {
  const teachers = useAppStore((state) => state.teachers);
  const user = useAppStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) {
      return teachers;
    }
    return teachers.filter((teacher) => {
      return (
        teacher.name.toLowerCase().includes(normalized) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(normalized))
      );
    });
  }, [query, teachers]);

  const segmented = useMemo(() => {
    if (segment === "stem") {
      return filtered.filter((teacher) =>
        teacher.subjects.some((subject) => ["math", "physics", "chemistry", "computer"].some((term) => subject.toLowerCase().includes(term)))
      );
    }
    if (segment === "humanities") {
      return filtered.filter((teacher) =>
        teacher.subjects.some((subject) => ["writing", "literature", "history"].some((term) => subject.toLowerCase().includes(term)))
      );
    }
    return filtered;
  }, [filtered, segment]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Teachers</Text>
          <Text style={styles.subtitle}>{user ? `Hi ${user.name}` : ""}</Text>
        </View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
            <Feather name="message-circle" size={16} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by subject or name" />
      <View style={styles.filterRow}>
        {[
          { key: "all", label: "All" },
          { key: "stem", label: "STEM" },
          { key: "humanities", label: "Humanities" },
          { key: "new", label: "New" }
        ].map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setSegment(item.key)}
            style={[styles.filterChip, segment === item.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, segment === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={segmented}
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
    filterRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md
    },
    filterChip: {
      backgroundColor: colors.chip,
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
