import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { useAppStore } from "./store/useAppStore";
import { useThemeColors } from "./theme/useTheme";

export default function App() {
  const mode = useAppStore((state) => state.themeMode);
  const colors = useThemeColors();

  return (
    <SafeAreaProvider>
      <StatusBar style={mode === "dark" ? "light" : "dark"} backgroundColor={colors.background} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
