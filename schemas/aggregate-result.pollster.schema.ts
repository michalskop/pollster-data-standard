import { z } from "zod";

/**
 * AggregateResult — a single party or coalition entry in an aggregated model output.
 *
 * All percent/seat figures are point estimates from the aggregation model.
 * `low`/`high` are the bounds of the 95% credible (or confidence) interval.
 */
export const AggregateResultSchema = z.object({
  /**
   * ID of the party or coalition (matches Party.id or Coalition.id).
   */
  partyId: z.string().min(1),

  /** Central estimate of voting share, in percent (0–100). */
  percent: z.number().min(0).max(100),

  /** Lower bound of the 95% interval for voting share, in percent (0–100). */
  low: z.number().min(0).max(100),

  /** Upper bound of the 95% interval for voting share, in percent (0–100). */
  high: z.number().min(0).max(100),

  /** Point estimate of seats won under the applicable allocation method (e.g. d'Hondt). */
  seats: z.number().int().min(0).optional(),

  /** Lower bound of the 95% interval for seat count. */
  seatsLow: z.number().int().min(0).optional(),

  /** Upper bound of the 95% interval for seat count. */
  seatsHigh: z.number().int().min(0).optional(),

  /**
   * Probability that this party/coalition crosses its electoral threshold,
   * as a value between 0 (certain exclusion) and 1 (certain entry).
   * Derived from the distribution of model draws above the threshold.
   */
  entryProbability: z.number().min(0).max(1).optional(),
});

export type AggregateResult = z.infer<typeof AggregateResultSchema>;
