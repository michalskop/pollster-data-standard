import { z } from "zod";
import { PollResultSchema } from "./poll-result.pollster.schema";

/**
 * PollOutput — one "view" of results within a poll.
 *
 * A single poll may publish multiple outputs, e.g.:
 *   - "core"       : respondents who will definitely vote
 *   - "potential"  : including those who might vote for the party
 *   - "model"      : agency's own modelled/weighted figures
 *   - "participation": turnout-related figures
 *
 * Each output may cover a different sub-population and apply its own
 * lower reporting threshold.
 */
export const PollOutputSchema = z.object({
  /**
   * Type of output.
   * Canonical values: "core", "potential", "model", "participation".
   * Other values allowed.
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

  /** Per-choice voting intention figures for this output. */
  results: z.array(PollResultSchema),

  /**
   * Aggregate percentage for parties/candidates that are not individually
   * listed in `results` (e.g. combined "other parties" figure).
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
