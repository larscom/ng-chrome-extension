import { injectable as Injectable } from 'inversify';
import ora from 'ora';

@Injectable()
export class SpinnerService {
  private readonly loader = ora({ color: 'green', hideCursor: true });

  start(text: string): void {
    this.loader.start(text);
  }

  stop(text?: string): void {
    this.loader.succeed(text);
  }
}
