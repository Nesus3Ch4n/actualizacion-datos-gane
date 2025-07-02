export class Email {
  readonly valor: string;

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.trim().toLowerCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El email es obligatorio');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor.trim())) {
      throw new Error('El formato del email no es válido');
    }

    if (valor.trim().length > 100) {
      throw new Error('El email no puede exceder 100 caracteres');
    }
  }

  getDominio(): string {
    return this.valor.split('@')[1];
  }

  equals(otro: Email): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 