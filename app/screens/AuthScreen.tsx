import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { RoleCard } from "../components/RoleCard";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { Role } from "../types";
import { useAppStore } from "../store/useAppStore";
import { useThemeColors } from "../theme/useTheme";
import { ThemeToggle } from "../components/ThemeToggle";

export const AuthScreen = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const login = useAppStore((state) => state.login);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleContinue = () => {
    if (!role) {
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    login(name, role);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AcademicConnect</Text>
          <Text style={styles.subtitle}>Choose your role to explore the marketplace.</Text>
        </View>
        <ThemeToggle />
      </View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <RoleCard
        role="student"
        title="Student"
        description="Find the right teacher fast."
        selected={role === "student"}
        onPress={() => setRole("student")}
      />
      <RoleCard
        role="teacher"
        title="Teacher"
        description="Share your profile and availability."
        selected={role === "teacher"}
        onPress={() => setRole("teacher")}
      />
      <RoleCard
        role="school"
        title="School"
        description="Build a reliable teacher roster."
        selected={role === "school"}
        onPress={() => setRole("school")}
      />
      <Pressable
        onPress={handleContinue}
        style={({ pressed }) => [styles.button, !role && styles.buttonDisabled, pressed && styles.pressed]}
        disabled={!role}
      >
        <Text style={styles.buttonText}>Continue</Text>
        <Feather name="arrow-right" size={16} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
};

const createStyles = (colors: {
  background: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: colors.background
    },
    header: {
      marginBottom: spacing.lg,
      paddingTop: spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    title: {
      fontSize: 28,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
      marginBottom: spacing.xs
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      color: colors.text
    },
    error: {
      color: "#D9534F",
      marginBottom: spacing.sm
    },
    button: {
      marginTop: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: spacing.md,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.sm
    },
    buttonDisabled: {
      backgroundColor: "#6E6E6E"
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: typography.fontFamilyBold
    },
    pressed: {
      opacity: 0.85
    }
  });
