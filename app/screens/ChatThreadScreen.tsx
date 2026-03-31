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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <FlatList
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              timestamp={item.timestamp}
              isMe={item.senderId === user?.id}
            />
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
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
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
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
      backgroundColor: colors.card
    },
    input: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      color: colors.text
    },
    sendButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 14
    },
    empty: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: spacing.lg
    }
  });
