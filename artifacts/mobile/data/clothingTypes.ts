export type ClothingType = {
  id: string;
  label: string;
};

export type ColorOption = {
  id: string;
  label: string;
  hex: string;
};

export const INNER_TYPES: ClothingType[] = [
  { id: "tshirt", label: "T-Shirt" },
  { id: "tank", label: "Tank Top" },
  { id: "polo", label: "Polo" },
  { id: "buttonup", label: "Button-Up Shirt" },
  { id: "henley", label: "Henley" },
  { id: "longsleeve", label: "Long Sleeve" },
  { id: "crewneck", label: "Crewneck" },
  { id: "sleeveless", label: "Sleeveless Shirt" },
];

export const OUTER_TYPES: ClothingType[] = [
  { id: "jacket", label: "Jacket" },
  { id: "hoodie", label: "Hoodie" },
  { id: "cardigan", label: "Cardigan" },
  { id: "overshirt", label: "Overshirt" },
  { id: "blazer", label: "Blazer" },
  { id: "denim", label: "Denim Jacket" },
  { id: "bomber", label: "Bomber Jacket" },
  { id: "coat", label: "Coat" },
  { id: "vest", label: "Vest" },
  { id: "flannel", label: "Flannel Shirt" },
];

export const BOTTOM_TYPES: ClothingType[] = [
  { id: "jeans", label: "Jeans" },
  { id: "chinos", label: "Chinos" },
  { id: "shorts", label: "Shorts" },
  { id: "sweatpants", label: "Sweatpants" },
  { id: "trousers", label: "Trousers" },
  { id: "joggers", label: "Joggers" },
  { id: "cargo", label: "Cargo Pants" },
  { id: "slacks", label: "Dress Pants" },
];

export const SHOE_TYPES: ClothingType[] = [
  { id: "sneakers", label: "Sneakers" },
  { id: "boots", label: "Boots" },
  { id: "loafers", label: "Loafers" },
  { id: "sandals", label: "Sandals" },
  { id: "derby", label: "Derby Shoes" },
  { id: "running", label: "Running Shoes" },
  { id: "chelsea", label: "Chelsea Boots" },
  { id: "slides", label: "Slides" },
];

export const ACCESSORY_TYPES: ClothingType[] = [
  { id: "watch", label: "Watch" },
  { id: "belt", label: "Belt" },
  { id: "cap", label: "Cap / Hat" },
  { id: "bag", label: "Bag" },
  { id: "socks", label: "Socks" },
  { id: "sunglasses", label: "Sunglasses" },
  { id: "necklace", label: "Necklace" },
  { id: "bracelet", label: "Bracelet" },
  { id: "ring", label: "Ring" },
  { id: "scarf", label: "Scarf" },
];

export const COLORS: ColorOption[] = [
  { id: "white", label: "White", hex: "#f5f5f5" },
  { id: "cream", label: "Cream", hex: "#f0ebe0" },
  { id: "beige", label: "Beige", hex: "#d4b896" },
  { id: "tan", label: "Tan", hex: "#c8a46e" },
  { id: "khaki", label: "Khaki", hex: "#c3a47d" },
  { id: "sand", label: "Sand", hex: "#d9c4a7" },
  { id: "olive", label: "Olive", hex: "#6b7c47" },
  { id: "camel", label: "Camel", hex: "#b8863b" },
  { id: "brown", label: "Brown", hex: "#92400e" },
  { id: "rust", label: "Rust", hex: "#b45309" },
  { id: "terracotta", label: "Terracotta", hex: "#c2603a" },
  { id: "gray", label: "Gray", hex: "#9ca3af" },
  { id: "charcoal", label: "Charcoal", hex: "#374151" },
  { id: "navy", label: "Navy", hex: "#1e3a5f" },
  { id: "black", label: "Black", hex: "#1a1a1a" },
  { id: "sky-blue", label: "Sky Blue", hex: "#7dd3fc" },
  { id: "blue", label: "Blue", hex: "#3b82f6" },
  { id: "royal-blue", label: "Royal Blue", hex: "#1d4ed8" },
  { id: "teal", label: "Teal", hex: "#14b8a6" },
  { id: "green", label: "Green", hex: "#22c55e" },
  { id: "emerald", label: "Emerald", hex: "#059669" },
  { id: "mustard", label: "Mustard", hex: "#ca8a04" },
  { id: "yellow", label: "Yellow", hex: "#fbbf24" },
  { id: "orange", label: "Orange", hex: "#f97316" },
  { id: "red", label: "Red", hex: "#ef4444" },
  { id: "burgundy", label: "Burgundy", hex: "#7f1d1d" },
  { id: "purple", label: "Purple", hex: "#a855f7" },
  { id: "pink", label: "Pink", hex: "#ec4899" },
  { id: "coral", label: "Coral", hex: "#fb7185" },
  { id: "denim", label: "Denim Blue", hex: "#4a6fa5" },
];

const LIGHT_COLORS = new Set(["white", "cream", "beige", "tan", "khaki", "sand", "sky-blue", "yellow"]);
export const isLightColor = (id: string) => LIGHT_COLORS.has(id);
