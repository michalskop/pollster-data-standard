import { z } from "zod";

/**
 * Candidate — an individual running in a direct election.
 *
 * Used for presidential races, senate elections, and other contests
 * where individual candidate data is relevant.
 * For proportional-list elections, use Choice instead.
 */
export const CandidateSchema = z.object({
  /**
   * Stable slug identifier, e.g. "pavel-petr", "babis-andrej".
   */
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug"),

  /** Full display name (canonical). */
  name: z.string().min(1),

  /**
   * Family (last) name(s).
   * Array for compound surnames.
   */
  family_name: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),

  /**
   * Given (first) name(s).
   * Array for multiple given names.
   */
  given_name: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),

  /**
   * Region(s) this candidate is running in.
   * ISO 3166-1 alpha-2 or ISO 3166-2 codes.
   */
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),

  /** URL to a candidate photo (HTTPS). */
  image_url: z.string().url().optional(),

  /**
   * Choice IDs (party or coalition) that endorse or support this candidate.
   * References Choice.id values.
   */
  supported_by: z.array(z.string().min(1)).optional(),

  /** Extension point for additional fields. */
  extras: z.record(z.string(), z.unknown()).optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;

/** Array wrapper for a full candidates file. */
export const CandidatesSchema = z.array(CandidateSchema);
export type Candidates = z.infer<typeof CandidatesSchema>;
