#!/usr/bin/env node
const fs = require('fs')
const yargs = require('yargs')
const inquirer = require('inquirer')
const childProccess = require('child_process')

yargs
  .help('h')
  .alias('h', 'help')
  .option('remove', {
    describe: 'Remove prettier from application',
    type: 'boolean',
    alias: 'rm',
    default: false
  })
  .option('upgrade', {
    describe: 'Upgrade prettier config',
    type: 'boolean',
    alias: 'up',
    default: false
  })

const argv = yargs.argv

// Validate we have a package json to work with. If not we can't do much
if (!fs.existsSync('package.json')) {
  console.error(
    'No package.json found. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.'
  )
  process.exit(1)
}

const prettierPackage = '@ocupop/prettier-config'
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
packageJson.scripts = packageJson.scripts || {}

// Write prettier config files
// @TODO: This should append if files already exist
const CONFIG_FILES = {
  'prettier.config.js': `\
  /**
   * @type { import("prettier").Options }
   */
  module.exports = {
    ...require('${prettierPackage}')
    // Override the rules here...
  }
  `,
  '.prettierignore': `\
  node_modules/
  package*.json
  *.html
  `
}

// Update package.json scripts to run prettier against these files
const FILE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'css', 'less', 'scss', 'graphql', 'yaml', 'yml', 'json', 'md']

/**
 * Adds Prettier to a project
 */
function addPrettier() {
  // Write files
  Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, contents, 'utf8')
    } else {
      console.warn(`skipping over writing ${fileName} because it already exists`)
    }
  })

  const targetedFileBlob = `**/*.{${FILE_EXTENSIONS.join(',')}}`

  // create new nodes
  packageJson.scripts.checkFormat = `prettier --check '${targetedFileBlob}' `
  packageJson.scripts.format = `prettier --write '${targetedFileBlob}' `
  // re-write the commands to package.json
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8')

  // add packages to the project
  childProccess.execSync(`npm install --save-dev ${prettierPackage} prettier`, {
    stdio: 'inherit'
  })
}

/**
 * Updates the prettier packages
 */
function upgradePrettier() {
  childProccess.execSync(`npm update ${prettierPackage}`, {
    stdio: 'inherit'
  })
}

/**
 * Removes prettier from a project
 */
function removePrettier() {
  // Remove files
  Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
    // validate file exists
    if (fs.existsSync(fileName)) {
      fs.unlink(fileName, error => {
        // supress the error
      })
    }
  })

  // clean package.json scripts
  delete packageJson.scripts.checkFormat
  delete packageJson.scripts.format

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8')

  // remove the packages
  childProccess.execSync(`npm uninstall ${prettierPackage} prettier`, {
    stdio: 'inherit'
  })
}

/**
 * Main entry point for the application
 */
async function init() {
  // Check against arugments passed in
  if (argv.remove) {
    // validate we really want to remove everything
    await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'shouldClean',
          message: 'This will remove all prettier config and prettier ignore files, continue?'
        }
      ])
      .then(value => {
        if (value.shouldClean) {
          removePrettier()
        }
      })
  } else if (argv.upgrade) {
    upgradePrettier()
  } else {
    addPrettier()
  }
}

init()
