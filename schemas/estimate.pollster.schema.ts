import { z } from "zod";
import { DistributionSchema } from "./distribution.pollster.schema";

/**
 * Estimate — a model-derived estimate for a single choice.
 * Layer: aggregate (contained within EstimateSnapshot)
 */
export const EstimateSchema = z.object({
  choice_id: z.string().min(1).describe(
    "ID of the choice (party, coalition) or candidate this estimate covers. References Choice.id or Candidate.id."
  ),
  type: z.string().min(1).describe(
    "What quantity is being estimated. Canonical values: \"percents\", \"seats\", \"probability to enter\"."
  ),
  value: z.number().describe("Point estimate (central value)."),
  lower_value: z.number().optional().describe("Lower bound of the credible/confidence interval."),
  upper_value: z.number().optional().describe("Upper bound of the credible/confidence interval."),
  other_values: z.array(z.record(z.string(), z.union([z.number(), z.string(), z.null()]))).optional().describe(
    "Additional computed values (median, mode, standard deviation, etc.). Example: [{ \"median_value\": 67 }]"
  ),
  probability_level_percentage: z.number().min(0).max(100).default(95).describe(
    "Confidence/credibility level for lower_value/upper_value, in percent. Default: 95."
  ),
  distribution: DistributionSchema.optional().describe(
    "Full probability distribution over discrete bins. Provides the complete shape of uncertainty."
  ),
}).describe(
  "A model-derived estimate for a single choice.\n\n" +
  "Layer: aggregate (contained in EstimateSnapshot)\n\n" +
  "These are outputs of the aggregation pipeline (poll-of-polls, Monte Carlo, etc.) — " +
  "not raw values reported by any polling agency. " +
  "For agency-reported values see PollResult (source) or DerivedResult (compute)."
);

export type Estimate = z.infer<typeof EstimateSchema>;