/**
 * Builds favicon / PWA icons and the social-share image from your logo files.
 *   npm run icons
 * Inputs : public/brand/mark-light.png (transparent "A" mark, light version)
 *          public/brand/logo-light.png (transparent full logo, light version)
 * Outputs: app/icon.png, app/apple-icon.png, public/icons/*, public/og.jpg
 * Replace the files in public/brand/ with your own artwork and re-run.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const BG = "#262626"; // charcoal
const mark = join(root, "public/brand/mark-light.png");
const logo = join(root, "public/brand/logo-light.png");
mkdirSync(join(root, "public/icons"), { recursive: true });

async function icon(size, out, { padding = 0.2, round = false } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const m = await sharp(mark).resize(inner, inner, { fit: "inside" }).toBuffer();
  let img = sharp({ create: { width: size, height: size, channels: 4, background: BG } }).composite([
    { input: m, gravity: "centre" },
  ]);
  if (round) {
    const r = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}"/></svg>`);
    img = img.composite([{ input: r, blend: "dest-in" }]);
  }
  await img.png().toFile(out);
  console.log("wrote", out.replace(root, "."));
}

await icon(32, join(root, "app/icon.png"), { padding: 0.08, round: true });
await icon(180, join(root, "app/apple-icon.png"), { padding: 0.16 });
await icon(192, join(root, "public/icons/icon-192.png"), { padding: 0.14, round: true });
await icon(512, join(root, "public/icons/icon-512.png"), { padding: 0.14, round: true });
// Maskable icons need a larger safe-zone (content within the inner 80%)
await icon(512, join(root, "public/icons/icon-maskable-512.png"), { padding: 0.24 });

// Open Graph / Twitter share image — 1200x630
const W = 1200;
const H = 630;
const logoBuf = await sharp(logo).resize({ height: 420, fit: "inside" }).toBuffer();
const bg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="45%" r="70%"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="100%" stop-color="#1b1b1b"/></radialGradient>
    <pattern id="p" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#ffffff" stroke-opacity="0.05"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#p)"/>
  <rect x="0" y="${H - 10}" width="${W}" height="10" fill="#FADF0B"/>
</svg>`);
await sharp(bg)
  .composite([{ input: logoBuf, gravity: "centre" }])
  .jpeg({ quality: 88 })
  .toFile(join(root, "public/og.jpg"));
console.log("wrote ./public/og.jpg");
