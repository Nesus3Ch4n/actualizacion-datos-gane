export class EstadoCivil {
  readonly valor: string;

  private static readonly VALORES_PERMITIDOS = [
    'SOLTERO',
    'CASADO',
    'UNION_LIBRE',
    'DIVORCIADO',
    'VIUDO',
    'SEPARADO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El estado civil es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!EstadoCivil.VALORES_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Estado civil no válido. Valores permitidos: ${EstadoCivil.VALORES_PERMITIDOS.join(', ')}`);
    }
  }

  static getValoresPermitidos(): string[] {
    return [...EstadoCivil.VALORES_PERMITIDOS];
  }

  esSoltero(): boolean {
    return this.valor === 'SOLTERO';
  }

  esCasado(): boolean {
    return this.valor === 'CASADO';
  }

  esUnionLibre(): boolean {
    return this.valor === 'UNION_LIBRE';
  }

  tienePareja(): boolean {
    return this.esCasado() || this.esUnionLibre();
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'SOLTERO': 'Soltero(a)',
      'CASADO': 'Casado(a)',
      'UNION_LIBRE': 'Unión Libre',
      'DIVORCIADO': 'Divorciado(a)',
      'VIUDO': 'Viudo(a)',
      'SEPARADO': 'Separado(a)'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: EstadoCivil): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 