import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
}

export const SearchBar = ({ value, placeholder, onChangeText }: SearchBarProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Feather name="search" size={16} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search"}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
};

const createStyles = (colors: { card: string; border: string; text: string }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    },
    input: {
      fontSize: 14,
      color: colors.text,
      flex: 1
    }
  });
