/** South-Asian digit grouping (12,50,000) — deterministic on server and client. */
function groupBD(n: number) {
  const s = Math.trunc(Math.abs(n)).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
}

/** The ONLY way prices are rendered on this site. BDT, never USD. */
export function formatBDT(amount: number | null | undefined) {
  const n = Number(amount ?? 0);
  const sign = n < 0 ? "-" : "";
  return `৳ ${sign}${groupBD(n)}`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Dhaka",
});

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return dateFmt.format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  return dateTimeFmt.format(new Date(value));
}

export function formatOrderNo(no: number | string | null | undefined) {
  return `ARX-${no ?? "—"}`;
}

export const PAYMENT_LABELS = { bkash: "bKash", nagad: "Nagad", cod: "Cash on delivery" } as const;
