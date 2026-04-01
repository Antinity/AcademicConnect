import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export const EditProfileScreen = ({ navigation }: Props) => {
  const user = useAppStore((state) => state.user);
  const profile = useAppStore((state) => state.profile);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const role = user?.role || "student";

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    setError("");
    const ok = await completeOnboarding({
      name: name.trim(),
      role,
      headline: headline.trim(),
      location: location.trim(),
      bio: bio.trim(),
      subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      gradeLevel: gradeLevel.trim(),
      goals: goals.trim(),
      institutionName: institutionName.trim(),
      hiringFocus: hiringFocus.trim(),
    });
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError("Failed to save. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
            <Feather name="chevron-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Common */}
          <Text style={styles.sectionLabel}>Basic Info</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={colors.muted} placeholder="Your name" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholderTextColor={colors.muted} placeholder="City, Country" />
          </View>

          {/* Teacher fields */}
          {role === "teacher" && (
            <>
              <Text style={styles.sectionLabel}>Teacher Profile</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Headline</Text>
                <TextInput value={headline} onChangeText={setHeadline} style={styles.input} placeholderTextColor={colors.muted} placeholder="Math tutor, Physics mentor" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Subjects</Text>
                <TextInput value={subjects} onChangeText={setSubjects} style={styles.input} placeholderTextColor={colors.muted} placeholder="Algebra, Calculus" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Hourly Rate ($)</Text>
                <TextInput value={hourlyRate} onChangeText={setHourlyRate} style={styles.input} placeholderTextColor={colors.muted} placeholder="45" keyboardType="numeric" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Bio</Text>
                <TextInput value={bio} onChangeText={setBio} style={[styles.input, styles.textarea]} placeholderTextColor={colors.muted} placeholder="A short bio about yourself" multiline />
              </View>
            </>
          )}

          {/* Student fields */}
          {role === "student" && (
            <>
              <Text style={styles.sectionLabel}>Student Info</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Grade / Level</Text>
                <TextInput value={gradeLevel} onChangeText={setGradeLevel} style={styles.input} placeholderTextColor={colors.muted} placeholder="Class 11, Undergrad" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Learning Goals</Text>
                <TextInput value={goals} onChangeText={setGoals} style={[styles.input, styles.textarea]} placeholderTextColor={colors.muted} placeholder="Exam prep, confidence building" multiline />
              </View>
            </>
          )}

          {/* School fields */}
          {role === "school" && (
            <>
              <Text style={styles.sectionLabel}>School Details</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Institution Name</Text>
                <TextInput value={institutionName} onChangeText={setInstitutionName} style={styles.input} placeholderTextColor={colors.muted} placeholder="Northview Academy" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Hiring Focus</Text>
                <TextInput value={hiringFocus} onChangeText={setHiringFocus} style={[styles.input, styles.textarea]} placeholderTextColor={colors.muted} placeholder="STEM, SAT prep" multiline />
              </View>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed, saved && styles.saveBtnSuccess]}
          >
            <Feather name={saved ? "check" : "save"} size={17} color="#fff" />
            <Text style={styles.saveBtnText}>{saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  success: string;
}) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 18,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      paddingTop: spacing.md,
    },
    sectionLabel: {
      fontSize: 11,
      color: colors.muted,
      fontFamily: typography.fontFamilyBold,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    field: { marginBottom: spacing.md },
    label: { fontSize: 12, color: colors.muted, marginBottom: spacing.xs },
    input: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.text,
      fontSize: 14,
    },
    textarea: { minHeight: 88, textAlignVertical: "top" },
    error: { color: "#EF4444", fontSize: 13, marginBottom: spacing.md },
    saveBtn: {
      marginTop: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },
    saveBtnPressed: { opacity: 0.85 },
    saveBtnSuccess: { backgroundColor: colors.success },
    saveBtnText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: typography.fontFamilyBold,
    },
  });
