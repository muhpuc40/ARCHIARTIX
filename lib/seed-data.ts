/**
 * Sample catalogue content.
 *
 * Two jobs:
 *  1. Offline fallback — the site renders fully before Supabase is connected.
 *  2. Source for supabase/seed.sql (`npm run seed:sql`), so the database starts
 *     with the same content.
 *
 * ⚠ ALL OF THIS IS PLACEHOLDER COPY. Replace the projects and products with
 * your real work (Supabase Table Editor, or the admin panel for products).
 */
import type { Category, Product, Project, Service, Testimonial } from "@/lib/types";

const uid = (prefix: string, n: number) => `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`;
const CAT = "0c0c0c0c";
const PROJ = "0b0b0b0b";
const SERV = "05e5e5e5";
const PROD = "0a0a0a0a";

/* ------------------------------ categories ------------------------------ */
export const seedCategories: Category[] = [
  { id: uid(CAT, 1), name: "Residential", slug: "residential", kind: "project", parent_id: null },
  { id: uid(CAT, 2), name: "Commercial", slug: "commercial", kind: "project", parent_id: null },
  { id: uid(CAT, 3), name: "Hospitality", slug: "hospitality", kind: "project", parent_id: null },
  { id: uid(CAT, 11), name: "Lighting", slug: "lighting", kind: "product", parent_id: null },
  { id: uid(CAT, 12), name: "Furniture", slug: "furniture", kind: "product", parent_id: null },
  { id: uid(CAT, 13), name: "Décor & Accessories", slug: "decor", kind: "product", parent_id: null },
  { id: uid(CAT, 14), name: "Surfaces & Materials", slug: "materials", kind: "product", parent_id: null },
  { id: uid(CAT, 15), name: "Studio & Model Making", slug: "studio-tools", kind: "product", parent_id: null },
];

const catRef = (slug: string) => {
  const c = seedCategories.find((x) => x.slug === slug)!;
  return { id: c.id, ref: { name: c.name, slug: c.slug } };
};

/* -------------------------------- projects -------------------------------- */
type P = [slug: string, title: string, cat: string, location: string, year: number, area: number, featured: boolean, description: string];
const projectRows: P[] = [
  ["lakeview-duplex", "Lakeview Duplex", "residential", "Bashundhara, Dhaka", 2025, 3400, true,
    "A double-height living volume opens to a lake-facing terrace. Warm oak joinery, honed stone and layered lighting keep a large family home calm and intimate."],
  ["courtyard-villa", "Courtyard Villa", "residential", "Khulshi, Chattogram", 2024, 4200, true,
    "Rooms wrap around a planted courtyard that pulls light and cross-breezes through the house — a modern take on the traditional Bengali uthan."],
  ["minimal-apartment", "Minimal Apartment", "residential", "Dhanmondi, Dhaka", 2025, 1450, false,
    "A compact flat re-planned around hidden storage and a single continuous material palette, so 1,450 sq ft reads as generous and uncluttered."],
  ["atelier-office", "Atelier Office", "commercial", "Gulshan, Dhaka", 2025, 6800, true,
    "A creative agency's headquarters: open studio floors, acoustic timber baffles and a double-sided library that doubles as a meeting space."],
  ["flagship-store", "Brand Flagship Store", "commercial", "Agrabad, Chattogram", 2024, 2900, false,
    "A fashion flagship with a sculptural arched entrance, backlit display niches and a tonal palette that lets the product take centre stage."],
  ["coworking-hub", "Co-working Hub", "commercial", "Uttara, Dhaka", 2023, 5200, false,
    "Flexible work zones, phone booths and a sunlit café, designed for acoustics first and finished with durable, easy-care surfaces."],
  ["boutique-hotel-lobby", "Boutique Hotel Lobby", "hospitality", "Zindabazar, Sylhet", 2025, 3100, true,
    "A lobby that welcomes guests with tea-garden greens, hand-finished plaster and a statement brass reception desk."],
  ["rooftop-restaurant", "Rooftop Restaurant", "hospitality", "Banani, Dhaka", 2024, 4600, false,
    "An all-weather rooftop dining space with a retractable canopy, warm festoon lighting and a skyline-facing open kitchen."],
  ["riverside-suites", "Riverside Resort Suites", "hospitality", "Barishal", 2023, 7800, false,
    "Twelve river-view suites using local brick, cane and bamboo detailing, planned for passive cooling and low energy use."],
];

export const seedProjects: Project[] = projectRows.map(([slug, title, cat, location, year, area, featured, description], i) => ({
  id: uid(PROJ, i + 1),
  title,
  slug,
  category_id: catRef(cat).id,
  category: catRef(cat).ref,
  description,
  location,
  year,
  area_sqft: area,
  cover_image_url: null,
  images: [],
  featured,
}));

