export class LocalStorage<T> {
  private memory: T | null = null;

  constructor(
    private key: string,
    private defaultValue: T | null = null,
  ) {}

  /**
   * Get value, prefer memory -> localStorage -> default
   */
  get(): T | null {
    if (this.memory !== null)
      return this.memory;

    const stored = localStorage.getItem(this.key);
    if (stored !== null) {
      try {
        this.memory = JSON.parse(stored) as T;
        return this.memory;
      }
      catch {
        console.warn(`Invalid JSON in localStorage for key "${this.key}"`);
        localStorage.removeItem(this.key);
      }
    }

    this.memory = this.defaultValue;
    return this.memory;
  }

  /**
   * Get value only from memory (without touching localStorage).
   */
  getFromMemory(): T | null {
    return this.memory;
  }

  /**
   * Save value to memory and localStorage
   */
  set(value: T): void {
    this.memory = value;
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  /**
   * Remove from both memory and localStorage
   */
  remove(): void {
    this.memory = null;
    localStorage.removeItem(this.key);
  }
}
