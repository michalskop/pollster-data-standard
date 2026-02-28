import { z } from "zod";

/**
 * Pollster — a polling company or research institution.
 * Layer: reference data
 */
export const PollsterSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug").describe(
    "Stable slug identifier, e.g. \"kantar-cz\", \"stem\", \"cvvm\". " +
    "Referenced by Poll.pollster when Poll.pollster is used as a foreign key."
  ),
  name: z.string().min(1).describe(
    "Full official name of the polling agency, e.g. \"Kantar CZ\", \"STEM\", \"CVVM\"."
  ),
  short_name: z.string().optional().describe(
    "Abbreviated display name for charts and tables, e.g. \"Kantar\", \"STEM\"."
  ),
  abbreviation: z.string().optional().describe(
    "Very short abbreviation, e.g. \"KNT\", \"STM\". Used where space is very limited."
  ),
  url: z.string().url().optional().describe("URL of the pollster's website."),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Region(s) the pollster primarily operates in. ISO 3166-1 alpha-2 or ISO 3166-2 codes."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe(
    "Extension point for pipeline-specific fields, e.g. poll-of-polls weight score."
  ),
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