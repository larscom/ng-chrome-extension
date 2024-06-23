import ora from 'ora'

export class Spinner {
  private loader = ora({ color: 'green', hideCursor: true })

  start(text: string) {
    this.loader.start(text)
  }

  stop(text?: string) {
    this.loader.succeed(text)
  }
}
