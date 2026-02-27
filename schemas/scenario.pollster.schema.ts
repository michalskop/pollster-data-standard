import { z } from "zod";

/**
 * Scenario — definition of a display/simulation grouping.
 * Layer: config (input to the compute layer)
 */
export const ScenarioEstimationSchema = z.object({
  allow_partial_members: z.boolean().default(true).describe(
    "Include a coalition even if some member values are missing (partial sum). Default: true."
  ),
  active_min_polls: z.number().int().min(1).default(2).describe(
    "Minimum number of recent polls in which a choice must appear (at ≥ active_min_value) to be considered \"known active\". Default: 2."
  ),
  active_window_polls: z.number().int().min(1).default(10).describe(
    "How many of the most recent polls to search when applying the known-active filter. Default: 10."
  ),
  active_min_value: z.number().min(0).default(0.3).describe(
    "Minimum value_percent a choice must have in a poll to count as an \"active\" appearance. Default: 0.3."
  ),
  cut_fraction: z.number().min(0).max(1).default(0.5).describe(
    "Fraction of lower_cut_percent to assign as the estimated value for a choice under the cut. Default: 0.5 (half the cut)."
  ),
  pool_method: z.enum(["equal", "proportional"]).default("equal").describe(
    "How the unaccounted residual pool is distributed among absent known-active choices. Default: \"equal\"."
  ),
  pool_cap_per_party: z.number().min(0).optional().describe(
    "Maximum value_percent any single choice may receive from the pool. No cap if omitted."
  ),
  max_total: z.number().min(0).default(100).describe(
    "Hard ceiling: sum of all derived values in a scenario poll may not exceed this. Default: 100."
  ),
}).describe(
  "Policy for filling missing values when deriving a poll's results under a scenario.\n\n" +
  "Layer: config (embedded in Scenario)"
);

export type ScenarioEstimation = z.infer<typeof ScenarioEstimationSchema>;

export const ScenarioSchema = z.object({
  id: z.string().min(1).describe("Unique slug. Referenced by ScenarioSnapshot.scenario_id."),
  label: z.string().min(1).describe("Human-readable label in the instance's default language."),
  region: z.union([z.string(), z.array(z.string())]).describe(
    "ISO 3166-1 alpha-2 / ISO 3166-2 region code, or array. Matches Poll.region."
  ),
  election_type: z.string().optional().describe("Election type, e.g. \"parliamentary\". Matches Poll.type."),
  is_default: z.boolean().optional().describe(
    "Whether this is the default scenario shown to end users. At most one scenario per region/election_type should be true."
  ),
  choices: z.array(z.string().min(1)).min(1).describe(
    "Ordered list of choice_ids to include. Order controls display order in charts and tables."
  ),
  preferred_tags: z.array(z.string().min(1)).min(1).describe(
    "Priority-ordered list of poll output tags to try when looking for a direct value. First matching tag wins."
  ),
  fallback: z.enum(["members_sum", "none"]).default("members_sum").describe(
    "What to do when no raw output has the choice directly. \"members_sum\": sum member choice values. \"none\": leave as absent."
  ),
  composition: z.record(z.string(), z.array(z.string())).optional().describe(
    "Coalition composition map: choice_id → member choice_ids. Authoritative source for member lookups during derivation."
  ),
  others_id: z.string().optional().describe(
    "choice_id of the catch-all \"others\" bucket. Unmapped parties flow here automatically."
  ),
  estimation: ScenarioEstimationSchema,
  extras: z.record(z.unknown()).optional().describe("Arbitrary extra fields."),
}).describe(
  "Definition of a display/simulation grouping.\n\n" +
  "Layer: config (input to the compute layer)\n\n" +
  "Specifies which choices are included and how to fill missing values from raw poll data. " +
  "Input to the compute-scenarios script which produces ScenarioSnapshot files."
);

export const ScenariosSchema = z.array(ScenarioSchema).describe("Array of Scenario objects.");

export type Scenario = z.infer<typeof ScenarioSchema>;
export type Scenarios = z.infer<typeof ScenariosSchema>;