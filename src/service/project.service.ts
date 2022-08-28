import admZip from 'adm-zip';
import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs-extra';
import { inject as Inject, injectable as Injectable } from 'inversify';
import path from 'path';
import ts from 'typescript';
import { Feature } from '../model/feature';
import { Package } from '../model/package';
import { LogService } from './log.service';
import { SpinnerService } from './spinner.service';

const deleteFiles = ['README.md'];
const jsonFormat = { spaces: 2 };

const getProjectDir = (name: string): string => path.join(process.cwd(), name);

const projectNameMatch = new RegExp(/^[a-z0-9-_]+$/);

const invalidProjectName = (name: string) => !projectNameMatch.test(String(name));

@Injectable()
export class ProjectService {
  constructor(
    @Inject('LogService') private readonly log: LogService,
    @Inject('SpinnerService') private readonly spinner: SpinnerService,
    @Inject('Package') private readonly pkg: Package
  ) {}

  /**
   * Download https://github.com/larscom/angular-chrome-extension template
   */
  async create(projectName: string, chosenFeatures: Feature[]): Promise<void> {
    const { repository } = this.pkg;

    const projectDir = getProjectDir(projectName);
    const featuresToRemove = Object.values(Feature).filter((it) => !chosenFeatures.includes(it));

    try {
      this.spinner.start('creating new extension...');

      await this.downloadAndUnzip(projectDir, repository.zip_url);
      await this.cleanDir(projectDir, featuresToRemove);
      await this.writeFiles(projectDir, projectName, chosenFeatures, featuresToRemove);

      this.spinner.stop(`done! created new angular chrome extension in: ${projectDir}`);
    } catch (e) {
      this.spinner.stop();
      this.log.error('failed creating new extension', e);
      process.exit(1);
    }
  }

  /**
   * Install the required dependencies using `npm ci`
   */
  async install(projectName: string): Promise<void> {
    const projectDir = getProjectDir(projectName);
    process.chdir(projectDir);

    try {
      this.spinner.start('installing dependencies...');

      await this.execAsync('npm ci --legacy-peer-deps');

      this.spinner.stop('done! installed dependencies');
    } catch (e) {
      this.spinner.stop();
      this.log.error('failed installing dependencies', e);
      process.exit(1);
    }
  }

  async validateName(projectName: string): Promise<void> {
    if (invalidProjectName(projectName)) {
      this.log.error(`Invalid project name, must match: ${projectNameMatch.toString()}`);
      process.exit(1);
    }
    const projectExists = await this.existsAsync(projectName);
    if (projectExists) {
      this.log.error(`Project '${projectName}' already exists`);
      process.exit(1);
    }
  }

  validateFeatures(features: Feature[]): void {
    if (!features.length) {
      this.log.error('You must select at least 1 feature');
      process.exit(1);
    }
  }

  private writeAngularRoutingModule(projectDir: string, featuresToRemove: Feature[]): void {
    if (!featuresToRemove.length) {
      return;
    }

    const fileName = 'app-routing.module.ts';
    const routingFile = `${projectDir}/angular/src/app/${fileName}`;

    const compiler = ts.createCompilerHost(require(`${projectDir}/angular/tsconfig.json`));
    const buffer = fs.readFileSync(routingFile);
    const source = ts.createSourceFile(fileName, buffer.toString('utf-8'), ts.ScriptTarget.Latest, true);
    const nodesToRemove = this.findNodes(source, featuresToRemove);

    const sourceContent = source.getFullText();
    const newSource = nodesToRemove
      .map((node) => sourceContent.substring(node.pos, node.end))
      .reduce((acc, curr) => acc.replace(curr, ''), sourceContent)
      .replace(',,', ',');

    compiler.writeFile(routingFile, newSource, false);
  }

  private findNodes(node: ts.Node, features: Feature[], nodes: ts.Node[] = []): ts.Node[] {
    if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
      const children = node.getChildren().map((child) => child.getText());
      const hasFeature = features.some((feature) => children.some((child) => child.includes(String(feature))));

      if (hasFeature) {
        nodes.push(node);
      }
    }

    for (const child of node.getChildren()) {
      this.findNodes(child, features, nodes);
    }

    return nodes;
  }

  private async cleanDir(cloneDir: string, featuresToRemove: Feature[]): Promise<[Promise<void>[], Promise<void>[]]> {
    return Promise.all([
      deleteFiles.map((file) => fs.unlink(`${cloneDir}/${file}`)),
      featuresToRemove.map((feature) => fs.remove(`${cloneDir}/angular/src/app/modules/${feature}`))
    ]);
  }

  private async writeManifestJson(cloneDir: string, projectName: string, chosenFeatures: Feature[]): Promise<void> {
    const manifestJson = `${cloneDir}/angular/src/manifest.json`;
    const currentManifestJson = require(manifestJson);

    const manifest = {
      name: projectName,
      short_name: projectName,
      description: `Generated with ${this.pkg.name}`,
      browser_action: chosenFeatures.includes(Feature.POPUP) ? currentManifestJson.browser_action : undefined,
      options_page: chosenFeatures.includes(Feature.OPTIONS) ? currentManifestJson.options_page : undefined,
      chrome_url_overrides: chosenFeatures.includes(Feature.TAB) ? currentManifestJson.chrome_url_overrides : undefined
    };

    return fs.writeJson(manifestJson, { ...currentManifestJson, ...manifest }, jsonFormat);
  }

  private async writeFiles(
    projectDir: string,
    projectName: string,
    chosenFeatures: Feature[],
    featuresToRemove: Feature[]
  ): Promise<void> {
    await this.writePackageJson(projectDir, projectName);
    await this.writeManifestJson(projectDir, projectName, chosenFeatures);
    this.writeAngularRoutingModule(projectDir, featuresToRemove);
  }

  private async writePackageJson(cloneDir: string, projectName: string): Promise<void> {
    const packageJson = `${cloneDir}/package.json`;
    const currentPackageJson = require(packageJson);

    return fs.writeJson(
      packageJson,
      {
        ...currentPackageJson,
        name: projectName,
        description: `Generated with ${this.pkg.name}`,
        author: undefined
      },
      jsonFormat
    );
  }

  private async downloadAndUnzip(projectDir: string, url: string): Promise<void> {
    await fs.mkdirp(projectDir);
    const zip = new admZip(await this.getZipBuffer(url));

    const entries = zip.getEntries();
    for (const entry of entries) {
      const path = `${projectDir}/${entry.entryName.replace('angular-chrome-extension-master/', '')}`;
      if (path.includes('..')) {
        throw Error(`Unexpected path: ${path}`);
      }

      if (entry.isDirectory) {
        fs.mkdirpSync(path);
      } else {
        fs.writeFileSync(path, entry.getData().toString('utf-8'));
      }
    }
  }

  private async getZipBuffer(url: string): Promise<Buffer> {
    return await axios({ url, responseType: 'arraybuffer' }).then(({ data }) => data as Buffer);
  }

  private existsAsync(projectName: string): Promise<boolean> {
    return fs.pathExists(getProjectDir(projectName));
  }

  private execAsync(command: string): Promise<void> {
    return new Promise((resolve, reject) => exec(command, (error) => (error ? reject(error) : resolve())));
  }
}
