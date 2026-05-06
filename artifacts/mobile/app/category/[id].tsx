import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
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
import { CATEGORIES } from "@/data/wardrobe";

const CATEGORY_TYPES: Record<string, ClothingType[]> = {
  "inner-tops": INNER_TYPES,
  "outer-tops": OUTER_TYPES,
  bottoms: BOTTOM_TYPES,
  shoes: SHOE_TYPES,
  accessories: ACCESSORY_TYPES,
};

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const category = CATEGORIES.find((c) => c.id === id);
  const types = CATEGORY_TYPES[id ?? ""] ?? [];
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filteredTypes = search.trim()
    ? types.filter((t) => t.label.toLowerCase().includes(search.toLowerCase()))
    : types;

  const filteredColors = search.trim() && selectedType
    ? COLORS.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : COLORS;

  const handleBack = () => {
    if (selectedColor) {
      setSelectedColor(null);
    } else if (selectedType) {
      setSelectedType(null);
      setSearch("");
    } else {
      router.back();
    }
  };

  const subTitle = selectedType
    ? selectedColor
      ? `${selectedType.label} · ${selectedColor.label}`
      : selectedType.label
    : null;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={26} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {category?.name ?? "Category"}
          </Text>
          {subTitle ? (
            <Text style={styles.headerSub} numberOfLines={1}>
              {subTitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerBtn} />
      </View>

      {/* Search bar — visible on type step and color step */}
      {!selectedColor && (
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedType ? "Search colors…" : "Search types…"}
            placeholderTextColor={colors.textSubtle}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {/* Breadcrumb strip */}
      <View style={styles.breadcrumb}>
        <Text style={[styles.crumb, !selectedType && styles.crumbActive]}>Type</Text>
        <Feather name="chevron-right" size={14} color={colors.textSubtle} style={styles.crumbArrow} />
        <Text style={[styles.crumb, selectedType && !selectedColor && styles.crumbActive]}>Color</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP 1: Type picker ── */}
        {!selectedType && (
          <>
            <Text style={styles.stepHint}>Tap a type to see colors</Text>
            <View style={styles.typeGrid}>
              {filteredTypes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.typeCard}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedType(t);
                    setSearch("");
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.typeLabel}>{t.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.textSubtle} />
                </TouchableOpacity>
              ))}

              {filteredTypes.length === 0 && (
                <View style={styles.empty}>
                  <Feather name="inbox" size={32} color={colors.textSubtle} />
                  <Text style={styles.emptyText}>No types match</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* ── STEP 2: Color picker ── */}
        {selectedType && (
          <>
            <Text style={styles.stepHint}>
              Pick the color of your {selectedType.label.toLowerCase()}
            </Text>
            <View style={styles.colorGrid}>
              {filteredColors.map((c) => {
                const active = selectedColor?.id === c.id;
                const light = isLightColor(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.colorItem}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedColor(active ? null : c);
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: c.hex },
                        light && styles.colorCircleLight,
                        active && styles.colorCircleActive,
                      ]}
                    />
                    <Text style={[styles.colorLabel, active && styles.colorLabelActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: colors.text,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.text,
    height: 44,
  },

  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  crumb: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: colors.textSubtle,
  },
  crumbActive: {
    color: colors.primary,
    fontFamily: "DMSans_600SemiBold",
  },
  crumbArrow: { marginHorizontal: 6 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  stepHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 14,
  },

  // Type grid — full width rows
  typeGrid: { gap: 10 },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  typeLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: colors.text,
  },

  empty: {
    alignItems: "center",
    paddingTop: 48,
    gap: 10,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: colors.textSubtle,
  },

  // Color grid — 5 per row
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  colorItem: {
    width: "17%",
    alignItems: "center",
    gap: 6,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorCircleLight: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  colorLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: colors.textMuted,
    textAlign: "center",
  },
  colorLabelActive: {
    color: colors.primary,
    fontFamily: "DMSans_500Medium",
  },
});
