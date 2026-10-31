export type CategoryKind = "project" | "service" | "product";

export type Category = {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  parent_id: string | null;
};

export type CategoryRef = { name: string; slug: string };

export type Project = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category: CategoryRef | null;
  description: string;
  location: string | null;
  year: number | null;
  area_sqft: number | null;
  cover_image_url: string | null;
  images: string[];
  featured: boolean;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image_url: string | null;
  features: string[];
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  category: CategoryRef | null;
  price_bdt: number;
  stock: number;
  images: string[];
  model_url?: string | null;
  is_published: boolean;
  created_at?: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

/** Allowed transitions — mirrored by the DB trigger in supabase/schema.sql. */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_bdt: number;
};

export type Order = {
  id: string;
  order_no: number;
  user_id: string;
  status: OrderStatus;
  total_bdt: number;
  payment_method: PaymentMethod;
  payment_sender: string | null;
  payment_ref: string | null;
  customer_email: string | null;
  shipping_address: ShippingAddress;
  created_at: string;
  order_items?: OrderItem[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  project_photo_url?: string | null;
  is_published: boolean;
  sort_order: number;
};

export type HeroSlide = {
  id: string;
  image_url: string;
  caption: string | null;
  is_published: boolean;
  sort_order: number;
};

export type PaymentMethod = "bkash" | "nagad" | "cod";

export type EstimateStatus = "new" | "contacted" | "won" | "lost";

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type Inquiry = {
  id: string;
  kind: "contact" | "quote";
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  stock: number;
};
