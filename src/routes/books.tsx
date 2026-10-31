import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BooksShowcase, PageIntro } from "@/components/site/sections";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Study Books — মিন্না নো নিহোঙ্গো, N5 কাঞ্জি ও ব্যাকরণ | NihonBD" },
      { name: "description", content: "বাংলা অর্থ সহ জাপানি শব্দতালিকা, কাঞ্জি কার্ড ও ব্যাকরণ শিট। প্রথম দুই অধ্যায় ফ্রি।" },
      { property: "og:title", content: "NihonBD ডিজিটাল স্টাডি লাইব্রেরি" },
      { property: "og:description", content: "ফুরিগানা ও বাংলা অর্থ সহ জাপানি বই — প্রথম দুই অধ্যায় ফ্রি।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Study Books"
        title="পকেটে একটি জাপানি লাইব্রেরি।"
        body="প্রতিটি শব্দ ও কাঞ্জি বাংলা অর্থ সহ। অধ্যায় ১ ও ২ সবার জন্য ফ্রি।"
      />
      <BooksShowcase />
    </SiteLayout>
  );
}
