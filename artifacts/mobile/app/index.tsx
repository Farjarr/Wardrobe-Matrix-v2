import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import colors from "@/constants/colors";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleBuildOutfit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/outfit");
  };

  return (
    <View style={styles.root}>
      <View style={[styles.content, { paddingTop: topPad + 20 }]}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingSmall}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>Fajar Ramadhan</Text>
        </View>

        {/* Majestic Card */}
        <TouchableOpacity
          onPress={handleBuildOutfit}
          activeOpacity={0.88}
          style={styles.cardWrapper}
        >
          <LinearGradient
            colors={["#1a2e5a", "#0f1829", "#141414"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Glow ring behind icon */}
            <View style={styles.iconGlow}>
              <View style={styles.iconRing}>
                <MaterialCommunityIcons
                  name="tshirt-crew-outline"
                  size={44}
                  color={colors.primary}
                />
              </View>
            </View>

            <Text style={styles.cardTitle}>Inner Tops</Text>
            <Text style={styles.cardSub}>
              Pick your fit. Get Korean fashion feedback.
            </Text>

            {/* CTA row */}
            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>Build outfit</Text>
              <View style={styles.ctaArrow}>
                <Feather name="arrow-right" size={14} color="#fff" />
              </View>
            </View>

            {/* Decorative dots */}
            <View style={styles.dots}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  greeting: {
    marginBottom: 28,
  },
  greetingSmall: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  greetingName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 30,
    color: colors.text,
    letterSpacing: -0.8,
  },
  cardWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2563eb44",
    padding: 28,
    alignItems: "center",
    minHeight: 280,
    justifyContent: "center",
    gap: 10,
  },
  iconGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#2563eb18",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: "#2563eb55",
    backgroundColor: "#2563eb22",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    color: "#ffffff",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  cardSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8899bb",
    textAlign: "center",
    lineHeight: 19,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  ctaText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: colors.primary,
  },
  ctaArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563eb33",
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
});
