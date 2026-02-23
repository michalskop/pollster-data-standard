import { z } from "zod";

/**
 * DistributionValue — one bin of a probability or frequency distribution.
 *
 * `x` is the bin label (string to accommodate both exact values and ranges):
 *   - exact:  "10"       — the value is exactly 10
 *   - range:  "9-10"     — the value falls in [9, 10]
 *   - label:  "<5"       — open-ended bin
 *
 * `value` is the probability mass or frequency for that bin.
 * For probability distributions, all `value` fields should sum to ~100
 * (expressed as percentages) or ~1 (expressed as fractions) — the convention
 * is up to the producer and should be noted in the parent Distribution.
 */
export const DistributionValueSchema = z.object({
  /** Bin label — exact value or range, e.g. "10", "9-10", "<5". */
  x: z.string().min(1),

  /** Probability mass or frequency for this bin. */
  value: z.number(),
});

export type DistributionValue = z.infer<typeof DistributionValueSchema>;
