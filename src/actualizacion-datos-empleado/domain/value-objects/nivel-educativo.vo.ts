export class NivelEducativo {
  readonly valor: string;

  private static readonly NIVELES_PERMITIDOS = [
    'PRIMARIA',
    'SECUNDARIA',
    'TECNICO',
    'TECNOLOGO',
    'UNIVERSITARIO',
    'ESPECIALIZACION',
    'MAESTRIA',
    'DOCTORADO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El nivel educativo es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!NivelEducativo.NIVELES_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Nivel educativo no válido. Niveles permitidos: ${NivelEducativo.NIVELES_PERMITIDOS.join(', ')}`);
    }
  }

  static getNivelesPermitidos(): string[] {
    return [...NivelEducativo.NIVELES_PERMITIDOS];
  }

  esEducacionBasica(): boolean {
    return ['PRIMARIA', 'SECUNDARIA'].includes(this.valor);
  }

  esEducacionTecnica(): boolean {
    return ['TECNICO', 'TECNOLOGO'].includes(this.valor);
  }

  esEducacionSuperior(): boolean {
    return ['UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'].includes(this.valor);
  }

  esPosgrado(): boolean {
    return ['ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'].includes(this.valor);
  }

  getJerarquia(): number {
    const jerarquia = NivelEducativo.NIVELES_PERMITIDOS;
    return jerarquia.indexOf(this.valor);
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'PRIMARIA': 'Educación Primaria',
      'SECUNDARIA': 'Educación Secundaria',
      'TECNICO': 'Técnico',
      'TECNOLOGO': 'Tecnólogo',
      'UNIVERSITARIO': 'Universitario',
      'ESPECIALIZACION': 'Especialización',
      'MAESTRIA': 'Maestría',
      'DOCTORADO': 'Doctorado'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: NivelEducativo): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 