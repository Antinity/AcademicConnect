import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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

const OPEN_DURATION = 320;
const CLOSE_DURATION = 240;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: "EditProfile" | "AppSettings") => void;
}

const NAV_ITEMS = [
  { key: "profile" as const, icon: "user", label: "Profile", sub: "Edit your information" },
  { key: "settings" as const, icon: "settings", label: "Settings", sub: "Theme & preferences" },
];

export const Sidebar = ({ visible, onClose, onNavigate }: SidebarProps) => {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const colors = useThemeColors();
  const styles = createStyles(colors);

  // Core animations
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Staggered item animations (header + 2 items + logout = 4)
  const itemAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  // Track whether modal should stay mounted (for close animation)
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);

      // Reset item positions
      itemAnims.forEach((a) => a.setValue(0));

      Animated.parallel([
        // Panel slide in with spring
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        // Backdrop fade in
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: OPEN_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Staggered item fade+slide in
        Animated.stagger(
          60,
          itemAnims.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 70,
              friction: 12,
            })
          )
        ),
      ]).start();
    } else {
      // Animate out, then hide modal
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: CLOSE_DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: CLOSE_DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(itemAnims[0], {
          toValue: 0,
          duration: CLOSE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible]);

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleNav = (route: "EditProfile" | "AppSettings") => {
    onClose();
    setTimeout(() => onNavigate(route), CLOSE_DURATION + 20);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => logout(), CLOSE_DURATION + 20);
  };

  const itemStyle = (index: number) => ({
    opacity: itemAnims[index],
    transform: [
      {
        translateX: itemAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [-24, 0],
        }),
      },
    ],
  });

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Panel */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        {/* Header row — item 0 */}
        <Animated.View style={[styles.header, itemStyle(0)]}>
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
        </Animated.View>

        <View style={styles.divider} />

        {/* Nav items — items 1 & 2 */}
        <View style={styles.nav}>
          {NAV_ITEMS.map((item, idx) => (
            <Animated.View key={item.key} style={itemStyle(idx + 1)}>
              <Pressable
                style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
                onPress={() => handleNav(item.key === "profile" ? "EditProfile" : "AppSettings")}
              >
                <View style={styles.navIconWrap}>
                  <Feather name={item.icon as any} size={18} color={colors.primary} />
                </View>
                <View style={styles.navText}>
                  <Text style={styles.navLabel}>{item.label}</Text>
                  <Text style={styles.navSub}>{item.sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.muted} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Logout — item 3 */}
        <Animated.View style={itemStyle(3)}>
          <Pressable
            style={({ pressed }) => [styles.navItem, styles.logoutItem, pressed && styles.navItemPressed]}
            onPress={handleLogout}
          >
            <View style={[styles.navIconWrap, styles.logoutIconWrap]}>
              <Feather name="log-out" size={18} color="#EF4444" />
            </View>
            <View style={styles.navText}>
              <Text style={styles.logoutLabel}>Logout</Text>
            </View>
          </Pressable>
        </Animated.View>
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
      shadowOffset: { width: 6, height: 0 },
      shadowOpacity: 0.22,
      shadowRadius: 20,
      elevation: 14,
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
