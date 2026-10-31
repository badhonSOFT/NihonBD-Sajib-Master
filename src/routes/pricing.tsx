import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ, PageIntro, Pricing } from "@/components/site/sections";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — মাত্র ২০ টাকা থেকে মক টেস্ট | NihonBD" },
      { name: "description", content: "২০, ৩০, ৫০ ও ১০০ টাকার প্যাকেজ — বিকাশ বা নগদে পেমেন্ট, সাথে সাথে আনলক।" },
      { property: "og:title", content: "NihonBD প্যাকেজ ও মূল্য" },
      { property: "og:description", content: "এক কাপ চায়ের দামে একটি JLPT মক টেস্ট।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Pricing"
        title="যতটুকু দরকার, ততটুকুই।"
        body="বিকাশ বা নগদে Send Money করে TrxID দিন — টিকিট সাথে সাথে আপনার অ্যাকাউন্টে।"
      />
      <div className="mt-12">
        <Pricing heading={false} />
      </div>
      <FAQ />
    </SiteLayout>
  );
}
