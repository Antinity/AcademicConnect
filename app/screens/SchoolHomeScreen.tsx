import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchBar } from "../components/SearchBar";
import { TeacherCard } from "../components/TeacherCard";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "SchoolHome">;

export const SchoolHomeScreen = ({ navigation }: Props) => {
  const teachers = useAppStore((state) => state.teachers);
  const user = useAppStore((state) => state.user);
  const [query, setQuery] = useState("");

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Teachers</Text>
          <Text style={styles.subtitle}>{user ? `Hi ${user.name}` : ""}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Chats</Text>
        </Pressable>
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by subject or name" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: spacing.xl
  }
});
