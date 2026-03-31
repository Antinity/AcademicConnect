import React from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

export const ChatListScreen = ({ navigation }: Props) => {
  const conversations = useAppStore((state) => state.conversations);
  const user = useAppStore((state) => state.user);
  const getPersonName = useAppStore((state) => state.getPersonName);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
        renderItem={({ item }) => {
          const otherId = item.participantIds.find((id) => id !== user?.id) || "";
          const title = otherId ? getPersonName(otherId) : "Conversation";
          const lastMessage = item.messages[item.messages.length - 1];
          return (
            <Pressable
              onPress={() => navigation.navigate("ChatThread", { conversationId: item.id })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.row}>
                <Text style={styles.name}>{title}</Text>
                {lastMessage && <Text style={styles.time}>{lastMessage.timestamp.slice(11, 16)}</Text>}
              </View>
              <Text style={styles.preview} numberOfLines={1}>
                {lastMessage ? lastMessage.text : "Start the conversation"}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg
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
  name: {
    fontSize: 16,
    color: colors.text
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
