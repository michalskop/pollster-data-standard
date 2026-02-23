import { z } from "zod";

/**
 * PollResult — a single choice's result within one poll output.
 *
 * `choice_id` references a Choice.id (party, coalition) or Candidate.id.
 * A missing entry means the choice was not reported (possibly suppressed
 * by `lower_cut_percent`); see PollOutput.under_lower_cut for named suppressions.
 */
export const PollResultSchema = z.object({
  /**
   * ID of the choice (party, coalition) or candidate.
   * References Choice.id or Candidate.id.
   */
  choice_id: z.string().min(1),

  /**
   * Stated voting intention as a percentage of valid responses (0–100).
   * Raw reported figure, not adjusted or modelled.
   */
  value_percent: z.number().min(0).max(100),
});

export type PollResult = z.infer<typeof PollResultSchema>;
