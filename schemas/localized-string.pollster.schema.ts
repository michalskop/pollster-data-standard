import { z } from "zod";

/**
 * LocalizedString — a map of BCP 47 locale codes to strings.
 * Layer: reference data (shared utility type)
 */
export const LocalizedStringSchema = z
  .record(
    z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Must be a BCP 47 locale code (e.g. 'cs', 'en', 'sk')"),
    z.string().min(1),
  )
  .refine((obj) => Object.keys(obj).length > 0, { message: "At least one locale is required" })
  .describe(
    "A map of BCP 47 locale codes to strings. At least one locale must be present.\n\n" +
    "Layer: reference data (shared utility type)\n\n" +
    "Examples: { \"cs\": \"Občanská demokratická strana\" } or { \"cs\": \"ANO\", \"en\": \"ANO\" }"
  );

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;