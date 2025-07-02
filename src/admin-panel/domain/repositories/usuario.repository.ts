import { Usuario } from '../entities/usuario.entity';
import { FiltroUsuariosDto, ResultadoFiltroDto } from '../../application/dto/filtro-usuarios.dto';

/**
 * Repositorio del dominio para la gestión de usuarios
 * Define el contrato para el acceso a datos de usuarios
 */
export abstract class UsuarioRepository {
  
  // Operaciones básicas CRUD
  abstract obtenerTodos(): Promise<Usuario[]>;
  abstract obtenerPorId(id: number): Promise<Usuario | null>;
  abstract obtenerPorEmail(email: string): Promise<Usuario | null>;
  abstract guardar(usuario: Usuario): Promise<Usuario>;
  abstract actualizar(usuario: Usuario): Promise<Usuario>;
  abstract eliminar(id: number): Promise<boolean>;

  // Operaciones de búsqueda y filtrado
  abstract obtenerConFiltros(filtros: FiltroUsuariosDto): Promise<ResultadoFiltroDto<Usuario>>;
  abstract buscarPorTexto(texto: string): Promise<Usuario[]>;
  abstract obtenerPorDepartamento(departamento: string): Promise<Usuario[]>;
  abstract obtenerPorEstado(estado: string): Promise<Usuario[]>;
  abstract obtenerConConflictoIntereses(): Promise<Usuario[]>;

  // Operaciones de metadatos
  abstract obtenerDepartamentosUnicos(): Promise<string[]>;
  abstract obtenerEstadosUnicos(): Promise<string[]>;
  abstract obtenerCargosUnicos(): Promise<string[]>;

  // Operaciones de validación
  abstract existeEmail(email: string): Promise<boolean>;
  abstract existeEmailExcluyendoId(email: string, id: number): Promise<boolean>;

  // Operaciones de estadísticas
  abstract contarPorEstado(estado: string): Promise<number>;
  abstract contarPorDepartamento(departamento: string): Promise<number>;
  abstract contarConConflictoIntereses(): Promise<number>;
  abstract obtenerEstadisticasGenerales(): Promise<EstadisticasUsuarios>;

  // Operaciones de auditoría
  abstract obtenerHistorialCambios(id: number): Promise<HistorialCambio[]>;
  abstract registrarCambio(cambio: RegistroCambio): Promise<void>;

  // Operaciones masivas
  abstract actualizarEstadoMasivo(ids: number[], nuevoEstado: string): Promise<ResultadoOperacionMasiva>;
  abstract eliminarMasivo(ids: number[]): Promise<ResultadoOperacionMasiva>;

  // Operaciones de búsqueda avanzada
  abstract busquedaAvanzada(criterios: CriteriosBusquedaAvanzada): Promise<ResultadoBusquedaAvanzada>;
  abstract obtenerSugerenciasAutocompletado(campo: string, texto: string): Promise<string[]>;
}

// Interfaces de apoyo
export interface EstadisticasUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  suspendidos: number;
  enRevision: number;
  conConflictoIntereses: number;
  distribuccionPorDepartamento: { [departamento: string]: number };
  distribuccionPorCargo: { [cargo: string]: number };
  promedioAntiguedad: number; // en meses
  usuariosNuevosUltimoMes: number;
  actualizacionesUltimoMes: number;
}

export interface HistorialCambio {
  id: number;
  usuarioId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  fechaCambio: Date;
  usuarioQueModifica: number;
  razonCambio?: string;
}

export interface RegistroCambio {
  usuarioId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  usuarioQueModifica: number;
  razonCambio?: string;
}

export interface ResultadoOperacionMasiva {
  exitosos: number;
  fallidos: number;
  errores: ErrorOperacion[];
  usuariosAfectados: number[];
}

export interface ErrorOperacion {
  usuarioId: number;
  mensaje: string;
  codigo: string;
}

export interface CriteriosBusquedaAvanzada {
  texto?: string;
  campos?: string[]; // ['nombre', 'email', 'cargo', etc.]
  departamentos?: string[];
  estados?: string[];
  cargos?: string[];
  fechaIngresoDesde?: Date;
  fechaIngresoHasta?: Date;
  ultimaActualizacionDesde?: Date;
  ultimaActualizacionHasta?: Date;
  soloConConflictoIntereses?: boolean;
  soloActivos?: boolean;
  ordenarPor?: string;
  ordenDescendente?: boolean;
  limite?: number;
  offset?: number;
}

export interface ResultadoBusquedaAvanzada {
  usuarios: Usuario[];
  totalEncontrados: number;
  tiempoRespuesta: number; // en ms
  sugerencias?: string[];
  filtrosAplicados: string[];
}

// Configuración del repositorio
export interface ConfiguracionRepositorio {
  timeoutConsulta: number; // en ms
  maxResultadosPorPagina: number;
  habilitarCache: boolean;
  tiempoVidaCache: number; // en segundos
  habilitarAuditoria: boolean;
  nivelLog: 'debug' | 'info' | 'warn' | 'error';
}

// Excepciones específicas del repositorio
export class UsuarioNoEncontradoError extends Error {
  constructor(id: number) {
    super(`Usuario con ID ${id} no encontrado`);
    this.name = 'UsuarioNoEncontradoError';
  }
}

export class EmailDuplicadoError extends Error {
  constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}`);
    this.name = 'EmailDuplicadoError';
  }
}

export class OperacionMasivaError extends Error {
  constructor(message: string, public resultadoParcial: ResultadoOperacionMasiva) {
    super(message);
    this.name = 'OperacionMasivaError';
  }
}

export class LimiteConsultaExcedidoError extends Error {
  constructor(limite: number) {
    super(`La consulta excede el límite máximo de ${limite} registros`);
    this.name = 'LimiteConsultaExcedidoError';
  }
} 