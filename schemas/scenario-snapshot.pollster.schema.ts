import { z } from "zod";
import { ScenarioPollSchema } from "./scenario-poll.pollster.schema";

/**
 * ScenarioSnapshot — the output file for one scenario.
 *
 * Layer: compute (intermediate between source and aggregate layers)
 *
 * Written by the compute-scenarios script. Contains every source poll
 * normalised to the scenario's choice grouping, with full derivation
 * provenance on each value. This is the input consumed by the simulation /
 * poll-of-polls step that produces EstimateSnapshot.
 *
 * Relationship to other schemas:
 *   Input:  Poll (source layer) + Scenario (config)
 *   Output: ScenarioSnapshot (this file) → fed into EstimateSnapshot
 *
 * Written to:
 *   apps/{instance}/data/{election}/{term}/scenarios/{scenario_id}.json
 */
export const ScenarioSnapshotSchema = z.object({
  /** References Scenario.id. */
  scenario_id: z.string().min(1),

  /** ISO 8601 datetime when this snapshot was computed. */
  computed_at: z.string().datetime(),

  /** One entry per poll in the dataset. */
  polls: z.array(ScenarioPollSchema),

  /** Arbitrary extra metadata (model version, parameter summary, etc.). */
  extras: z.record(z.unknown()).optional(),
});

export const ScenarioSnapshotsSchema = z.array(ScenarioSnapshotSchema);

export type ScenarioSnapshot = z.infer<typeof ScenarioSnapshotSchema>;
export type ScenarioSnapshots = z.infer<typeof ScenarioSnapshotsSchema>;