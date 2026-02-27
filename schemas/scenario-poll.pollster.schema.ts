import { z } from "zod";
import { DerivedResultSchema } from "./derived-result.pollster.schema";

/**
 * ScenarioPoll — all derived results for one poll under one scenario.
 * Layer: compute
 */
export const ScenarioPollSchema = z.object({
  poll_id: z.string().min(1).describe("References Poll.id."),
  results: z.array(DerivedResultSchema).describe(
    "Derived results for each choice in the scenario. " +
    "Every choice listed in Scenario.choices has an entry here " +
    "(with value_percent=null and method=\"absent\" if unresolvable)."
  ),
}).describe(
  "All derived results for one poll under one scenario.\n\n" +
  "Layer: compute (contained in ScenarioSnapshot)\n\n" +
  "Maps a single source Poll to the scenario's choice grouping. " +
  "Input: Poll (source) + Scenario (config). Output: feeds into EstimateSnapshot (aggregate)."
);

export type ScenarioPoll = z.infer<typeof ScenarioPollSchema>;