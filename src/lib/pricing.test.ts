import { describe, expect, it } from "vitest";
import { calculateQuote, type CalculatorConfig } from "./pricing";

const config: CalculatorConfig = {
  serviceSlug: "test",
  serviceFee: 1_000_000,
  govFee: 40_000,
  prepDays: 10,
  govDays: 15,
  questions: [
    { id: "a", text: "", hint: "", docs: [], fix: "", surcharge: 300_000, extraDays: 5 },
    { id: "b", text: "", hint: "", docs: [], fix: "", surcharge: 200_000, extraDays: 3 },
  ],
};

describe("calculateQuote", () => {
  it("returns a range covering every outcome when nothing is answered", () => {
    const q = calculateQuote(config, {});
    expect(q.min).toBe(1_040_000);
    expect(q.max).toBe(1_540_000);
    expect([q.minDays, q.maxDays]).toEqual([25, 33]);
    expect(q.isComplete).toBe(false);
  });

  it("charges only the base price when the client has everything", () => {
    const q = calculateQuote(config, { a: true, b: true });
    expect(q.min).toBe(q.max);
    expect(q.min).toBe(1_040_000);
    expect(q.minDays).toBe(25);
    expect(q.isComplete).toBe(true);
    expect(q.missing).toHaveLength(0);
  });

  it("adds surcharges and days for missing items", () => {
    const q = calculateQuote(config, { a: false, b: true });
    expect(q.min).toBe(1_340_000);
    expect(q.max).toBe(1_340_000);
    expect(q.minDays).toBe(30);
    expect(q.missing.map((m) => m.id)).toEqual(["a"]);
    expect(q.present.map((m) => m.id)).toEqual(["b"]);
  });

  it("narrows the range as answers come in", () => {
    const q = calculateQuote(config, { a: true });
    expect(q.min).toBe(1_040_000);
    expect(q.max).toBe(1_240_000);
    expect(q.pending.map((m) => m.id)).toEqual(["b"]);
  });
});
