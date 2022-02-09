#!/usr/bin/env node
import { argv, exit } from 'process';
import { CLI } from './cli';
import { createContainer } from './inversify.config';
import { LogService } from './service/log.service';

const requestVersion = (arg: string) => ['--version', '-version', 'version', '-v', '--v'].includes(arg.toLowerCase());
const requestHelp = (arg: string) => ['--help', '-help', 'help', '-h', '--h'].includes(arg.toLowerCase());

const main = (args: string[]) => {
  const argument = [...args].shift();

  if (requestVersion(String(argument))) {
    const { version } = require('../package.json');
    console.log(version);
    exit(0);
  }
  const container = createContainer();

  if (requestHelp(String(argument))) {
    container.get<LogService>('LogService').info('https://github.com/larscom/ng-chrome-extension');
    exit(0);
  }

  container.get<CLI>('CLI').run();
};

main(argv.slice(2));
