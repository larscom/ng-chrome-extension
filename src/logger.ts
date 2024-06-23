import clear from 'clear'
import figlet from 'figlet'
import kleur from 'kleur'

const red = kleur.red
const yellow = kleur.yellow
const cyan = kleur.cyan
const green = kleur.green
const bold = kleur.bold

export class Logger {
  private readonly githubUrl: string

  constructor(githubUrl: string) {
    this.githubUrl = githubUrl
  }

  error(message: string, ...optionalParams: any[]) {
    console.log(red(`ERROR: ${message}`), ...optionalParams)
  }

  warn(message: string, ...optionalParams: any[]) {
    console.log(yellow(`WARN: ${message}`), ...optionalParams)
  }

  info(message: string, ...optionalParams: any[]) {
    console.log(cyan(`INFO: ${message}`), ...optionalParams)
  }

  showIntro(name: string, version: string) {
    clear({ fullClear: true })

    console.log(red(figlet.textSync(name, { horizontalLayout: 'full' })))
    console.log(green(version))
    console.log('---------------------------------------------------------------')
    console.log(`${this.githubUrl}`)
    console.log()
  }

  showOutro(name: string) {
    console.log()
    console.log('---------------------------------------------------------------')
    console.log(`You can now change directory to ${yellow(name)} and type the following commands:`)

    console.log()
    console.log(`   ${cyan('npm start')}`)
    console.log('       The project is automatically being watched/build')
    console.log(`       Go to ${yellow('chrome://extensions')} in the browser and enable '${bold('developer mode')}'`)
    console.log(`       Press ${yellow('Load unpacked')} and target the folder '${bold('angular/dist')}'`)

    console.log()
    console.log(`   ${cyan('npm run build:production')}`)
    console.log('       Creates a production ready zip file')
    console.log(`       Upload ${yellow('extension-build.zip')} directly to the chrome webstore`)
    console.log()
  }
}
