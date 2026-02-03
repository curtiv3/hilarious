export interface SubjectRevenue {
  subjectId: string;
  preAmount: number;
  postAmount: number;
}

export interface DidResult {
  upliftAmount: number | null;
  upliftPercent: number | null;
  confidenceLevel: number | null;
  ci: [number, number] | null;
  insufficientData: boolean;
  warnings: string[];
}

const bootstrapSample = (data: number[], samples: number) => {
  const results: number[] = [];
  const n = data.length;
  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const idx = Math.floor(Math.random() * n);
      sum += data[idx];
    }
    results.push(sum / n);
  }
  return results.sort((a, b) => a - b);
};

const mean = (values: number[]) => values.reduce((acc, v) => acc + v, 0) / values.length;

export const computeDid = (
  treatment: SubjectRevenue[],
  control: SubjectRevenue[],
  bootstrapSamples = 1000
): DidResult => {
  if (treatment.length < 50 || control.length < 50) {
    return {
      upliftAmount: null,
      upliftPercent: null,
      confidenceLevel: null,
      ci: null,
      insufficientData: true,
      warnings: ["insufficient_data"]
    };
  }

  const treatmentDeltas = treatment.map((s) => s.postAmount - s.preAmount);
  const controlDeltas = control.map((s) => s.postAmount - s.preAmount);

  const treatmentDelta = mean(treatmentDeltas);
  const controlDelta = mean(controlDeltas);
  const upliftAmount = treatmentDelta - controlDelta;

  const baseline = Math.max(1, mean(treatment.map((s) => s.preAmount)));
  const upliftPercent = upliftAmount / baseline;

  const treatmentSamples = bootstrapSample(treatmentDeltas, bootstrapSamples);
  const controlSamples = bootstrapSample(controlDeltas, bootstrapSamples);
  const upliftSamples = treatmentSamples.map((value, idx) => value - controlSamples[idx]);
  upliftSamples.sort((a, b) => a - b);
  const lowerIdx = Math.floor(0.025 * upliftSamples.length);
  const upperIdx = Math.floor(0.975 * upliftSamples.length);
  const ci: [number, number] = [upliftSamples[lowerIdx], upliftSamples[upperIdx]];

  const excludesZero = ci[0] > 0 || ci[1] < 0;
  const ciWidth = Math.abs(ci[1] - ci[0]);
  let confidenceLevel = excludesZero ? 0.8 : 0.4;
  if (ciWidth < Math.abs(upliftAmount) * 0.5) {
    confidenceLevel += 0.1;
  }
  const samplePenalty = Math.min(treatment.length, control.length) < 100 ? 0.1 : 0;
  confidenceLevel = Math.max(0.1, Math.min(0.95, confidenceLevel - samplePenalty));

  return {
    upliftAmount,
    upliftPercent,
    confidenceLevel,
    ci,
    insufficientData: false,
    warnings: []
  };
};
