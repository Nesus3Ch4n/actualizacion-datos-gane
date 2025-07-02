export class Parentesco {
  readonly valor: string;

  private static readonly VALORES_PERMITIDOS = [
    'PADRE',
    'MADRE',
    'HERMANO',
    'HERMANA',
    'HIJO',
    'HIJA',
    'ABUELO',
    'ABUELA',
    'TIO',
    'TIA',
    'SOBRINO',
    'SOBRINA',
    'PRIMO',
    'PRIMA',
    'ESPOSO',
    'ESPOSA',
    'AMIGO',
    'AMIGA',
    'CONOCIDO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El parentesco es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!Parentesco.VALORES_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Parentesco no válido. Valores permitidos: ${Parentesco.VALORES_PERMITIDOS.join(', ')}`);
    }
  }

  static getValoresPermitidos(): string[] {
    return [...Parentesco.VALORES_PERMITIDOS];
  }

  esFamiliar(): boolean {
    const familiares = ['PADRE', 'MADRE', 'HERMANO', 'HERMANA', 'HIJO', 'HIJA', 
                       'ABUELO', 'ABUELA', 'TIO', 'TIA', 'SOBRINO', 'SOBRINA', 
                       'PRIMO', 'PRIMA', 'ESPOSO', 'ESPOSA'];
    return familiares.includes(this.valor);
  }

  esParejaSentimental(): boolean {
    return ['ESPOSO', 'ESPOSA'].includes(this.valor);
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'PADRE': 'Padre',
      'MADRE': 'Madre',
      'HERMANO': 'Hermano',
      'HERMANA': 'Hermana',
      'HIJO': 'Hijo',
      'HIJA': 'Hija',
      'ABUELO': 'Abuelo',
      'ABUELA': 'Abuela',
      'TIO': 'Tío',
      'TIA': 'Tía',
      'SOBRINO': 'Sobrino',
      'SOBRINA': 'Sobrina',
      'PRIMO': 'Primo',
      'PRIMA': 'Prima',
      'ESPOSO': 'Esposo',
      'ESPOSA': 'Esposa',
      'AMIGO': 'Amigo',
      'AMIGA': 'Amiga',
      'CONOCIDO': 'Conocido'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: Parentesco): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 