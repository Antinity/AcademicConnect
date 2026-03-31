import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { useAppStore } from "./store/useAppStore";
import { useThemeColors } from "./theme/useTheme";

export default function App() {
  const mode = useAppStore((state) => state.themeMode);
  const colors = useThemeColors();
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0.96);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true
    }).start();
  }, [fade, mode]);

  return (
    <SafeAreaProvider>
      <StatusBar style={mode === "dark" ? "light" : "dark"} backgroundColor={colors.background} />
      <Animated.View style={{ flex: 1, opacity: fade }}>
        <RootNavigator />
      </Animated.View>
    </SafeAreaProvider>
  );
}
