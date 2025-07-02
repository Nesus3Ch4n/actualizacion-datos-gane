import { UsuarioDto } from './usuario.dto';

export interface ReporteDto {
  id: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  columnas: string[];
  estimacionTiempo: string;
  tamanioEstimado?: string;
}

export interface ConfiguracionReporteDto {
  tipo: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  columnas: string[];
  filtrosDisponibles: FiltroReporteDto[];
  formatosExportacion: string[];
  requiereAutorizacion: boolean;
}

export interface FiltroReporteDto {
  campo: string;
  etiqueta: string;
  tipo: 'texto' | 'select' | 'fecha' | 'boolean' | 'multiselect';
  opciones?: OpcionFiltroDto[];
  requerido: boolean;
}

export interface OpcionFiltroDto {
  valor: string;
  etiqueta: string;
}

export interface SolicitudReporteDto {
  tipo: string;
  usuarios?: UsuarioDto[];
  filtros: FiltrosReporteDto;
  formato: 'xlsx' | 'csv' | 'pdf';
  incluirGraficos?: boolean;
  solicitadoPor: number; // ID del usuario que solicita
}

export interface FiltrosReporteDto {
  texto?: string;
  departamentos?: string[];
  estados?: string[];
  fechaDesde?: Date;
  fechaHasta?: Date;
  soloConflictoIntereses?: boolean;
  soloPersonasACargo?: boolean;
  nivelesEducativos?: string[];
  [key: string]: any; // Para filtros dinámicos adicionales
}

export interface ReporteGeneradoDto {
  id: number;
  tipo: string;
  nombreArchivo: string;
  rutaArchivo: string;
  fechaGeneracion: Date;
  solicitadoPor: number;
  filtrosAplicados: FiltrosReporteDto;
  totalRegistros: number;
  tamanioArchivo: string;
  estado: 'generando' | 'completado' | 'error';
  progreso?: number; // 0-100
  mensajeError?: string;
  urlDescarga?: string;
  fechaExpiracion: Date;
}

export interface ResumenReporteDto {
  totalReportes: number;
  reportesHoy: number;
  reportesEsteMes: number;
  reportesPorTipo: TipoReporteResumenDto[];
  reportesRecientes: ReporteGeneradoDto[];
  espacioUtilizado: string;
  reportesMasGenerados: TipoReporteResumenDto[];
}

export interface TipoReporteResumenDto {
  tipo: string;
  nombre: string;
  cantidad: number;
  ultimaGeneracion?: Date;
  tamanioPromedio: string;
}

// DTOs para programación de reportes
export interface ReporteProgramadoDto {
  id: number;
  tipo: string;
  nombre: string;
  descripcion?: string;
  filtros: FiltrosReporteDto;
  frecuencia: 'diario' | 'semanal' | 'mensual' | 'trimestral';
  diaEjecucion?: number; // Para semanal/mensual
  horaEjecucion: string; // HH:mm
  activo: boolean;
  creadoPor: number;
  fechaCreacion: Date;
  ultimaEjecucion?: Date;
  proximaEjecucion: Date;
  destinatarios: DestinatarioReporteDto[];
}

export interface DestinatarioReporteDto {
  id: number;
  email: string;
  nombre: string;
  tipo: 'empleado' | 'externo';
  activo: boolean;
}

// DTOs para configuración de reportes
export interface ConfiguracionSistemaReportesDto {
  maxReportesConcurrentes: number;
  tiempoRetencionArchivos: number; // días
  tamanioMaximoArchivo: number; // MB
  formatosPermitidos: string[];
  emailNotificaciones: boolean;
  almacenamientoNube: boolean;
  compresionArchivos: boolean;
}

// DTOs para métricas y análisis
export interface MetricasReportesDto {
  reportesGeneradosHoy: number;
  reportesGeneradosEsteMes: number;
  tiempoPromedioGeneracion: string;
  reporteMasPopular: string;
  departamentoMasActivo: string;
  horariosMaximaActividad: string[];
  tendenciaGeneracion: TendenciaDto[];
}

export interface TendenciaDto {
  fecha: Date;
  cantidad: number;
  tipo?: string;
}

// DTOs para validación y errores
export interface ValidacionReporteDto {
  valido: boolean;
  errores: ErrorValidacionDto[];
  advertencias: AdvertenciaValidacionDto[];
}

export interface ErrorValidacionDto {
  campo: string;
  mensaje: string;
  codigo: string;
}

export interface AdvertenciaValidacionDto {
  mensaje: string;
  tipo: 'rendimiento' | 'datos' | 'seguridad';
}

// DTOs para exportación personalizada
export interface ExportacionPersonalizadaDto {
  columnas: ColumnaExportacionDto[];
  filtros: FiltrosReporteDto;
  formato: 'xlsx' | 'csv' | 'pdf';
  configuracion: ConfiguracionExportacionDto;
}

export interface ColumnaExportacionDto {
  campo: string;
  etiqueta: string;
  ancho?: number;
  alineacion?: 'izquierda' | 'centro' | 'derecha';
  formato?: 'texto' | 'numero' | 'fecha' | 'moneda' | 'porcentaje';
  incluir: boolean;
}

export interface ConfiguracionExportacionDto {
  incluirEncabezados: boolean;
  incluirPiePagina: boolean;
  incluirFechaGeneracion: boolean;
  incluirFiltrosAplicados: boolean;
  logoEmpresa: boolean;
  formatoFecha: string;
  separadorMiles: string;
  separadorDecimal: string;
} 