#!/usr/bin/env node

import admZip from 'adm-zip'
import axios from 'axios'
import { exec } from 'child_process'
import { program } from 'commander'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import { Logger } from './logger'
import { Spinner } from './spinner'
import { version } from './version'

const packageName = 'ng-chrome'
const githubUrl = 'https://github.com/larscom/ng-chrome-extension'
const templateUrl = 'https://github.com/larscom/angular-chrome-extension/archive/refs/heads/master.zip'

const nameRegex = new RegExp(/^[a-z0-9-_]+$/)
const log = new Logger(githubUrl)
const spinner = new Spinner()

program
  .name(packageName)
  .description(`Create Google Chrome (V3) extensions with Angular!\n${githubUrl}`)
  .version(version)

  .command('new [name]')
  .description('Create a new Angular Chrome extension')
  .action(handleNewProject)

program.parse(process.argv, { from: 'node' })

async function handleNewProject(name: string): Promise<void> {
  log.showIntro(packageName, version)
  if (name) {
    const projectName = await parseName(name)
    await setupNewProject(projectName)
  } else {
    const { name } = await askName('name')
    const projectName = await parseName(name)
    await setupNewProject(projectName)
  }
}

async function setupNewProject(name: string): Promise<void> {
  await createProject(name)
  await installDeps(name)

  log.showOutro(name)
}

async function createProject(name: string): Promise<void> {
  const projectDir = getProjectDir(name)

  try {
    spinner.start('Creating new extension...')

    await downloadTemplate(projectDir, templateUrl)

    spinner.stop(`Created new Angular chrome extension at: ${projectDir}`)
  } catch (e) {
    spinner.stop()
    log.error('Failed creating new extension', e)
    process.exit(1)
  }
}

async function installDeps(name: string): Promise<void> {
  process.chdir(getProjectDir(name))

  try {
    spinner.start('Installing dependencies...')

    await execCmd('npm ci --legacy-peer-deps')
    await execCmd('(cd chrome && npm ci --legacy-peer-deps)')

    spinner.stop('Successfully installed dependencies')
  } catch (e) {
    spinner.stop()
    log.error('Failed installing dependencies', e)
    process.exit(1)
  }
}

async function downloadTemplate(dir: string, templateUrl: string): Promise<void> {
  await fs.mkdirp(dir)
  const zip = new admZip(await getZipBuffer(templateUrl))

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

async function parseName(name: string): Promise<string> {
  if (isValidName(name)) {
    const exist = await dirExists(name)
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

async function getZipBuffer(url: string) {
  return await axios({ url, responseType: 'arraybuffer' }).then(({ data }) => data)
}

async function execCmd(command: string): Promise<void> {
  return new Promise<void>((resolve, reject) => exec(command, (error) => (error ? reject(error) : resolve())))
}

function dirExists(name: string): Promise<boolean> {
  return fs.pathExists(getProjectDir(name))
}

function getProjectDir(name: string): string {
  return path.join(process.cwd(), name)
}

function isValidName(name: string): boolean {
  return nameRegex.test(name)
}

function askName(name: string): Promise<any> {
  return inquirer.prompt([{ name, type: 'input', message: 'Enter a project name:' }])
}
