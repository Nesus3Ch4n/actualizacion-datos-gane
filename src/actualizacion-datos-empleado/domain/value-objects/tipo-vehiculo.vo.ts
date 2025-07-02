export class TipoVehiculo {
  readonly valor: string;

  private static readonly TIPOS_PERMITIDOS = [
    'AUTOMOVIL',
    'MOTOCICLETA',
    'CAMIONETA',
    'CAMION',
    'BUS',
    'BICICLETA',
    'OTRO'
  ];

  constructor(valor: string) {
    this.validar(valor);
    this.valor = valor.toUpperCase();
  }

  private validar(valor: string): void {
    if (!valor || !valor.trim()) {
      throw new Error('El tipo de vehículo es obligatorio');
    }

    const valorNormalizado = valor.toUpperCase().trim();
    if (!TipoVehiculo.TIPOS_PERMITIDOS.includes(valorNormalizado)) {
      throw new Error(`Tipo de vehículo no válido. Tipos permitidos: ${TipoVehiculo.TIPOS_PERMITIDOS.join(', ')}`);
    }
  }

  static getTiposPermitidos(): string[] {
    return [...TipoVehiculo.TIPOS_PERMITIDOS];
  }

  esMotorizado(): boolean {
    return !['BICICLETA'].includes(this.valor);
  }

  esAutomovil(): boolean {
    return this.valor === 'AUTOMOVIL';
  }

  esMotocicleta(): boolean {
    return this.valor === 'MOTOCICLETA';
  }

  requiereLicencia(): boolean {
    return this.esMotorizado();
  }

  getDescripcion(): string {
    const descripciones: { [key: string]: string } = {
      'AUTOMOVIL': 'Automóvil',
      'MOTOCICLETA': 'Motocicleta',
      'CAMIONETA': 'Camioneta',
      'CAMION': 'Camión',
      'BUS': 'Bus',
      'BICICLETA': 'Bicicleta',
      'OTRO': 'Otro'
    };
    return descripciones[this.valor] || this.valor;
  }

  equals(otro: TipoVehiculo): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
} 