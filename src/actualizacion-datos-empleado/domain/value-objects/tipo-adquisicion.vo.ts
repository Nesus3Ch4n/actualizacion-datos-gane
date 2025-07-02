export class TipoAdquisicion {
  readonly valor: string;

  private static readonly TIPOS_PERMITIDOS = [
    'PROPIA',
    'ARRENDADA',
    'FAMILIAR',
    'PRESTADA',
    'OTRO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El tipo de adquisición es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!TipoAdquisicion.TIPOS_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Tipo de adquisición no válido. Tipos permitidos: ${TipoAdquisicion.TIPOS_PERMITIDOS.join(', ')}`);
    }
  }

  static getTiposPermitidos(): string[] {
    return [...TipoAdquisicion.TIPOS_PERMITIDOS];
  }

  esPropia(): boolean {
    return this.valor === 'PROPIA';
  }

  esArrendada(): boolean {
    return this.valor === 'ARRENDADA';
  }

  esFamiliar(): boolean {
    return this.valor === 'FAMILIAR';
  }

  requierePago(): boolean {
    return this.esArrendada();
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'PROPIA': 'Propia',
      'ARRENDADA': 'Arrendada',
      'FAMILIAR': 'Familiar',
      'PRESTADA': 'Prestada',
      'OTRO': 'Otro'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: TipoAdquisicion): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 