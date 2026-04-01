import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useThemeColors } from "../theme/useTheme";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.72;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: "EditProfile" | "AppSettings") => void;
}

export const Sidebar = ({ visible, onClose, onNavigate }: SidebarProps) => {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateX, backdropOpacity]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleNav = (route: "EditProfile" | "AppSettings") => {
    onClose();
    setTimeout(() => onNavigate(route), 220);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => logout(), 220);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name || "User"}</Text>
            <Text style={styles.userRole}>{user?.role || ""}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Feather name="x" size={18} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Nav items */}
        <View style={styles.nav}>
          <Pressable style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]} onPress={() => handleNav("EditProfile")}>
            <View style={styles.navIconWrap}>
              <Feather name="user" size={18} color={colors.primary} />
            </View>
            <View style={styles.navText}>
              <Text style={styles.navLabel}>Profile</Text>
              <Text style={styles.navSub}>Edit your information</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.muted} />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]} onPress={() => handleNav("AppSettings")}>
            <View style={styles.navIconWrap}>
              <Feather name="settings" size={18} color={colors.primary} />
            </View>
            <View style={styles.navText}>
              <Text style={styles.navLabel}>Settings</Text>
              <Text style={styles.navSub}>Theme & preferences</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Logout */}
        <Pressable style={({ pressed }) => [styles.navItem, styles.logoutItem, pressed && styles.navItemPressed]} onPress={handleLogout}>
          <View style={[styles.navIconWrap, styles.logoutIconWrap]}>
            <Feather name="log-out" size={18} color="#EF4444" />
          </View>
          <View style={styles.navText}>
            <Text style={styles.logoutLabel}>Logout</Text>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (colors: {
  background: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  chip: string;
  primary: string;
}) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sidebar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: SIDEBAR_WIDTH,
      backgroundColor: colors.card,
      paddingTop: 56,
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.chip,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 16,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 15,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    userRole: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
      textTransform: "capitalize",
    },
    closeBtn: {
      padding: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    nav: {
      paddingVertical: spacing.sm,
    },
    navItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    navItemPressed: {
      backgroundColor: colors.chip,
    },
    navIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.chip,
      alignItems: "center",
      justifyContent: "center",
    },
    navText: {
      flex: 1,
    },
    navLabel: {
      fontSize: 15,
      fontFamily: typography.fontFamilyBold,
      color: colors.text,
    },
    navSub: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    logoutItem: {
      marginTop: spacing.sm,
    },
    logoutIconWrap: {
      backgroundColor: "#FEE2E2",
    },
    logoutLabel: {
      fontSize: 15,
      fontFamily: typography.fontFamilyBold,
      color: "#EF4444",
    },
  });
