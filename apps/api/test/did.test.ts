import { describe, expect, it } from "vitest";
import { computeDid } from "../src/experiments/did";

const makeSubjects = (count: number, pre: number, post: number) =>
  Array.from({ length: count }, (_, idx) => ({
    subjectId: `s-${idx}`,
    preAmount: pre,
    postAmount: post
  }));

describe("computeDid", () => {
  it("computes uplift and confidence", () => {
    const treatment = makeSubjects(60, 100, 200);
    const control = makeSubjects(60, 100, 130);
    const result = computeDid(treatment, control, 200);
    expect(result.insufficientData).toBe(false);
    expect(result.upliftAmount).toBeGreaterThan(0);
  });

  it("flags insufficient data", () => {
    const result = computeDid(makeSubjects(10, 100, 110), makeSubjects(10, 100, 100));
    expect(result.insufficientData).toBe(true);
  });
});
