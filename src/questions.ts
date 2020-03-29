import inquirer from 'inquirer';
import { Feature } from './model/feature';

export const askProjectName = (name: string): Promise<{ [name: string]: string }> =>
  inquirer.prompt([{ name, type: 'input', message: 'Enter a project name:' }]);

export const askFeatures = (name: string): Promise<{ [name: string]: Feature[] }> =>
  inquirer.prompt([
    {
      name,
      type: 'checkbox',
      message: 'Which features do you want?\n',
      choices: [
        { name: 'Popup (visible when left clicking the icon in the browser)', value: Feature.POPUP },
        { name: 'Options (visible when right clicking the icon in the browser)', value: Feature.OPTIONS },
        { name: 'Tab (visible when opening a new tab in the browser)', value: Feature.TAB }
      ]
    }
  ]);
