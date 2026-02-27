import { z } from "zod";
import { LocalizedStringSchema } from "./localized-string.pollster.schema";
import { HistoricalResultSchema } from "./historical-result.pollster.schema";

/**
 * Choice — any entity that can appear in poll results.
 *
 * Layer: reference data
 *
 * Covers parties, coalitions, and independent groupings.
 * Coalitions set type="coalition" and list their constituent party IDs in `members`.
 *
 * Choice.id is the stable key used across all layers:
 *   - PollResult.choice_id     (source layer — what agencies report)
 *   - DerivedResult.choice_id  (compute layer — normalised values)
 *   - Estimate.choice_id       (aggregate layer — model outputs)
 *
 * Candidates in direct elections (presidential, senate) use the separate
 * Candidate schema.
 */
export const ChoiceSchema = z.object({
  /**
   * Stable slug identifier, lowercase, e.g. "ods", "ano", "spolu".
   * Should remain stable across election cycles.
   */
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug"),

  /**
   * Canonical display name (in the primary language of the region).
   * Use `names` for multilingual variants.
   */
  name: z.string().min(1),

  /** Abbreviated name for charts and tables, e.g. "ODS", "SPOLU". */
  short_name: z.string().min(1),

  /**
   * Optional multilingual name map (BCP 47 locale → string).
   * Example: { "cs": "Občanská demokratická strana", "en": "Civic Democratic Party" }
   */
  names: LocalizedStringSchema.optional(),

  /**
   * Region(s) this choice is active in.
   * ISO 3166-1 alpha-2 (country) or ISO 3166-2 (sub-national) codes.
   * Examples: "cz", ["cz", "sk"], "cz-pl" (Plzeňský kraj)
   */
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),

  /**
   * Primary brand color.
   * Canonical form: CSS hex (#rrggbb or #rrggbbaa).
   * RGB/RGBA functional notation also accepted.
   */
  color: z.string().optional(),

  /** URL to the choice's logo (SVG or PNG preferred). */
  logo_url: z.string().url().optional(),

  /**
   * Entity type.
   * Canonical values: "party", "coalition".
   * Other values allowed for flexibility.
   */
  type: z.string().optional(),

  /**
   * IDs of constituent choices (for coalitions).
   * References other Choice.id values.
   */
  members: z.array(z.string().min(1)).optional(),

  /**
   * Fractional split weights for each member (values 0–1, sum ≈ 1).
   *
   * Used as the default distribution key when a poll reports only the
   * aggregate coalition value and per-member breakdowns are unavailable.
   * Typically set to the most recent election seat / vote shares.
   *
   * Example (SPOLU, CZ 2025 parliamentary election seats):
   *   { "ods": 0.67, "top-09": 0.19, "kdu-csl": 0.14 }
   *
   * The compute layer normalises the values, so they do not need to sum
   * to exactly 1.
   */
  member_shares: z.record(z.string().min(1), z.number().min(0)).optional(),

  /**
   * Historical election results for this choice.
   * May include results from elections where the choice ran under a different
   * ID (e.g. a coalition's constituent parties' past results).
   */
  historical_results: z.array(HistoricalResultSchema).optional(),

  /** Extension point for additional fields. */
  extras: z.record(z.string(), z.unknown()).optional(),
});

export type Choice = z.infer<typeof ChoiceSchema>;

/** Array wrapper for a full choices file. */
export const ChoicesSchema = z.array(ChoiceSchema);
export type Choices = z.infer<typeof ChoicesSchema>;
