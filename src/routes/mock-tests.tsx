import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MockTestsShowcase, PageIntro } from "@/components/site/sections";

export const Route = createFileRoute("/mock-tests")({
  head: () => ({
    meta: [
      { title: "Mock Tests — JLPT N5, N4 ও NAT-TEST | NihonBD" },
      { name: "description", content: "আসল পরীক্ষার মতো ফুল মক টেস্ট: ভাষা জ্ঞান, পঠন ও শ্রবণ — ১৮০ নম্বরে স্কোর ও সেকশন কাট-অফ সহ।" },
      { property: "og:title", content: "JLPT ও NAT-TEST মক টেস্ট — NihonBD" },
      { property: "og:description", content: "একটি ফ্রি ডেমো টেস্ট দিয়ে শুরু করুন।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MockTestsPage,
});

function MockTestsPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Mock Tests"
        title="আসল পরীক্ষার নিয়মে অনুশীলন।"
        body="সেকশন টাইমার শেষ হলে অটো-সাবমিট, পেছনে ফেরা নেই, অডিও একবারই। মোট ১৮০ — পাস ৯০, প্রতি সেকশনে কমপক্ষে ১৯।"
      />
      <MockTestsShowcase />
    </SiteLayout>
  );
}
