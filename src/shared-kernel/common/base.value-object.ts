export abstract class BaseValueObject<T> {
  protected constructor(protected readonly _value: T) {
    this.validate();
  }

  get value(): T {
    return this._value;
  }

  equals(other: BaseValueObject<T>): boolean {
    if (!(other instanceof BaseValueObject)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return String(this._value);
  }
  
  protected abstract validate(): void;
} 