export class TipoVivienda {
  readonly valor: string;

  private static readonly TIPOS_PERMITIDOS = [
    'CASA',
    'APARTAMENTO',
    'CASA_LOTE',
    'FINCA',
    'HABITACION',
    'OTRO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El tipo de vivienda es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!TipoVivienda.TIPOS_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Tipo de vivienda no válido. Tipos permitidos: ${TipoVivienda.TIPOS_PERMITIDOS.join(', ')}`);
    }
  }

  static getTiposPermitidos(): string[] {
    return [...TipoVivienda.TIPOS_PERMITIDOS];
  }

  esCasa(): boolean {
    return ['CASA', 'CASA_LOTE'].includes(this.valor);
  }

  esApartamento(): boolean {
    return this.valor === 'APARTAMENTO';
  }

  esFinca(): boolean {
    return this.valor === 'FINCA';
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'CASA': 'Casa',
      'APARTAMENTO': 'Apartamento',
      'CASA_LOTE': 'Casa con Lote',
      'FINCA': 'Finca',
      'HABITACION': 'Habitación',
      'OTRO': 'Otro'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: TipoVivienda): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 