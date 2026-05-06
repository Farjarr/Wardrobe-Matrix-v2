import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import {
  INNER_TYPES,
  OUTER_TYPES,
  BOTTOM_TYPES,
  SHOE_TYPES,
  ACCESSORY_TYPES,
  COLORS,
  isLightColor,
  type ClothingType,
  type ColorOption,
} from "@/data/clothingTypes";
import { HISTORY_KEY, type HistoryEntry } from "./history";

// ─── Step IDs ────────────────────────────────────────────────────────────────
type StepId =
  | "inner-type"
  | "inner-color"
  | "outer-type"
  | "outer-color"
  | "bottom-type"
  | "bottom-color"
  | "shoes-type"
  | "shoes-color"
  | "accessories"
  | "result";

const ALL_STEPS: StepId[] = [
  "inner-type",
  "inner-color",
  "outer-type",
  "outer-color",
  "bottom-type",
  "bottom-color",
  "shoes-type",
  "shoes-color",
  "accessories",
  "result",
];

// ─── State ────────────────────────────────────────────────────────────────────
type OutfitState = {
  innerType: ClothingType | null;
  innerColor: ColorOption | null;
  hasOuter: boolean;
  outerType: ClothingType | null;
  outerColor: ColorOption | null;
  bottomType: ClothingType | null;
  bottomColor: ColorOption | null;
  shoesType: ClothingType | null;
  shoesColor: ColorOption | null;
  noAccessories: boolean;
  accessories: ClothingType[];
};

