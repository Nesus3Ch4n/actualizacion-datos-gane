import { Reporte } from '../entities/reporte.entity';
import { ReporteGeneradoDto, ReporteProgramadoDto, FiltrosReporteDto } from '../../application/dto/reporte.dto';

/**
 * Repositorio del dominio para la gestión de reportes
 * Define el contrato para el acceso a datos de reportes
 */
export abstract class ReporteRepository {
  
  // Operaciones básicas CRUD
  abstract obtenerTodos(): Promise<Reporte[]>;
  abstract obtenerPorId(id: number): Promise<Reporte | null>;
  abstract guardar(reporte: Reporte): Promise<Reporte>;
  abstract actualizar(reporte: Reporte): Promise<Reporte>;
  abstract eliminar(id: number): Promise<boolean>;

  // Operaciones de búsqueda
  abstract obtenerPorTipo(tipo: string): Promise<Reporte[]>;
  abstract obtenerPorUsuario(usuarioId: number): Promise<Reporte[]>;
  abstract obtenerPorFechas(fechaDesde: Date, fechaHasta: Date): Promise<Reporte[]>;
  abstract obtenerRecientes(limite: number): Promise<Reporte[]>;

  // Operaciones de reportes programados
  abstract obtenerReportesProgramados(): Promise<ReporteProgramadoDto[]>;
  abstract obtenerConfiguracionProgramada(id: number): Promise<ReporteProgramadoDto | null>;
  abstract guardarReporteProgramado(reporte: ReporteProgramadoDto): Promise<ReporteProgramadoDto>;
  abstract actualizarReporteProgramado(reporte: ReporteProgramadoDto): Promise<ReporteProgramadoDto>;
  abstract eliminarReporteProgramado(id: number): Promise<boolean>;
  abstract activarReporteProgramado(id: number): Promise<boolean>;
  abstract desactivarReporteProgramado(id: number): Promise<boolean>;

  // Operaciones de gestión de archivos
  abstract guardarArchivo(reporte: Reporte, contenido: Uint8Array, ruta: string): Promise<string>;
  abstract obtenerArchivo(ruta: string): Promise<Uint8Array | null>;
  abstract eliminarArchivo(ruta: string): Promise<boolean>;
  abstract obtenerUrlDescarga(ruta: string): Promise<string>;
  abstract limpiarArchivosExpirados(): Promise<number>;

  // Operaciones de control de ejecución
  abstract marcarComoIniciado(id: number): Promise<void>;
  abstract marcarComoCompletado(id: number, rutaArchivo: string): Promise<void>;
  abstract marcarComoError(id: number, error: string): Promise<void>;
  abstract cancelarGeneracion(id: number): Promise<boolean>;
  abstract actualizarProgreso(id: number, progreso: number): Promise<void>;

  // Operaciones de estadísticas y métricas
  abstract obtenerEstadisticas(): Promise<EstadisticasReportes>;
  abstract obtenerMetricasPorTipo(): Promise<MetricasPorTipo[]>;
  abstract obtenerTendenciaGeneracion(dias: number): Promise<TendenciaGeneracion[]>;
  abstract obtenerReportesMasGenerados(limite: number): Promise<ReporteMasGenerado[]>;

  // Operaciones de configuración
  abstract obtenerConfiguracionSistema(): Promise<ConfiguracionSistemaReportes>;
  abstract actualizarConfiguracionSistema(config: ConfiguracionSistemaReportes): Promise<void>;

  // Operaciones de auditoría
  abstract registrarAccesoReporte(reporteId: number, usuarioId: number): Promise<void>;
  abstract obtenerHistorialAccesos(reporteId: number): Promise<HistorialAcceso[]>;
  abstract obtenerLogGeneracion(reporteId: number): Promise<LogGeneracion[]>;

  // Operaciones de búsqueda avanzada
  abstract buscarReportes(criterios: CriteriosBusquedaReportes): Promise<ResultadoBusquedaReportes>;
  abstract obtenerReportesPorEstado(estado: string): Promise<Reporte[]>;
  abstract obtenerReportesEnProceso(): Promise<Reporte[]>;

  // Operaciones de limpieza y mantenimiento
  abstract limpiarReportesAntiguos(diasRetencion: number): Promise<number>;
  abstract compactarHistorial(): Promise<void>;
  abstract verificarIntegridadArchivos(): Promise<VerificacionIntegridad>;
}

