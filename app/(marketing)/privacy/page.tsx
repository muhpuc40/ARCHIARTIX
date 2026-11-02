import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How ARCHIARTIX collects, uses and protects your personal information when you use our website, shop and quote tools.",
  path: "/privacy",
});

const contact = siteConfig.email ? (
  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
) : (
  <Link href="/contact">our contact page</Link>
);

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      path="/privacy"
      updated="31 October 2026"
      intro={`${siteConfig.name} (“we”, “us”) respects your privacy. This policy explains what personal information we collect through this website, why we collect it, who we share it with, and the choices you have.`}
      sections={[
        {
          title: "Information we collect",
          body: (
            <>
              <p>We only collect what we need to respond to you and to run the studio and shop:</p>
              <ul>
                <li><strong>Contact &amp; quote requests</strong> — name, phone, email, project details and anything you write in the message.</li>
                <li><strong>“Make your plan” estimates</strong> — space type, size, rooms, add-ons, chosen package and your contact details.</li>
                <li><strong>Accounts</strong> — name, email and password (stored hashed by our authentication provider), or your Google account name and email if you sign in with Google.</li>
                <li><strong>Orders</strong> — delivery name, phone, address, items bought, and for bKash / Nagad payments the sender number and transaction ID you enter.</li>
                <li><strong>Technical data</strong> — basic device and browser information, and essential cookies needed to keep you signed in and your cart working.</li>
              </ul>
              <p>We never see or store card numbers — we do not take card payments.</p>
            </>
          ),
        },
        {
          title: "How we use it",
          body: (
            <ul>
              <li>To reply to enquiries, prepare quotes and contact you about your project.</li>
              <li>To process, verify (bKash / Nagad payments) and deliver orders, and send order updates.</li>
              <li>To run your account, keep the site secure, and prevent fraud and abuse.</li>
              <li>To improve the website. We do not sell your personal information.</li>
            </ul>
          ),
        },
        {
          title: "Who we share it with",
          body: (
            <>
              <p>We use a small number of service providers who process data on our behalf:</p>
              <ul>
                <li><strong>Supabase</strong> — database and authentication.</li>
                <li><strong>Cloudinary</strong> — storage and delivery of images and video.</li>
                <li><strong>Hosting and delivery providers</strong> — to serve the website.</li>
                <li><strong>Google</strong> — only if you choose “Sign in with Google”, or when you load the embedded map on the contact page.</li>
                <li><strong>WhatsApp</strong> — only when you choose to message us there.</li>
              </ul>
              <p>We may also disclose information if the law requires it. Delivery details are shared with couriers only as needed to deliver your order.</p>
            </>
          ),
        },
        {
          title: "Cookies",
          body: (
            <p>
              We use essential cookies and similar storage to keep you signed in, remember your cart and keep the site secure. We do not run advertising
              cookies. Embedded content such as the map or a video may set its own cookies once you interact with it.
            </p>
          ),
        },
        {
          title: "How long we keep it",
          body: (
            <p>
              We keep enquiries and estimates for as long as needed to follow up and serve you, and order records for as long as needed for accounting and
              warranty purposes. You can ask us to delete your account and personal data at any time, except where we must keep records by law.
            </p>
          ),
        },
        {
          title: "Security",
          body: (
            <p>
              Data is transmitted over HTTPS, access to the admin area is restricted to authorised staff, and database rules limit customers to their own
              records. No online service is perfectly secure, so please use a strong, unique password.
            </p>
          ),
        },
        {
          title: "Your rights",
          body: (
            <p>
              You may ask to access, correct or delete the personal information we hold about you, or object to how we use it. Contact us at {contact} and
              we will respond within a reasonable time.
            </p>
          ),
        },
        {
          title: "Children",
          body: <p>This website is not directed at children under 13, and we do not knowingly collect their personal information.</p>,
        },
        {
          title: "Changes to this policy",
          body: <p>We may update this policy from time to time. The “last updated” date above shows when it last changed; continued use of the site means you accept the update.</p>,
        },
        {
          title: "Contact us",
          body: (
            <p>
              Questions about this policy? Reach {siteConfig.name} at {contact}
              {siteConfig.phone ? <> or call {siteConfig.phone}</> : null}. Our studio: {siteConfig.address}.
            </p>
          ),
        },
      ]}
    />
  );
}
