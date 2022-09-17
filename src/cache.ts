type CacheHandler<T> = () => Promise<T>;

export class Cache<T> {
  private readonly handler: CacheHandler<T>;
  private lastUpdated: string | undefined;
  private cache: T | undefined;

  public constructor(handler: CacheHandler<T>) {
    this.handler = handler;
  }

  private getDateKey(): string {
    const date = new Date();
    return `${date.getMonth()}-${date.getDay()}-${date.getFullYear()}`;
  }

  public async read(): Promise<T> {
    if (this.cache && this.lastUpdated === this.getDateKey()) return this.cache;
    this.cache = await this.handler();
    this.lastUpdated = this.getDateKey();
    return this.cache;
  }
}