// Interfaces de apoyo
export interface EstadisticasReportes {
  totalReportes: number;
  reportesHoy: number;
  reportesEsteMes: number;
  reportesEsteAnio: number;
  reportesEnProceso: number;
  reportesCompletados: number;
  reportesConError: number;
  espacioUtilizado: number; // en bytes
  tiempoPromedioGeneracion: number; // en segundos
  reportesMasGenerados: string[];
  horasPicoGeneracion: number[];
}

export interface MetricasPorTipo {
  tipo: string;
  cantidad: number;
  porcentaje: number;
  tiempoPromedioGeneracion: number;
  tamanioPromedioArchivo: number;
  ultimaGeneracion: Date;
  exitos: number;
  errores: number;
}

export interface TendenciaGeneracion {
  fecha: Date;
  cantidad: number;
  tiempoPromedio: number;
  espacioUtilizado: number;
}

export interface ReporteMasGenerado {
  tipo: string;
  nombre: string;
  cantidad: number;
  ultimaGeneracion: Date;
}

export interface ConfiguracionSistemaReportes {
  maxReportesConcurrentes: number;
  tiempoRetencionArchivos: number; // días
  tamanioMaximoArchivo: number; // MB
  formatosPermitidos: string[];
  directorioAlmacenamiento: string;
  habilitarCompresion: boolean;
  habilitarNotificaciones: boolean;
  habilitarCache: boolean;
  tiempoVidaCache: number; // segundos
  maxHistorialPorUsuario: number;
}

export interface HistorialAcceso {
  id: number;
  reporteId: number;
  usuarioId: number;
  fechaAcceso: Date;
  ipAddress: string;
  userAgent: string;
  accion: 'descarga' | 'visualizacion' | 'compartir';
}

export interface LogGeneracion {
  id: number;
  reporteId: number;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: 'iniciado' | 'procesando' | 'completado' | 'error' | 'cancelado';
  progreso: number;
  mensaje?: string;
  detallesError?: string;
  tiempoEjecucion?: number; // segundos
  memoria_utilizada?: number; // MB
}

export interface CriteriosBusquedaReportes {
  tipos?: string[];
  estados?: string[];
  fechaDesde?: Date;
  fechaHasta?: Date;
  usuarioId?: number;
  texto?: string; // búsqueda en nombre de archivo
  soloRecientes?: boolean;
  limite?: number;
  offset?: number;
  ordenarPor?: 'fecha' | 'tipo' | 'tamanio' | 'usuario';
  ordenDescendente?: boolean;
}

export interface ResultadoBusquedaReportes {
  reportes: Reporte[];
  totalEncontrados: number;
  tiempoRespuesta: number;
  filtrosAplicados: string[];
}

export interface VerificacionIntegridad {
  archivosVerificados: number;
  archivosCorruptos: number;
  archivosHuerfanos: number;
  espacioRecuperado: number; // bytes
  errores: string[];
}

// Configuración de programación de reportes
export interface ConfiguracionEjecucion {
  maxReintentos: number;
  tiempoEsperaReintentos: number; // segundos
  habilitarNotificacionesError: boolean;
  emailsNotificacion: string[];
  timeoutEjecucion: number; // segundos
}

// Excepciones específicas del repositorio
export class ReporteNoEncontradoError extends Error {
  constructor(id: number) {
    super(`Reporte con ID ${id} no encontrado`);
    this.name = 'ReporteNoEncontradoError';
  }
}

export class ReporteEnProcesoError extends Error {
  constructor(id: number) {
    super(`El reporte ${id} ya está siendo procesado`);
    this.name = 'ReporteEnProcesoError';
  }
}

export class ArchivoNoEncontradoError extends Error {
  constructor(ruta: string) {
    super(`Archivo no encontrado en la ruta: ${ruta}`);
    this.name = 'ArchivoNoEncontradoError';
  }
}

export class LimiteReportesExcedidoError extends Error {
  constructor(limite: number) {
    super(`Se ha excedido el límite máximo de ${limite} reportes concurrentes`);
    this.name = 'LimiteReportesExcedidoError';
  }
}

export class ReporteProgramadoInactivoError extends Error {
  constructor(id: number) {
    super(`El reporte programado ${id} está inactivo`);
    this.name = 'ReporteProgramadoInactivoError';
  }
} 