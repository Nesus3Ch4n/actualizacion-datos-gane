export class NumeroDocumento {
  readonly valor: string;

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.trim();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El número de documento es obligatorio');
    }

    const numeroLimpio = valor.trim();

    if (numeroLimpio.length < 7 || numeroLimpio.length > 15) {
      throw new Error('El número de documento debe tener entre 7 y 15 dígitos');
    }

    if (!/^\d+$/.test(numeroLimpio)) {
      throw new Error('El número de documento solo puede contener números');
    }
  }

  equals(otro: NumeroDocumento): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 