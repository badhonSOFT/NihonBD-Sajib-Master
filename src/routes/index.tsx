import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ, Features, Hero, Pricing } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NihonBD — জাপানি ভাষা শিখুন, JLPT ও NAT-TEST মক টেস্ট দিন" },
      {
        name: "description",
        content: "বাংলা ব্যাখ্যা সহ JLPT N5, N4 ও NAT-TEST এর ফুল CBT মক টেস্ট — মাত্র ২০ টাকা থেকে, বিকাশ বা নগদে।",
      },
      { property: "og:title", content: "NihonBD — JLPT ও NAT-TEST মক টেস্ট, বাংলা ব্যাখ্যা সহ" },
      {
        property: "og:description",
        content: "আসল পরীক্ষার মতো টাইমার, সেকশন লক ও একবার-বাজানো অডিও। ফুরিগানা ও ট্যাপ-করে-বাংলা-অর্থ।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
    </SiteLayout>
  );
}
