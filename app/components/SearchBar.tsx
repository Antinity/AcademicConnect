import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
}

export const SearchBar = ({ value, placeholder, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md
  },
  input: {
    fontSize: 14,
    color: colors.text
  }
});
