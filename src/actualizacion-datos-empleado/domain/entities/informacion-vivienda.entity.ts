import { Direccion } from '../value-objects/direccion.vo';
import { TipoVivienda } from '../value-objects/tipo-vivienda.vo';
import { TipoAdquisicion } from '../value-objects/tipo-adquisicion.vo';

export class InformacionVivienda {
  constructor(
    private readonly direccion: Direccion,
    private readonly tipoVivienda: TipoVivienda,
    private readonly tipoAdquisicion: TipoAdquisicion,
    private readonly valorVivienda?: number,
    private readonly fechaAdquisicion?: Date
  ) {
    this.validarDatos();
  }

  // Getters
  getDireccion(): Direccion {
    return this.direccion;
  }

  getTipoVivienda(): TipoVivienda {
    return this.tipoVivienda;
  }

  getTipoAdquisicion(): TipoAdquisicion {
    return this.tipoAdquisicion;
  }

  getValorVivienda(): number | undefined {
    return this.valorVivienda;
  }

  getFechaAdquisicion(): Date | undefined {
    return this.fechaAdquisicion;
  }

  // Métodos de negocio
  esViviendaPropia(): boolean {
    return this.tipoAdquisicion.valor === 'PROPIA';
  }

  esViviendaArrendada(): boolean {
    return this.tipoAdquisicion.valor === 'ARRENDADA';
  }

  tieneValorDefinido(): boolean {
    return this.valorVivienda !== undefined && this.valorVivienda > 0;
  }

  private validarDatos(): void {
    if (this.esViviendaPropia() && !this.tieneValorDefinido()) {
      throw new Error('Para vivienda propia es obligatorio especificar el valor');
    }

    if (this.valorVivienda !== undefined && this.valorVivienda <= 0) {
      throw new Error('El valor de la vivienda debe ser mayor a cero');
    }

    if (this.fechaAdquisicion && this.fechaAdquisicion > new Date()) {
      throw new Error('La fecha de adquisición no puede ser futura');
    }
  }
} 