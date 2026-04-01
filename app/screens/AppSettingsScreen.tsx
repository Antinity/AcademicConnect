import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";

type Props = NativeStackScreenProps<RootStackParamList, "AppSettings">;

export const AppSettingsScreen = ({ navigation }: Props) => {
  const themeMode = useAppStore((state) => state.themeMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const isDark = themeMode === "dark";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Appearance</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingIconWrap}>
            <Feather name={isDark ? "moon" : "sun"} size={18} color={colors.primary} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>{isDark ? "Dark" : "Light"} mode</Text>
          </View>
          {/* Toggle pill */}
          <Pressable
            onPress={toggleTheme}
            style={[styles.pill, isDark && styles.pillActive]}
            hitSlop={8}
          >
            <View style={[styles.pillThumb, isDark && styles.pillThumbActive]} />
          </Pressable>
        </View>
      </View>
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
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    sectionLabel: {
      fontSize: 11,
      color: colors.muted,
      fontFamily: typography.fontFamilyBold,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: spacing.md,
    },
    settingCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    settingIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.chip,
      alignItems: "center",
      justifyContent: "center",
    },
    settingText: { flex: 1 },
    settingLabel: {
      fontSize: 15,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    settingValue: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    pill: {
      width: 48,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.chip,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      paddingHorizontal: 3,
    },
    pillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pillThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
    },
    pillThumbActive: {
      alignSelf: "flex-end",
    },
  });
