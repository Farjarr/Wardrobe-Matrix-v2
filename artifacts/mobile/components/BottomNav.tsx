import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isHome = pathname === "/" || pathname === "/index";
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const barHeight = 64 + bottomPad;

  return (
    <View style={[styles.container, { height: barHeight, paddingBottom: bottomPad }]}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/")}
        activeOpacity={0.7}
      >
        <Feather
          name="home"
          size={24}
          color={isHome ? colors.primary : colors.tabInactive}
        />
      </TouchableOpacity>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/outfit")}
      >
        <Feather name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* History */}
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.7}
        onPress={() => router.push("/history")}
      >
        <MaterialCommunityIcons
          name="hanger"
          size={26}
          color={!isHome ? colors.primary : colors.tabInactive}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.navBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 32,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
