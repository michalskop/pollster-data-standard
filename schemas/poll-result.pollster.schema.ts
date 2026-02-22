import { z } from "zod";

/**
 * PollResult — a single party or coalition result within one poll.
 *
 * `partyId` references either a Party.id or a Coalition.id.
 * Results that fall below a reporting threshold may be omitted by the agency;
 * the absence of an entry does not imply zero.
 */
export const PollResultSchema = z.object({
  /**
   * ID of the party or coalition (matches Party.id or Coalition.id).
   * Use the coalition ID when a coalition ran as a unit in this poll.
   */
  partyId: z.string().min(1),

  /**
   * Stated voting intention as a percentage of valid responses (0–100).
   * This is the raw reported figure, not adjusted or modelled.
   */
  percent: z.number().min(0).max(100),

  /**
   * Margin of error around `percent`, in percentage points (±).
   * Represents the 95% confidence interval half-width when reported.
   * Omit if the agency did not publish a margin for this party.
   */
  marginOfError: z.number().min(0).optional(),
});

export type PollResult = z.infer<typeof PollResultSchema>;
