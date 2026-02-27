import { z } from "zod";

/**
 * DistributionValue — one bin of a probability or frequency distribution.
 * Layer: aggregate (embedded in Distribution → Estimate → EstimateSnapshot)
 */
export const DistributionValueSchema = z.object({
  x: z.string().min(1).describe(
    "Bin label — exact value or range. Examples: \"10\" (exact), \"9-10\" (range), \"<5\" (open-ended)."
  ),
  value: z.number().describe(
    "Probability mass or frequency for this bin. " +
    "Typically a percentage (0–100) summing to ~100 across all bins, or a probability (0–1) summing to ~1."
  ),
}).describe(
  "One bin of a probability or frequency distribution.\n\n" +
  "Layer: aggregate (embedded in Distribution → Estimate → EstimateSnapshot)"
);

export type DistributionValue = z.infer<typeof DistributionValueSchema>;