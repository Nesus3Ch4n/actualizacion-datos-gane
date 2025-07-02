import { Injectable } from '@angular/core';

// Domain imports
import { Reporte } from '../../domain/entities/reporte.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { TipoReporte } from '../../domain/value-objects/tipo-reporte.vo';
import { ReporteRepository } from '../../domain/repositories/reporte.repository';

// Application imports
import { SolicitudReporteDto, ReporteGeneradoDto, FiltrosReporteDto } from '../dto/reporte.dto';
import { UsuarioDto } from '../dto/usuario.dto';

// Infrastructure imports
import { ReporteAdapter } from '../../infrastructure/adapters/reporte.adapter';
import { ExcelGeneratorService } from '../../infrastructure/services/excel-generator.service';

@Injectable({
  providedIn: 'root'
})
export class GenerarReporteUseCase {
  constructor(
    private reporteRepository: ReporteRepository,
    private reporteAdapter: ReporteAdapter,
    private excelGenerator: ExcelGeneratorService
  ) {}

  /**
   * Ejecuta la generación de un reporte
   */
  async execute(solicitud: SolicitudGenerarReporteDto): Promise<ReporteGeneradoDto> {
    try {
      // Validar la solicitud
      this.validarSolicitud(solicitud);

      // Convertir usuarios DTO a entidades de dominio
      const usuarios = solicitud.usuarios.map(dto => this.convertirDtoAUsuario(dto));

      // Crear la entidad Reporte
      const reporte = Reporte.crear(
        solicitud.tipo.value,
        usuarios,
        solicitud.filtros
      );

      // Validar que el tipo de reporte es válido
      if (!TipoReporte.obtenerTiposValidos().includes(solicitud.tipo.value)) {
        throw new Error(`Tipo de reporte inválido: ${solicitud.tipo.value}`);
      }

      // Generar el archivo de reporte
      const archivoGenerado = await this.generarArchivo(reporte, solicitud.formato || 'xlsx');

      // Guardar el reporte en el repositorio
      const reporteGuardado = await this.reporteRepository.guardar(reporte);

      // Convertir a DTO de respuesta
      const reporteDto = this.reporteAdapter.toGeneradoDto(reporteGuardado);
      reporteDto.urlDescarga = archivoGenerado.url;
      reporteDto.rutaArchivo = archivoGenerado.ruta;
      reporteDto.tamanioArchivo = archivoGenerado.tamanio;
      reporteDto.estado = 'completado';

      return reporteDto;

    } catch (error: any) {
      console.error('Error generando reporte:', error);
      throw new Error(`No se pudo generar el reporte: ${error.message}`);
    }
  }

  /**
   * Genera múltiples reportes de forma asíncrona
   */
  async generarMultiplesReportes(solicitudes: SolicitudGenerarReporteDto[]): Promise<ReporteGeneradoDto[]> {
    try {
      const promesas = solicitudes.map(solicitud => this.execute(solicitud));
      return await Promise.all(promesas);
    } catch (error) {
      console.error('Error generando múltiples reportes:', error);
      throw new Error('No se pudieron generar todos los reportes solicitados');
    }
  }

  /**
   * Genera un reporte programado
   */
  async ejecutarReporteProgramado(idReporteProgramado: number): Promise<ReporteGeneradoDto> {
    try {
      const configuracion = await this.reporteRepository.obtenerConfiguracionProgramada(idReporteProgramado);
      
      if (!configuracion) {
        throw new Error(`Reporte programado ${idReporteProgramado} no encontrado`);
      }

      if (!configuracion.activo) {
        throw new Error(`Reporte programado ${idReporteProgramado} está inactivo`);
      }

      // Crear solicitud basada en la configuración
      const solicitud: SolicitudGenerarReporteDto = {
        tipo: new TipoReporte(configuracion.tipo),
        usuarios: [], // Se obtendrán a continuación
        filtros: configuracion.filtros,
        formato: 'xlsx',
        solicitadoPor: 0, // Sistema
        programado: true,
        idReporteProgramado: idReporteProgramado
      };

      // Obtener usuarios según los filtros configurados
      solicitud.usuarios = await this.obtenerUsuariosParaReporte(configuracion.filtros);

      const reporte = await this.execute(solicitud);

      // Enviar notificaciones a destinatarios
      await this.enviarNotificacionesReporte(reporte, configuracion.destinatarios);

      return reporte;

    } catch (error: any) {
      console.error(`Error ejecutando reporte programado ${idReporteProgramado}:`, error);
      throw new Error(`No se pudo ejecutar el reporte programado: ${error.message}`);
    }
  }

  /**
   * Obtiene el progreso de generación de un reporte
   */
  async obtenerProgresoReporte(idReporte: number): Promise<{ progreso: number; estado: string; mensaje?: string }> {
    try {
      const reporte = await this.reporteRepository.obtenerPorId(idReporte);
      
      if (!reporte) {
        throw new Error(`Reporte ${idReporte} no encontrado`);
      }

      // En una implementación real, esto vendría del sistema de procesamiento
      return {
        progreso: 100, // Simulación
        estado: 'completado',
        mensaje: 'Reporte generado exitosamente'
      };

    } catch (error) {
      console.error(`Error obteniendo progreso del reporte ${idReporte}:`, error);
      return {
        progreso: 0,
        estado: 'error',
        mensaje: (error as any).message
      };
    }
  }

