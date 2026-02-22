import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";

import { LocalizedStringSchema } from "../schemas/localized-string.pollster.schema";
import { CountryCodeSchema } from "../schemas/country-code.pollster.schema";
import { PartySchema, PartiesSchema } from "../schemas/party.pollster.schema";
import { CoalitionSchema, CoalitionsSchema } from "../schemas/coalition.pollster.schema";
import { CandidateSchema, CandidatesSchema } from "../schemas/candidate.pollster.schema";
import { PollResultSchema } from "../schemas/poll-result.pollster.schema";
import { ElectionTypeSchema, MethodologySchema, PollSchema, PollsSchema } from "../schemas/poll.pollster.schema";
import { AggregateResultSchema } from "../schemas/aggregate-result.pollster.schema";
import { AggregateSchema, AggregatesSchema } from "../schemas/aggregate.pollster.schema";

type SchemaItem = { name: string; fileBase: string; zod: any };

const SCHEMAS: SchemaItem[] = [
  // Primitives / shared
  { name: "LocalizedString", fileBase: "localized-string.pollster", zod: LocalizedStringSchema },
  { name: "CountryCode",     fileBase: "country-code.pollster",     zod: CountryCodeSchema },
  { name: "ElectionType",    fileBase: "election-type.pollster",    zod: ElectionTypeSchema },
  { name: "Methodology",     fileBase: "methodology.pollster",      zod: MethodologySchema },

  // Party / Coalition / Candidate
  { name: "Party",        fileBase: "party.pollster",      zod: PartySchema },
  { name: "Parties",      fileBase: "parties.pollster",    zod: PartiesSchema },
  { name: "Coalition",    fileBase: "coalition.pollster",  zod: CoalitionSchema },
  { name: "Coalitions",   fileBase: "coalitions.pollster", zod: CoalitionsSchema },
  { name: "Candidate",    fileBase: "candidate.pollster",  zod: CandidateSchema },
  { name: "Candidates",   fileBase: "candidates.pollster", zod: CandidatesSchema },

  // Poll
  { name: "PollResult",  fileBase: "poll-result.pollster", zod: PollResultSchema },
  { name: "Poll",        fileBase: "poll.pollster",        zod: PollSchema },
  { name: "Polls",       fileBase: "polls.pollster",       zod: PollsSchema },

  // Aggregate
  { name: "AggregateResult", fileBase: "aggregate-result.pollster", zod: AggregateResultSchema },
  { name: "Aggregate",       fileBase: "aggregate.pollster",        zod: AggregateSchema },
  { name: "Aggregates",      fileBase: "aggregates.pollster",       zod: AggregatesSchema },
];

const out = (p: string) => path.join(process.cwd(), p);
const ensureDir = (d: string) => fs.mkdirSync(d, { recursive: true });

function schemaOutPath(fileBase: string, ext: string) {
  return out(`schemas/${fileBase}.${ext}`);
}

function writeJsonSchema(item: SchemaItem) {
  if (!item?.zod || !item?.zod._def) {
    throw new Error(`Schema "${item?.name}" is undefined or not a Zod schema.`);
  }
  const json = zodToJsonSchema(item.zod, { name: item.name });
  const p = schemaOutPath(item.fileBase, "json");
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(json, null, 2));
  console.log(`✓ JSON  ${item.fileBase}.json`);
  return json;
}

function writeMarkdown(item: SchemaItem, jsonSchema: any) {
  const props = jsonSchema?.properties ?? {};
  const required: string[] = Array.isArray(jsonSchema?.required) ? jsonSchema.required : [];

  const rows: string[] = [
    "| Field | Type | Required | Description |",
    "|---|---:|:---:|---|",
  ];

  for (const [key, def] of Object.entries<any>(props)) {
    const type =
      Array.isArray(def.type)
        ? def.type.join(" | ")
        : def.type ?? (def.anyOf ? def.anyOf.map((x: any) => x.type).filter(Boolean).join(" | ") : "object");
    const req = required.includes(key) ? "✓" : "";
    const desc = def.description ?? "";
    rows.push(`|\`${key}\`|${type}|${req}|${desc}|`);
  }

  const md = `# Schema: ${item.name}\n\n${rows.join("\n")}\n`;
  const p = schemaOutPath(item.fileBase, "md");
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, md);
  console.log(`✓ MD    ${item.fileBase}.md`);
}

for (const s of SCHEMAS) {
  const json = writeJsonSchema(s);
  writeMarkdown(s, json);
}

console.log(`\nDone. Generated ${SCHEMAS.length} schemas.`);
