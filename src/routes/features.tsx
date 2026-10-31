import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Features, HeroQuestionCard, PageIntro } from "@/components/site/sections";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — NihonBD CBT মক টেস্ট ও বাংলা অনুবাদ" },
      { name: "description", content: "অফিসিয়াল CBT সিমুলেশন, ফুরিগানা, ট্যাপ-করে-বাংলা-অর্থ, ডিজিটাল বই ও স্বয়ংক্রিয় ভুলের খাতা।" },
      { property: "og:title", content: "NihonBD Features" },
      { property: "og:description", content: "জাপানি পরীক্ষার প্রস্তুতির সব টুল এক জায়গায় — বাংলায়।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Features"
        title="প্রস্তুতির প্রতিটি ধাপ, বাংলায়।"
        body="নিচের প্রশ্নে যেকোনো শব্দে ট্যাপ করে দেখুন — উচ্চারণ, রোমাজি আর বাংলা অর্থ সাথে সাথে।"
      />
      <div className="mx-auto mt-10 max-w-2xl px-5">
        <HeroQuestionCard />
      </div>
      <Features heading={false} />
    </SiteLayout>
  );
}
