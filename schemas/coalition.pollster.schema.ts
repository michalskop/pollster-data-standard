import { z } from "zod";
import { LocalizedStringSchema } from "./localized-string.pollster.schema";
import { CountryCodeSchema } from "./country-code.pollster.schema";

/**
 * Coalition — an electoral alliance of two or more parties running together.
 *
 * Coalitions have their own identity (id, name, color) but reference
 * their constituent parties via `members`. Electoral thresholds are typically
 * higher for coalitions (e.g. 8% for 2-party, 11% for 3+ party in CZ law).
 */
export const CoalitionSchema = z.object({
  /** Stable slug identifier, e.g. "spolu", "pir-stan". */
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug"),

  /** Full coalition name in one or more languages. */
  name: LocalizedStringSchema,

  /** Short/abbreviated name used in charts, e.g. "SPOLU", "PirSTAN". */
  shortName: LocalizedStringSchema,

  /**
   * Primary brand color as a CSS hex value (#rrggbb or #rgb).
   * Usually derived from the lead party's color.
   */
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a CSS hex color"),

  /** Country this coalition is active in. */
  country: CountryCodeSchema,

  /**
   * IDs of the constituent parties (must match Party.id values).
   * Minimum 2 parties.
   */
  members: z.array(z.string().min(1)).min(2),

  /**
   * Electoral threshold the coalition must cross to enter parliament, in percent.
   * Under CZ law: 8% for 2-party coalition, 11% for 3+ party.
   */
  electoralThreshold: z.number().min(0).max(100),

  /**
   * Date from which this coalition is considered active (ISO 8601 date).
   * Typically the date of the coalition agreement.
   */
  since: z.string().date().optional(),

  /**
   * Date the coalition was dissolved (ISO 8601 date).
   * Omit for active coalitions.
   */
  until: z.string().date().optional(),
});

export type Coalition = z.infer<typeof CoalitionSchema>;

/** Array wrapper for a full coalitions file. */
export const CoalitionsSchema = z.array(CoalitionSchema);
export type Coalitions = z.infer<typeof CoalitionsSchema>;
