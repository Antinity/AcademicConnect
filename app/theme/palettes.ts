export type ThemeMode = "light" | "dark";

export const lightColors = {
  background: "#F3F2F0",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#1D4E89",
  accent: "#E07A5F",
  text: "#1E1E1E",
  muted: "#6B6B6B",
  border: "#E3E1DD",
  chip: "#F0EAE3",
  success: "#2B9348"
};

export const darkColors = {
  background: "#111315",
  surface: "#171A1D",
  card: "#1E2226",
  primary: "#6EA8FF",
  accent: "#F2A07B",
  text: "#F7F7F7",
  muted: "#A3A6AA",
  border: "#2B2F33",
  chip: "#262B30",
  success: "#7BE495"
};

export const getColors = (mode: ThemeMode) => (mode === "dark" ? darkColors : lightColors);
