export interface FiltroUsuariosDto {
  texto?: string;
  estado?: string;
  departamento?: string;
  fechaIngresoDesde?: Date;
  fechaIngresoHasta?: Date;
  ultimaActualizacionDesde?: Date;
  ultimaActualizacionHasta?: Date;
  soloConConflictoIntereses?: boolean;
  soloActivos?: boolean;
  soloInactivos?: boolean;
  excluirSuspendidos?: boolean;
}

export interface FiltroAvanzadoDto extends FiltroUsuariosDto {
  cargos?: string[];
  departamentos?: string[];
  estados?: string[];
  busquedaEnCampos?: CampoBusquedaDto[];
  ordenamiento?: OrdenamientoDto;
  paginacion?: PaginacionDto;
}

export interface CampoBusquedaDto {
  campo: 'nombre' | 'apellido' | 'email' | 'cargo' | 'departamento' | 'todos';
  valor: string;
  operador: 'contiene' | 'empiezaCon' | 'terminaCon' | 'igual' | 'diferente';
}

export interface OrdenamientoDto {
  campo: 'id' | 'nombre' | 'apellido' | 'email' | 'cargo' | 'departamento' | 'fechaIngreso' | 'ultimaActualizacion' | 'estado';
  direccion: 'asc' | 'desc';
}

export interface PaginacionDto {
  pagina: number;
  elementosPorPagina: number;
  offset?: number;
}

export interface ResultadoFiltroDto<T> {
  elementos: T[];
  totalElementos: number;
  paginaActual: number;
  totalPaginas: number;
  elementosPorPagina: number;
  hayPaginaAnterior: boolean;
  hayPaginaSiguiente: boolean;
  filtrosAplicados: FiltroAplicadoDto[];
}

export interface FiltroAplicadoDto {
  campo: string;
  etiqueta: string;
  valor: any;
  operador?: string;
}

// DTOs para configuración de filtros
export interface ConfiguracionFiltrosDto {
  filtrosDisponibles: DefinicionFiltroDto[];
  ordenamientosDisponibles: OrdenamientoDisponibleDto[];
  valoresPorDefecto: FiltroUsuariosDto;
  opcionesPaginacion: number[];
}

export interface DefinicionFiltroDto {
  campo: string;
  etiqueta: string;
  tipo: 'texto' | 'select' | 'multiselect' | 'fecha' | 'rango-fecha' | 'boolean';
  opciones?: OpcionFiltroDto[];
  placeholder?: string;
  requerido?: boolean;
  validacion?: ValidacionFiltroDto;
}

export interface OpcionFiltroDto {
  valor: string;
  etiqueta: string;
  descripcion?: string;
  activo?: boolean;
}

export interface ValidacionFiltroDto {
  minimo?: number;
  maximo?: number;
  patron?: string;
  requerido?: boolean;
  mensaje?: string;
}

export interface OrdenamientoDisponibleDto {
  campo: string;
  etiqueta: string;
  permitidoAsc: boolean;
  permitidoDesc: boolean;
  porDefecto?: boolean;
}

// DTOs para filtros guardados
export interface FiltroGuardadoDto {
  id: number;
  nombre: string;
  descripcion?: string;
  filtros: FiltroAvanzadoDto;
  creadoPor: number;
  fechaCreacion: Date;
  ultimoUso?: Date;
  vecesUtilizado: number;
  esPublico: boolean;
  esFavorito: boolean;
}

export interface CrearFiltroGuardadoDto {
  nombre: string;
  descripcion?: string;
  filtros: FiltroAvanzadoDto;
  esPublico?: boolean;
}

export interface ActualizarFiltroGuardadoDto {
  nombre?: string;
  descripcion?: string;
  filtros?: FiltroAvanzadoDto;
  esPublico?: boolean;
}

// DTOs para estadísticas de filtros
export interface EstadisticasFiltrosDto {
  filtrosMasUtilizados: FiltroEstadisticaDto[];
  camposMasFiltrados: CampoEstadisticaDto[];
  usuariosActivosFiltros: number;
  filtrosGuardadosTotal: number;
  filtrosPublicosTotal: number;
}

export interface FiltroEstadisticaDto {
  id: number;
  nombre: string;
  vecesUtilizado: number;
  ultimoUso: Date;
  creadoPor: string;
}

export interface CampoEstadisticaDto {
  campo: string;
  etiqueta: string;
  vecesUtilizado: number;
  porcentajeUso: number;
}

// DTOs para validación de filtros
export interface ValidacionFiltrosDto {
  valido: boolean;
  errores: ErrorFiltroDto[];
  advertencias: AdvertenciaFiltroDto[];
}

export interface ErrorFiltroDto {
  campo: string;
  mensaje: string;
  codigo: string;
  valor?: any;
}

export interface AdvertenciaFiltroDto {
  campo: string;
  mensaje: string;
  tipo: 'rendimiento' | 'datos' | 'usabilidad';
}

// DTOs para sugerencias de filtros
export interface SugerenciaFiltroDto {
  tipo: 'autocompletar' | 'relacionado' | 'popular';
  campo: string;
  valores: string[];
  descripcion?: string;
}

export interface ConfiguracionSugerenciasDto {
  habilitadas: boolean;
  maxSugerencias: number;
  incluirHistorial: boolean;
  incluirPopulares: boolean;
  incluirRelacionados: boolean;
} 