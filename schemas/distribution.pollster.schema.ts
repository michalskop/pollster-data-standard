import { z } from "zod";
import { DistributionValueSchema } from "./distribution-value.pollster.schema";

/**
 * Distribution — a probability or frequency distribution over discrete bins.
 *
 * Layer: aggregate (optional field on Estimate, part of EstimateSnapshot)
 *
 * Used to represent the full uncertainty of a model estimate, not just
 * the point value and interval. Attached as an optional field on Estimate.
 *
 * Examples:
 *   Seat distribution:    type="seats",   values=[{"x":"9","value":5}, {"x":"10","value":25}, …]
 *   Percent distribution: type="percents", values=[{"x":"9-10","value":18}, …]
 */
export const DistributionSchema = z.object({
  /**
   * What quantity the distribution is over.
   * Should match the parent Estimate.type.
   * Canonical values: "seats", "percents".
   */
  type: z.string().min(1),

  /**
   * Ordered array of bins.
   * Bins should be listed in ascending order of `x`.
   * `value` is typically a percentage (0–100) summing to ~100,
   * or a probability (0–1) summing to ~1.
   */
  values: z.array(DistributionValueSchema).min(1),
});

export type Distribution = z.infer<typeof DistributionSchema>;