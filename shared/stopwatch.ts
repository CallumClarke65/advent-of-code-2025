export class Stopwatch {
  private startTime = 0;
  private elapsed = 0;
  private running = false;

  start(): void {
    if (!this.running) {
      this.startTime = Date.now() - this.elapsed;
      this.running = true;
    }
  }

  stop(): string {
    if (this.running) {
      this.elapsed = Date.now() - this.startTime;
      this.running = false;
    }
    return Stopwatch.formatMs(this.elapsed);
  }

  reset(): void {
    this.startTime = 0;
    this.elapsed = 0;
    this.running = false;
  }

  private static formatMs(ms: number): string {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const mmm = String(milliseconds).padStart(3, "0");
    return `${mm}:${ss}.${mmm}`; // e.g. "04:05.023"
  }
}
