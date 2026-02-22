# Pollster Data Standard

A data standard for polling and election data — parties, coalitions, candidates, individual polls, and aggregated model outputs.

Schemas are written in **TypeScript (Zod)**, compiled to **JSON Schema**, and published as browsable **OpenAPI/Redoc** docs on GitHub Pages. `dist/` is not committed — built and deployed automatically by GitHub Actions on every push to `main`.

## Live docs

- **Pollster (latest):** https://michalskop.github.io/pollster-data-standard/pollster/latest/
- **Schemas:** https://michalskop.github.io/pollster-data-standard/pollster/latest/schemas/

## Schema overview

| Schema | File | Description |
|---|---|---|
| `LocalizedString` | `localized-string.pollster` | Multilingual string map (BCP 47 locale → string) |
| `CountryCode` | `country-code.pollster` | ISO 3166-1 alpha-2 country codes in scope |
| `ElectionType` | `election-type.pollster` | Enum: parliament, president, municipal, … |
| `Methodology` | `methodology.pollster` | Enum: phone, online, face-to-face, mixed, other |
| `Party` | `party.pollster` | Political party (id, name, color, threshold, …) |
| `Parties` | `parties.pollster` | Array of Party |
| `Coalition` | `coalition.pollster` | Electoral alliance with member party IDs |
| `Coalitions` | `coalitions.pollster` | Array of Coalition |
| `Candidate` | `candidate.pollster` | Individual candidate (presidential, senate, …) |
| `Candidates` | `candidates.pollster` | Array of Candidate |
| `PollResult` | `poll-result.pollster` | Single party/coalition result within one poll |
| `Poll` | `poll.pollster` | Full poll record (agency, dates, sample, results) |
| `Polls` | `polls.pollster` | Array of Poll |
| `AggregateResult` | `aggregate-result.pollster` | Model output for one party (%, interval, seats, probability) |
| `Aggregate` | `aggregate.pollster` | Full aggregation snapshot |
| `Aggregates` | `aggregates.pollster` | Array of Aggregate (time series) |

## Repository structure

```
pollster-data-standard/
├─ schemas/
│  └─ *.pollster.schema.ts     # Zod schema definitions
├─ scripts/
│  ├─ build.ts                 # Zod → JSON Schema + Markdown
│  ├─ write-openapi.js         # JSON Schema → OpenAPI spec
│  └─ release.js               # copies build artefacts into dist/
├─ examples/
│  └─ cz-2025/                 # Example CZ 2025 data files
│     ├─ parties.json
│     ├─ coalitions.json
│     └─ polls.json
├─ .github/workflows/
│  └─ deploy.yml               # builds and deploys to GitHub Pages
├─ index.html                  # Redoc viewer
├─ package.json
└─ tsconfig.json
```

## Local development

```bash
npm install

# Compile Zod schemas to JSON Schema + Markdown
npm run build:schemas

# Build OpenAPI spec
STD_BRANCH=pollster STD_VERSION=0.1.0 npm run build:openapi

# Copy artefacts into dist/
STD_BRANCH=pollster STD_VERSION=0.1.0 npm run release

# Preview locally
python3 -m http.server 8080
# open http://localhost:8080/dist/pollster/latest/
```

## Adding a new schema

1. Create `schemas/<name>.pollster.schema.ts` with a Zod schema export.
2. Import it and add an entry to the `SCHEMAS` array in `scripts/build.ts`.
3. Push to `main` — GitHub Actions builds and deploys automatically.

## Design principles

- **Zod-first:** schemas are the single source of truth; JSON Schema and OpenAPI are derived outputs.
- **LocalizedString everywhere names appear:** `{ cs: "...", en: "...", sk: "..." }` — consumers pick their locale.
- **Stable slug IDs:** party and coalition IDs are lowercase slugs (e.g. `"ods"`, `"spolu"`) stable across election cycles.
- **Raw vs. modelled:** `Poll` contains raw reported figures; `Aggregate` contains model outputs with uncertainty intervals.
- **Optional but documented:** fields that agencies sometimes omit (sample size, fieldwork dates, margin of error) are optional but fully described.

## License

MIT
