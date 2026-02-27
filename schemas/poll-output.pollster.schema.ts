import { z } from "zod";
import { PollResultSchema } from "./poll-result.pollster.schema";

/**
 * PollOutput — one "view" of results within a poll.
 * Layer: source / ingestion (raw agency-reported data)
 */
export const PollOutputSchema = z.object({
  output_type: z.string().min(1).describe(
    "Type of output. Canonical values: \"core\", \"potential\", \"model\", \"participation\". Other values allowed.\n\n" +
    "Note: \"model\" here means the polling agency's own weighted/adjusted figures — " +
    "not anything produced by the aggregation pipeline. " +
    "Poll-of-polls aggregates and Monte Carlo outputs belong in EstimateSnapshot."
  ),
  tags: z.array(z.string()).optional().describe(
    "Descriptive tags for filtering and grouping. Examples: [\"parties\", \"main\"], [\"candidates\", \"first-round\"]"
  ),
  sub_population: z.string().optional().describe(
    "Sub-population this output covers, if narrower than the poll-level population. Example: \"Definite voters\""
  ),
  margin_of_error: z.string().optional().describe(
    "Margin of error for this output. Free string — agencies report in different formats. Examples: \"±3%\", \"2.8 pp\""
  ),
  lower_cut_percent: z.number().min(0).max(100).optional().describe(
    "Choices below this percent threshold are not individually reported by the agency. Example: 2.0 means parties under 2% are suppressed."
  ),
  under_lower_cut: z.array(z.string()).optional().describe(
    "Named choices that were included in fieldwork but fell below lower_cut_percent and are not listed in results."
  ),
  results: z.array(PollResultSchema).describe(
    "Per-choice voting intention figures for this output. " +
    "May be empty when the output records only aggregate figures (e.g. a participation output with only undecided_percent)."
  ),
  others_percent: z.number().min(0).max(100).optional().describe(
    "Aggregate percentage for parties/candidates not individually listed in results (e.g. combined \"other parties\" figure reported by the agency)."
  ),
  undecided_percent: z.number().min(0).max(100).optional().describe(
    "Percentage of respondents who are undecided or answered \"don't know\"."
  ),
  abstention_percent: z.number().min(0).max(100).optional().describe(
    "Percentage of respondents who plan to abstain / will not vote."
  ),
  blank_percent: z.number().min(0).max(100).optional().describe(
    "Percentage of respondents who plan to cast a blank or null ballot."
  ),
  extras: z.record(z.string(), z.unknown()).optional().describe("Extension point for additional fields."),
}).describe(
  "One \"view\" of results within a poll.\n\n" +
  "Layer: source / ingestion (raw agency-reported data)\n\n" +
  "A single poll may publish multiple outputs, e.g.: " +
  "\"core\" (definite voters), \"potential\" (might vote), \"model\" (agency's own weighted figures), \"participation\" (turnout figures).\n\n" +
  "IMPORTANT — scope boundary: PollOutput represents data exactly as the polling agency publishes it. " +
  "output_type=\"model\" means the agency's own internal model, not the aggregation pipeline's model. " +
  "Poll-of-polls aggregates, Monte Carlo simulations, and other computed estimates are stored in EstimateSnapshot — " +
  "a completely separate schema that is never nested inside Poll."
);

export type PollOutput = z.infer<typeof PollOutputSchema>;