  /**
   * Cancela la generación de un reporte en curso
   */
  async cancelarReporte(idReporte: number): Promise<boolean> {
    try {
      const resultado = await this.reporteRepository.cancelarGeneracion(idReporte);
      return resultado;
    } catch (error) {
      console.error(`Error cancelando reporte ${idReporte}:`, error);
      return false;
    }
  }

  /**
   * Regenera un reporte existente
   */
  async regenerarReporte(idReporte: number): Promise<ReporteGeneradoDto> {
    try {
      const reporteOriginal = await this.reporteRepository.obtenerPorId(idReporte);
      
      if (!reporteOriginal) {
        throw new Error(`Reporte ${idReporte} no encontrado`);
      }

      if (!reporteOriginal.puedeSerRegenerado()) {
        throw new Error('El reporte no puede ser regenerado (más de 24 horas desde su creación)');
      }

      // Crear nueva solicitud basada en el reporte original
      const solicitud: SolicitudGenerarReporteDto = {
        tipo: new TipoReporte(reporteOriginal.tipoReporteValue),
        usuarios: [], // Se obtendrán nuevamente
        filtros: {}, // Usar filtros vacíos ya que no están almacenados en el reporte
        formato: 'xlsx',
        solicitadoPor: 0 // Usuario del sistema o se debería pasar como parámetro
      };

      // Obtener usuarios actualizados
      solicitud.usuarios = await this.obtenerUsuariosParaReporte(solicitud.filtros);

      return await this.execute(solicitud);

    } catch (error: any) {
      console.error(`Error regenerando reporte ${idReporte}:`, error);
      throw new Error(`No se pudo regenerar el reporte: ${error.message}`);
    }
  }

  // Métodos privados
  private validarSolicitud(solicitud: SolicitudGenerarReporteDto): void {
    if (!solicitud.tipo) {
      throw new Error('El tipo de reporte es requerido');
    }

    if (!solicitud.usuarios || solicitud.usuarios.length === 0) {
      throw new Error('Debe incluir al menos un usuario en el reporte');
    }

    if (solicitud.usuarios.length > 10000) {
      throw new Error('El reporte excede el límite máximo de 10,000 usuarios');
    }

    // Validaciones específicas por tipo de reporte
    if (solicitud.tipo.value === 'conflicto-intereses') {
      const usuariosConConflicto = solicitud.usuarios.filter(u => u.tieneConflictoIntereses);
      if (usuariosConConflicto.length === 0) {
        throw new Error('No hay usuarios con conflicto de intereses para generar este reporte');
      }
    }
  }

  private convertirDtoAUsuario(dto: UsuarioDto): Usuario {
    return Usuario.fromPlainObject({
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      cargo: dto.cargo,
      departamento: dto.departamento,
      fechaIngreso: dto.fechaIngreso,
      estado: dto.estado,
      ultimaActualizacion: dto.ultimaActualizacion,
      tieneConflictoIntereses: dto.tieneConflictoIntereses
    });
  }

  private async generarArchivo(reporte: Reporte, formato: string): Promise<ArchivoGenerado> {
    switch (formato.toLowerCase()) {
      case 'xlsx':
        return await this.excelGenerator.generarExcel(reporte);
      case 'csv':
        return await this.excelGenerator.generarCSV(reporte);
      case 'pdf':
        return await this.excelGenerator.generarPDF(reporte);
      default:
        throw new Error(`Formato de archivo no soportado: ${formato}`);
    }
  }

  private async obtenerUsuariosParaReporte(filtros: FiltrosReporteDto): Promise<UsuarioDto[]> {
    // En una implementación real, esto usaría el ObtenerUsuariosUseCase
    // Por ahora simularemos con datos de prueba
    return [
      {
        id: 1,
        nombre: 'María',
        apellido: 'García',
        email: 'maria.garcia@empresa.com',
        cargo: 'Analista Senior',
        departamento: 'Recursos Humanos',
        fechaIngreso: new Date('2023-01-15'),
        estado: 'activo',
        ultimaActualizacion: new Date('2024-11-20'),
        tieneConflictoIntereses: false
      }
      // ... más usuarios de prueba
    ];
  }

  private async enviarNotificacionesReporte(reporte: ReporteGeneradoDto, destinatarios: any[]): Promise<void> {
    try {
      // En una implementación real, esto enviaría emails
      console.log(`Enviando notificaciones del reporte ${reporte.nombreArchivo} a ${destinatarios.length} destinatarios`);
      
      for (const destinatario of destinatarios) {
        console.log(`- Notificación enviada a: ${destinatario.email}`);
      }
    } catch (error) {
      console.error('Error enviando notificaciones:', error);
      // No fallar el reporte por errores de notificación
    }
  }
}

// Interfaces de apoyo
interface SolicitudGenerarReporteDto {
  tipo: TipoReporte;
  usuarios: UsuarioDto[];
  filtros: FiltrosReporteDto;
  formato?: 'xlsx' | 'csv' | 'pdf';
  incluirGraficos?: boolean;
  solicitadoPor: number;
  programado?: boolean;
  idReporteProgramado?: number;
}

interface ArchivoGenerado {
  url: string;
  ruta: string;
  tamanio: string;
  nombreArchivo: string;
} 