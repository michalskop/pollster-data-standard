import { z } from "zod";
import { EstimateSchema } from "./estimate.pollster.schema";

/**
 * EstimateSnapshot — the output of a polling aggregation model at one point in time.
 *
 * Layer: aggregate (final output of the pipeline)
 *
 * Combines multiple individual polls using a statistical model
 * (e.g. Bayesian poll averaging, house-effect correction, Monte Carlo
 * seat simulation) and outputs probability distributions over party
 * support and seat counts.
 *
 * A new snapshot is produced each time the model is recomputed.
 *
 * IMPORTANT — scope boundary:
 *   EstimateSnapshot is the home for all computed/modelled outputs —
 *   poll-of-polls aggregates, seat distributions, entry probabilities,
 *   and majority scenario probabilities. It is completely separate from
 *   Poll / PollOutput, which store only what polling agencies publish.
 *   An EstimateSnapshot is never nested inside a Poll.
 *
 * Data flow:
 *   Poll (source) → ScenarioSnapshot (compute) → EstimateSnapshot (aggregate)
 */
export const EstimateSnapshotSchema = z.object({
  /** Unique stable identifier, e.g. "cz-parliament-2025-02-23". */
  id: z.string().min(1),

  /**
   * Region(s) this snapshot covers.
   * ISO 3166-1 alpha-2 or ISO 3166-2 codes.
   */
  region: z.union([z.string().min(1), z.array(z.string().min(1))]),

  /**
   * Election type being modelled.
   * Canonical values: "parliamentary", "presidential", "municipal",
   * "regional", "european", "referendum".
   */
  type: z.string().optional(),

  /**
   * ISO 8601 datetime (UTC) when the model was last computed.
   * Format: YYYY-MM-DDTHH:mm:ssZ
   */
  computed_at: z.string().datetime(),

  /**
   * Identifier for the model version that produced this snapshot.
   * Examples: "v1.2.0", "2025-02-01"
   */
  model_version: z.string().optional(),

  /**
   * Model estimates for each choice/candidate.
   * Typically contains separate Estimate entries for each type
   * ("percents", "seats", "probability to enter").
   */
  estimates: z.array(EstimateSchema).min(1),

  /** Extension point for additional fields (e.g. poll_count, total_seats). */
  extras: z.record(z.string(), z.unknown()).optional(),
});

export type EstimateSnapshot = z.infer<typeof EstimateSnapshotSchema>;

/** Array wrapper for a time series of snapshots. */
export const EstimateSnapshotsSchema = z.array(EstimateSnapshotSchema);
export type EstimateSnapshots = z.infer<typeof EstimateSnapshotsSchema>;