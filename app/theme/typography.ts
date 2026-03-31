import { Platform } from "react-native";

export const typography = {
  fontFamily: Platform.select({
    ios: "Helvetica Neue",
    android: "sans-serif",
    default: "System"
  }),
  fontFamilyBold: Platform.select({
    ios: "Helvetica Neue Medium",
    android: "sans-serif-medium",
    default: "System"
  })
};
