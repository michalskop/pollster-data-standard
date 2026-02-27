import { z } from "zod";
import { ScenarioPollSchema } from "./scenario-poll.pollster.schema";

/**
 * ScenarioSnapshot — output of the scenario derivation step for one scenario.
 * Layer: compute
 */
export const ScenarioSnapshotSchema = z.object({
  scenario_id: z.string().min(1).describe("References Scenario.id."),
  computed_at: z.string().datetime().describe("ISO 8601 datetime when this snapshot was computed."),
  polls: z.array(ScenarioPollSchema).describe("One entry per poll in the dataset."),
  extras: z.record(z.unknown()).optional().describe("Arbitrary extra metadata (model version, parameter summary, etc.)."),
}).describe(
  "Output of the scenario derivation step for one scenario.\n\n" +
  "Layer: compute (intermediate between source and aggregate layers)\n\n" +
  "Contains every source poll normalised to the scenario's choice grouping, with full derivation provenance. " +
  "This is the input consumed by the simulation/poll-of-polls step that produces EstimateSnapshot.\n\n" +
  "Data flow: Poll (source) + Scenario (config) → ScenarioSnapshot (this) → EstimateSnapshot (aggregate)"
);

export const ScenarioSnapshotsSchema = z.array(ScenarioSnapshotSchema).describe("Array of ScenarioSnapshot objects.");

export type ScenarioSnapshot = z.infer<typeof ScenarioSnapshotSchema>;
export type ScenarioSnapshots = z.infer<typeof ScenarioSnapshotsSchema>;