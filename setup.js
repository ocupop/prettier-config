#!/usr/bin/env node
const fs = require("fs");

// Validate we have a package json to work with. If not we can't do much
if (!fs.existsSync("package.json")) {
  console.error(
    "No package.json found. Make sure you are in the project root. If no package.json exists yet, run `npm init` first."
  );
  process.exit(1);
}

// Write prettier config files
const CONFIG_FILES = {
"prettier.config.js": `\
 const config = require("@ocupop/prettier-config");
 module.exports = config;`,
 // @TODO: This should append
".prettierignore": `\
node_modules/
# npm install does its' own formatting of the package.json and package-lock.json
# files
package*.json
*.html
`
};

// Write files
Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
  fs.writeFileSync(fileName, contents, "utf8");
});

// Update package.json scripts to run prettier against these files
const FILE_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "css",
  "less",
  "scss",
  "graphql",
  "yaml",
  "yml",
  "json",
  "md",
];


const targetedFileBlob = `**/*.{${FILE_EXTENSIONS.join(",")}}`;
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

packageJson.scripts = packageJson.scripts || {};
// create new nodes
packageJson.scripts.checkFormat = `prettier --list-different '${targetedFileBlob}' `;
packageJson.scripts.format = `prettier --write '${targetedFileBlob}' `;
// re-write the commands to package.json
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf8");

// add packages to the project
require("child_process").execSync(
  "npm install --save-dev @ocupop/prettier-config prettier",
  { stdio: "inherit" },
);