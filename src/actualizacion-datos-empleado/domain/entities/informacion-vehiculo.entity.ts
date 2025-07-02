import { TipoVehiculo } from '../value-objects/tipo-vehiculo.vo';

export class InformacionVehiculo {
  constructor(
    private readonly tieneVehiculo: boolean,
    private readonly tipoVehiculo?: TipoVehiculo,
    private readonly marca?: string,
    private readonly placa?: string,
    private readonly año?: number,
    private readonly propietario?: string
  ) {
    this.validarDatos();
  }

  // Getters
  getTieneVehiculo(): boolean {
    return this.tieneVehiculo;
  }

  getTipoVehiculo(): TipoVehiculo | undefined {
    return this.tipoVehiculo;
  }

  getMarca(): string | undefined {
    return this.marca;
  }

  getPlaca(): string | undefined {
    return this.placa;
  }

  getAño(): number | undefined {
    return this.año;
  }

  getPropietario(): string | undefined {
    return this.propietario;
  }

  // Métodos de negocio
  esVehiculoPropio(): boolean {
    if (!this.tieneVehiculo || !this.propietario) {
      return false;
    }
    return this.propietario.toLowerCase().includes('propio') || 
           this.propietario.toLowerCase().includes('mismo');
  }

  getAntiguedad(): number | undefined {
    if (!this.año) return undefined;
    return new Date().getFullYear() - this.año;
  }

  esVehiculoNuevo(): boolean {
    const antiguedad = this.getAntiguedad();
    return antiguedad !== undefined && antiguedad <= 3;
  }

  private validarDatos(): void {
    if (this.tieneVehiculo) {
      if (!this.tipoVehiculo) {
        throw new Error('Si tiene vehículo, debe especificar el tipo');
      }

      if (!this.marca || !this.marca.trim()) {
        throw new Error('Si tiene vehículo, debe especificar la marca');
      }

      if (!this.placa || !this.placa.trim()) {
        throw new Error('Si tiene vehículo, debe especificar la placa');
      }

      if (!this.año) {
        throw new Error('Si tiene vehículo, debe especificar el año');
      }

      if (!this.propietario || !this.propietario.trim()) {
        throw new Error('Si tiene vehículo, debe especificar el propietario');
      }

      // Validar formato de placa colombiana
      const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
      if (!placaRegex.test(this.placa.toUpperCase())) {
        throw new Error('La placa debe tener el formato ABC123');
      }

      // Validar año
      const añoActual = new Date().getFullYear();
      if (this.año < 1960 || this.año > añoActual + 2) {
        throw new Error(`El año del vehículo debe estar entre 1960 y ${añoActual + 2}`);
      }

      if (this.marca.length > 50) {
        throw new Error('La marca no puede exceder 50 caracteres');
      }

      if (this.propietario.length > 100) {
        throw new Error('El propietario no puede exceder 100 caracteres');
      }
    }
  }
} 