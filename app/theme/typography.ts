import { Platform } from "react-native";

export const typography = {
  fontFamily: Platform.select({
    ios: "Avenir Next",
    android: "serif",
    default: "System"
  })
};
