/**
 * Content for the "Make your plan" estimate wizard.
 * Edit the lists below to change the rooms, add-ons and packages that customers see.
 * (Package copy is generic placeholder text — adjust it to match what you really offer.)
 */

export const FLAT_STATUSES = [
  { id: "under_construction", label: "Under construction", hint: "The building is still being built" },
  { id: "ready_for_interior", label: "Ready for interior", hint: "Handed over and ready to design" },
  { id: "not_ready_yet", label: "Not ready yet", hint: "Planning ahead, no date yet" },
] as const;
export type FlatStatusId = (typeof FLAT_STATUSES)[number]["id"];

export type AddonSetKey = "bedroom" | "kitchen" | "bathroom" | "living" | "dining" | "balcony" | "workspace" | "hospitality" | "generic";

export const ADDON_SETS: Record<AddonSetKey, string[]> = {
  bedroom: ["TV unit", "Folding / sliding door", "Wardrobe", "Study table", "False ceiling", "Bed with storage"],
  kitchen: ["Kitchen cabinets", "Granite / quartz countertop", "Backsplash tiles", "Pantry unit", "Chimney & hob setup"],
  bathroom: ["Shower enclosure", "Vanity cabinet", "Mirror cabinet", "Accent wall tiles", "Bathtub"],
  living: ["TV wall unit", "False ceiling", "Feature wall panelling", "Display / showcase unit", "Folding / sliding door"],
  dining: ["Crockery unit", "Wall panelling", "Pendant lighting", "Dining table set"],
  balcony: ["Planter wall", "Folding / sliding door", "Deck flooring", "Outdoor seating"],
  workspace: ["Reception desk", "Workstation partitions", "False ceiling", "Acoustic panels", "Storage & filing"],
  hospitality: ["Headboard wall", "False ceiling", "Custom furniture", "Feature lighting", "Wall panelling"],
  generic: ["False ceiling", "Wall panelling", "Custom storage", "Lighting design"],
};

export type RoomPreset = { name: string; addons: AddonSetKey; defaultCount: number };

const HOME_ROOMS: RoomPreset[] = [
  { name: "Bedroom", addons: "bedroom", defaultCount: 0 },
  { name: "Kitchen", addons: "kitchen", defaultCount: 0 },
  { name: "Bathroom", addons: "bathroom", defaultCount: 0 },
  { name: "Living room", addons: "living", defaultCount: 0 },
  { name: "Dining room", addons: "dining", defaultCount: 0 },
  { name: "Balcony", addons: "balcony", defaultCount: 0 },
];
const OFFICE_ROOMS: RoomPreset[] = [
  { name: "Cabin", addons: "workspace", defaultCount: 0 },
  { name: "Open workstation area", addons: "workspace", defaultCount: 0 },
  { name: "Meeting room", addons: "workspace", defaultCount: 0 },
  { name: "Reception", addons: "workspace", defaultCount: 0 },
  { name: "Pantry", addons: "kitchen", defaultCount: 0 },
  { name: "Washroom", addons: "bathroom", defaultCount: 0 },
];
const HOSPITALITY_ROOMS: RoomPreset[] = [
  { name: "Guest room", addons: "hospitality", defaultCount: 0 },
  { name: "Lobby / lounge", addons: "hospitality", defaultCount: 0 },
  { name: "Restaurant / dining", addons: "dining", defaultCount: 0 },
  { name: "Kitchen", addons: "kitchen", defaultCount: 0 },
  { name: "Washroom", addons: "bathroom", defaultCount: 0 },
];

/** Room suggestions depend on the category the visitor picks in step 1 (matched by slug / name). */
export function roomPresetsFor(category: { slug: string; name: string } | null): RoomPreset[] {
  const key = `${category?.slug ?? ""} ${category?.name ?? ""}`.toLowerCase();
  if (/commercial|office|retail|work/.test(key)) return OFFICE_ROOMS;
  if (/hospitality|hotel|restaurant|resort|cafe/.test(key)) return HOSPITALITY_ROOMS;
  return HOME_ROOMS;
}

export function addonSetFor(roomName: string, presets: RoomPreset[]): string[] {
  const preset = presets.find((p) => p.name.toLowerCase() === roomName.toLowerCase());
  if (preset) return ADDON_SETS[preset.addons];
  const n = roomName.toLowerCase();
  if (/bed/.test(n)) return ADDON_SETS.bedroom;
  if (/kitchen|pantry/.test(n)) return ADDON_SETS.kitchen;
  if (/bath|wash|toilet|powder/.test(n)) return ADDON_SETS.bathroom;
  if (/living|drawing|lounge/.test(n)) return ADDON_SETS.living;
  if (/dining/.test(n)) return ADDON_SETS.dining;
  if (/balcony|terrace|veranda/.test(n)) return ADDON_SETS.balcony;
  return ADDON_SETS.generic;
}

export const PACKAGES = [
  {
    id: "standard",
    name: "Standard",
    tagline: "Smart, durable essentials",
    features: ["Layout planning & 3D visuals", "Quality laminate & paint finishes", "Standard hardware & fittings", "Dedicated site supervisor"],
  },
  {
    id: "superior",
    name: "Superior",
    tagline: "The best balance of look & value",
    popular: true,
    features: ["Everything in Standard", "Premium veneer & acrylic finishes", "Soft-close hardware, designer lighting", "Detailed material & colour consultation"],
  },
  {
    id: "signature",
    name: "Signature",
    tagline: "Fully bespoke, statement interiors",
    features: ["Everything in Superior", "Custom-designed furniture & joinery", "Imported materials & specialty finishes", "VR walkthrough before work begins"],
  },
] as const;
export type PackageId = (typeof PACKAGES)[number]["id"];

export const ROTATING_WORDS = ["Home", "Office", "Bedroom", "Kitchen", "Living room", "Restaurant"];
