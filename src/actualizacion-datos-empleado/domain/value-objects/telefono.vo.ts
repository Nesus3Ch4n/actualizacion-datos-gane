export class Telefono {
  readonly valor: string;

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.trim();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El número de teléfono es obligatorio');
    }

    const telefonoLimpio = valor.trim();

    if (!/^\d{10}$/.test(telefonoLimpio)) {
      throw new Error('El número de teléfono debe tener exactamente 10 dígitos');
    }

    // Validar que no sea un número obviamente inválido
    if (/^0{10}$/.test(telefonoLimpio) || /^1{10}$/.test(telefonoLimpio)) {
      throw new Error('El número de teléfono no es válido');
    }
  }

  esMovil(): boolean {
    // En Colombia, los móviles empiezan con 3
    return this.valor.startsWith('3');
  }

  esFijo(): boolean {
    // En Colombia, los fijos no empiezan con 3
    return !this.valor.startsWith('3');
  }

  getFormatoMostrar(): string {
    // Formato: 300 123 4567
    return `${this.valor.substring(0, 3)} ${this.valor.substring(3, 6)} ${this.valor.substring(6)}`;
  }

  equals(otro: Telefono): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 