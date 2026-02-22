import { z } from "zod";

/**
 * LocalizedString — a map of BCP 47 locale codes to strings.
 * At least one locale must be present.
 * Examples: { cs: "Občanská demokratická strana" }
 *           { cs: "ANO", sk: "ANO", en: "ANO" }
 */
export const LocalizedStringSchema = z
  .record(
    z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Must be a BCP 47 locale code (e.g. 'cs', 'en', 'sk')"),
    z.string().min(1),
  )
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one locale is required",
  });

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
