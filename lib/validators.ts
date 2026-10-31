import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/types";

/** Bangladeshi mobile: 01[3-9]XXXXXXXX, optionally prefixed with +88 / 88. */
export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const phoneRegex = BD_PHONE_REGEX;

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => phoneRegex.test(v), "Enter a valid Bangladeshi mobile number, e.g. 01712345678");

export const optionalPhoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => v === "" || phoneRegex.test(v), "Enter a valid Bangladeshi mobile number")
  .optional();

/* ----------------------------- public forms ----------------------------- */
export const inquirySchema = z.object({
  kind: z.enum(["contact", "quote"]).default("contact"),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: optionalPhoneSchema,
  service: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(3000),
  // honeypot — real users never fill this in
  website: z.string().max(0).optional(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: optionalPhoneSchema,
});

export const loginEmailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

/* ------------------------------- shop / orders ------------------------------- */
export const shippingSchema = z.object({
  name: z.string().trim().min(2, "Enter the recipient's name").max(100),
  phone: phoneSchema,
  address: z.string().trim().min(8, "Enter a full delivery address").max(300),
  city: z.string().trim().min(2, "Select your district").max(60),
  note: z.string().trim().max(500).optional(),
});

/** Payment fields, kept separate so the checkout form can merge them with the shipping fields. */
export const paymentFields = {
  method: z.enum(["bkash", "nagad", "cod"], { message: "Choose a payment method" }),
  // Only needed for bKash / Nagad (send money, then enter who paid and the TrxID). Cash on Delivery sends neither.
  sender: z.string().trim().default("").transform((v) => v.replace(/[\s-]/g, "")),
  trx_id: z.string().trim().default("").transform((v) => v.toUpperCase()),
};

/** bKash / Nagad need a valid sender number and TrxID; Cash on Delivery needs neither. */
export function checkPaymentFields(v: { method: string; sender: string; trx_id: string }, ctx: z.RefinementCtx) {
  if (v.method === "cod") return;
  if (!phoneRegex.test(v.sender)) {
    ctx.addIssue({ code: "custom", path: ["sender"], message: "Enter the mobile number you paid from, e.g. 01712345678" });
  }
  if (!/^[A-Z0-9]{6,20}$/.test(v.trx_id)) {
    ctx.addIssue({ code: "custom", path: ["trx_id"], message: "Enter the transaction ID from your payment SMS (letters and numbers)" });
  }
}

export const paymentSchema = z.object(paymentFields).superRefine(checkPaymentFields);

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
  shipping: shippingSchema,
  payment: paymentSchema,
});

export const cartValidateSchema = z.object({
  ids: z.array(z.string().min(1).max(64)).max(50),
});

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [string, ...string[]]),
});

/* ---------------------------------- admin ---------------------------------- */
export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(5000).default(""),
  category_id: z.string().uuid().nullable().optional(),
  price_bdt: z.number().int("Whole taka only").min(0).max(10_000_000),
  stock: z.number().int("Whole units only").min(0).max(100_000),
  images: z.array(z.string().url()).max(8).default([]),
  model_url: z.string().url().max(600).nullable().optional(),
  is_published: z.boolean().default(false),
});
export type ProductInput = z.infer<typeof productSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  role: z.string().trim().max(80).default(""),
  location: z.string().trim().max(80).default(""),
  quote: z.string().trim().min(10, "Write at least a sentence").max(600),
  // half-star steps: 1, 1.5, 2 … 5
  rating: z
    .number()
    .min(1)
    .max(5)
    .refine((v) => Number.isInteger(v * 2), "Use whole or half stars (e.g. 4 or 4.5)")
    .default(5),
  avatar_url: z.string().url().nullable().optional(),
  project_photo_url: z.string().url().nullable().optional(),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

/** A hosted/embeddable link or a file under /public (e.g. /3d/room.glb). Empty clears the setting. */
const mediaLink = z
  .string()
  .trim()
  .max(600)
  .refine((v) => v === "" || /^https?:\/\//i.test(v) || /^\/[\w./%-]+$/.test(v), "Use a full https:// link or a /path")
  .nullable()
  .optional();
export const siteSettingsSchema = z.object({
  tour3d_url: mediaLink,
  video_url: mediaLink,
});

export const heroSlideSchema = z.object({
  image_url: z.string().url("Upload an image first").max(600),
  caption: z.string().trim().max(120).default(""),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

const slugField = z
  .string()
  .trim()
  .max(90)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only")
  .optional()
  .or(z.literal(""));

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(140),
  slug: slugField,
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().trim().max(6000).default(""),
  location: z.string().trim().max(120).default(""),
  year: z.number().int().min(1990).max(2100).nullable().optional(),
  area_sqft: z.number().int().min(1).max(10_000_000).nullable().optional(),
  images: z.array(z.string().url()).max(20).default([]),
  featured: z.boolean().default(false),
});

export const estimateSchema = z.object({
  space_kind: z.string().trim().min(2).max(60),
  flat_status: z.enum(["under_construction", "ready_for_interior", "not_ready_yet"]),
  size_sqft: z.number().int().min(1).max(1_000_000).nullable().optional(),
  rooms: z
    .array(z.object({ name: z.string().trim().min(1).max(40), count: z.number().int().min(1).max(30) }))
    .min(1, "Add at least one room")
    .max(25),
  addons: z
    .array(z.object({ room: z.string().trim().min(1).max(40), items: z.array(z.string().trim().min(1).max(60)).max(12) }))
    .max(25)
    .default([]),
  package: z.enum(["standard", "superior", "signature"], { message: "Pick a package" }),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email address").max(160).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const estimateStatusSchema = z.object({
  status: z.enum(["new", "contacted", "won", "lost"]),
});

export const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"] as const;
export const MODEL_MIME = ["model/gltf-binary"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_MODEL_BYTES = 50 * 1024 * 1024;

/** Ask the server for a signed Cloudinary upload (admin only). */
export const uploadRequestSchema = z
  .object({
    folder: z.enum(["products", "projects", "testimonials", "hero", "models", "site"]),
    contentType: z.enum([...IMAGE_MIME, ...VIDEO_MIME, ...MODEL_MIME]),
    size: z.number().int().min(1),
  })
  .superRefine((v, ctx) => {
    const isVideo = (VIDEO_MIME as readonly string[]).includes(v.contentType);
    const isModel = (MODEL_MIME as readonly string[]).includes(v.contentType);
    const max = isModel ? MAX_MODEL_BYTES : isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (v.size > max) ctx.addIssue({ code: "custom", path: ["size"], message: `Files must be ${Math.round(max / 1024 / 1024)} MB or smaller` });
  });

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "read", "replied", "archived"]),
});

export const BD_DISTRICTS = [
  "Bagerhat","Bandarban","Barguna","Barishal","Bhola","Bogura","Brahmanbaria","Chandpur","Chapai Nawabganj",
  "Chattogram","Chuadanga","Cox's Bazar","Cumilla","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha","Gazipur",
  "Gopalganj","Habiganj","Jamalpur","Jashore","Jhalokathi","Jhenaidah","Joypurhat","Khagrachhari","Khulna",
  "Kishoreganj","Kurigram","Kushtia","Lakshmipur","Lalmonirhat","Madaripur","Magura","Manikganj","Meherpur",
  "Moulvibazar","Munshiganj","Mymensingh","Naogaon","Narail","Narayanganj","Narsingdi","Natore","Netrokona",
  "Nilphamari","Noakhali","Pabna","Panchagarh","Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati",
  "Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet","Tangail","Thakurgaon",
] as const;
