import ora from 'ora'

export class Spinner {
  #loader = ora({ color: 'green', hideCursor: true })

  start(text) {
    this.#loader.start(text)
  }

  stop(text) {
    this.#loader.succeed(text)
  }
}
