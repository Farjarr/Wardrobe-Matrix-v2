export type Category = {
  id: string;
  name: string;
  icon: string;
  iconLib: "MaterialCommunityIcons" | "Ionicons";
  iconColor: string;
  count: number;
};

export type ClothingItem = {
  id: string;
  categoryId: string;
  name: string;
  color: string;
  isFavorite: boolean;
};

export const CATEGORIES: Category[] = [
  {
    id: "inner-tops",
    name: "Inner Tops",
    icon: "tshirt-crew-outline",
    iconLib: "MaterialCommunityIcons",
    iconColor: "#3b82f6",
    count: 8,
  },
  {
    id: "outer-tops",
    name: "Outer Tops",
    icon: "hanger",
    iconLib: "MaterialCommunityIcons",
    iconColor: "#f97316",
    count: 6,
  },
  {
    id: "bottoms",
    name: "Bottoms",
    icon: "human-male",
    iconLib: "MaterialCommunityIcons",
    iconColor: "#a855f7",
    count: 7,
  },
  {
    id: "shoes",
    name: "Shoes",
    icon: "shoe-formal",
    iconLib: "MaterialCommunityIcons",
    iconColor: "#22c55e",
    count: 5,
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "watch",
    iconLib: "MaterialCommunityIcons",
    iconColor: "#14b8a6",
    count: 9,
  },
];

export const CLOTHING_ITEMS: ClothingItem[] = [
  // Inner Tops
  { id: "it1", categoryId: "inner-tops", name: "White", color: "#f5f5f5", isFavorite: true },
  { id: "it2", categoryId: "inner-tops", name: "Navy", color: "#1e3a5f", isFavorite: false },
  { id: "it3", categoryId: "inner-tops", name: "Black", color: "#1a1a1a", isFavorite: true },
  { id: "it4", categoryId: "inner-tops", name: "Gray", color: "#6b7280", isFavorite: false },
  { id: "it5", categoryId: "inner-tops", name: "Sky Blue", color: "#7dd3fc", isFavorite: true },
  { id: "it6", categoryId: "inner-tops", name: "Olive", color: "#6b7c47", isFavorite: false },
  { id: "it7", categoryId: "inner-tops", name: "Burgundy", color: "#7f1d1d", isFavorite: false },
  { id: "it8", categoryId: "inner-tops", name: "Mustard", color: "#ca8a04", isFavorite: true },

  // Outer Tops
  { id: "ot1", categoryId: "outer-tops", name: "Black", color: "#1a1a1a", isFavorite: true },
  { id: "ot2", categoryId: "outer-tops", name: "Camel", color: "#c8a46e", isFavorite: false },
  { id: "ot3", categoryId: "outer-tops", name: "Navy", color: "#1e3a5f", isFavorite: true },
  { id: "ot4", categoryId: "outer-tops", name: "Olive", color: "#6b7c47", isFavorite: false },
  { id: "ot5", categoryId: "outer-tops", name: "Charcoal", color: "#374151", isFavorite: false },
  { id: "ot6", categoryId: "outer-tops", name: "Denim", color: "#4a6fa5", isFavorite: true },

  // Bottoms
  { id: "b1", categoryId: "bottoms", name: "Black", color: "#1a1a1a", isFavorite: true },
  { id: "b2", categoryId: "bottoms", name: "Navy", color: "#1e3a5f", isFavorite: false },
  { id: "b3", categoryId: "bottoms", name: "Khaki", color: "#c3a47d", isFavorite: true },
  { id: "b4", categoryId: "bottoms", name: "Gray", color: "#6b7280", isFavorite: false },
  { id: "b5", categoryId: "bottoms", name: "Olive", color: "#6b7c47", isFavorite: false },
  { id: "b6", categoryId: "bottoms", name: "White", color: "#f5f5f5", isFavorite: false },
  { id: "b7", categoryId: "bottoms", name: "Denim", color: "#4a6fa5", isFavorite: true },

  // Shoes
  { id: "s1", categoryId: "shoes", name: "White", color: "#f5f5f5", isFavorite: true },
  { id: "s2", categoryId: "shoes", name: "Black", color: "#1a1a1a", isFavorite: true },
  { id: "s3", categoryId: "shoes", name: "Brown", color: "#92400e", isFavorite: false },
  { id: "s4", categoryId: "shoes", name: "Tan", color: "#d4a76a", isFavorite: true },
  { id: "s5", categoryId: "shoes", name: "Gray", color: "#6b7280", isFavorite: false },

  // Accessories
  { id: "ac1", categoryId: "accessories", name: "Gold", color: "#d4af37", isFavorite: true },
  { id: "ac2", categoryId: "accessories", name: "Silver", color: "#c0c0c0", isFavorite: false },
  { id: "ac3", categoryId: "accessories", name: "Black", color: "#1a1a1a", isFavorite: true },
  { id: "ac4", categoryId: "accessories", name: "Brown", color: "#92400e", isFavorite: false },
  { id: "ac5", categoryId: "accessories", name: "Navy", color: "#1e3a5f", isFavorite: false },
  { id: "ac6", categoryId: "accessories", name: "Green", color: "#166534", isFavorite: true },
  { id: "ac7", categoryId: "accessories", name: "Red", color: "#991b1b", isFavorite: false },
  { id: "ac8", categoryId: "accessories", name: "Camel", color: "#c8a46e", isFavorite: false },
  { id: "ac9", categoryId: "accessories", name: "Rose", color: "#be185d", isFavorite: true },
];
