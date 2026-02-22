import { z } from "zod";
import { CountryCodeSchema } from "./country-code.pollster.schema";
import { PollResultSchema } from "./poll-result.pollster.schema";

/**
 * ElectionType — the type of election a poll is measuring.
 */
export const ElectionTypeSchema = z.enum([
  "parliament",   // lower/upper house / national assembly
  "president",    // direct presidential election
  "municipal",    // local / city council
  "regional",     // regional / county assembly
  "european",     // European Parliament
  "senate",       // upper chamber where separate from parliament
  "referendum",   // referendum / plebiscite
]);

export type ElectionType = z.infer<typeof ElectionTypeSchema>;

/**
 * Methodology — how the poll was conducted.
 */
export const MethodologySchema = z.enum([
  "phone",         // CATI (computer-assisted telephone interviewing)
  "online",        // CAWI (web panel, online questionnaire)
  "face-to-face",  // CAPI / PAPI (in-person interviewing)
  "mixed",         // combination of methods
  "other",         // any other or unspecified method
]);

export type Methodology = z.infer<typeof MethodologySchema>;

/**
 * Poll — a single published opinion poll.
 *
 * The `id` should be stable and unique across all polls in a dataset,
 * e.g. a slug derived from agency + published date: "kantar-2025-01-15".
 */
export const PollSchema = z.object({
  /** Unique stable identifier for this poll, e.g. "kantar-2025-01-15". */
  id: z.string().min(1),

  /** Country this poll was conducted in. */
  country: CountryCodeSchema,

  /** Type of election being measured. */
  electionType: ElectionTypeSchema,

  /**
   * Name of the polling agency that conducted the fieldwork,
   * e.g. "Kantar CZ", "STEM", "CVVM".
   */
  agency: z.string().min(1),

  /**
   * Name of the organisation or media outlet that commissioned the poll.
   * Omit if self-commissioned or unknown.
   */
  commissioner: z.string().min(1).optional(),

  /**
   * Date the poll results were publicly released (ISO 8601 date, YYYY-MM-DD).
   * Use the earliest known publication date.
   */
  publishedAt: z.string().date(),

  /**
   * First day of fieldwork (ISO 8601 date).
   * Omit if the agency did not publish fieldwork dates.
   */
  fieldworkStart: z.string().date().optional(),

  /**
   * Last day of fieldwork (ISO 8601 date).
   * Omit if the agency did not publish fieldwork dates.
   */
  fieldworkEnd: z.string().date().optional(),

  /**
   * Number of respondents interviewed.
   * Omit if the agency did not publish a sample size.
   */
  sampleSize: z.number().int().positive().optional(),

  /** How the poll was conducted. */
  methodology: MethodologySchema.optional(),

  /**
   * Canonical URL of the primary published source for these results.
   * Should link to the agency's press release or data page.
   */
  sourceUrl: z.string().url().optional(),

  /**
   * Per-party or per-coalition voting intention figures.
   * Ordered by descending `percent` is conventional but not required.
   */
  results: z.array(PollResultSchema).min(1),
});

export type Poll = z.infer<typeof PollSchema>;

/** Array wrapper for a full polls file. */
export const PollsSchema = z.array(PollSchema);
export type Polls = z.infer<typeof PollsSchema>;
