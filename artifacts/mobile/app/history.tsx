import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";

export type HistoryEntry = {
  id: string;
  savedAt: string;
  outfit: {
    inner: string;
    outer?: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
  analysis: {
    concept: string;
    boldCount: number;
    balanceCheck: { pass: boolean; reason: string };
    suggestion: string;
    summary: { role: string; color: string; category: string }[];
  };
};

export const HISTORY_KEY = "outfit_history";

export async function saveToHistory(entry: HistoryEntry) {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const existing: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const updated = [entry, ...existing].slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ConceptBadge({ concept }: { concept: string }) {
  return (
    <View style={card.conceptBadge}>
      <Text style={card.conceptText}>{concept}</Text>
    </View>
  );
}

function HistoryCard({ entry, onPress }: { entry: HistoryEntry; onPress: () => void }) {
  const { outfit, analysis } = entry;
  const outfitParts = [outfit.inner, outfit.bottom, outfit.shoes]
    .filter(Boolean)
    .join(" · ");

  return (
    <TouchableOpacity style={card.container} onPress={onPress} activeOpacity={0.8}>
      {/* Top row */}
      <View style={card.topRow}>
        <View style={card.dateRow}>
          <Feather name="clock" size={12} color={colors.textSubtle} />
          <Text style={card.date}>{formatDate(entry.savedAt)}</Text>
        </View>
        <View style={[
          card.statusDot,
          { backgroundColor: analysis.balanceCheck.pass ? "#22c55e" : "#f97316" }
        ]} />
      </View>

      {/* Concept + bold count */}
      <View style={card.conceptRow}>
        <ConceptBadge concept={analysis.concept} />
        <Text style={card.boldCount}>{analysis.boldCount} bold</Text>
      </View>

      {/* Outfit summary */}
      <Text style={card.outfitLine} numberOfLines={1}>{outfitParts}</Text>
      {outfit.outer && (
        <Text style={card.outfitLine2} numberOfLines={1}>+ {outfit.outer}</Text>
      )}
      {outfit.accessories.length > 0 && (
        <Text style={card.accessories} numberOfLines={1}>
          {outfit.accessories.join(", ")}
        </Text>
      )}

      {/* Balance check */}
      <View style={[card.balanceRow, analysis.balanceCheck.pass ? card.balancePass : card.balanceFail]}>
        <Feather
          name={analysis.balanceCheck.pass ? "check-circle" : "alert-circle"}
          size={13}
          color={analysis.balanceCheck.pass ? "#22c55e" : "#f97316"}
        />
        <Text
          style={[card.balanceText, { color: analysis.balanceCheck.pass ? "#22c55e" : "#f97316" }]}
          numberOfLines={2}
        >
          {analysis.balanceCheck.reason}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      setEntries(raw ? JSON.parse(raw) : []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const clearAll = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setEntries([]);
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={26} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        {entries.length > 0 ? (
          <TouchableOpacity style={styles.headerBtn} onPress={clearAll} activeOpacity={0.7}>
            <Feather name="trash-2" size={18} color={colors.textSubtle} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerBtn} />
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="clock" size={48} color={colors.textSubtle} />
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySubtitle}>
            Build your first outfit to see the analysis here
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push("/outfit")}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>Build an outfit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: (Platform.OS === "web" ? 24 : insets.bottom) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.count}>{entries.length} outfit{entries.length !== 1 ? "s" : ""} analyzed</Text>
          {entries.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} onPress={() => {}} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: colors.text,
    letterSpacing: -0.3,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4, gap: 12 },
  count: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
});

const card = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  date: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: colors.textSubtle,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  conceptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  conceptBadge: {
    backgroundColor: `${colors.primary}22`,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  conceptText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: colors.primary,
  },
  boldCount: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.textSubtle,
  },
  outfitLine: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.text,
  },
  outfitLine2: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
  },
  accessories: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.textSubtle,
    fontStyle: "italic",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 10,
    borderRadius: 8,
    marginTop: 2,
  },
  balancePass: { backgroundColor: "#22c55e12" },
  balanceFail: { backgroundColor: "#f9731612" },
  balanceText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
});
