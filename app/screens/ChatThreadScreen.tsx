import React, { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageBubble } from "../components/MessageBubble";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";

type Props = NativeStackScreenProps<RootStackParamList, "ChatThread">;

export const ChatThreadScreen = ({ route }: Props) => {
  const { conversationId } = route.params;
  const [draft, setDraft] = useState("");
  const user = useAppStore((state) => state.user);
  const conversations = useAppStore((state) => state.conversations);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const getPersonName = useAppStore((state) => state.getPersonName);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const conversation = useMemo(
    () => conversations.find((conv) => conv.id === conversationId),
    [conversations, conversationId]
  );

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>Conversation not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    sendMessage(conversationId, draft);
    setDraft("");
  };

  const otherId = conversation.participantIds.find((id) => id !== user?.id) || "";
  const title = otherId ? getPersonName(otherId) : "Conversation";
  const initials = title
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSubtitle}>Active now</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Feather name="phone" size={16} color={colors.muted} />
            <Feather name="video" size={16} color={colors.muted} />
          </View>
        </View>
        <FlatList
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              timestamp={item.timestamp}
              isMe={item.senderId === user?.id}
            />
          )}
        />
        <View style={styles.inputRow}>
          <Pressable style={styles.iconButton}>
            <Feather name="plus" size={16} color={colors.muted} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable style={styles.iconButton}>
            <Feather name="smile" size={16} color={colors.muted} />
          </Pressable>
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Feather name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: {
  background: string;
  border: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  chip: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md
    },
    headerTitle: {
      fontSize: 16,
      color: colors.text
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: colors.chip,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    avatarText: {
      fontSize: 12,
      color: colors.text
    },
    listContent: {
      padding: spacing.lg
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
      gap: spacing.sm
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card
    },
    input: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.text
    },
    sendButton: {
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center"
    },
    empty: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: spacing.lg
    }
  });
