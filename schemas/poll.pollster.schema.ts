import { z } from "zod";
import { PollOutputSchema } from "./poll-output.pollster.schema";

/**
 * Poll — a single published opinion poll.
 * Layer: source / ingestion (raw agency-reported data)
 *
 * Data flow:
 *   SOURCE (Poll/PollOutput/PollResult) →
 *   COMPUTE (ScenarioSnapshot/ScenarioPoll/DerivedResult) →
 *   AGGREGATE (EstimateSnapshot/Estimate)
 */
export const PollSchema = z.object({
  id: z.string().min(1).describe("Unique stable identifier, e.g. \"kantar-cz-2025-02-01\"."),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).describe(
    "Region(s) this poll covers. ISO 3166-1 alpha-2 (country) or ISO 3166-2 (sub-national) codes."
  ),
  type: z.string().optional().describe(
    "Type of election being measured. Canonical values: \"parliamentary\", \"presidential\", \"municipal\", \"regional\", \"european\", \"referendum\"."
  ),
  pollster: z.string().optional().describe(
    "ID or name of the polling agency. Should reference Pollster.id when a pollsters.json reference file is maintained."
  ),
  sponsors: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Organisation(s) that commissioned the poll. String for single sponsor; array for multiple."
  ),
  url: z.union([z.string().url(), z.array(z.string().url())]).optional().describe(
    "URL(s) of the published source(s) for these results."
  ),
  published_at: z.string().optional().describe(
    "Date (or datetime) results were publicly released (ISO 8601). Use the earliest known publication date."
  ),
  start_date: z.string().date().optional().describe("First day of fieldwork (ISO 8601 date)."),
  end_date: z.string().date().optional().describe("Last day of fieldwork (ISO 8601 date)."),
  central_date: z.string().optional().describe(
    "Representative date for time-series placement (ISO 8601). Typically the fieldwork midpoint."
  ),
  sample_size: z.number().int().positive().nullable().optional().describe(
    "Number of respondents interviewed. Null if not published."
  ),
  population: z.string().optional().describe(
    "Population the poll is intended to represent. Example: \"18+\", \"registered voters\", \"likely voters\""
  ),
  method: z.string().optional().describe(
    "How the poll was conducted. Example: \"100% CATI\", \"CAWI\", \"CAPI/CAWI mixed\""
  ),
  margin_of_error: z.string().optional().describe(
    "Overall margin of error. Free string. Examples: \"±3%\", \"2.8 pp\""
  ),
  outputs: z.array(PollOutputSchema).min(1).describe(
    "Poll outputs — one or more views of the results. " +
    "At minimum one output with type \"core\" or \"model\" is expected. " +
    "output_type=\"model\" refers to the agency's own model, not the aggregation pipeline's model (see EstimateSnapshot for that)."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields."),
}).describe(
  "A single published opinion poll.\n\n" +
  "Layer: source / ingestion (raw agency-reported data)\n\n" +
  "Contains data exactly as reported by the polling agency — nothing here is computed or adjusted by the aggregation pipeline.\n\n" +
  "Data flow: Poll (source) → ScenarioSnapshot (compute) → EstimateSnapshot (aggregate).\n\n" +
  "Note: output_type=\"model\" in a PollOutput means the agency's own weighted/adjusted figures. " +
  "The aggregation pipeline's model outputs belong in EstimateSnapshot."
);

export type Poll = z.infer<typeof PollSchema>;

/** Array wrapper for a full polls file. */
export const PollsSchema = z.array(PollSchema).describe("Array of Poll objects.");
export type Polls = z.infer<typeof PollsSchema>;