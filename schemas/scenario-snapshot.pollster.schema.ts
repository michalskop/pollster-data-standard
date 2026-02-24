import { z } from "zod";
import { ScenarioPollSchema } from "./scenario-poll.pollster.schema";

/**
 * ScenarioSnapshot — the output file for one scenario.
 *
 * Written by the compute-scenarios script to:
 *   apps/{instance}/data/{election}/{term}/scenarios/{scenario_id}.json
 *
 * Contains every poll in the dataset normalised to the scenario's choice
 * grouping, with full derivation provenance on each value.
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
