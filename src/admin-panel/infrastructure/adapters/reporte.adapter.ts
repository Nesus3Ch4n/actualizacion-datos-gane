import { Injectable } from '@angular/core';

// Domain imports
import { Reporte } from '../../domain/entities/reporte.entity';

// Application imports
import { 
  ReporteDto, 
  ReporteGeneradoDto, 
  ConfiguracionReporteDto,
  ResumenReporteDto,
  SolicitudReporteDto 
} from '../../application/dto/reporte.dto';

/**
 * Adaptador para convertir entre entidades de dominio Reporte y DTOs
 * Implementa el patrón Adapter para la capa de infraestructura
 */
@Injectable({
  providedIn: 'root'
})
export class ReporteAdapter {

  /**
   * Convierte una entidad Reporte del dominio a ReporteDto básico
   */
  toDto(reporte: Reporte): ReporteDto {
    return {
      id: reporte.getId(),
      tipo: reporte.tipoReporteValue,
      nombre: reporte.tipoReporte.obtenerNombre(),
      descripcion: reporte.tipoReporte.obtenerDescripcion(),
      icono: reporte.tipoReporte.obtenerIcono(),
      color: reporte.tipoReporte.obtenerColor(),
      columnas: reporte.columnas,
      estimacionTiempo: reporte.tipoReporte.obtenerEstimacionTiempo(),
      tamanioEstimado: this.formatearTamanio(reporte.numeroRegistros * 150)
    };
  }

  /**
   * Convierte una entidad Reporte del dominio a ReporteGeneradoDto
   */
  toGeneradoDto(reporte: Reporte): ReporteGeneradoDto {
    return {
      id: reporte.getId(),
      tipo: reporte.tipoReporteValue,
      nombreArchivo: this.generarNombreArchivo(reporte, 'xlsx'),
      rutaArchivo: reporte.ubicacionArchivo,
      fechaGeneracion: reporte.fechaGeneracion,
      solicitadoPor: reporte.generadoPor,
      filtrosAplicados: {},
      totalRegistros: reporte.numeroRegistros,
      tamanioArchivo: this.formatearTamanio(reporte.numeroRegistros * 150),
      estado: 'completado',
      progreso: 100,
      urlDescarga: '',
      fechaExpiracion: this.calcularFechaExpiracion(reporte.fechaGeneracion)
    };
  }

  /**
   * Convierte configuración estática a ConfiguracionReporteDto
   */
  toConfiguracionDto(tipo: string): ConfiguracionReporteDto {
    const configuraciones = this.obtenerConfiguracionesEstaticas();
    const config = configuraciones.find(c => c.tipo === tipo);
    
    if (!config) {
      throw new Error(`Configuración no encontrada para el tipo de reporte: ${tipo}`);
    }

    return config;
  }

  /**
   * Convierte múltiples tipos a array de ConfiguracionReporteDto
   */
  toConfiguracionDtoArray(tipos: string[]): ConfiguracionReporteDto[] {
    return tipos.map(tipo => this.toConfiguracionDto(tipo));
  }

  /**
   * Convierte datos de estadísticas a ResumenReporteDto
   */
  toResumenDto(datos: DatosResumenReporte): ResumenReporteDto {
    return {
      totalReportes: datos.totalReportes,
      reportesHoy: datos.reportesHoy,
      reportesEsteMes: datos.reportesEsteMes,
      reportesPorTipo: datos.reportesPorTipo.map(tipo => ({
        tipo: tipo.tipo,
        nombre: tipo.nombre,
        cantidad: tipo.cantidad,
        ultimaGeneracion: tipo.ultimaGeneracion,
        tamanioPromedio: this.formatearTamanio(tipo.tamanioPromedio)
      })),
      reportesRecientes: datos.reportesRecientes.map(reporte => this.toGeneradoDto(reporte)),
      espacioUtilizado: this.formatearTamanio(datos.espacioUtilizado),
      reportesMasGenerados: datos.reportesMasGenerados.map(tipo => ({
        tipo: tipo.tipo,
        nombre: tipo.nombre,
        cantidad: tipo.cantidad,
        ultimaGeneracion: tipo.ultimaGeneracion,
        tamanioPromedio: this.formatearTamanio(tipo.tamanioPromedio)
      }))
    };
  }

