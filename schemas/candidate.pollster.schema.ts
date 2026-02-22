import { z } from "zod";
import { LocalizedStringSchema } from "./localized-string.pollster.schema";
import { CountryCodeSchema } from "./country-code.pollster.schema";

/**
 * Candidate — an individual running in an election.
 *
 * Used for presidential races and ranked-list elections where
 * individual candidate data is relevant (e.g. senate, president).
 * For standard proportional elections, party/coalition schemas suffice.
 */
export const CandidateSchema = z.object({
  /** Stable slug identifier, e.g. "pavel-petr", "babis-andrej". */
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug"),

  /** Full display name in one or more languages. */
  name: LocalizedStringSchema,

  /** Given (first) name. */
  givenName: z.string().min(1).optional(),

  /** Family (last) name. */
  familyName: z.string().min(1).optional(),

  /** ID of the affiliated party or coalition (matches Party.id or Coalition.id). */
  partyId: z.string().min(1).optional(),

  /** Country where the candidate is running. */
  country: CountryCodeSchema,

  gender: z.enum(["male", "female", "other"]).optional(),

  /** Date of birth (ISO 8601 date). */
  birthDate: z.string().date().optional(),

  /** URL to a candidate photo (HTTPS, square crop preferred). */
  imageUrl: z.string().url().optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;

/** Array wrapper for a full candidates file. */
export const CandidatesSchema = z.array(CandidateSchema);
export type Candidates = z.infer<typeof CandidatesSchema>;
