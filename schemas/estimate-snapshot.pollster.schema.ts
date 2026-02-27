import { z } from "zod";
import { EstimateSchema } from "./estimate.pollster.schema";

/**
 * EstimateSnapshot — the output of a polling aggregation model at one point in time.
 * Layer: aggregate (final output of the pipeline)
 */
export const EstimateSnapshotSchema = z.object({
  id: z.string().min(1).describe("Unique stable identifier, e.g. \"cz-parliament-2025-02-23\"."),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).describe(
    "Region(s) this snapshot covers. ISO 3166-1 alpha-2 or ISO 3166-2 codes."
  ),
  type: z.string().optional().describe(
    "Election type being modelled. Canonical values: \"parliamentary\", \"presidential\", \"municipal\", \"regional\", \"european\", \"referendum\"."
  ),
  computed_at: z.string().datetime().describe(
    "ISO 8601 datetime (UTC) when the model was last computed. Format: YYYY-MM-DDTHH:mm:ssZ"
  ),
  model_version: z.string().optional().describe(
    "Identifier for the model version that produced this snapshot. Examples: \"v1.2.0\", \"2025-02-01\""
  ),
  estimates: z.array(EstimateSchema).min(1).describe(
    "Model estimates for each choice/candidate. Typically contains separate Estimate entries for each type (\"percents\", \"seats\", \"probability to enter\")."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields (e.g. poll_count, total_seats)."),
}).describe(
  "The output of a polling aggregation model at one point in time.\n\n" +
  "Layer: aggregate (final output of the pipeline)\n\n" +
  "IMPORTANT — scope boundary: EstimateSnapshot is the home for all computed/modelled outputs — " +
  "poll-of-polls aggregates, seat distributions, entry probabilities, and majority scenario probabilities. " +
  "It is completely separate from Poll/PollOutput, which store only what polling agencies publish. " +
  "An EstimateSnapshot is never nested inside a Poll.\n\n" +
  "Data flow: Poll (source) → ScenarioSnapshot (compute) → EstimateSnapshot (this)"
);

export type EstimateSnapshot = z.infer<typeof EstimateSnapshotSchema>;

export const EstimateSnapshotsSchema = z.array(EstimateSnapshotSchema).describe("Array of EstimateSnapshot objects (time series).");
export type EstimateSnapshots = z.infer<typeof EstimateSnapshotsSchema>;