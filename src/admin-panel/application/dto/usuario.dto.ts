export interface UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  departamento: string;
  fechaIngreso: Date;
  estado: string;
  ultimaActualizacion: Date;
  tieneConflictoIntereses: boolean;
}

export interface UsuarioDetalleDto extends UsuarioDto {
  telefono: string;
  direccion: string;
  ciudad: string;
  nivelEducativo: string;
  institucion: string;
  titulo: string;
  personasACargo: PersonaCargoDto[];
  contactosEmergencia: ContactoEmergenciaDto[];
}

export interface PersonaCargoDto {
  id: number;
  nombre: string;
  apellido: string;
  parentesco: string;
  edad: number;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface ContactoEmergenciaDto {
  id: number;
  nombre: string;
  apellido: string;
  parentesco: string;
  telefono: string;
  email?: string;
}

export interface CrearUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  departamento: string;
  fechaIngreso: Date;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
}

export interface ActualizarUsuarioDto {
  cargo?: string;
  departamento?: string;
  estado?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  tieneConflictoIntereses?: boolean;
}

export interface UsuarioResumenDto {
  id: number;
  nombreCompleto: string;
  email: string;
  cargo: string;
  departamento: string;
  estado: string;
  tieneConflictoIntereses: boolean;
}

// DTOs para estadísticas y métricas
export interface EstadisticasUsuariosDto {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  usuariosSuspendidos: number;
  usuariosEnRevision: number;
  usuariosConConflicto: number;
  distribucionPorDepartamento: DepartamentoEstadisticaDto[];
  nuevosUsuariosUltimoMes: number;
  actualizacionesUltimoMes: number;
}

export interface DepartamentoEstadisticaDto {
  departamento: string;
  cantidad: number;
  porcentaje: number;
  activos: number;
  inactivos: number;
}

// DTOs para validación
export interface ValidacionUsuarioDto {
  email: {
    valido: boolean;
    mensaje?: string;
  };
  nombre: {
    valido: boolean;
    mensaje?: string;
  };
  apellido: {
    valido: boolean;
    mensaje?: string;
  };
  departamento: {
    valido: boolean;
    mensaje?: string;
  };
  cargo: {
    valido: boolean;
    mensaje?: string;
  };
}

// DTOs para búsqueda avanzada
export interface BusquedaAvanzadaDto {
  texto?: string;
  departamentos?: string[];
  estados?: string[];
  fechaIngresoDesde?: Date;
  fechaIngresoHasta?: Date;
  soloConConflicto?: boolean;
  soloActivos?: boolean;
  ordenarPor?: 'nombre' | 'apellido' | 'fechaIngreso' | 'ultimaActualizacion';
  ordenDescendente?: boolean;
  pagina?: number;
  elementosPorPagina?: number;
}

export interface ResultadoBusquedaDto {
  usuarios: UsuarioDto[];
  totalEncontrados: number;
  paginaActual: number;
  totalPaginas: number;
  filtrosAplicados: string[];
}

// DTOs para operaciones masivas
export interface OperacionMasivaDto {
  usuariosIds: number[];
  operacion: 'activar' | 'desactivar' | 'suspender' | 'eliminar' | 'exportar';
  parametrosAdicionales?: any;
}

export interface ResultadoOperacionMasivaDto {
  exitosos: number;
  fallidos: number;
  errores: string[];
  mensaje: string;
} 