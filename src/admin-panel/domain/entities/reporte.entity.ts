import { BaseEntity } from '../../../shared-kernel/common/base.entity';
import { TipoReporte } from '../value-objects/tipo-reporte.vo';
import { Usuario } from './usuario.entity';

export class Reporte extends BaseEntity<number> {
  private _tipoReporte: TipoReporte;
  private _fechaGeneracion: Date;
  private _generadoPor: number;
  private _numeroRegistros: number;
  private _ubicacionArchivo: string;
  private _columnas: string[];
  private _datos: any[];
  private _formato: 'excel' | 'csv' | 'pdf';

  constructor(
    id: number,
    tipoReporte: string,
    generadoPor: number,
    numeroRegistros: number,
    columnas: string[],
    datos: any[],
    formato: 'excel' | 'csv' | 'pdf' = 'excel'
  ) {
    super(id);
    this._tipoReporte = new TipoReporte(tipoReporte);
    this._fechaGeneracion = new Date();
    this._generadoPor = generadoPor;
    this._numeroRegistros = numeroRegistros;
    this._columnas = columnas;
    this._datos = datos;
    this._formato = formato;
    this._ubicacionArchivo = this.generarRutaArchivo();
  }

  // Implementación requerida por BaseEntity
  validate(): string[] {
    const errores: string[] = [];
    
    if (!this._tipoReporte) {
      errores.push('El tipo de reporte es requerido');
    }
    
    if (this._numeroRegistros < 0) {
      errores.push('El número de registros no puede ser negativo');
    }
    
    if (!this._columnas || this._columnas.length === 0) {
      errores.push('Debe tener al menos una columna');
    }
    
    return errores;
  }

  // Getters
  get tipoReporte(): TipoReporte {
    return this._tipoReporte;
  }

  get tipoReporteValue(): string {
    return this._tipoReporte.value;
  }

  get fechaGeneracion(): Date {
    return this._fechaGeneracion;
  }

  get generadoPor(): number {
    return this._generadoPor;
  }

  get numeroRegistros(): number {
    return this._numeroRegistros;
  }

  get ubicacionArchivo(): string {
    return this._ubicacionArchivo;
  }

  get columnas(): string[] {
    return [...this._columnas]; // retorna copia para inmutabilidad
  }

  get datos(): any[] {
    return [...this._datos]; // retorna copia para inmutabilidad
  }

  get formato(): 'excel' | 'csv' | 'pdf' {
    return this._formato;
  }

  // Métodos de negocio
  private generarRutaArchivo(): string {
    const fecha = this._fechaGeneracion.toISOString().split('T')[0];
    const extension = this.obtenerExtensionArchivo();
    return `/reportes/${this._tipoReporte.value}/${fecha}_${this._tipoReporte.value}.${extension}`;
  }

  private obtenerExtensionArchivo(): string {
    switch (this._formato) {
      case 'excel':
        return 'xlsx';
      case 'csv':
        return 'csv';
      case 'pdf':
        return 'pdf';
      default:
        return 'xlsx';
    }
  }

  // Validaciones de negocio
  esReporteValido(): boolean {
    return this._datos.length > 0 && this._columnas.length > 0;
  }

  puedeSerDescargado(): boolean {
    const dosHoras = 2 * 60 * 60 * 1000; // milisegundos en 2 horas
    const ahora = new Date();
    return (ahora.getTime() - this._fechaGeneracion.getTime()) < dosHoras;
  }

  puedeSerRegenerado(): boolean {
    const veinticuatroHoras = 24 * 60 * 60 * 1000; // milisegundos en 24 horas
    const ahora = new Date();
    return (ahora.getTime() - this._fechaGeneracion.getTime()) < veinticuatroHoras;
  }

  // Método para convertir a JSON (útil para APIs)
  toJSON(): any {
    return {
      id: this.getId(),
      tipoReporte: this._tipoReporte.value,
      fechaGeneracion: this._fechaGeneracion,
      generadoPor: this._generadoPor,
      numeroRegistros: this._numeroRegistros,
      ubicacionArchivo: this._ubicacionArchivo,
      columnas: this._columnas,
      formato: this._formato
    };
  }

  // Factory method estático
  static crear(
    tipoReporte: string,
    usuarios: any[],
    filtros?: any
  ): Reporte {
    const id = Math.floor(Math.random() * 10000); // En producción sería generado por la BD
    const columnas = Reporte.obtenerColumnasParaTipo(tipoReporte);
    const datos = Reporte.procesarDatosParaTipo(tipoReporte, usuarios);
    
    return new Reporte(
      id,
      tipoReporte,
      0, // sistema
      datos.length,
      columnas,
      datos
    );
  }

  private static obtenerColumnasParaTipo(tipo: string): string[] {
    switch (tipo) {
      case 'integrantes':
        return ['Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Estado'];
      case 'conflicto-intereses':
        return ['Nombre', 'Apellido', 'Cargo', 'Conflicto', 'Fecha Declaración'];
      case 'estudios':
        return ['Nombre', 'Apellido', 'Nivel Educativo', 'Institución', 'Título'];
      case 'contacto':
        return ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección'];
      case 'personas-cargo':
        return ['Nombre', 'Apellido', 'Personas a Cargo', 'Relación', 'Edad'];
      default:
        return ['Nombre', 'Apellido', 'Email'];
    }
  }

  private static procesarDatosParaTipo(tipo: string, usuarios: any[]): any[] {
    // Simulación de procesamiento de datos
    return usuarios.map(usuario => ({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      cargo: usuario.cargo,
      departamento: usuario.departamento,
      estado: usuario.estado
    }));
  }

  // Factory method para crear desde datos planos
  static fromPlainObject(data: any): Reporte {
    const reporte = new Reporte(
      data.id,
      data.tipoReporte,
      data.generadoPor,
      data.numeroRegistros,
      data.columnas,
      data.datos || [],
      data.formato || 'excel'
    );

    // Si hay datos de fecha específicos, sobrescribir
    if (data.fechaGeneracion) {
      (reporte as any)._fechaGeneracion = new Date(data.fechaGeneracion);
    }

    return reporte;
  }
} 