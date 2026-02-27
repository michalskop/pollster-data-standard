import { z } from "zod";

/**
 * Candidate — an individual running in a direct election.
 * Layer: reference data
 */
export const CandidateSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug").describe(
    "Stable slug identifier, e.g. \"pavel-petr\", \"babis-andrej\"."
  ),
  name: z.string().min(1).describe("Full display name (canonical)."),
  family_name: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Family (last) name(s). Array for compound surnames."
  ),
  given_name: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Given (first) name(s). Array for multiple given names."
  ),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Region(s) this candidate is running in. ISO 3166-1 alpha-2 or ISO 3166-2 codes."
  ),
  image_url: z.string().url().optional().describe("URL to a candidate photo (HTTPS)."),
  supported_by: z.array(z.string().min(1)).optional().describe(
    "Choice IDs (party or coalition) that endorse or support this candidate. References Choice.id values."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields."),
}).describe(
  "An individual running in a direct election.\n\n" +
  "Layer: reference data\n\n" +
  "Used for presidential races, senate elections, and other contests where individual candidate data is relevant. " +
  "For proportional-list elections, use Choice instead."
);

export type Candidate = z.infer<typeof CandidateSchema>;

/** Array wrapper for a full candidates file. */
export const CandidatesSchema = z.array(CandidateSchema).describe("Array of Candidate objects.");
export type Candidates = z.infer<typeof CandidatesSchema>;