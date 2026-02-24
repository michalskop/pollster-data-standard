import { z } from "zod";

/**
 * DerivationMethod — how a DerivedResult value was obtained.
 *
 * Priority order used by the compute script:
 *   direct > members_sum > members_partial > cut_estimate > pool_estimate > absent
 *
 * "temporal" is reserved for future cross-poll imputation.
 */
export const DerivationMethodSchema = z.enum([
  /** Value came directly from a matching poll output. Not estimated. */
  "direct",
  /** Sum of all member choices; every member was resolved directly. Not estimated. */
  "members_sum",
  /** Sum of present members; one or more members were absent and estimated. */
  "members_partial",
  /** Half of lower_cut_percent from the same poll output (named under cut, or known-active filter). */
  "cut_estimate",
  /** Distributed share of the jiné strany / unaccounted pool value from the same poll. */
  "pool_estimate",
  /** Estimated from neighboring polls by date. Reserved — not yet implemented. */
  "temporal",
  /**
   * Sum of all poll values not mapped to any named choice in the scenario.
   * Used exclusively for the scenario's others_id catch-all choice.
   * source_members lists every choice_id that was included in the sum.
   */
  "others_sum",
  /** No basis for estimation. value_percent will be null. */
  "absent",
]);

export type DerivationMethod = z.infer<typeof DerivationMethodSchema>;

/**
 * Derivation — full provenance record attached to every DerivedResult.
 *
 * Only fields relevant to the specific method need to be populated.
 */
export const DerivationSchema = z.object({
  method: DerivationMethodSchema,

  // --- direct / members_sum / members_partial ---

  /** output_type of the raw PollOutput used as source. */
  source_output_type: z.string().optional(),
  /** tags[] of the raw PollOutput used as source. */
  source_tags: z.array(z.string()).optional(),
  /** choice_ids of member choices that were successfully resolved. */
  source_members: z.array(z.string()).optional(),
  /** choice_ids of member choices that could not be resolved and were estimated or absent. */
  missing_members: z.array(z.string()).optional(),

  // --- cut_estimate ---

  /** The lower_cut_percent value from the poll output. */
  cut_value: z.number().optional(),
  /**
   * Fraction of cut_value assigned as the estimate.
   * Default 0.5 (half the cut).
   */
  cut_fraction: z.number().optional(),

  // --- pool_estimate ---

  /** choice_id of the pool choice (typically "jine-strany"). */
  pool_choice_id: z.string().optional(),
  /** Measured value of the pool choice in the poll output. */
  pool_value: z.number().optional(),
  /** Other choice_ids sharing the pool with this one. */
  pool_peers: z.array(z.string()).optional(),
  /** Distribution method applied to the pool. */
  pool_method: z.enum(["equal", "proportional"]).optional(),

  // --- temporal (reserved) ---

  /** Poll ids used as source for temporal estimation. */
  temporal_source_polls: z.array(z.string()).optional(),
  /** Method used to combine temporal sources. */
  temporal_method: z.string().optional(),
  /** Time window (days) used to select neighboring polls. */
  temporal_window_days: z.number().optional(),

  /** Arbitrary extra provenance fields. */
  extras: z.record(z.unknown()).optional(),
});

export type Derivation = z.infer<typeof DerivationSchema>;
