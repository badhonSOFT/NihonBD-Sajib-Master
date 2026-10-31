// Pure business rules: packages, access, JLPT scoring. No browser APIs here.

export const DAY = 24 * 60 * 60 * 1000;

export type PackageId = "p20" | "p30" | "p50" | "p100";

export interface PackageDef {
  id: PackageId;
  price: number;
  priceBn: string;
  title: string;
  titleBn: string;
  perks: string[];
  highlight?: boolean;
}

export const PACKAGES: PackageDef[] = [
  {
    id: "p20",
    price: 20,
    priceBn: "২০",
    title: "Single Ticket",
    titleBn: "১টি মক টেস্ট",
    perks: ["১টি ফুল মক এক্সাম টিকিট", "সম্পূর্ণ বাংলা ব্যাখ্যা সহ রিভিউ", "ভুলের খাতায় অটো সেভ"],
  },
  {
    id: "p30",
    price: 30,
    priceBn: "৩০",
    title: "Duo + Library",
    titleBn: "২টি টেস্ট + লাইব্রেরি",
    perks: ["২টি মক এক্সাম টিকিট", "২৪ ঘণ্টা বই লাইব্রেরি অ্যাক্সেস", "ফুরিগানা ও বাংলা অর্থ"],
  },
  {
    id: "p50",
    price: 50,
    priceBn: "৫০",
    title: "Weekly Pass",
    titleBn: "সাপ্তাহিক পাস",
    perks: ["৫টি মক এক্সাম টিকিট", "৭ দিন আনলিমিটেড প্র্যাকটিস ড্রিল", "স্কোর অ্যানালিটিক্স"],
  },
  {
    id: "p100",
    price: 100,
    priceBn: "১০০",
    title: "Monthly All-Access",
    titleBn: "মাসিক অল-অ্যাক্সেস",
    perks: ["৩০ দিন আনলিমিটেড মক এক্সাম", "সম্পূর্ণ ডিজিটাল বই অ্যাক্সেস", "আনলিমিটেড প্র্যাকটিস ড্রিল"],
    highlight: true,
  },
];

export interface Entitlements {
  tickets: number;
  monthlyUntil: number;
  weeklyUntil: number;
  bookUntil: number;
}

/** Apply a purchased package. Time-based passes extend from the later of now or the current expiry. */
export function applyPackage<T extends Entitlements>(user: T, pkg: PackageId, now: number): T {
  const extend = (until: number, days: number) => Math.max(until, now) + days * DAY;
  switch (pkg) {
    case "p20":
      return { ...user, tickets: user.tickets + 1 };
    case "p30":
      return { ...user, tickets: user.tickets + 2, bookUntil: extend(user.bookUntil, 1) };
    case "p50":
      return { ...user, tickets: user.tickets + 5, weeklyUntil: extend(user.weeklyUntil, 7) };
    case "p100":
      return { ...user, monthlyUntil: extend(user.monthlyUntil, 30) };
  }
}

export const hasMonthly = (u: Entitlements, now: number) => u.monthlyUntil > now;

/** Mock exams unlock with at least one ticket or an active monthly pass. */
export const canTakeExam = (u: Entitlements | null, now: number) =>
  !!u && (u.tickets > 0 || hasMonthly(u, now));

/** Book chapters 1-2 are always free; 3+ need a ticket, monthly pass or 24h book access. */
export const canReadChapter = (u: Entitlements | null, chapterNo: number, now: number) =>
  chapterNo <= 2 || (!!u && (u.tickets > 0 || hasMonthly(u, now) || u.bookUntil > now));

/** Starting a paid exam spends one ticket unless the monthly pass is active. */
export function consumeExamEntry<T extends Entitlements>(u: T, now: number): T {
  if (hasMonthly(u, now)) return u;
  if (u.tickets <= 0) throw new Error("No tickets");
  return { ...u, tickets: u.tickets - 1 };
}

// ---------- Scoring ----------

export type SectionKey = "vocab" | "reading" | "listening";
export const SECTION_MAX = 60;
export const PASS_TOTAL = 90;
export const SECTION_CUTOFF = 19;

export const SECTION_LABEL_BN: Record<SectionKey, string> = {
  vocab: "ভাষা জ্ঞান (শব্দভান্ডার/ব্যাকরণ)",
  reading: "পঠন (Reading)",
  listening: "শ্রবণ (Listening)",
};

/** Scale raw correct answers to a 0-60 section score. */
export const scaleSection = (correct: number, total: number) =>
  total === 0 ? 0 : Math.round((correct / total) * SECTION_MAX);

export interface Verdict {
  total: number;
  passed: boolean;
  failedSections: SectionKey[];
  reasonBn: string;
}

export function judge(scores: Record<SectionKey, number>): Verdict {
  const total = scores.vocab + scores.reading + scores.listening;
  const failedSections = (Object.keys(scores) as SectionKey[]).filter(
    (k) => scores[k] < SECTION_CUTOFF,
  );
  const totalOk = total >= PASS_TOTAL;
  const passed = totalOk && failedSections.length === 0;
  let reasonBn = "অভিনন্দন! মোট স্কোর ও প্রতিটি সেকশনের কাট-অফ দুটিই পূরণ হয়েছে।";
  if (!passed) {
    const parts: string[] = [];
    if (!totalOk) parts.push(`মোট স্কোর ${total}/180, পাস করতে কমপক্ষে ${PASS_TOTAL} প্রয়োজন।`);
    if (failedSections.length) {
      parts.push(
        `${failedSections
          .map((k) => `${SECTION_LABEL_BN[k]} সেকশনে ${scores[k]}/60`)
          .join(", ")} পেয়েছেন। নিয়ম অনুযায়ী প্রতিটি সেকশনে কমপক্ষে ${SECTION_CUTOFF}/60 পেতে হবে — মোট স্কোর যত বেশিই হোক, একটি সেকশনে কাট-অফের নিচে পেলে ফলাফল ফেল।`,
      );
    }
    reasonBn = parts.join(" ");
  }
  return { total, passed, failedSections, reasonBn };
}

// ---------- Exam calendar (Bangladesh) ----------

function nthSunday(year: number, month: number, n: number) {
  const d = new Date(year, month, 1, 9, 0, 0);
  const offset = (7 - d.getDay()) % 7;
  d.setDate(1 + offset + (n - 1) * 7);
  return d;
}

/** JLPT is held on the first Sunday of July and December. */
export function nextJlpt(now: Date) {
  for (let y = now.getFullYear(); y <= now.getFullYear() + 1; y++) {
    for (const m of [6, 11]) {
      const d = nthSunday(y, m, 1);
      if (d.getTime() > now.getTime()) return d;
    }
  }
  return nthSunday(now.getFullYear() + 1, 6, 1);
}

/** NAT-TEST runs roughly every two months; approximated as the 3rd Sunday of even months. */
export function nextNat(now: Date) {
  for (let y = now.getFullYear(); y <= now.getFullYear() + 1; y++) {
    for (const m of [1, 3, 5, 7, 9, 11]) {
      const d = nthSunday(y, m, 3);
      if (d.getTime() > now.getTime()) return d;
    }
  }
  return nthSunday(now.getFullYear() + 1, 1, 3);
}

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
export const toBn = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
