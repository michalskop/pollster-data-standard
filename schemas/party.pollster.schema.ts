import { z } from "zod";
import { LocalizedStringSchema } from "./localized-string.pollster.schema";
import { CountryCodeSchema } from "./country-code.pollster.schema";

/**
 * Party — a political party participating in elections.
 *
 * Coalitions are represented separately in coalition.pollster.schema.ts.
 * A party may appear as a member of a coalition while also running independently
 * in different election cycles.
 */
export const PartySchema = z.object({
  /** Stable slug identifier, e.g. "ods", "ano", "pirati". */
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug"),

  /** Full party name in one or more languages. */
  name: LocalizedStringSchema,

  /** Short/abbreviated name used in charts and tables, e.g. "ODS", "ANO". */
  shortName: LocalizedStringSchema,

  /**
   * Primary brand color as a CSS hex value (#rrggbb or #rgb).
   * Used for chart rendering.
   */
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a CSS hex color"),

  /** Country this party is active in. */
  country: CountryCodeSchema,

  /**
   * Electoral threshold the party must cross to enter parliament, in percent.
   * Defaults to 5 for standard single-party entries.
   */
  electoralThreshold: z.number().min(0).max(100).default(5),

  /** URL to the party's official logo (SVG or PNG preferred). */
  logoUrl: z.string().url().optional(),

  /**
   * Date the party was founded or officially registered (ISO 8601 date).
   * Omit if unknown.
   */
  foundedAt: z.string().date().optional(),

  /**
   * Date the party was dissolved or merged into another entity (ISO 8601 date).
   * Omit for active parties.
   */
  dissolvedAt: z.string().date().optional(),
});

export type Party = z.infer<typeof PartySchema>;

/** Array wrapper for a full parties file. */
export const PartiesSchema = z.array(PartySchema);
export type Parties = z.infer<typeof PartiesSchema>;
