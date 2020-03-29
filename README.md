# @larscom/ng-chrome-extension

[![npm-release](https://img.shields.io/npm/v/@larscom/ng-chrome-extension.svg?label=npm)](https://www.npmjs.com/package/@larscom/ng-chrome-extension)
[![license](https://img.shields.io/npm/l/@larscom/ng-chrome-extension)](https://github.com/larscom/ng-chrome-extension/blob/master/LICENSE)
![npm](https://img.shields.io/npm/dw/@larscom/ng-chrome-extension)

Easily create Google Chrome Extensions using the `latest` version of Angular.

The following scenarios/options are supported:

- Popup &#10003;
- New Tab &#10003;
- Options &#10003;
- Background Page &#10003;
- Content Page &#10003;

## How to install

```bash
npm install -g @larscom/ng-chrome-extension
```

## Start creating a new project

```bash
ng-chrome
```

![alt text](https://snipboard.io/2eBxET.jpg 'ng-chrome CLI')

## How to use/develop

- change directory to your newly created project
- run `npm run start`
- goto: `chrome://extensions` in the browser and enable `'developer mode'`
- press `Load unpacked` and target the folder `angular/dist`

The project is automatically being watched, any changes to the files will recompile the project.

**NOTE**: changes to the **content page** and **background page** scripts requires you to reload the extension in `chrome://extensions`

![alt text](https://snipboard.io/KToCI3.jpg 'Angular Chrome Popup')
![alt text](https://snipboard.io/VYfGoD.jpg 'Angular Chrome Tab')

## Build/package for production

- update version number inside `./angular/src/manifest.json`
- run `npm run build:production`
- upload `extension-build.zip` to the chrome webstore.

This will run a production build and will automatically zip it as a extension package in the root folder named: `extension-build.zip`

## Angular folder

This folder contains the angular source code.
Each feature (popup,options,tab) lives inside its own module and gets lazily loaded.

see: `./angular/src/app/modules`

## Chrome folder

This folder contains the content page/background page scripts.
