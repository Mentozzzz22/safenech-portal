import { describe, expect, it } from "vitest";
import { getCalculator } from "@/data/calculators";
import { buildAgentScript } from "./agent-script";

const config = getCalculator("scrap-metal")!;

describe("buildAgentScript", () => {
  it("requests only documents the client said they have", () => {
    const script = buildAgentScript({ serviceTitle: "Лом", config, presentIds: ["scales", "dosimeter"], fallbackDocs: [] });
    const files = script.filter((m) => m.kind === "file");
    expect(files).toHaveLength(3);
    const report = script.find((m) => m.kind === "report");
    expect(report && report.kind === "report" && report.items.map((i) => i.doc)).toEqual([
      "Сертификат поверки весов",
      "Сертификат поверки дозиметра",
      "Договор дозиметрического контроля",
    ]);
  });

  it("asks for a location instead of documents when the client has nothing", () => {
    const script = buildAgentScript({ serviceTitle: "Лом", config, presentIds: [], fallbackDocs: [] });
    expect(script.some((m) => m.kind === "file")).toBe(false);
    expect(script.some((m) => m.kind === "location")).toBe(true);
  });

  it("falls back to the service requirements without a calculator", () => {
    const script = buildAgentScript({ serviceTitle: "X", presentIds: [], fallbackDocs: ["A", "B"], clientName: "Ержан" });
    expect(script[0]).toMatchObject({ kind: "text", text: expect.stringContaining("Ержан") });
    expect(script.filter((m) => m.kind === "file")).toHaveLength(2);
  });
});
