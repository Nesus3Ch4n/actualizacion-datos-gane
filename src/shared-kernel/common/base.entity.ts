export abstract class BaseEntity<T> {
  protected constructor(protected readonly id: T) {}

  getId(): T {
    return this.id;
  }

  equals(other: BaseEntity<T>): boolean {
    if (!(other instanceof BaseEntity)) {
      return false;
    }
    return this.id === other.id;
  }

  abstract validate(): string[];
} 