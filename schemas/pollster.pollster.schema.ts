import { z } from "zod";

/**
 * Pollster — a polling company or research institution.
 * Layer: reference data
 */
export const PollsterSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug").describe(
    "Stable slug identifier, e.g. \"kantar-cz\", \"stem\", \"cvvm\". Referenced by Poll.pollster."
  ),
  name: z.string().min(1).describe(
    "Full official name of the polling agency, e.g. \"Kantar CZ\", \"STEM\", \"CVVM\"."
  ),
  abbreviation: z.string().optional().describe(
    "Short abbreviation for charts and tables, e.g. \"Kantar\", \"STEM\"."
  ),
  url: z.string().url().optional().describe("URL of the pollster's website or primary source page."),
  score: z.number().nullable().optional().describe(
    "Poll-of-polls quality/reliability score for this pollster. " +
    "Used as a weight multiplier when computing weighted poll averages. " +
    "Null means the pollster is not currently scored (excluded from weighted averages). " +
    "Scale and interpretation are pipeline-defined."
  ),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Region(s) the pollster primarily operates in. ISO 3166-1 alpha-2 or ISO 3166-2 codes."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields."),
}).describe(
  "A polling company or research institution.\n\n" +
  "Layer: reference data\n\n" +
  "Pollster.id is the stable key referenced by Poll.pollster. " +
  "Storing pollster metadata separately allows consistent weighting, " +
  "house-effect correction, and attribution across all polls."
);

export type Pollster = z.infer<typeof PollsterSchema>;

/** Array wrapper for a full pollsters file. */
export const PollstersSchema = z.array(PollsterSchema).describe("Array of Pollster objects.");
export type Pollsters = z.infer<typeof PollstersSchema>;