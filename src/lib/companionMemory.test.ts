import { describe, it, expect, beforeEach } from "bun:test";

const store: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
};
const { learnFromMessage, dueFollowUps, buildCompanionContext } = await import("./companionMemory");

describe("companion memory", () => {
  beforeEach(() => { for (const k in store) delete store[k]; });

  it("remembers the user's name", () => {
    expect(learnFromMessage("mera naam Aryan hai").name).toBe("Aryan");
  });

  it("asks about tomorrow's exam the next day, not today", () => {
    const today = new Date(2026, 10, 5, 20);
    learnFromMessage("Kal mera Maths ka board exam hai", today);
    expect(dueFollowUps(today).length).toBe(0);
    expect(dueFollowUps(new Date(2026, 10, 6, 9)).length).toBe(1);
  });

  it("asks the follow-up only once", () => {
    learnFromMessage("Kal mera interview hai", new Date(2026, 10, 5, 20));
    const next = new Date(2026, 10, 6, 9);
    expect(buildCompanionContext("hi", next)).toContain("PENDING FOLLOW-UP");
    expect(buildCompanionContext("hi", next)).not.toContain("PENDING FOLLOW-UP");
  });
});
