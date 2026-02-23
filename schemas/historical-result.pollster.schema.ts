import { z } from "zod";

/**
 * HistoricalResult — one previous-election result stored on a Choice.
 *
 * Used to track what a party, coalition, or candidate achieved in past
 * elections, even if the choice ran under a different ID at the time.
 *
 * `values` is a flexible key-value map — use keys like "percent", "seats",
 * "rank", "mandates", etc. as appropriate.
 */
export const HistoricalResultSchema = z.object({
  /** Identifier for the election, e.g. "cz-parliament-2021". */
  election_id: z.string().min(1),

  /**
   * The choice_id as it appeared in that election.
   * Omit when identical to the current Choice.id.
   * Use when the party ran under a different name/coalition
   * (e.g. storing ODS's 2021 result on the SPOLU coalition choice).
   */
  choice_id: z.string().min(1).optional(),

  /**
   * Flexible numeric or string values for this election result.
   * Recommended keys: "percent", "seats", "rank", "votes".
   * Example: { "percent": 27.7, "seats": 71 }
   */
  values: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
});

export type HistoricalResult = z.infer<typeof HistoricalResultSchema>;
