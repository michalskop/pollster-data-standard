import { z } from "zod";

/**
 * ScenarioEstimation — policy for filling missing values when deriving
 * a poll's results under a scenario.
 *
 * All thresholds are configurable per scenario so different scenarios
 * can apply different levels of caution.
 */
export const ScenarioEstimationSchema = z.object({
  /**
   * Include a coalition in the result even if some member values are
   * missing (partial sum). The coalition is marked is_estimated = true
   * and derivation.method = "members_partial".
   * Default: true.
   */
  allow_partial_members: z.boolean().default(true),

  // "known-active" filter — applied before cut_estimate and pool_estimate
  // to distinguish parties with genuine recent support from dormant ones.

  /**
   * Minimum number of recent polls in which the choice must appear
   * (at >= active_min_value) to be considered "known active".
   * Default: 2.
   */
  active_min_polls: z.number().int().min(1).default(2),

  /**
   * How many of the most recent polls (by central_date / end_date) to
   * search when applying the known-active filter.
   * Default: 10.
   */
  active_window_polls: z.number().int().min(1).default(10),

  /**
   * Minimum value_percent a choice must have in a poll to count as
   * an "active" appearance for the known-active filter.
   * Default: 0.3.
   */
  active_min_value: z.number().min(0).default(0.3),

  /**
   * Fraction of lower_cut_percent to assign as the estimated value
   * for a choice that is under the cut or passes the known-active filter.
   * Default: 0.5 (half the cut).
   */
  cut_fraction: z.number().min(0).max(1).default(0.5),

  /**
   * How the jiné-strany (or unaccounted residual) pool is distributed
   * among absent known-active choices.
   * "equal"        — equal share for each qualifying choice.
   * "proportional" — shares weighted by each choice's relative value
   *                  in neighboring polls (requires temporal data).
   * Default: "equal".
   */
  pool_method: z.enum(["equal", "proportional"]).default("equal"),

  /**
   * Maximum value_percent any single choice may receive from the pool.
   * Prevents a single choice from consuming the entire pool.
   * Optional — no cap if omitted.
   */
  pool_cap_per_party: z.number().min(0).optional(),

  /**
   * Hard ceiling: the sum of all derived values in a scenario poll may
   * not exceed this. Estimated values are scaled down proportionally
   * until the constraint is satisfied.
   * Default: 100.
   */
  max_total: z.number().min(0).default(100),
});

export type ScenarioEstimation = z.infer<typeof ScenarioEstimationSchema>;

/**
 * Scenario — definition of a display/simulation grouping.
 *
 * A scenario specifies exactly which choices are included, in what order,
 * and how to fill in missing values from raw poll data. It is the input
 * to the compute-scenarios script which produces ScenarioSnapshot files.
 *
 * Scenarios live in:
 *   apps/{instance}/data/{election}/{term}/scenarios.json
 */
export const ScenarioSchema = z.object({
  /** Unique slug. Referenced by ScenarioSnapshot.scenario_id. */
  id: z.string().min(1),

  /** Human-readable label (in the instance's default language). */
  label: z.string().min(1),

  /**
   * ISO 3166-1 alpha-2 / ISO 3166-2 region code, or array of codes.
   * Matches Poll.region.
   */
  region: z.union([z.string(), z.array(z.string())]),

  /** Election type (e.g. "parliamentary"). Matches Poll.type. */
  election_type: z.string().optional(),

  /**
   * Whether this is the default scenario shown to end users.
   * At most one scenario per region/election_type should be true.
   */
  is_default: z.boolean().optional(),

  /**
   * Ordered list of choice_ids to include in this scenario.
   * Order controls display order in charts and tables.
   */
  choices: z.array(z.string().min(1)).min(1),

  /**
   * Priority-ordered list of poll output tags to try when looking for a
   * direct value. The first matching output tag wins.
   *
   * Example: ["coalitions", "parties"] means prefer a coalitions-tagged
   * output; fall back to a parties-tagged output if coalitions is absent.
   */
  preferred_tags: z.array(z.string().min(1)).min(1),

  /**
   * What to do when no raw output has the choice directly.
   * "members_sum" — sum member choice values (recurses through derivation).
   * "none"        — leave as absent without attempting member derivation.
   * Default: "members_sum".
   */
  fallback: z.enum(["members_sum", "none"]).default("members_sum"),

  /**
   * Coalition composition map: choice_id → member choice_ids.
   *
   * Defines which parties make up each coalition **within this scenario**.
   * This is the authoritative source for member lookups during derivation —
   * the compute script uses this map before falling back to Choice.members
   * in choices.json. Listing it here makes the scenario self-documenting
   * and allows the same choice to have different compositions across scenarios
   * (e.g. a coalition that changes members between election terms).
   *
   * Example:
   *   { "spolu": ["ods", "top-09", "kdu-csl"], "stacilo": ["kscm"] }
   */
  composition: z.record(z.string(), z.array(z.string())).optional(),

  /**
   * choice_id of the catch-all "others" bucket.
   *
   * When set, any party that appears in a poll's output but is NOT listed
   * in `choices` and is NOT a member of a listed coalition is automatically
   * added to this bucket. This means new parties showing up in polls flow
   * into "others" without requiring changes to the scenario definition.
   *
   * The others_id choice must also appear in `choices` (typically last).
   * Its value = sum of all unmapped parties in the poll + the pollster's
   * own jiné-strany measurement (if the pollster uses a different id).
   *
   * Example: "jine-strany"
   */
  others_id: z.string().optional(),

  /** Policy for filling missing values. */
  estimation: ScenarioEstimationSchema,

  /** Arbitrary extra fields. */
  extras: z.record(z.unknown()).optional(),
});

export const ScenariosSchema = z.array(ScenarioSchema);

export type Scenario = z.infer<typeof ScenarioSchema>;
export type Scenarios = z.infer<typeof ScenariosSchema>;
