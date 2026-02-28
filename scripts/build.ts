import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";

import { LocalizedStringSchema } from "../schemas/localized-string.pollster.schema";
import { HistoricalResultSchema } from "../schemas/historical-result.pollster.schema";
import { DistributionValueSchema } from "../schemas/distribution-value.pollster.schema";
import { DistributionSchema } from "../schemas/distribution.pollster.schema";
import { ChoiceSchema, ChoicesSchema } from "../schemas/choice.pollster.schema";
import { PollsterSchema, PollstersSchema } from "../schemas/pollster.pollster.schema";
import { PollResultSchema } from "../schemas/poll-result.pollster.schema";
import { PollOutputSchema } from "../schemas/poll-output.pollster.schema";
import { PollSchema, PollsSchema } from "../schemas/poll.pollster.schema";
import { CandidateSchema, CandidatesSchema } from "../schemas/candidate.pollster.schema";
import { EstimateSchema } from "../schemas/estimate.pollster.schema";
import { EstimateSnapshotSchema, EstimateSnapshotsSchema } from "../schemas/estimate-snapshot.pollster.schema";
import { DerivationSchema } from "../schemas/derivation.pollster.schema";
import { DerivedResultSchema } from "../schemas/derived-result.pollster.schema";
import { ScenarioSchema, ScenariosSchema } from "../schemas/scenario.pollster.schema";
import { ScenarioPollSchema } from "../schemas/scenario-poll.pollster.schema";
import { ScenarioSnapshotSchema, ScenarioSnapshotsSchema } from "../schemas/scenario-snapshot.pollster.schema";

type SchemaItem = { name: string; fileBase: string; zod: any };

const SCHEMAS: SchemaItem[] = [
  // Shared primitives
  { name: "LocalizedString",   fileBase: "localized-string.pollster",   zod: LocalizedStringSchema },
  { name: "HistoricalResult",  fileBase: "historical-result.pollster",  zod: HistoricalResultSchema },
  { name: "DistributionValue", fileBase: "distribution-value.pollster", zod: DistributionValueSchema },
  { name: "Distribution",      fileBase: "distribution.pollster",       zod: DistributionSchema },

  // Entities
  { name: "Choice",     fileBase: "choice.pollster",     zod: ChoiceSchema },
  { name: "Choices",    fileBase: "choices.pollster",    zod: ChoicesSchema },
  { name: "Candidate",  fileBase: "candidate.pollster",  zod: CandidateSchema },
  { name: "Candidates", fileBase: "candidates.pollster", zod: CandidatesSchema },
  { name: "Pollster",   fileBase: "pollster.pollster",   zod: PollsterSchema },
  { name: "Pollsters",  fileBase: "pollsters.pollster",  zod: PollstersSchema },

  // Poll
  { name: "PollResult", fileBase: "poll-result.pollster", zod: PollResultSchema },
  { name: "PollOutput", fileBase: "poll-output.pollster", zod: PollOutputSchema },
  { name: "Poll",       fileBase: "poll.pollster",        zod: PollSchema },
  { name: "Polls",      fileBase: "polls.pollster",       zod: PollsSchema },

  // Estimates
  { name: "Estimate",          fileBase: "estimate.pollster",           zod: EstimateSchema },
  { name: "EstimateSnapshot",  fileBase: "estimate-snapshot.pollster",  zod: EstimateSnapshotSchema },
  { name: "EstimateSnapshots", fileBase: "estimate-snapshots.pollster", zod: EstimateSnapshotsSchema },

  // Scenarios (derivation layer)
  { name: "Derivation",        fileBase: "derivation.pollster",         zod: DerivationSchema },
  { name: "DerivedResult",     fileBase: "derived-result.pollster",     zod: DerivedResultSchema },
  { name: "Scenario",          fileBase: "scenario.pollster",           zod: ScenarioSchema },
  { name: "Scenarios",         fileBase: "scenarios.pollster",          zod: ScenariosSchema },
  { name: "ScenarioPoll",      fileBase: "scenario-poll.pollster",      zod: ScenarioPollSchema },
  { name: "ScenarioSnapshot",  fileBase: "scenario-snapshot.pollster",  zod: ScenarioSnapshotSchema },
  { name: "ScenarioSnapshots", fileBase: "scenario-snapshots.pollster", zod: ScenarioSnapshotsSchema },
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