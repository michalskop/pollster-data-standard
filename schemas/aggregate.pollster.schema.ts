import { z } from "zod";
import { CountryCodeSchema } from "./country-code.pollster.schema";
import { ElectionTypeSchema } from "./poll.pollster.schema";
import { AggregateResultSchema } from "./aggregate-result.pollster.schema";

/**
 * Aggregate — the output of a polling aggregation model for one election.
 *
 * An aggregate combines multiple individual polls using a statistical model
 * (e.g. Bayesian poll averaging, house-effect correction) and outputs
 * probability distributions over party support and seat counts.
 *
 * A new Aggregate record is produced each time the model is recomputed.
 */
export const AggregateSchema = z.object({
  /** Unique stable identifier, e.g. "cz-parliament-2025-02-23". */
  id: z.string().min(1),

  /** Country this aggregate covers. */
  country: CountryCodeSchema,

  /** Election type being aggregated. */
  electionType: ElectionTypeSchema,

  /**
   * ISO 8601 datetime (UTC) when the model was last computed.
   * Format: YYYY-MM-DDTHH:mm:ssZ
   */
  computedAt: z.string().datetime(),

  /**
   * Number of individual polls included in this aggregate.
   * Useful for communicating confidence to readers.
   */
  pollCount: z.number().int().positive().optional(),

  /**
   * Total seats in the legislature being modelled.
   * Required when `seats` figures are included in results.
   */
  totalSeats: z.number().int().positive().optional(),

  /**
   * Identifier for the model version used to produce this aggregate.
   * Allows reproducibility and changelog tracking.
   * Example: "v1.2.0", "2025-02-01"
   */
  modelVersion: z.string().optional(),

  /**
   * Per-party or per-coalition model output.
   * Ordered by descending `percent` is conventional but not required.
   */
  results: z.array(AggregateResultSchema).min(1),
});

export type Aggregate = z.infer<typeof AggregateSchema>;

/** Array wrapper for a series of aggregate snapshots (e.g. time series). */
export const AggregatesSchema = z.array(AggregateSchema);
export type Aggregates = z.infer<typeof AggregatesSchema>;
