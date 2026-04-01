import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "./types";
import { AuthScreen } from "../screens/AuthScreen";
import { StudentHomeScreen } from "../screens/StudentHomeScreen";
import { TeacherHomeScreen } from "../screens/TeacherHomeScreen";
import { SchoolHomeScreen } from "../screens/SchoolHomeScreen";
import { TeacherProfileScreen } from "../screens/TeacherProfileScreen";
import { ChatListScreen } from "../screens/ChatListScreen";
import { ChatThreadScreen } from "../screens/ChatThreadScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";
import { AppSettingsScreen } from "../screens/AppSettingsScreen";
import { useThemeColors } from "../theme/useTheme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const user = useAppStore((state) => state.user);
  const mode = useAppStore((state) => state.themeMode);
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const colors = useThemeColors();

  return (
    <NavigationContainer
      theme={{
        dark: mode === "dark",
        colors: {
          background: colors.background,
          card: colors.surface,
          primary: colors.primary,
          text: colors.text,
          border: colors.border,
          notification: colors.accent
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Welcome" }} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <>
            {user.role === "teacher" && (
              <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} options={{ headerShown: false }} />
            )}
            {user.role === "school" && (
              <Stack.Screen name="SchoolHome" component={SchoolHomeScreen} options={{ headerShown: false }} />
            )}
            {user.role === "student" && (
              <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }} />
            )}
            <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: "Teacher Profile" }} />
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatThread" component={ChatThreadScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AppSettings" component={AppSettingsScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
