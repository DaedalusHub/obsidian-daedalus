import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the current Obsidian version from package.json
const packageJsonPath = path.resolve(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const obsidianVersion = packageJson.dependencies.obsidian.replace(/[^0-9.]/g, "");
const newVersion = packageJson.version;

// Read the current manifest.json file
const manifestJsonPath = path.resolve(__dirname, "..", "src", "manifest.json");
const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, "utf8"));

// Update the manifest.json file with the new version number
manifestJson.version = newVersion;
fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, "\t"));

// Read the current versions.json file
const versionsJsonPath = path.resolve(__dirname, "..", "src", "versions.json");
let versionsJson = {};
if (fs.existsSync(versionsJsonPath)) {
  versionsJson = JSON.parse(fs.readFileSync(versionsJsonPath, "utf-8"));
}

// Remove any older versions that have the same minAppVersion
Object.keys(versionsJson).forEach((version) => {
  if (versionsJson[version] === obsidianVersion && version !== newVersion) {
    delete versionsJson[version];
  }
});

// Check if the new version already exists in the versions.json file
// If it does, only update the minAppVersion if it is higher than the existing version's minAppVersion
if (versionsJson[newVersion]) {
  const existingMinAppVersion = versionsJson[newVersion];
  if (existingMinAppVersion < obsidianVersion) {
    versionsJson[newVersion] = obsidianVersion;
  }
} else {
  // If the new version doesn't exist, add it to the versions.json file
  versionsJson[newVersion] = obsidianVersion;
}

// Write the updated versions.json file
fs.writeFileSync(versionsJsonPath, JSON.stringify(versionsJson, null, "\t"));
