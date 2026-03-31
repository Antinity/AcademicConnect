import { useAppStore } from "../store/useAppStore";
import { getColors } from "./palettes";

export const useThemeColors = () => {
  const mode = useAppStore((state) => state.themeMode);
  return getColors(mode);
};
