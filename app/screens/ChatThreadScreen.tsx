import React, { useMemo, useState, useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageBubble } from "../components/MessageBubble";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { useThemeColors } from "../theme/useTheme";
import { typography } from "../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "ChatThread">;

export const ChatThreadScreen = ({ route, navigation }: Props) => {
  const { conversationId } = route.params;
  const [draft, setDraft] = useState("");
  const user = useAppStore((state) => state.user);
  const conversations = useAppStore((state) => state.conversations);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const getPersonName = useAppStore((state) => state.getPersonName);
  const fetchMessages = useAppStore((state) => state.fetchMessages);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    fetchMessages(conversationId);
  }, [fetchMessages, conversationId]);

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

  const handleEmoji = () => {
    setDraft((value) => `${value}🙂`);
  };

  const handleAttachment = () => {
    setDraft((value) => `${value}${value ? " " : ""}[Attachment]`);
  };

  const handleCall = () => {
    sendMessage(conversationId, "Started a call");
  };

  const handleVideo = () => {
    sendMessage(conversationId, "Started a video call");
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
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="chevron-left" size={20} color={colors.text} />
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSubtitle}>Active now</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={handleCall} style={styles.headerIcon}>
              <Feather name="phone" size={16} color={colors.muted} />
            </Pressable>
            <Pressable onPress={handleVideo} style={styles.headerIcon}>
              <Feather name="video" size={16} color={colors.muted} />
            </Pressable>
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
          <Pressable style={styles.iconButton} onPress={handleAttachment}>
            <Feather name="paperclip" size={16} color={colors.muted} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable style={styles.iconButton} onPress={handleEmoji}>
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
    backButton: {
      width: 32,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center"
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    headerTitle: {
      fontSize: 16,
      color: colors.text,
      fontFamily: typography.fontFamilyBold
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
