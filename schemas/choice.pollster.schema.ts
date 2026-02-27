import { z } from "zod";
import { LocalizedStringSchema } from "./localized-string.pollster.schema";
import { HistoricalResultSchema } from "./historical-result.pollster.schema";

/**
 * Choice — any entity that can appear in poll results.
 * Layer: reference data
 */
export const ChoiceSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Must be a lowercase slug").describe(
    "Stable slug identifier, lowercase, e.g. \"ods\", \"ano\", \"spolu\". " +
    "Should remain stable across election cycles. " +
    "Used as the foreign key in PollResult.choice_id, DerivedResult.choice_id, and Estimate.choice_id across all pipeline layers."
  ),
  name: z.string().min(1).describe(
    "Canonical display name in the primary language of the region. Use `names` for multilingual variants."
  ),
  short_name: z.string().min(1).describe("Abbreviated name for charts and tables, e.g. \"ODS\", \"SPOLU\"."),
  names: LocalizedStringSchema.optional().describe(
    "Optional multilingual name map (BCP 47 locale → string). Example: { \"cs\": \"Občanská demokratická strana\", \"en\": \"Civic Democratic Party\" }"
  ),
  region: z.union([z.string().min(1), z.array(z.string().min(1))]).optional().describe(
    "Region(s) this choice is active in. ISO 3166-1 alpha-2 (country) or ISO 3166-2 (sub-national) codes."
  ),
  color: z.string().optional().describe(
    "Primary brand color. Canonical form: CSS hex (#rrggbb or #rrggbbaa)."
  ),
  logo_url: z.string().url().optional().describe("URL to the choice's logo (SVG or PNG preferred)."),
  type: z.string().optional().describe(
    "Entity type. Canonical values: \"party\", \"coalition\". Other values allowed."
  ),
  members: z.array(z.string().min(1)).optional().describe(
    "IDs of constituent choices (for coalitions). References other Choice.id values."
  ),
  member_shares: z.record(z.string().min(1), z.number().min(0)).optional().describe(
    "Fractional split weights for each member (values 0–1, sum ≈ 1). " +
    "Used as the default distribution key when a poll reports only the aggregate coalition value. " +
    "Example (SPOLU 2025 seats): { \"ods\": 0.67, \"top-09\": 0.19, \"kdu-csl\": 0.14 }"
  ),
  historical_results: z.array(HistoricalResultSchema).optional().describe(
    "Historical election results for this choice."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields."),
}).describe(
  "Any entity that can appear in poll results: party, coalition, or independent grouping.\n\n" +
  "Layer: reference data\n\n" +
  "Choice.id is the stable key used across all pipeline layers: " +
  "PollResult.choice_id (source), DerivedResult.choice_id (compute), Estimate.choice_id (aggregate)."
);

export type Choice = z.infer<typeof ChoiceSchema>;

/** Array wrapper for a full choices file. */
export const ChoicesSchema = z.array(ChoiceSchema).describe("Array of Choice objects.");
export type Choices = z.infer<typeof ChoicesSchema>;