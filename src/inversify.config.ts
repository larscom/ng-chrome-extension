import { Container } from 'inversify';
import 'reflect-metadata';
import { CLI } from './cli';
import { Package } from './model/package';
import { ProjectService } from './service/project.service';
import { SpinnerService } from './service/spinner.service';
import { LogService } from './service/log.service';

/**
 * Creates an IoC Container
 * @summary all bindings are Singleton by default
 */
export const createContainer = (): Container => {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind<CLI>('CLI').to(CLI);
  container.bind<LogService>('LogService').to(LogService);
  container.bind<ProjectService>('ProjectService').to(ProjectService);
  container.bind<SpinnerService>('SpinnerService').to(SpinnerService);

  container.bind<Package>('Package').toConstantValue(require('../package'));

  return container;
};
