const fs = require("fs");
const path = require("path");

const version = process.env.STD_VERSION || "latest";
const branch  = process.env.STD_BRANCH  || "pollster";

function listFilesRecursive(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listFilesRecursive(full));
    else if (ent.isFile()) out.push(full);
  }
  return out;
}

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    const d = path.join(dst, f);
    if (fs.lstatSync(s).isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

function rimraf(p) { fs.rmSync(p, { recursive: true, force: true }); }

const specFile = fs.existsSync("openapi.json") ? "openapi.json" : null;
if (!specFile) { console.error("No openapi.json found."); process.exit(1); }

// schema filter
const schemaFilter = (name) => /\.pollster\.json$/.test(name);

rimraf("stage");
fs.mkdirSync("stage/schemas", { recursive: true });
fs.copyFileSync("index.html", "stage/index.html");
fs.copyFileSync(specFile, `stage/${specFile}`);

// copy filtered schemas
const copiedNames = [];
for (const full of listFilesRecursive("schemas")) {
  const name = path.basename(full);
  if (schemaFilter(name)) {
    fs.copyFileSync(full, path.join("stage", "schemas", name));
    copiedNames.push(name);
  }
}

// schemas/index.html
const list = copiedNames.sort().map((f) => `<li><a href="./${f}">${f}</a></li>`).join("\n");
fs.writeFileSync(
  path.join("stage", "schemas", "index.html"),
  `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><title>Schemas</title>
<body style="font-family:sans-serif;max-width:900px;margin:3em auto">
<h1>Schemas — ${branch} / ${version}</h1>
<ul>${list}</ul></body></html>`
);

const destBase   = branch ? path.join("dist", branch) : "dist";
const destVer    = path.join(destBase, version);
const destLatest = path.join(destBase, "latest");

rimraf(destVer);    copyTree("stage", destVer);
rimraf(destLatest); copyTree("stage", destLatest);

// top-level /latest always points to the primary (pollster) branch
rimraf(path.join("dist", "latest"));
copyTree("stage", path.join("dist", "latest"));

// branch-root redirect
if (branch) {
  const redirect = `<!DOCTYPE html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=./latest/"><script>location.replace('./latest/'+location.hash);</script>`;
  fs.writeFileSync(path.join(destBase, "index.html"), redirect);
}

// dist/index.html
fs.writeFileSync(
  path.join("dist", "index.html"),
  `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><title>Pollster Data Standard</title>
<body style="font-family:sans-serif;max-width:700px;margin:3em auto">
<h1>Pollster Data Standard</h1>
<p>JSON schemas for polling and election data — parties, coalitions, candidates, polls, and aggregates.</p>
<ul>
  <li><a href="./pollster/latest/">pollster/latest</a> — <a href="./pollster/latest/schemas/">schemas</a></li>
  <li><a href="./latest/">latest (= pollster/latest)</a></li>
</ul>
<p style="margin-top:2em;font-size:90%;color:#555">
  Source: <a href="https://github.com/michalskop/pollster-data-standard">github.com/michalskop/pollster-data-standard</a>
</p>
</body></html>`
);

rimraf("stage");
console.log(`Published branch=${branch} version=${version} to ${destVer} and ${destLatest}`);
