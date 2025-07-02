export class TipoSangre {
  readonly valor: string;

  private static readonly TIPOS_PERMITIDOS = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El tipo de sangre es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!TipoSangre.TIPOS_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Tipo de sangre no válido. Tipos permitidos: ${TipoSangre.TIPOS_PERMITIDOS.join(', ')}`);
    }
  }

  static getTiposPermitidos(): string[] {
    return [...TipoSangre.TIPOS_PERMITIDOS];
  }

  esPositivo(): boolean {
    return this.valor.endsWith('+');
  }

  esNegativo(): boolean {
    return this.valor.endsWith('-');
  }

  getGrupo(): string {
    return this.valor.replace(/[+-]/, '');
  }

  getFactor(): string {
    return this.valor.slice(-1);
  }

  esDonadorUniversal(): boolean {
    return this.valor === 'O-';
  }

  esReceptorUniversal(): boolean {
    return this.valor === 'AB+';
  }

  equals(otro: TipoSangre): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 