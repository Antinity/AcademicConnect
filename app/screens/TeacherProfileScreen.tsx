import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { RatingStars } from "../components/RatingStars";
import { ReviewItem } from "../components/ReviewItem";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherProfile">;

export const TeacherProfileScreen = ({ route, navigation }: Props) => {
  const { teacherId } = route.params;
  const teacher = useAppStore((state) => state.getTeacherById(teacherId));
  const startConversation = useAppStore((state) => state.startConversation);
  const user = useAppStore((state) => state.user);

  if (!teacher) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Teacher not found.</Text>
      </SafeAreaView>
    );
  }

  const handleMessage = () => {
    const conversationId = startConversation(teacher.id);
    if (conversationId) {
      navigation.navigate("ChatThread", { conversationId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.titleText}>{teacher.title}</Text>
          <RatingStars rating={teacher.rating} />
          <Text style={styles.bio}>{teacher.bio}</Text>
          <View style={styles.subjectRow}>
            {teacher.subjects.map((subject) => (
              <View key={subject} style={styles.tag}>
                <Text style={styles.tagText}>{subject}</Text>
              </View>
            ))}
          </View>
          {user?.role !== "teacher" && (
            <Pressable onPress={handleMessage} style={styles.button}>
              <Text style={styles.buttonText}>Message</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {teacher.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  name: {
    fontSize: 22,
    fontFamily: typography.fontFamily,
    color: colors.text
  },
  titleText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    marginTop: spacing.md
  },
  subjectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md
  },
  tag: {
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.xs,
    marginBottom: spacing.xs
  },
  tagText: {
    fontSize: 12,
    color: colors.muted
  },
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    color: colors.text,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 20,
    color: colors.text
  }
});
