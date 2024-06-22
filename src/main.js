#!/usr/bin/env node

import admZip from 'adm-zip'
import axios from 'axios'
import { exec } from 'child_process'
import { program } from 'commander'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import { githubUrl, packageName, templateUrl, version } from './constants.js'
import { Logger } from './logger.js'
import { Spinner } from './spinner.js'

const nameRegex = new RegExp(/^[a-z0-9-_]+$/)
const log = new Logger()
const spinner = new Spinner()

program
  .name(packageName)
  .description(`Create Google Chrome (V3) extensions with Angular!\n${githubUrl}`)
  .version(version)

  .command('new [name]')
  .description('Create a new Angular Chrome extension')
  .action(handleNewProjectAsync)

program.parse(process.argv, { from: 'node' })

async function handleNewProjectAsync(name) {
  log.showIntro(packageName, version)
  if (name) {
    const projectName = await parseNameAsync(name)
    await setupNewProjectAsync(projectName)
  } else {
    const { name } = await askNameAsync('name')
    const projectName = await parseNameAsync(name)
    await setupNewProjectAsync(projectName)
  }
}

async function setupNewProjectAsync(name) {
  await createProjectAsync(name)
  await installDepsAsync(name)

  log.showOutro(name)
}

async function createProjectAsync(name) {
  const projectDir = getProjectDir(name)

  try {
    spinner.start('Creating new extension...')

    await downloadTemplateAsync(projectDir, templateUrl)

    spinner.stop(`Created new Angular chrome extension at: ${projectDir}`)
  } catch (e) {
    spinner.stop()
    log.error('Failed creating new extension', e)
    process.exit(1)
  }
}

async function installDepsAsync(name) {
  process.chdir(getProjectDir(name))

  try {
    spinner.start('Installing dependencies...')

    await execAsync('npm ci --legacy-peer-deps')
    await execAsync('(cd chrome && npm ci --legacy-peer-deps)')

    spinner.stop('Successfully installed dependencies')
  } catch (e) {
    spinner.stop()
    log.error('Failed installing dependencies', e)
    process.exit(1)
  }
}

async function downloadTemplateAsync(dir, templateUrl) {
  await fs.mkdirp(dir)
  const zip = new admZip(await getZipBufferAsync(templateUrl))

  const entries = zip.getEntries()
  for (const entry of entries) {
    const path = `${dir}/${entry.entryName.replace('angular-chrome-extension-master/', '')}`
    if (path.includes('..')) {
      const msg = `Unexpected path: ${path}`
      log.error(msg)
      throw Error(msg)
    }

    if (entry.isDirectory) {
      fs.mkdirpSync(path)
    } else {
      fs.writeFileSync(path, entry.getData().toString('utf-8'))
    }
  }
}

async function parseNameAsync(name) {
  if (isValidName(name)) {
    const exist = await existsAsync(name)
    if (exist) {
      log.error(`Project with name '${name}' already exists`)
      process.exit(1)
    }
    return name
  } else {
    log.error(`Project name invalid, must match: ${nameRegex.toString()}`)
    process.exit(1)
  }
}

async function getZipBufferAsync(url) {
  return await axios({ url, responseType: 'arraybuffer' }).then(({ data }) => data)
}

async function execAsync(command) {
  return new Promise((resolve, reject) => exec(command, (error) => (error ? reject(error) : resolve())))
}

function existsAsync(name) {
  return fs.pathExists(getProjectDir(name))
}

function getProjectDir(name) {
  return path.join(process.cwd(), name)
}

function isValidName(name) {
  return nameRegex.test(name)
}

function askNameAsync(name) {
  return inquirer.prompt([{ name, type: 'input', message: 'Enter a project name:' }])
}
