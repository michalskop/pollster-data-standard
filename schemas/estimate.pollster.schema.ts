import { z } from "zod";
import { DistributionSchema } from "./distribution.pollster.schema";

/**
 * Estimate — a model-derived estimate for a single choice.
 *
 * Layer: aggregate (contained within EstimateSnapshot)
 *
 * Part of an EstimateSnapshot. Covers any quantity the model computes:
 * voting share, seat count, or entry probability.
 *
 * These are outputs of the aggregation pipeline (poll-of-polls, Monte Carlo,
 * etc.), not raw values reported by any polling agency. For agency-reported
 * values see PollResult (source layer) or DerivedResult (compute layer).
 *
 * Canonical `type` values:
 *   "percents"             — estimated voting share
 *   "seats"                — estimated seat count
 *   "probability to enter" — probability of crossing the electoral threshold
 *
 * `lower_value` and `upper_value` are the bounds of the credible/confidence
 * interval at `probability_level_percentage` (default 95%).
 */
export const EstimateSchema = z.object({
  /**
   * ID of the choice (party, coalition) or candidate this estimate covers.
   * References Choice.id or Candidate.id.
   */
  choice_id: z.string().min(1),

  /**
   * What quantity is being estimated.
   * Canonical values: "percents", "seats", "probability to enter".
   */
  type: z.string().min(1),

  /** Point estimate (central value). */
  value: z.number(),

  /** Lower bound of the credible/confidence interval. */
  lower_value: z.number().optional(),

  /** Upper bound of the credible/confidence interval. */
  upper_value: z.number().optional(),

  /**
   * Additional computed values (median, mode, standard deviation, etc.).
   * Example: [{ "median_value": 67 }, { "std_dev": 4.2 }]
   */
  other_values: z.array(z.record(z.string(), z.union([z.number(), z.string(), z.null()]))).optional(),

  /**
   * Confidence/credibility level for `lower_value`/`upper_value`, in percent.
   * Default: 95.
   */
  probability_level_percentage: z.number().min(0).max(100).default(95),

  /**
   * Full probability or frequency distribution over discrete bins.
   * Provides the complete shape of uncertainty beyond the point estimate
   * and interval. The distribution `type` should match this Estimate's `type`.
   */
  distribution: DistributionSchema.optional(),
});

export type Estimate = z.infer<typeof EstimateSchema>;