import { z } from "zod";
import { DerivationSchema } from "./derivation.pollster.schema";

/**
 * DerivedResult — a single choice's value within a scenario-normalised poll.
 *
 * Layer: compute (output of the scenario derivation step)
 *
 * Replaces PollResult at the scenario layer. Every value carries full
 * provenance via the Derivation object so that simulations can apply
 * appropriate uncertainty based on estimation confidence.
 *
 * Relationship to source data:
 *   PollResult (source layer) — raw value as the agency reported it.
 *   DerivedResult (compute layer) — value after normalisation to the
 *     scenario's choice grouping, with estimation as needed.
 *
 * value_percent is null when derivation.method = "absent".
 * is_estimated is true for every method except "direct" and "members_sum"
 * (where all source values are themselves direct).
 */
export const DerivedResultSchema = z.object({
  /** References Choice.id. */
  choice_id: z.string().min(1),

  /**
   * Percentage value (0–100). Null when the value could not be estimated.
   * For members_partial sums this is the sum of resolved members plus
   * any estimates for missing members.
   */
  value_percent: z.number().nullable(),

  /**
   * Top-level flag: true when any part of this value was computed rather
   * than directly measured by the pollster. Mirrors derivation.method !== "direct"
   * and !== "members_sum" (all direct), provided as a convenience shortcut.
   */
  is_estimated: z.boolean(),

  /** Full provenance record. */
  derivation: DerivationSchema,
});

export type DerivedResult = z.infer<typeof DerivedResultSchema>;