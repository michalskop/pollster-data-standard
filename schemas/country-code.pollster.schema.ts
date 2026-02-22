import { z } from "zod";

/**
 * CountryCode — ISO 3166-1 alpha-2 country code.
 * Expanded as new countries are added to the standard.
 */
export const CountryCodeSchema = z.enum(["cz", "sk", "eu", "pl", "hu", "at", "de"]);

export type CountryCode = z.infer<typeof CountryCodeSchema>;
