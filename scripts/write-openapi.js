const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const branch = process.env.STD_BRANCH || "pollster";

function listSchemaJsonFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...listSchemaJsonFiles(full));
    } else if (ent.isFile() && ent.name.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

function pickFiles(all) {
  if (branch === "pollster") {
    return all.filter((f) => /\.pollster\.json$/.test(f));
  }
  return all;
}

function titleFromJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).title;
  } catch {
    return null;
  }
}

(async () => {
  const version = process.env.STD_VERSION || "latest";
  const pagesBase = process.env.STD_PAGES_BASE || "/pollster-data-standard";

  const filesAll = listSchemaJsonFiles("schemas")
    .map((f) => f.replace(/\\/g, "/"))
    .sort();

  const files = pickFiles(filesAll.map((f) => path.basename(f)));
  const selectedSet = new Set(files);
  const selectedFullPaths = filesAll.filter((full) => selectedSet.has(path.basename(full)));

  const components = {};
  const paths = {};

  for (const full of selectedFullPaths) {
    const deref = await $RefParser.dereference(full);
    const title = titleFromJson(full) || path.basename(full, ".json");
    components[title] = deref;
    const fileName = path.basename(full);
    paths[`/schemas/${fileName}`] = {
      get: {
        summary: `Schema: ${title}`,
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${title}` },
              },
            },
          },
        },
      },
    };
  }

  const serverUrl = [pagesBase, branch || null, version]
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");

  const spec = {
    openapi: "3.0.3",
    servers: [{ url: serverUrl }],
    info: {
      title: "Pollster Data Standard",
      version,
      description: [
        `Branch **${branch || "(none)"}**, version **${version}**.`,
        `Includes ${Object.keys(components).length} schema(s).`,
        "",
        "A data standard for polling and election data.",
        "Schemas are defined in TypeScript (Zod), compiled to JSON Schema,",
        "and published as browsable OpenAPI/Redoc documentation.",
        "",
        "Source: [github.com/michalskop/pollster-data-standard](https://github.com/michalskop/pollster-data-standard)",
      ].join("\n"),
    },
    paths,
    components: { schemas: components },
  };

  fs.writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
  console.log(
    `Wrote openapi.json for branch=${branch} version=${version} with ${selectedFullPaths.length} schema(s).`
  );
})();
