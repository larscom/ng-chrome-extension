# @larscom/ng-chrome-extension

[![npm-release](https://img.shields.io/npm/v/@larscom/ng-chrome-extension.svg?label=npm)](https://www.npmjs.com/package/@larscom/ng-chrome-extension)
[![license](https://img.shields.io/npm/l/@larscom/ng-chrome-extension)](https://github.com/larscom/ng-chrome-extension/blob/master/LICENSE)
![npm](https://img.shields.io/npm/dt/@larscom/ng-chrome-extension)

> Easily create `Angular` Chrome Extensions (manifest v3)

The following scenarios are supported:

- Popup &#10003;
- New Tab &#10003;
- Options &#10003;
- Side Panel &#10003;
- Service Worker &#10003;
- Content Page &#10003;

## How to install

```bash
npm install -g @larscom/ng-chrome-extension
```

## Start creating a new project

```bash
ng-chrome
```

![alt text](https://snipboard.io/OYcNzx.jpg 'ng-chrome CLI')

## How to use/develop

- change directory to your newly created project
- run `npm run start`
- goto: `chrome://extensions` in the browser and enable `'developer mode'`
- press `Load unpacked` and target the folder `angular/dist`

The project is automatically being watched, any changes to the files will recompile the project.

**NOTE**: changes to the **content page** and **service worker** scripts requires you to reload the extension in `chrome://extensions`

![alt text](https://snipboard.io/KToCI3.jpg 'Angular Chrome Popup')
![alt text](https://snipboard.io/VYfGoD.jpg 'Angular Chrome Tab')

## Build/package for production

- update version number inside `./angular/src/manifest.json`
- run `npm run build:production`
- upload `extension-build.zip` to the chrome webstore.

This will run a production build and will automatically zip it as a extension package in the root folder named: `extension-build.zip`

## Debugging

Run: `npm start`

Go to: Developer tools (inspect popup) => Sources => webpack

You can find your source files (TypeScript) over there.

## Upgrade Angular

After you have created a new project with `ng-chrome` and you want to update angular.

Just follow the regular upgrade guide of angular. See: https://update.angular.io/

## Angular folder

This folder contains the angular source code.
Each feature (popup,options,tab,side-panel) lives inside its own standalone component and gets lazily loaded.

see: `./angular/src/app/modules`

## Chrome folder

This folder contains the content page/service worker scripts.
