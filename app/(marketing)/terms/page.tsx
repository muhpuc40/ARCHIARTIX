import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply when you use the ARCHIARTIX website, request a quote, or buy from our shop.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      path="/terms"
      updated="31 October 2026"
      intro={`These terms apply when you use the ${siteConfig.name} website, request a quote or estimate, or buy from our shop. By using the site you agree to them.`}
      sections={[
        {
          title: "About us",
          body: (
            <p>
              {siteConfig.name} is an interior design and architecture studio
              operating in Bangladesh. Studio contact details are on our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          ),
        },
        {
          title: "Quotes and estimates",
          body: (
            <p>
              Estimates from the “Make your plan” tool and any early price
              discussion are indicative only. A binding price, scope and
              timeline are agreed in a written quotation or contract after we
              understand your space and requirements. Submitting an estimate
              request does not create a contract.
            </p>
          ),
        },
        {
          title: "Design and project services",
          body: (
            <ul>
              <li>
                Project scope, stages, payment schedule and timeline are set out
                in the signed agreement for each project.
              </li>
              <li>
                Changes after approval may affect cost and schedule and will be
                agreed in writing first.
              </li>
              <li>
                Renders, drawings and designs remain our intellectual property
                until the agreed fees are paid in full; we may show completed
                work in our portfolio unless you ask us not to.
              </li>
            </ul>
          ),
        },
        {
          title: "Shop orders and prices",
          body: (
            <ul>
              <li>
                All prices are in Bangladeshi Taka (BDT, ৳). Prices and
                availability can change without notice.
              </li>
              <li>
                An order is confirmed only after we receive and verify your
                payment. We may cancel an order if an item is out of stock or a
                price was shown in error, and will refund any payment received.
              </li>
              <li>
                Delivery times are estimates and depend on your location and the
                product.
              </li>
            </ul>
          ),
        },
        {
          title: "Payments (bKash and Nagad)",
          body: (
            <>
              <p>
                We accept manual mobile-money payments. Send the exact order
                total to the bKash or Nagad number shown at checkout, then enter
                the sender number and transaction ID (TrxID) on the order.
              </p>
              <p>
                We confirm the payment against our account before processing the
                order. Entering a false or reused transaction ID may result in
                the order being cancelled. Please send money only to the numbers
                displayed on our official checkout page.
              </p>
            </>
          ),
        },
        {
          title: "Cancellations, returns and refunds",
          body: (
            <p>
              Contact us as soon as possible if you want to cancel. Orders not
              yet dispatched can normally be cancelled with a refund to the
              original payment number. Made-to-order and custom items cannot be
              cancelled once production starts. If an item arrives damaged or
              not as described, tell us within 3 days of delivery with photos
              and we will repair, replace or refund it.
            </p>
          ),
        },
        {
          title: "Your account and acceptable use",
          body: (
            <ul>
              <li>
                Keep your login details confidential; you are responsible for
                activity on your account.
              </li>
              <li>
                Do not misuse the site: no attempts to break security, scrape at
                scale, submit false information or interfere with other users.
              </li>
              <li>We may suspend accounts that breach these terms.</li>
            </ul>
          ),
        },
        {
          title: "Content and intellectual property",
          body: (
            <p>
              The website, logo, photographs, renders and text belong to{" "}
              {siteConfig.name} or its licensors. You may view and share pages
              for personal, non-commercial use, but may not copy or reuse our
              content commercially without written permission.
            </p>
          ),
        },
        {
          title: "Liability",
          body: (
            <p>
              We take care to keep the website accurate and available, but it is
              provided “as is”. To the extent permitted by law, we are not
              liable for indirect or consequential loss arising from use of the
              site, and our total liability for any order is limited to the
              amount you paid for it. Nothing in these terms limits liability
              that cannot be limited by law.
            </p>
          ),
        },
        {
          title: "Privacy",
          body: (
            <p>
              How we handle your personal information is described in our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          title: "Governing law and changes",
          body: (
            <p>
              These terms are governed by the laws of Bangladesh, and disputes
              fall under the courts of Chattogram. We may update these terms
              from time to time; the “last updated” date shows the current
              version.
            </p>
          ),
        },
        {
          title: "Contact",
          body: (
            <p>
              Questions about these terms?{" "}
              <Link href="/contact">Get in touch</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