type AnalysisResult = {
  summary: { role: string; color: string; category: string }[];
  boldCount: number;
  balanceCheck: { pass: boolean; reason: string };
  concept: string;
  suggestion: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getStepSequence(hasOuter: boolean): StepId[] {
  return ALL_STEPS.filter((s) => !(s === "outer-color" && !hasOuter));
}

function getStepLabel(step: StepId): string {
  switch (step) {
    case "inner-type":   return "What type of inner top?";
    case "inner-color":  return "What color is your inner top?";
    case "outer-type":   return "Adding an outer layer?";
    case "outer-color":  return "What color is your outer layer?";
    case "bottom-type":  return "What type of bottom?";
    case "bottom-color": return "What color are your bottoms?";
    case "shoes-type":   return "What type of shoes?";
    case "shoes-color":  return "What color are your shoes?";
    case "accessories":  return "Any accessories?";
    case "result":       return "Your Outfit Analysis";
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function TypeGrid({
  items,
  selected,
  onSelect,
}: {
  items: ClothingType[];
  selected: ClothingType | null;
  onSelect: (item: ClothingType) => void;
}) {
  return (
    <View style={grid.container}>
      {items.map((item) => {
        const active = selected?.id === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[grid.card, active && grid.cardActive]}
            onPress={() => { Haptics.selectionAsync(); onSelect(item); }}
            activeOpacity={0.75}
          >
            <Text style={[grid.cardText, active && grid.cardTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ColorGrid({
  selected,
  onSelect,
}: {
  selected: ColorOption | null;
  onSelect: (c: ColorOption) => void;
}) {
  return (
    <View style={cg.container}>
      {COLORS.map((c) => {
        const active = selected?.id === c.id;
        const light = isLightColor(c.id);
        return (
          <TouchableOpacity
            key={c.id}
            style={cg.item}
            onPress={() => { Haptics.selectionAsync(); onSelect(c); }}
            activeOpacity={0.8}
          >
            <View
              style={[
                cg.circle,
                { backgroundColor: c.hex },
                light && cg.circleBorder,
                active && cg.circleActive,
              ]}
            />
            <Text style={[cg.label, active && cg.labelActive]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AccessoryGrid({
  noAccessories,
  selected,
  onToggle,
  onSetNoAccessories,
}: {
  noAccessories: boolean;
  selected: ClothingType[];
  onToggle: (item: ClothingType) => void;
  onSetNoAccessories: (v: boolean) => void;
}) {
  const selectedIds = new Set(selected.map((a) => a.id));
  return (
    <View style={{ gap: 12 }}>
      {/* No accessories option */}
      <TouchableOpacity
        style={[styles.skipBtn, noAccessories && styles.skipBtnActive]}
        onPress={() => { Haptics.selectionAsync(); onSetNoAccessories(!noAccessories); }}
        activeOpacity={0.75}
      >
        <Feather
          name="x-circle"
          size={18}
          color={noAccessories ? colors.primary : colors.textMuted}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.skipText, noAccessories && styles.skipTextActive]}>
          No accessories
        </Text>
      </TouchableOpacity>

      {!noAccessories && (
        <>
          <Text style={styles.orLabel}>— or pick any —</Text>
          <View style={grid.container}>
            {ACCESSORY_TYPES.map((item) => {
              const active = selectedIds.has(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[grid.card, active && grid.cardActive]}
                  onPress={() => { Haptics.selectionAsync(); onToggle(item); }}
                  activeOpacity={0.75}
                >
                  {active && (
                    <Feather
                      name="check"
                      size={13}
                      color={colors.primary}
                      style={grid.checkIcon}
                    />
                  )}
                  <Text style={[grid.cardText, active && grid.cardTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const bg = category === "Bold" ? "#2563eb22" : category === "Dark" ? "#ffffff11" : "#22c55e22";
  const tc = category === "Bold" ? "#3b82f6" : category === "Dark" ? "#aaaaaa" : "#22c55e";
  return (
    <View style={[rs.badge, { backgroundColor: bg }]}>
      <Text style={[rs.badgeText, { color: tc }]}>{category}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function OutfitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [stepIndex, setStepIndex] = useState(0);
  const [outfit, setOutfit] = useState<OutfitState>({
    innerType: null, innerColor: null,
    hasOuter: false, outerType: null, outerColor: null,
    bottomType: null, bottomColor: null,
    shoesType: null, shoesColor: null,
    noAccessories: false, accessories: [],
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const stepSequence = getStepSequence(outfit.hasOuter);
  const currentStep = stepSequence[stepIndex];
  const isResultStep = currentStep === "result";
  const progressSteps = stepSequence.filter((s) => s !== "result");
  const progressIndex = progressSteps.indexOf(currentStep as StepId);
  const progress = isResultStep ? 1 : (progressIndex + 1) / progressSteps.length;

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case "inner-type":   return !!outfit.innerType;
      case "inner-color":  return !!outfit.innerColor;
      case "outer-type":   return true;
      case "outer-color":  return !!outfit.outerColor;
      case "bottom-type":  return !!outfit.bottomType;
      case "bottom-color": return !!outfit.bottomColor;
      case "shoes-type":   return !!outfit.shoesType;
      case "shoes-color":  return !!outfit.shoesColor;
      case "accessories":  return true;
      default: return true;
    }
  }, [currentStep, outfit]);

  const analyzeOutfit = useCallback(async (o: OutfitState) => {
    setLoading(true);
    setApiError(null);

    const items: { role: string; type: string; color: string }[] = [];
    if (o.innerType && o.innerColor)
      items.push({ role: "inner", type: o.innerType.label, color: o.innerColor.label });
    if (o.hasOuter && o.outerType && o.outerColor)
      items.push({ role: "outer", type: o.outerType.label, color: o.outerColor.label });
    if (o.bottomType && o.bottomColor)
      items.push({ role: "bottom", type: o.bottomType.label, color: o.bottomColor.label });
    if (o.shoesType && o.shoesColor)
      items.push({ role: "shoes", type: o.shoesType.label, color: o.shoesColor.label });
    if (!o.noAccessories) {
      for (const acc of o.accessories)
        items.push({ role: "accessory", type: acc.label, color: "neutral" });
    }

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
      const baseUrl = domain ? `https://${domain}` : "";
      const res = await fetch(`${baseUrl}/api/outfit/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = (await res.json()) as AnalysisResult;
      setAnalysis(data);

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        outfit: {
          inner: `${o.innerColor?.label ?? ""} ${o.innerType?.label ?? ""}`.trim(),
          outer: o.hasOuter && o.outerType && o.outerColor
            ? `${o.outerColor.label} ${o.outerType.label}`
            : undefined,
          bottom: `${o.bottomColor?.label ?? ""} ${o.bottomType?.label ?? ""}`.trim(),
          shoes: `${o.shoesColor?.label ?? ""} ${o.shoesType?.label ?? ""}`.trim(),
          accessories: o.noAccessories ? [] : o.accessories.map((a) => a.label),
        },
        analysis: {
          concept: data.concept,
          boldCount: data.boldCount,
          balanceCheck: data.balanceCheck,
          suggestion: data.suggestion,
          summary: data.summary,
        },
      };
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const existing: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing].slice(0, 50)));
    } catch {
      setApiError("Couldn't analyze outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const goNext = useCallback(async () => {
    if (!canProceed()) return;
    const nextIndex = stepIndex + 1;
    const nextStep = stepSequence[nextIndex];
    if (nextStep === "result") {
      await analyzeOutfit(outfit);
    }
    setStepIndex(nextIndex);
  }, [stepIndex, stepSequence, canProceed, outfit, analyzeOutfit]);

  const goBack = useCallback(() => {
    if (stepIndex === 0) router.back();
    else setStepIndex(stepIndex - 1);
  }, [stepIndex, router]);

  const goHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  const nextLabel = (): string => {
    const nextStep = stepSequence[stepIndex + 1];
    if (nextStep === "result" || currentStep === "accessories") return "Analyze Outfit";
    if (currentStep === "outer-type" && !outfit.hasOuter) return "Skip, Next";
    return "Continue";
  };

  const renderStep = () => {
    switch (currentStep) {
      case "inner-type":
        return <TypeGrid items={INNER_TYPES} selected={outfit.innerType}
          onSelect={(t) => setOutfit((o) => ({ ...o, innerType: t }))} />;
      case "inner-color":
        return <ColorGrid selected={outfit.innerColor}
          onSelect={(c) => setOutfit((o) => ({ ...o, innerColor: c }))} />;
      case "outer-type":
        return (
          <View style={{ gap: 0 }}>
            <TouchableOpacity
              style={[styles.skipBtn, !outfit.hasOuter && styles.skipBtnActive]}
              onPress={() => { Haptics.selectionAsync(); setOutfit((o) => ({ ...o, hasOuter: false, outerType: null, outerColor: null })); }}
              activeOpacity={0.75}
            >
              <Feather name="x-circle" size={18} color={!outfit.hasOuter ? colors.primary : colors.textMuted} style={{ marginRight: 8 }} />
              <Text style={[styles.skipText, !outfit.hasOuter && styles.skipTextActive]}>No outer layer</Text>
            </TouchableOpacity>
            <Text style={styles.orLabel}>— or pick one —</Text>
            <TypeGrid items={OUTER_TYPES} selected={outfit.outerType}
              onSelect={(t) => setOutfit((o) => ({ ...o, hasOuter: true, outerType: t }))} />
          </View>
        );
      case "outer-color":
        return <ColorGrid selected={outfit.outerColor}
          onSelect={(c) => setOutfit((o) => ({ ...o, outerColor: c }))} />;
      case "bottom-type":
        return <TypeGrid items={BOTTOM_TYPES} selected={outfit.bottomType}
          onSelect={(t) => setOutfit((o) => ({ ...o, bottomType: t }))} />;
      case "bottom-color":
        return <ColorGrid selected={outfit.bottomColor}
          onSelect={(c) => setOutfit((o) => ({ ...o, bottomColor: c }))} />;
      case "shoes-type":
        return <TypeGrid items={SHOE_TYPES} selected={outfit.shoesType}
          onSelect={(t) => setOutfit((o) => ({ ...o, shoesType: t }))} />;
      case "shoes-color":
        return <ColorGrid selected={outfit.shoesColor}
          onSelect={(c) => setOutfit((o) => ({ ...o, shoesColor: c }))} />;
      case "accessories":
        return (
          <AccessoryGrid
            noAccessories={outfit.noAccessories}
            selected={outfit.accessories}
            onToggle={(item) => setOutfit((o) => {
              const exists = o.accessories.find((a) => a.id === item.id);
              return { ...o, accessories: exists ? o.accessories.filter((a) => a.id !== item.id) : [...o.accessories, item] };
            })}
            onSetNoAccessories={(v) => setOutfit((o) => ({ ...o, noAccessories: v, accessories: [] }))}
          />
        );
      case "result":
        return <ResultView analysis={analysis} loading={loading} error={apiError} onRetry={() => analyzeOutfit(outfit)} />;
      default: return null;
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={goBack} style={styles.headerBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={26} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {!isResultStep && (
            <Text style={styles.stepCounter}>{progressIndex + 1} of {progressSteps.length}</Text>
          )}
          <Text style={styles.headerTitle}>{getStepLabel(currentStep)}</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Progress Bar */}
      {!isResultStep && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      {!isResultStep ? (
        <View style={[styles.footer, { paddingBottom: (Platform.OS === "web" ? 24 : insets.bottom) + 16 }]}>
          <TouchableOpacity
            style={[styles.continueBtn, !canProceed() && styles.continueBtnDisabled]}
            onPress={goNext}
            disabled={!canProceed()}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.continueBtnText}>{nextLabel()}</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.footer, { paddingBottom: (Platform.OS === "web" ? 24 : insets.bottom) + 16 }]}>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={goHome}
            activeOpacity={0.85}
          >
            <Feather name="home" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.continueBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Result View ─────────────────────────────────────────────────────────────
function ResultView({
  analysis, loading, error, onRetry,
}: {
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View style={rs.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={rs.loadingText}>Analyzing your outfit...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={rs.error}>
        <Feather name="alert-circle" size={32} color="#f87171" />
        <Text style={rs.errorText}>{error}</Text>
        <TouchableOpacity style={rs.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={rs.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!analysis) return null;

  return (
    <View style={rs.container}>
      <View style={[rs.balanceCard, analysis.balanceCheck.pass ? rs.balancePass : rs.balanceFail]}>
        <Feather name={analysis.balanceCheck.pass ? "check-circle" : "alert-circle"} size={20}
          color={analysis.balanceCheck.pass ? "#22c55e" : "#f97316"} />
        <Text style={[rs.balanceText, { color: analysis.balanceCheck.pass ? "#22c55e" : "#f97316" }]}>
          {analysis.balanceCheck.reason}
        </Text>
      </View>

      <View style={rs.card}>
        <Text style={rs.cardTitle}>Outfit</Text>
        {analysis.summary.map((piece, i) => (
          <View key={i} style={rs.summaryRow}>
            <Text style={rs.summaryRole}>{piece.role}</Text>
            <Text style={rs.summaryColor}>{piece.color}</Text>
            <CategoryBadge category={piece.category} />
          </View>
        ))}
      </View>

      <View style={rs.statsRow}>
        <View style={rs.statCard}>
          <Text style={rs.statLabel}>Bold Pieces</Text>
          <Text style={rs.statValue}>{analysis.boldCount}</Text>
        </View>
        <View style={rs.statCard}>
          <Text style={rs.statLabel}>Concept</Text>
          <Text style={[rs.statValue, { color: colors.primary, fontSize: 14 }]}>{analysis.concept}</Text>
        </View>
      </View>

      {analysis.suggestion ? (
        <View style={rs.suggestionCard}>
          <Feather name="zap" size={15} color={colors.primary} style={{ marginRight: 10, marginTop: 1 }} />
          <Text style={rs.suggestionText}>{analysis.suggestion}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingBottom: 12 },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  stepCounter: { fontFamily: "DMSans_400Regular", fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  headerTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: colors.text, textAlign: "center", letterSpacing: -0.3 },
  progressTrack: { height: 3, backgroundColor: colors.card, marginHorizontal: 20, borderRadius: 2, marginBottom: 20 },
  progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  skipBtn: {
    flexDirection: "row", alignItems: "center", padding: 14,
    backgroundColor: colors.card, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.cardBorder, marginBottom: 16,
  },
  skipBtnActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  skipText: { fontFamily: "DMSans_500Medium", fontSize: 15, color: colors.textMuted },
  skipTextActive: { color: colors.primary },
  orLabel: { fontFamily: "DMSans_400Regular", fontSize: 12, color: colors.textSubtle, textAlign: "center", marginBottom: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  continueBtn: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" },
  continueBtnDisabled: { opacity: 0.35 },
  continueBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 16, color: "#ffffff" },
  homeBtn: {
    backgroundColor: "#1a2744", borderRadius: 14, height: 52,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: colors.primary + "55",
  },
});

const grid = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: "48%", backgroundColor: colors.card, borderWidth: 1.5,
    borderColor: colors.cardBorder, borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 14,
    justifyContent: "center", minHeight: 52, position: "relative",
  },
  cardActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  cardText: { fontFamily: "DMSans_500Medium", fontSize: 14, color: colors.textMuted },
  cardTextActive: { color: colors.primary },
  checkIcon: { position: "absolute", top: 8, right: 10 },
});

// Color grid — centered
const cg = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
  },
  item: { width: 60, alignItems: "center", gap: 6 },
  circle: { width: 48, height: 48, borderRadius: 24 },
  circleBorder: { borderWidth: 1, borderColor: colors.cardBorder },
  circleActive: { borderWidth: 3, borderColor: colors.primary },
  label: { fontFamily: "DMSans_400Regular", fontSize: 10, color: colors.textMuted, textAlign: "center" },
  labelActive: { color: colors.primary, fontFamily: "DMSans_500Medium" },
});

const rs = StyleSheet.create({
  loading: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 16 },
  loadingText: { fontFamily: "DMSans_400Regular", fontSize: 14, color: colors.textMuted },
  error: { alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 },
  errorText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#f87171", textAlign: "center" },
  retryBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.cardBorder },
  retryText: { fontFamily: "DMSans_500Medium", fontSize: 14, color: colors.text },
  container: { gap: 12, paddingBottom: 20 },
  balanceCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12 },
  balancePass: { backgroundColor: "#22c55e18" },
  balanceFail: { backgroundColor: "#f9731618" },
  balanceText: { fontFamily: "DMSans_400Regular", fontSize: 13, flex: 1, lineHeight: 19 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: colors.radius, padding: 16, gap: 8 },
  cardTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: colors.textMuted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 4 },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 3 },
  summaryRole: { fontFamily: "DMSans_500Medium", fontSize: 13, color: colors.textMuted, width: 76, textTransform: "capitalize" },
  summaryColor: { fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.text, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontFamily: "DMSans_500Medium", fontSize: 11 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: colors.radius, padding: 14, alignItems: "center", gap: 4 },
  statLabel: { fontFamily: "DMSans_400Regular", fontSize: 11, color: colors.textMuted, letterSpacing: 0.3 },
  statValue: { fontFamily: "DMSans_700Bold", fontSize: 22, color: colors.text, textAlign: "center" },
  suggestionCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: `${colors.primary}12`, borderRadius: 12, padding: 14 },
  suggestionText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.text, flex: 1, lineHeight: 19 },
});
