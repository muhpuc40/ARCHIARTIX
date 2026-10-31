import { PageHeader } from "@/components/marketing/PageHeader";
import { CartSync } from "@/components/shop/CartSync";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { getProfile, requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your ARCHIAETIX shop order.",
  path: "/checkout",
  noindex: true,
});

// Needs the signed-in user, so this route is rendered per request.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  let name = "";
  let phone = "";
  if (isSupabaseConfigured) {
    await requireUser("/checkout"); // proxy.ts also guards this path
    const profile = await getProfile();
    name = profile?.full_name ?? "";
    phone = profile?.phone ?? "";
  }

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ name: "Cart", href: "/cart" }, { name: "Checkout", href: "/checkout" }]} compact />
      <section className="py-12 sm:py-16">
        <Container>
          <CheckoutForm defaultName={name} defaultPhone={phone} backendReady={isSupabaseConfigured} />
        </Container>
      </section>
      <CartSync />
    </>
  );
}
