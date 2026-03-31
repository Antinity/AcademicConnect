import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isMe: boolean;
}

export const MessageBubble = ({ text, timestamp, isMe }: MessageBubbleProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={[styles.row, isMe ? styles.right : styles.left]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>{text}</Text>
        <Text style={styles.time}>{new Date(timestamp).toLocaleTimeString().slice(0, 5)}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: {
  primary: string;
  card: string;
  border: string;
  text: string;
  muted: string;
}) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      marginBottom: spacing.sm
    },
    left: {
      justifyContent: "flex-start"
    },
    right: {
      justifyContent: "flex-end"
    },
    bubble: {
      maxWidth: "80%",
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm
    },
    bubbleMe: {
      backgroundColor: colors.primary
    },
    bubbleOther: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border
    },
    text: {
      fontSize: 14
    },
    textMe: {
      color: "#FFFFFF"
    },
    textOther: {
      color: colors.text
    },
    time: {
      fontSize: 11,
      color: colors.muted,
      marginTop: spacing.xs
    }
  });
