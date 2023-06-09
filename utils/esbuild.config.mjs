import process from "node:process";
import esbuild from "esbuild";
import builtins from "builtin-modules";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import AdmZip from "adm-zip";
import fse from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const output = distPath + "/obsidian-daedalus";


const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

// Clear the dist folder at the beginning of the script
await fse.emptyDir(distPath);

const buildOptions = {
  banner: {
    js: banner
  },
  entryPoints: ["src/daedalus.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins
  ],
  platform: "node",
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  outfile: "dist/obsidian-daedalus/main.js"
};

if (prod) {
  try {
    await esbuild.build(buildOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Build failed");
  }
} else {
  const { rebuild } = await esbuild.build({
    ...buildOptions,
    watch: true,
    serve: {
      port: 1234,
      servedir: "dist"
    }
  });
  rebuild();
}

const src = path.resolve(__dirname, "../src");
const zipPath = distPath + "/obsidian-daedalus.zip";

try {
  await Promise.all([
    fs.copyFile(src + "/manifest.json", output + "/manifest.json"),
    fs.copyFile(src + "/versions.json", output + "/versions.json")
  ]);

  const zip = new AdmZip();
  zip.addLocalFolder(output, "obsidian-daedalus");
  zip.writeZip(zipPath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Zip created");
    }
  });
} catch (error) {
  console.error(error);
}
