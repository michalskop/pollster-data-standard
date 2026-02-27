import { z } from "zod";
import { DistributionValueSchema } from "./distribution-value.pollster.schema";

/**
 * Distribution — a probability or frequency distribution over discrete bins.
 * Layer: aggregate (optional field on Estimate)
 */
export const DistributionSchema = z.object({
  type: z.string().min(1).describe(
    "What quantity the distribution is over. Canonical values: \"seats\", \"percents\". Should match the parent Estimate.type."
  ),
  values: z.array(DistributionValueSchema).min(1).describe(
    "Ordered array of bins in ascending order of x."
  ),
}).describe(
  "A probability or frequency distribution over discrete bins.\n\n" +
  "Layer: aggregate (optional field on Estimate → EstimateSnapshot)\n\n" +
  "Provides the full shape of uncertainty beyond the point estimate and interval."
);

export type Distribution = z.infer<typeof DistributionSchema>;