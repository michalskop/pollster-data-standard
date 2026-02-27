import { z } from "zod";
import { DerivationSchema } from "./derivation.pollster.schema";

/**
 * DerivedResult — a single choice's value within a scenario-normalised poll.
 * Layer: compute
 */
export const DerivedResultSchema = z.object({
  choice_id: z.string().min(1).describe("References Choice.id."),
  value_percent: z.number().nullable().describe(
    "Percentage value (0–100). Null when derivation.method = \"absent\" (value could not be estimated)."
  ),
  is_estimated: z.boolean().describe(
    "True when any part of this value was computed rather than directly measured by the pollster. " +
    "False only for method=\"direct\" and method=\"members_sum\" (where all source values are direct)."
  ),
  derivation: DerivationSchema,
}).describe(
  "A single choice's value within a scenario-normalised poll.\n\n" +
  "Layer: compute (contained in ScenarioPoll → ScenarioSnapshot)\n\n" +
  "Replaces PollResult at the scenario layer. Every value carries full provenance via the Derivation object. " +
  "Contrast with PollResult (source layer) which is the raw agency-reported value."
);

export type DerivedResult = z.infer<typeof DerivedResultSchema>;