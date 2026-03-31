import React from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TeacherCard } from "../components/TeacherCard";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "StudentHome">;

export const StudentHomeScreen = ({ navigation }: Props) => {
  const teachers = useAppStore((state) => state.teachers);
  const user = useAppStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Browse Teachers</Text>
          <Text style={styles.subtitle}>{user ? `Welcome, ${user.name}` : ""}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("ChatList")} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Chats</Text>
        </Pressable>
      </View>
      <FlatList
        data={teachers}
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
