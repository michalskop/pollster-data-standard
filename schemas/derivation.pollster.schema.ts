import { z } from "zod";

/**
 * Derivation — provenance record for a DerivedResult.
 * Layer: compute
 */
export const DerivationMethodSchema = z.enum([
  "direct",
  "members_sum",
  "members_partial",
  "cut_estimate",
  "pool_estimate",
  "temporal",
  "others_sum",
  "absent",
]).describe(
  "How a DerivedResult value was obtained.\n\n" +
  "direct: value came directly from a matching poll output (not estimated).\n" +
  "members_sum: sum of all member choices; every member resolved directly (not estimated).\n" +
  "members_partial: sum of present members; one or more members estimated.\n" +
  "cut_estimate: half of lower_cut_percent from the same poll output.\n" +
  "pool_estimate: distributed share of the unaccounted pool value.\n" +
  "others_sum: sum of all poll values not mapped to any named choice (for others_id).\n" +
  "temporal: estimated from neighboring polls by date (reserved, not yet implemented).\n" +
  "absent: no basis for estimation; value_percent will be null."
);

export type DerivationMethod = z.infer<typeof DerivationMethodSchema>;

export const DerivationSchema = z.object({
  method: DerivationMethodSchema,
  source_output_type: z.string().optional().describe("output_type of the raw PollOutput used as source."),
  source_tags: z.array(z.string()).optional().describe("tags[] of the raw PollOutput used as source."),
  source_members: z.array(z.string()).optional().describe("choice_ids of member choices that were successfully resolved."),
  missing_members: z.array(z.string()).optional().describe("choice_ids of member choices that could not be resolved."),
  cut_value: z.number().optional().describe("The lower_cut_percent value from the poll output (for cut_estimate)."),
  cut_fraction: z.number().optional().describe("Fraction of cut_value assigned as the estimate. Default 0.5."),
  pool_choice_id: z.string().optional().describe("choice_id of the pool choice, typically the \"others\" bucket (for pool_estimate)."),
  pool_value: z.number().optional().describe("Measured value of the pool choice in the poll output."),
  pool_peers: z.array(z.string()).optional().describe("Other choice_ids sharing the pool with this one."),
  pool_method: z.enum(["equal", "proportional"]).optional().describe("Distribution method applied to the pool."),
  temporal_source_polls: z.array(z.string()).optional().describe("Poll ids used as source for temporal estimation (reserved)."),
  temporal_method: z.string().optional().describe("Method used to combine temporal sources (reserved)."),
  temporal_window_days: z.number().optional().describe("Time window (days) used to select neighboring polls (reserved)."),
  extras: z.record(z.unknown()).optional().describe("Arbitrary extra provenance fields."),
}).describe(
  "Full provenance record attached to every DerivedResult.\n\n" +
  "Layer: compute (embedded in DerivedResult)\n\n" +
  "Records exactly how the value was obtained from source poll data. " +
  "Only fields relevant to the specific method need to be populated."
);

export type Derivation = z.infer<typeof DerivationSchema>;