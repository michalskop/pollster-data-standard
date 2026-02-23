import { z } from "zod";
import { PollOutputSchema } from "./poll-output.pollster.schema";

/**
 * Poll — a single published opinion poll.
 *
 * Raw data as reported by the polling agency. Modelled/aggregated outputs
 * belong in EstimateSnapshot.
 *
 * Canonical `type` values: "parliamentary", "presidential", "municipal",
 * "regional", "european", "referendum".
 */
export const PollSchema = z.object({
  /**
   * Unique stable identifier, e.g. "kantar-cz-2025-02-01".
   */
  id: z.string().min(1),

  /**
   * Region(s) this poll covers.
   * ISO 3166-1 alpha-2 (country) or ISO 3166-2 (sub-national) codes.
   * Examples: "cz", ["cz", "sk"], "cz-pl" (Plzeňský kraj)
   */
  region: z.union([z.string().min(1), z.array(z.string().min(1))]),

  /**
   * Type of election being measured.
   * Canonical values: "parliamentary", "presidential", "municipal",
   * "regional", "european", "referendum".
   */
  type: z.string().optional(),

  /**
   * Name of the polling agency that conducted the fieldwork,
   * e.g. "Kantar CZ", "STEM", "CVVM", "Pollster.eu".
   */
  pollster: z.string().optional(),

  /**
   * Organisation(s) that commissioned the poll.
   * String for single sponsor; array for multiple.
   */
  sponsors: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),

  /**
   * URL(s) of the published source(s) for these results.
   * String for single source; array for multiple.
   */
  url: z.union([z.string().url(), z.array(z.string().url())]).optional(),

  /**
   * Date (or datetime) results were publicly released (ISO 8601).
   * Use the earliest known publication date.
   */
  published_at: z.string().optional(),

  /** First day of fieldwork (ISO 8601 date). */
  start_date: z.string().date().optional(),

  /** Last day of fieldwork (ISO 8601 date). */
  end_date: z.string().date().optional(),

  /**
   * Representative date for time-series placement (ISO 8601 date or datetime).
   * Typically the fieldwork midpoint. Used when plotting poll on a timeline.
   */
  central_date: z.string().optional(),

  /**
   * Number of respondents interviewed.
   * Null if not published.
   */
  sample_size: z.number().int().positive().nullable().optional(),

  /**
   * Population the poll is intended to represent.
   * Example: "18+", "registered voters", "likely voters"
   */
  population: z.string().optional(),

  /**
   * How the poll was conducted.
   * Example: "100% CATI", "CAWI", "CAPI/CAWI mixed"
   */
  method: z.string().optional(),

  /**
   * Overall margin of error for the poll.
   * Free string — agencies report in varying formats.
   * Examples: "±3%", "2.8 pp", "95% CI ±3.1 pp"
   */
  margin_of_error: z.string().optional(),

  /**
   * Poll outputs (one or more views of the results).
   * At minimum one output with type "core" or "model" is expected.
   */
  outputs: z.array(PollOutputSchema).min(1),

  /** Extension point for additional fields. */
  extras: z.record(z.string(), z.unknown()).optional(),
});

export type Poll = z.infer<typeof PollSchema>;

/** Array wrapper for a full polls file. */
export const PollsSchema = z.array(PollSchema);
export type Polls = z.infer<typeof PollsSchema>;
