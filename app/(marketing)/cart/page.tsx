import { PageHeader } from "@/components/marketing/PageHeader";
import { CartSync } from "@/components/shop/CartSync";
import { CartView } from "@/components/shop/CartView";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your Cart",
  description: "Review the items in your ARCHIAETIX shop cart.",
  path: "/cart",
  noindex: true,
});

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ name: "Cart", href: "/cart" }]} compact />
      <section className="py-12 sm:py-16">
        <Container>
          <CartView />
        </Container>
      </section>
      <CartSync />
    </>
  );
}
