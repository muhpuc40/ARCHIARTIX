import { NextResponse } from "next/server";
import { getClientIp, isSameOrigin, jsonError, jsonOk } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { inquirySchema } from "@/lib/validators";

/** Public contact / quote form. Validated, rate-limited, stored via the service role. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");

  const limit = rateLimit(`inquiry:${getClientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  }
  const { website, ...data } = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing.
  if (website) return jsonOk();

  if (!hasServiceRole()) {
    return jsonError(503, "Our message service isn’t connected yet — please reach us on WhatsApp instead.");
  }

  const { error } = await createAdminClient()
    .from("inquiries")
    .insert({
      kind: data.kind,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      message: data.message,
    });

  if (error) {
    console.error("[inquiries] insert failed:", error.message);
    return jsonError(500, "We couldn’t save your message. Please try again or use WhatsApp.");
  }
  return jsonOk();
}
