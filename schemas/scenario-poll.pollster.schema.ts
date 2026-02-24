import { z } from "zod";
import { DerivedResultSchema } from "./derived-result.pollster.schema";

/**
 * ScenarioPoll — all derived results for one poll under one scenario.
 *
 * Contained within a ScenarioSnapshot.
 */
export const ScenarioPollSchema = z.object({
  /** References Poll.id. */
  poll_id: z.string().min(1),

  /**
   * Derived results for each choice in the scenario.
   * Every choice listed in Scenario.choices will have an entry here
   * (with value_percent = null and method = "absent" if unresolvable).
   */
  results: z.array(DerivedResultSchema),
});

export type ScenarioPoll = z.infer<typeof ScenarioPollSchema>;