  /**
   * Convierte datos planos a entidad Reporte del dominio
   */
  fromPlainObject(data: any): Reporte {
    return Reporte.crear(
      data.tipo,
      data.usuarios || [],
      data.filtrosAplicados || {}
    );
  }

  /**
   * Convierte una entidad Reporte a objeto plano para APIs
   */
  toPlainObject(reporte: Reporte): any {
    return reporte.toJSON();
  }

  /**
   * Valida si una solicitud de reporte tiene la estructura correcta
   */
  validarSolicitudReporte(solicitud: SolicitudReporteDto): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!solicitud.tipo || solicitud.tipo.trim().length === 0) {
      errores.push('El tipo de reporte es requerido');
    }

    if (!solicitud.formato) {
      errores.push('El formato de reporte es requerido');
    } else if (!['xlsx', 'csv', 'pdf'].includes(solicitud.formato)) {
      errores.push('El formato de reporte debe ser xlsx, csv o pdf');
    }

    if (!solicitud.filtros) {
      errores.push('Los filtros son requeridos');
    }

    if (solicitud.usuarios && solicitud.usuarios.length > 10000) {
      errores.push('El reporte excede el límite máximo de 10,000 usuarios');
    }

    // Validaciones específicas por tipo
    if (solicitud.tipo === 'conflicto-intereses' && solicitud.usuarios) {
      const usuariosConConflicto = solicitud.usuarios.filter(u => u.tieneConflictoIntereses);
      if (usuariosConConflicto.length === 0) {
        errores.push('No hay usuarios con conflicto de intereses para generar este reporte');
      }
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Mapea errores de dominio a mensajes amigables
   */
  mapearErroresDominio(error: Error): string {
    const erroresDominio = {
      'Tipo de reporte inválido': 'El tipo de reporte seleccionado no es válido',
      'Datos insuficientes para el reporte': 'No hay suficientes datos para generar el reporte',
      'Reporte no puede ser regenerado': 'Este reporte no puede ser regenerado (más de 24 horas)'
    };

    return erroresDominio[error.message as keyof typeof erroresDominio] || error.message;
  }

  /**
   * Convierte estado interno a estado amigable para la UI
   */
  mapearEstadoReporte(estado: string): string {
    const estados = {
      'generando': 'Generando...',
      'procesando': 'Procesando datos...',
      'completado': 'Completado',
      'error': 'Error en la generación',
      'cancelado': 'Cancelado por el usuario'
    };

    return estados[estado as keyof typeof estados] || estado;
  }

  /**
   * Genera un nombre de archivo único para el reporte
   */
  generarNombreArchivo(reporte: Reporte, formato: string): string {
    const fecha = reporte.fechaGeneracion.toISOString().split('T')[0];
    const hora = reporte.fechaGeneracion.toTimeString().split(' ')[0].replace(/:/g, '-');
    const timestamp = Date.now();
    
    return `${reporte.tipoReporte.obtenerNombreArchivo()}_${fecha}_${hora}_${timestamp}.${formato}`;
  }

  /**
   * Estima el tiempo de generación basado en el tipo y cantidad de datos
   */
  estimarTiempoGeneracion(tipo: string, cantidadUsuarios: number): string {
    const tiempoBase = {
      'integrantes': 0.1, // segundos por usuario
      'conflicto-intereses': 0.05,
      'estudios': 0.15,
      'contacto': 0.1,
      'personas-cargo': 0.08,
      'completo': 0.2
    };

    const tiempo = (tiempoBase[tipo as keyof typeof tiempoBase] || 0.1) * cantidadUsuarios;
    
    if (tiempo < 60) {
      return `${Math.ceil(tiempo)} segundos`;
    } else if (tiempo < 3600) {
      return `${Math.ceil(tiempo / 60)} minutos`;
    } else {
      return `${Math.ceil(tiempo / 3600)} horas`;
    }
  }

  // Métodos privados
  private calcularFechaExpiracion(fechaGeneracion: Date): Date {
    const expiracion = new Date(fechaGeneracion);
    expiracion.setDate(expiracion.getDate() + 30); // 30 días de retención
    return expiracion;
  }

  private formatearTamanio(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private obtenerConfiguracionesEstaticas(): ConfiguracionReporteDto[] {
    return [
      {
        tipo: 'integrantes',
        nombre: 'Reporte de Integrantes',
        descripcion: 'Listado completo de todos los empleados con información básica',
        icono: 'group',
        color: 'primary',
        columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado'],
        filtrosDisponibles: [
          {
            campo: 'departamento',
            etiqueta: 'Departamento',
            tipo: 'multiselect',
            opciones: [
              { valor: 'Recursos Humanos', etiqueta: 'Recursos Humanos' },
              { valor: 'Tecnología', etiqueta: 'Tecnología' },
              { valor: 'Finanzas', etiqueta: 'Finanzas' }
            ],
            requerido: false
          },
          {
            campo: 'estado',
            etiqueta: 'Estado',
            tipo: 'multiselect',
            opciones: [
              { valor: 'activo', etiqueta: 'Activo' },
              { valor: 'inactivo', etiqueta: 'Inactivo' }
            ],
            requerido: false
          }
        ],
        formatosExportacion: ['xlsx', 'csv', 'pdf'],
        requiereAutorizacion: false
      },
      {
        tipo: 'conflicto-intereses',
        nombre: 'Reporte Conflicto de Intereses',
        descripcion: 'Empleados con declaraciones de conflicto de intereses',
        icono: 'warning',
        color: 'warn',
        columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Conflicto de Intereses'],
        filtrosDisponibles: [
          {
            campo: 'soloConConflicto',
            etiqueta: 'Solo con conflicto',
            tipo: 'boolean',
            requerido: true
          }
        ],
        formatosExportacion: ['xlsx', 'csv'],
        requiereAutorizacion: true
      },
      {
        tipo: 'estudios',
        nombre: 'Reporte de Estudios',
        descripcion: 'Información académica y formación de los empleados',
        icono: 'school',
        color: 'accent',
        columnas: ['ID', 'Nombre', 'Apellido', 'Nivel Educativo', 'Institución', 'Título'],
        filtrosDisponibles: [
          {
            campo: 'nivelEducativo',
            etiqueta: 'Nivel Educativo',
            tipo: 'multiselect',
            opciones: [
              { valor: 'Técnico', etiqueta: 'Técnico' },
              { valor: 'Profesional', etiqueta: 'Profesional' },
              { valor: 'Maestría', etiqueta: 'Maestría' }
            ],
            requerido: false
          }
        ],
        formatosExportacion: ['xlsx', 'csv', 'pdf'],
        requiereAutorizacion: false
      },
      {
        tipo: 'contacto',
        nombre: 'Reporte Personas de Contacto',
        descripcion: 'Información de contacto y personas de emergencia',
        icono: 'contact_phone',
        color: 'primary',
        columnas: ['ID', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'Contacto Emergencia'],
        filtrosDisponibles: [],
        formatosExportacion: ['xlsx', 'csv'],
        requiereAutorizacion: true
      },
      {
        tipo: 'personas-cargo',
        nombre: 'Reporte Personas a Cargo',
        descripcion: 'Empleados con personas dependientes a su cargo',
        icono: 'family_restroom',
        color: 'accent',
        columnas: ['ID', 'Nombre', 'Apellido', 'Personas a Cargo', 'Parentesco'],
        filtrosDisponibles: [
          {
            campo: 'soloConPersonasACargo',
            etiqueta: 'Solo con personas a cargo',
            tipo: 'boolean',
            requerido: false
          }
        ],
        formatosExportacion: ['xlsx', 'csv'],
        requiereAutorizacion: false
      }
    ];
  }
}

// Interfaces de apoyo
interface DatosResumenReporte {
  totalReportes: number;
  reportesHoy: number;
  reportesEsteMes: number;
  reportesPorTipo: {
    tipo: string;
    nombre: string;
    cantidad: number;
    ultimaGeneracion?: Date;
    tamanioPromedio: number;
  }[];
  reportesRecientes: Reporte[];
  espacioUtilizado: number;
  reportesMasGenerados: {
    tipo: string;
    nombre: string;
    cantidad: number;
    ultimaGeneracion?: Date;
    tamanioPromedio: number;
  }[];
} 