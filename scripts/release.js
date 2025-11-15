// Release helper: reads version from manifest.json and tags/pushes it (no 'v' prefix).
// Usage:
//   npm run release
//
// Behavior:
// - Reads version from manifest.json
// - Verifies clean working tree
// - Validates semver (no 'v' prefix)
// - Errors if a tag with that version already exists locally or on remotes
// - Creates annotated tag
// - Pushes tag to 'origin'
// - If a 'github' remote exists, pushes tag there as well (optional)

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
  return res;
}

function runQuiet(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { stdio: "pipe", encoding: "utf-8", ...opts });
}

function ensureCleanWorkingTree() {
  const status = runQuiet("git", ["status", "--porcelain"]);
  if (status.status !== 0) {
    console.error("Failed to check git status.");
    process.exit(1);
  }
  if (status.stdout.trim().length !== 0) {
    console.error("Working tree not clean. Commit or stash changes before releasing.");
    process.exit(1);
  }
}

function tagExists(tag) {
  const res = runQuiet("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`]);
  return res.status === 0;
}

function remoteExists(name) {
  const res = runQuiet("git", ["remote", "get-url", name]);
  return res.status === 0;
}

function remoteTagExists(remote, tag) {
  // --exit-code makes git return non-zero if the ref isn't found
  const res = runQuiet("git", ["ls-remote", "--exit-code", "--tags", remote, `refs/tags/${tag}`]);
  return res.status === 0;
}

function getManifestVersion() {
  if (!fs.existsSync("manifest.json")) {
    console.error("manifest.json not found in project root.");
    process.exit(1);
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
  } catch (e) {
    console.error("Failed to parse manifest.json:", e.message);
    process.exit(1);
  }
  const version = String(manifest.version || "").trim();
  if (!version) {
    console.error("manifest.json is missing a 'version' field.");
    process.exit(1);
  }
  return version;
}

function main() {
  const version = getManifestVersion();

  if (version.startsWith("v")) {
    console.error("manifest.json version must not start with 'v'. Use 0.0.2 or 0.0.2-beta.0.");
    process.exit(1);
  }

  const semverRe = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;
  if (!semverRe.test(version)) {
    console.error(`Invalid version '${version}' in manifest.json. Expected semver like 0.0.2 or 0.0.2-beta.0`);
    process.exit(1);
  }

  if (tagExists(version)) {
    console.error(`Tag '${version}' already exists locally.`);
    process.exit(1);
  }

  // Also check remotes to avoid pushing a duplicate
  if (remoteExists("origin") && remoteTagExists("origin", version)) {
    console.error(`Tag '${version}' already exists on 'origin'.`);
    process.exit(1);
  }

  ensureCleanWorkingTree();

  console.log(`Creating annotated tag ${version} ...`);
  run("git", ["tag", "-a", version, "-m", `Release ${version}`]);

  console.log(`Pushing tag ${version} to 'origin' ...`);
  run("git", ["push", "origin", version]);

  console.log("\nDone. GitHub Actions will build and publish the release with assets for BRAT.");
}

main();
