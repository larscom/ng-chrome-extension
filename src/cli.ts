import { inject as Inject, injectable as Injectable } from 'inversify';
import { askFeatures, askProjectName } from './questions';
import { ProjectService } from './service/project.service';
import { LogService } from './service/log.service';

@Injectable()
export class CLI {
  constructor(
    @Inject('LogService') private readonly log: LogService,
    @Inject('ProjectService') private readonly project: ProjectService
  ) {}

  /**
   * Start asking questions
   */
  async run(): Promise<void> {
    this.log.showIntro();

    const { projectName } = await askProjectName('projectName');
    await this.project.validateName(projectName);

    const { features } = await askFeatures('features');
    this.project.validateFeatures(features);

    await this.project.create(projectName, features);
    await this.project.install(projectName);

    this.log.showHelp(projectName);
  }
}
