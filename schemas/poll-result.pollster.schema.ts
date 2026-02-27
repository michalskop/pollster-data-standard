import { z } from "zod";

/**
 * PollResult — a single choice's result within one poll output.
 * Layer: source / ingestion (raw agency-reported data)
 */
export const PollResultSchema = z.object({
  choice_id: z.string().min(1).describe(
    "ID of the choice (party, coalition) or candidate. References Choice.id or Candidate.id."
  ),
  value_percent: z.number().min(0).max(100).describe(
    "Stated voting intention as a percentage of valid responses (0–100). " +
    "Raw reported figure — not adjusted or modelled by the aggregation pipeline."
  ),
}).describe(
  "A single choice's result within one poll output.\n\n" +
  "Layer: source / ingestion (raw agency-reported data)\n\n" +
  "These are values exactly as the polling agency published them. " +
  "A missing entry means the choice was not reported (possibly suppressed by lower_cut_percent). " +
  "Derived/normalised values produced by the compute layer are stored in DerivedResult instead."
);

export type PollResult = z.infer<typeof PollResultSchema>;