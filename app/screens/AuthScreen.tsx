import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
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
  const [isRegister, setIsRegister] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const authenticate = useAppStore((state) => state.authenticate);
  const authError = useAppStore((state) => state.authError);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleContinue = async () => {
    if (isRegister && !role) {
      setLocalError("Please select a role.");
      return;
    }
    if (isRegister && !name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setLocalError("Email and Password are required.");
      return;
    }

    setLocalError("");
    setLoading(true);

    // Call the store action
    const success = await authenticate(name, email, password, role || "student", isRegister);
    setLoading(false);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setLocalError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AcademicConnect</Text>
          <Text style={styles.subtitle}>{isRegister ? "Create an account to explore." : "Log in to your account."}</Text>
        </View>
        <ThemeToggle />
      </View>

      {isRegister && (
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your Full Name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      )}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      {(localError || authError) ? <Text style={styles.error}>{localError || authError}</Text> : null}

      {isRegister && (
        <>
          <Text style={styles.roleLabel}>Select your role:</Text>
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
        </>
      )}

      <Pressable
        onPress={handleContinue}
        style={({ pressed }) => [
          styles.button,
          (isRegister && !role) && styles.buttonDisabled,
          loading && styles.buttonDisabled,
          pressed && styles.pressed
        ]}
        disabled={(isRegister && !role) || loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.buttonText}>{isRegister ? "Sign Up" : "Log In"}</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </>
        )}
      </Pressable>

      <Pressable onPress={toggleMode} style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {isRegister ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </Text>
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
    roleLabel: {
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      color: colors.text,
      fontFamily: typography.fontFamily
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      color: colors.text,
      height: 50
    },
    error: {
      color: "#D9534F",
      marginBottom: spacing.sm,
      fontFamily: typography.fontFamily
    },
    button: {
      marginTop: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: 16,
      height: 56,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.sm
    },
    buttonDisabled: {
      backgroundColor: colors.muted
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: typography.fontFamilyBold
    },
    pressed: {
      opacity: 0.85
    },
    toggleContainer: {
      marginTop: spacing.lg,
      alignItems: "center"
    },
    toggleText: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: typography.fontFamily
    }
  });