/* -------------------------------- services -------------------------------- */
export const seedServices: Service[] = [
  {
    id: uid(SERV, 1),
    title: "Interior Design",
    slug: "interior-design",
    summary: "Rooms that feel like you — planned down to the last switch and curtain rail.",
    description:
      "We design interiors around the way you actually live and work. Every project starts with a conversation about routines, budget and taste, then moves through layout, materials, lighting and furniture — with 3D visuals so you can see the result before a single wall is touched.\n\nThe outcome is a complete, coordinated design package: drawings your contractor can price, a materials schedule you can approve, and a styling plan that makes the finished space feel considered rather than assembled.",
    image_url: null,
    features: [
      "Space planning and layout options",
      "Mood boards and material palettes",
      "Photo-realistic 3D visualisation",
      "Custom furniture and joinery design",
      "Lighting, electrical and ceiling plans",
      "Final styling and dressing",
    ],
    sort_order: 1,
  },
  {
    id: uid(SERV, 2),
    title: "Architectural Design",
    slug: "architectural-design",
    summary: "Buildings shaped by site, climate and the people who will use them.",
    description:
      "From a single home to a mixed-use building, our architectural service covers feasibility through to construction drawings. We design for Bangladesh's climate — shade, cross-ventilation and monsoon-ready detailing — so buildings feel good and cost less to run.\n\nWe coordinate with structural and MEP engineers and support you through the approvals process, so your design arrives on site complete, buildable and on budget.",
    image_url: null,
    features: [
      "Site analysis and feasibility studies",
      "Concept and schematic design",
      "Working drawings and approvals support",
      "Structural and MEP coordination",
      "Façade and landscape design",
      "Passive-cooling and sustainability strategy",
    ],
    sort_order: 2,
  },
  {
    id: uid(SERV, 3),
    title: "Turnkey Execution",
    slug: "turnkey-execution",
    summary: "One accountable team from first sketch to handover keys.",
    description:
      "Turnkey means a single point of responsibility. We price the project transparently, manage procurement and contractors, supervise the site daily and hand over a finished space — so you are not coordinating a dozen vendors yourself.\n\nYou get weekly progress reports, quality checks at every milestone and a clear handover with after-care, so what was designed is exactly what gets built.",
    image_url: null,
    features: [
      "Fixed-scope bill of quantities and clear budgeting",
      "Procurement and vendor management",
      "Daily site supervision by our engineers",
      "Quality checks at every milestone",
      "Weekly progress reports",
      "Handover and after-care",
    ],
    sort_order: 3,
  },
];

/* -------------------------------- products -------------------------------- */
type Pr = [slug: string, name: string, cat: string, price: number, stock: number, description: string];
const productRows: Pr[] = [
  ["brass-arc-floor-lamp", "Brass Arc Floor Lamp", "lighting", 18500, 6,
    "A sweeping brushed-brass arc with a marble base and a linen-finish shade. Reaches over a sofa or reading chair without needing a ceiling point. E27 fitting, 2 m cable with inline switch."],
  ["walnut-cantilever-coffee-table", "Walnut Cantilever Coffee Table", "furniture", 32000, 3,
    "A solid walnut top floats on a slim powder-coated steel cantilever frame. Hand-oiled finish, 110 × 55 cm, built to order in our partner workshop."],
  ["minimal-pendant-light-set", "Minimal Pendant Light Set (3 pcs)", "lighting", 12400, 10,
    "Three opal-glass globe pendants on adjustable fabric cords. Ideal over a dining table or kitchen island; bulbs not included."],
  ["handwoven-jute-rug", "Handwoven Jute Area Rug, 5 × 8 ft", "decor", 14900, 8,
    "Natural jute, hand-woven by artisans in a herringbone pattern. Adds texture and warmth to living rooms and bedrooms. Spot-clean only."],
  ["fluted-wood-wall-panel", "Fluted Wood Wall Panel (per panel)", "materials", 4800, 40,
    "Pre-finished fluted oak-veneer panel, 2400 × 600 mm. Mounts on a simple batten frame — a quick way to add depth to feature walls and TV units."],
  ["architects-scale-ruler-set", "Architect's Scale Ruler & Drafting Set", "studio-tools", 3600, 15,
    "Triangular architect's scale (1:20–1:500), 30 cm engineer's rule, compass, circle template and eraser shield — a complete desk-side drafting kit."],
  ["terrazzo-tray-planter-set", "Terrazzo Tray & Planter Set", "decor", 6200, 12,
    "A hand-cast terrazzo tray with two matching planters in warm greys and soft yellow chips. Drainage holes included in the planters."],
  ["courtyard-house-model-kit", 'Architectural Model Kit — "Courtyard House"', "studio-tools", 9500, 5,
    "A laser-cut 1:100 model kit of a courtyard house in birch plywood and card. A satisfying build for students, architects and design lovers; no glue gun required."],
];

export const seedProducts: Product[] = productRows.map(([slug, name, cat, price, stock, description], i) => ({
  id: uid(PROD, i + 1),
  name,
  slug,
  description,
  category_id: catRef(cat).id,
  category: catRef(cat).ref,
  price_bdt: price,
  stock,
  images: [],
  is_published: true,
}));

/* ----------------------------- testimonials ----------------------------- */
// ⚠ Placeholder quotes — add real client testimonials from Admin → Testimonials.
export const seedTestimonials: Testimonial[] = [
  {
    id: uid("0d0d0d0d", 1),
    name: "Apartment owner",
    role: "Homeowner",
    location: "Dhanmondi, Dhaka",
    quote:
      "They turned a cramped flat into a calm, bright home. The 3D walkthrough meant there were no surprises on site — what we approved is exactly what we got.",
    rating: 5,
    avatar_url: null,
    is_published: true,
    sort_order: 1,
  },
  {
    id: uid("0d0d0d0d", 2),
    name: "Agency founder",
    role: "Office fit-out",
    location: "Gulshan, Dhaka",
    quote:
      "Clear budgets, weekly updates and a team that actually showed up every day. Our office opened on the date we were promised.",
    rating: 5,
    avatar_url: null,
    is_published: true,
    sort_order: 2,
  },
  {
    id: uid("0d0d0d0d", 3),
    name: "Villa owner",
    role: "Residential",
    location: "Khulshi, Chattogram",
    quote:
      "They understood how the building should breathe in our climate. The courtyard changed how the whole family lives.",
    rating: 5,
    avatar_url: null,
    is_published: true,
    sort_order: 3,
  },
];
