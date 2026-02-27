import { z } from "zod";
import { PollResultSchema } from "./poll-result.pollster.schema";

/**
 * PollOutput — one "view" of results within a poll.
 *
 * Layer: source / ingestion (raw agency-reported data)
 *
 * A single poll may publish multiple outputs, e.g.:
 *   - "core"          : respondents who will definitely vote
 *   - "potential"     : including those who might vote for the party
 *   - "model"         : the agency's own modelled/weighted figures
 *   - "participation" : turnout-related figures (abstention, undecided, blank)
 *
 * Each output may cover a different sub-population and apply its own
 * lower reporting threshold.
 *
 * IMPORTANT — scope boundary:
 *   PollOutput (and Poll) represent data exactly as the polling agency
 *   publishes it. This includes any internal model the agency applies to
 *   their own data (output_type = "model" means the agency's model, not
 *   the aggregation pipeline's model). Poll-of-polls aggregates, Monte
 *   Carlo simulations, and other computed estimates are stored in
 *   EstimateSnapshot — a completely separate schema that is never nested
 *   inside Poll.
 */
export const PollOutputSchema = z.object({
  /**
   * Type of output.
   * Canonical values: "core", "potential", "model", "participation".
   * Other values allowed.
   *
   * Note: "model" here means the polling agency's own weighted/adjusted
   * figures, not anything produced by the aggregation pipeline.
   */
  output_type: z.string().min(1),

  /**
   * Descriptive tags for filtering and grouping.
   * Examples: ["parties", "main"], ["candidates", "first-round"]
   */
  tags: z.array(z.string()).optional(),

  /**
   * Sub-population this output covers (if narrower than the poll-level population).
   * Example: "Women 18–34", "Definite voters"
   */
  sub_population: z.string().optional(),

  /**
   * Margin of error for this output.
   * Free string — agencies report in different formats.
   * Examples: "±3%", "2.8 pp", "95% CI ±3.1 pp"
   */
  margin_of_error: z.string().optional(),

  /**
   * Choices (parties/candidates) below this percent threshold are not
   * individually reported by the agency.
   * Example: 2.0 means parties under 2% are suppressed.
   */
  lower_cut_percent: z.number().min(0).max(100).optional(),

  /**
   * Named choices that were included in fieldwork but fell below
   * `lower_cut_percent` and are therefore not listed in `results`.
   * Example: ["Small Party A", "Small Party B"]
   */
  under_lower_cut: z.array(z.string()).optional(),

  /**
   * Per-choice voting intention figures for this output.
   * May be empty when the output records only aggregate figures
   * (e.g. a participation output with only `undecided_percent`).
   */
  results: z.array(PollResultSchema),

  /**
   * Aggregate percentage for parties/candidates that are not individually
   * listed in `results` (e.g. combined "other parties" figure reported by
   * the agency alongside the named results).
   */
  others_percent: z.number().min(0).max(100).optional(),

  /**
   * Percentage of respondents who are undecided or answered "don't know".
   */
  undecided_percent: z.number().min(0).max(100).optional(),

  /**
   * Percentage of respondents who plan to abstain / will not vote.
   */
  abstention_percent: z.number().min(0).max(100).optional(),

  /**
   * Percentage of respondents who plan to cast a blank or null ballot.
   */
  blank_percent: z.number().min(0).max(100).optional(),

  /** Extension point for additional fields. */
  extras: z.record(z.string(), z.unknown()).optional(),
});

export type PollOutput = z.infer<typeof PollOutputSchema>;
