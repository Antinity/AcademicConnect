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
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

const getHomeRoute = (role: "student" | "teacher" | "school") => {
  if (role === "teacher") {
    return "TeacherHome" as const;
  }
  if (role === "school") {
    return "SchoolHome" as const;
  }
  return "StudentHome" as const;
};

export const RootNavigator = () => {
  const user = useAppStore((state) => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text }
        }}
      >
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Welcome" }} />
        ) : (
          <>
            <Stack.Screen
              name={getHomeRoute(user.role)}
              component={
                user.role === "teacher"
                  ? TeacherHomeScreen
                  : user.role === "school"
                    ? SchoolHomeScreen
                    : StudentHomeScreen
              }
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TeacherProfile"
              component={TeacherProfileScreen}
              options={{ title: "Teacher Profile" }}
            />
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: "Chats" }} />
            <Stack.Screen
              name="ChatThread"
              component={ChatThreadScreen}
              options={{ title: "Conversation" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
