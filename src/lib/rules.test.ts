import { describe, expect, it } from "vitest";
import {
  DAY,
  applyPackage,
  canReadChapter,
  canTakeExam,
  consumeExamEntry,
  judge,
  nextJlpt,
} from "./rules";

const empty = { tickets: 0, monthlyUntil: 0, weeklyUntil: 0, bookUntil: 0 };
const now = new Date("2026-10-31T12:00:00").getTime();

describe("packages", () => {
  it("20 Taka gives 1 exam ticket", () => {
    expect(applyPackage(empty, "p20", now).tickets).toBe(1);
  });
  it("30 Taka gives 2 tickets and 24h library access", () => {
    const u = applyPackage(empty, "p30", now);
    expect(u.tickets).toBe(2);
    expect(u.bookUntil).toBe(now + DAY);
  });
  it("50 Taka gives 5 tickets and a 7-day weekly pass", () => {
    const u = applyPackage(empty, "p50", now);
    expect(u.tickets).toBe(5);
    expect(u.weeklyUntil).toBe(now + 7 * DAY);
  });
  it("100 Taka gives 30 days of monthly access", () => {
    expect(applyPackage(empty, "p100", now).monthlyUntil).toBe(now + 30 * DAY);
  });
});

describe("locks", () => {
  it("locks exams with 0 tickets and no monthly pass", () => {
    expect(canTakeExam(empty, now)).toBe(false);
  });
  it("unlocks exams with a monthly pass", () => {
    expect(canTakeExam({ ...empty, monthlyUntil: now + DAY }, now)).toBe(true);
  });
  it("chapters 1 and 2 are free, chapter 3 is locked without access", () => {
    expect(canReadChapter(empty, 2, now)).toBe(true);
    expect(canReadChapter(empty, 3, now)).toBe(false);
  });
  it("monthly pass does not spend a ticket", () => {
    const u = { ...empty, tickets: 2, monthlyUntil: now + DAY };
    expect(consumeExamEntry(u, now).tickets).toBe(2);
    expect(consumeExamEntry({ ...empty, tickets: 2 }, now).tickets).toBe(1);
  });
});

describe("JLPT pass rule", () => {
  it("passes at 90 total with every section at least 19", () => {
    expect(judge({ vocab: 30, reading: 30, listening: 30 }).passed).toBe(true);
  });
  it("fails at 89 total", () => {
    expect(judge({ vocab: 30, reading: 30, listening: 29 }).passed).toBe(false);
  });
  it("fails a 100 total when listening is 17", () => {
    const v = judge({ vocab: 43, reading: 40, listening: 17 });
    expect(v.total).toBe(100);
    expect(v.passed).toBe(false);
    expect(v.failedSections).toEqual(["listening"]);
  });
});

describe("exam calendar", () => {
  it("next JLPT after 31 Oct 2026 is Sunday 6 Dec 2026", () => {
    const d = nextJlpt(new Date(now));
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 11, 6]);
  });
});
