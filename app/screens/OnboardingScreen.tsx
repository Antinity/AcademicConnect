import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";

export const OnboardingScreen = () => {
  const user = useAppStore((state) => state.user);
  const profile = useAppStore((state) => state.profile);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(profile?.headline || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [subjects, setSubjects] = useState(profile?.subjects?.join(", ") || "");
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate?.toString() || "");
  const [gradeLevel, setGradeLevel] = useState(profile?.gradeLevel || "");
  const [goals, setGoals] = useState(profile?.goals || "");
  const [institutionName, setInstitutionName] = useState(profile?.institutionName || "");
  const [hiringFocus, setHiringFocus] = useState(profile?.hiringFocus || "");
  const [error, setError] = useState("");

  const role = user?.role || "student";

  const helper = useMemo(() => {
    if (role === "teacher") {
      return "Build a teacher profile so students can discover you.";
    }
    if (role === "school") {
      return "Add your school details to find the right teachers.";
    }
    return "Tell us a bit about your learning goals.";
  }, [role]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (role === "teacher") {
      if (!headline.trim() || !subjects.trim()) {
        setError("Add a headline and at least one subject.");
        return;
      }
    }
    if (role === "student") {
      if (!gradeLevel.trim()) {
        setError("Add your grade or level.");
        return;
      }
    }
    if (role === "school") {
      if (!institutionName.trim() || !location.trim()) {
        setError("Add a school name and location.");
        return;
      }
    }

    completeOnboarding({
      name: name.trim(),
      role,
      headline: headline.trim(),
      location: location.trim(),
      bio: bio.trim(),
      subjects: subjects
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      gradeLevel: gradeLevel.trim(),
      goals: goals.trim(),
      institutionName: institutionName.trim(),
      hiringFocus: hiringFocus.trim()
    });
    setError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Finish your profile</Text>
        <Text style={styles.subtitle}>{helper}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        {role === "teacher" && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Headline</Text>
              <TextInput
                value={headline}
                onChangeText={setHeadline}
                placeholder="Math tutor, Physics mentor"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Subjects</Text>
              <TextInput
                value={subjects}
                onChangeText={setSubjects}
                placeholder="Algebra, Calculus"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Hourly rate</Text>
              <TextInput
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="45"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Short bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Two lines about your approach"
                placeholderTextColor={colors.muted}
                style={[styles.input, styles.textarea]}
                multiline
              />
            </View>
          </>
        )}

        {role === "student" && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Grade or level</Text>
              <TextInput
                value={gradeLevel}
                onChangeText={setGradeLevel}
                placeholder="Class 11, Undergrad"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Goals</Text>
              <TextInput
                value={goals}
                onChangeText={setGoals}
                placeholder="Exam prep, confidence building"
                placeholderTextColor={colors.muted}
                style={[styles.input, styles.textarea]}
                multiline
              />
            </View>
          </>
        )}

        {role === "school" && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>School name</Text>
              <TextInput
                value={institutionName}
                onChangeText={setInstitutionName}
                placeholder="Northview Academy"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Seattle, WA"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Hiring focus</Text>
              <TextInput
                value={hiringFocus}
                onChangeText={setHiringFocus}
                placeholder="STEM enrichment, SAT prep"
                placeholderTextColor={colors.muted}
                style={[styles.input, styles.textarea]}
                multiline
              />
            </View>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Save profile</Text>
          <Feather name="check" size={16} color="#FFFFFF" />
        </Pressable>
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
  primary: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl
    },
    title: {
      fontSize: 24,
      fontFamily: typography.fontFamilyBold,
      color: colors.text
    },
    subtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: spacing.xs,
      marginBottom: spacing.lg
    },
    section: {
      marginBottom: spacing.md
    },
    label: {
      fontSize: 12,
      color: colors.muted,
      marginBottom: spacing.xs
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.text
    },
    textarea: {
      minHeight: 90,
      textAlignVertical: "top"
    },
    error: {
      color: "#D9534F",
      marginBottom: spacing.md
    },
    button: {
      marginTop: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: spacing.md,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.sm
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: typography.fontFamilyBold
    }
  });
