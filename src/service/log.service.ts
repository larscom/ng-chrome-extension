import clear from 'clear';
import figlet from 'figlet';
import { inject as Inject, injectable as Injectable } from 'inversify';
import { cyan, red, yellow, bold } from 'kleur';
import { Package } from '../model/package';

@Injectable()
export class LogService {
  constructor(@Inject('Package') private readonly pkg: Package) {}

  error(message: string, ...optionalParams: any[]): void {
    console.log(red(`=> ${message}`), ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    console.log(yellow(`=> ${message}`), ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    console.log(cyan(`=> ${message}`), ...optionalParams);
  }

  showIntro(): void {
    clear({ fullClear: true });

    console.log(red(figlet.textSync(this.pkg.shortName, { horizontalLayout: 'full' })));
    console.log(yellow(`More info: ${cyan('https://github.com/larscom/ng-chrome-extension')}`));
    console.log('---------------------------------------------------------------');
    console.info('Generating a new chrome extension...');
    console.log();
  }

  showHelp(projectName: string): void {
    console.log();
    console.log('---------------------------------------------------------------');
    console.log(`You can now change directory to ${yellow(projectName)} and type the following commands:`);

    console.log();
    console.log(`   ${cyan('npm start')}`);
    console.log('       The project is automatically being watched/build');
    console.log(`       Go to ${yellow('chrome://extensions')} in the browser and enable '${bold('developer mode')}'`);
    console.log(`       Press ${yellow('Load unpacked')} and target the folder '${bold('angular/dist')}'`);

    console.log();
    console.log(`   ${cyan('npm run build:production')}`);
    console.log('       Creates a production ready zip file');
    console.log(`       Upload ${yellow('extension-build.zip')} directly to the chrome webstore`);
    console.log();
  }
}
