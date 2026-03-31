import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";
import { typography } from "../theme/typography";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchBar } from "../components/SearchBar";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

export const ChatListScreen = ({ navigation }: Props) => {
  const conversations = useAppStore((state) => state.conversations);
  const user = useAppStore((state) => state.user);
  const getPersonName = useAppStore((state) => state.getPersonName);
  const [query, setQuery] = useState("");
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return conversations;
    }
    return conversations.filter((item) => {
      const otherId = item.participantIds.find((id) => id !== user?.id) || "";
      const name = otherId ? getPersonName(otherId) : "Conversation";
      return name.toLowerCase().includes(normalized);
    });
  }, [conversations, getPersonName, query, user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Stay in sync with your network.</Text>
        </View>
        <ThemeToggle />
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search conversations" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
        renderItem={({ item }) => {
          const otherId = item.participantIds.find((id) => id !== user?.id) || "";
          const title = otherId ? getPersonName(otherId) : "Conversation";
          const lastMessage = item.messages[item.messages.length - 1];
          const initials = title
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <Pressable
              onPress={() => navigation.navigate("ChatThread", { conversationId: item.id })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.messageBody}>
                  <View style={styles.row}>
                    <Text style={styles.name}>{title}</Text>
                    {lastMessage && <Text style={styles.time}>{lastMessage.timestamp.slice(11, 16)}</Text>}
                  </View>
                  <Text style={styles.preview} numberOfLines={1}>
                    {lastMessage ? lastMessage.text : "Start the conversation"}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.muted} />
              </View>
            </Pressable>
          );
        }}
      />
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
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg
    },
    header: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    title: {
      fontSize: 24,
      fontFamily: typography.fontFamilyBold,
      color: colors.text
    },
    subtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: spacing.xs
    },
    listContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xl
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm
    },
    pressed: {
      opacity: 0.85
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.xs
    },
    cardRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: colors.chip,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    avatarText: {
      fontSize: 13,
      color: colors.text,
      fontFamily: typography.fontFamilyBold
    },
    messageBody: {
      flex: 1
    },
    name: {
      fontSize: 16,
      color: colors.text,
      fontFamily: typography.fontFamilyBold
    },
    time: {
      fontSize: 12,
      color: colors.muted
    },
    preview: {
      fontSize: 13,
      color: colors.muted
    },
    empty: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: spacing.lg
    }
  });
