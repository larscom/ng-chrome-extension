#!/usr/bin/env node
import { argv, exit } from 'process';
import { CLI } from './cli';
import { createContainer } from './inversify.config';

const requestVersion = (arg: string) => ['--version', '-version', 'version', '-v'].includes(arg.toLowerCase());

const main = (args: string[]) => {
  const argument = [...args].shift();

  if (requestVersion(String(argument))) {
    const { version } = require('./package');
    console.log(version);
    exit(0);
  }

  const container = createContainer();
  container.get<CLI>('CLI').run();
};

main(argv.slice(2));
