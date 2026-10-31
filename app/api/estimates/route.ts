import { NextResponse } from "next/server";
import { getClientIp, isSameOrigin, jsonError, jsonOk } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { estimateSchema } from "@/lib/validators";

/** Public "Make your plan" wizard submission. Validated, rate-limited, stored via the service role. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");

  const limit = rateLimit(`estimate:${getClientIp(request)}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests — please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Please check your answers and try again.");
  const { website, ...d } = parsed.data;
  if (website) return jsonOk(); // honeypot

  if (!hasServiceRole()) {
    return jsonError(503, "Our estimate service isn’t connected yet — please reach us on WhatsApp instead.");
  }

  const { error } = await createAdminClient()
    .from("estimates")
    .insert({
      space_kind: d.space_kind,
      flat_status: d.flat_status,
      size_sqft: d.size_sqft ?? null,
      rooms: d.rooms,
      addons: d.addons.filter((a) => a.items.length > 0),
      package: d.package,
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      note: d.note || null,
    });
  if (error) {
    console.error("[estimates] insert failed:", error.message);
    return jsonError(500, "We couldn’t save your request. Please try again or use WhatsApp.");
  }
  return jsonOk();
}
