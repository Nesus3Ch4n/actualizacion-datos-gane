import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuditoriaDTO {
  id: number;
  tablaModificada: string;
  idRegistroModificado: number;
  campoModificado: string;
  valorAnterior: string;
  valorNuevo: string;
  tipoPeticion: string;
  usuarioModificador: string;
  fechaModificacion: string;
  idUsuario: number;
  descripcion: string;
  ipAddress: string;
  userAgent: string;
}

export interface FiltroAuditoria {
  idUsuario?: number;
  tablaModificada?: string;
  tipoPeticion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private baseUrl = environment.apiUrl + '/auditoria';

  constructor(private http: HttpClient) { }

  // Obtener todas las auditorías
  obtenerTodasAuditorias(): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(this.baseUrl);
  }

  // Obtener auditorías por ID de usuario
  obtenerAuditoriasPorUsuario(idUsuario: number): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/usuario/${idUsuario}`);
  }

  // Obtener auditorías por tabla
  obtenerAuditoriasPorTabla(tablaModificada: string): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/tabla/${tablaModificada}`);
  }

  // Obtener auditorías por tipo de petición
  obtenerAuditoriasPorTipoPeticion(tipoPeticion: string): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/tipo/${tipoPeticion}`);
  }

  // Obtener auditorías por rango de fechas
  obtenerAuditoriasPorRangoFechas(fechaInicio: string, fechaFin: string): Observable<AuditoriaDTO[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/fechas`, { params });
  }

  // Obtener auditorías con filtros múltiples
  obtenerAuditoriasConFiltros(filtros: FiltroAuditoria): Observable<AuditoriaDTO[]> {
    let params = new HttpParams();
    
    if (filtros.idUsuario) {
      params = params.set('idUsuario', filtros.idUsuario.toString());
    }
    if (filtros.tablaModificada) {
      params = params.set('tablaModificada', filtros.tablaModificada);
    }
    if (filtros.tipoPeticion) {
      params = params.set('tipoPeticion', filtros.tipoPeticion);
    }
    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }

    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/filtros`, { params });
  }

  // Obtener auditorías por tabla y ID de registro
  obtenerAuditoriasPorTablaYRegistro(tablaModificada: string, idRegistroModificado: number): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/tabla/${tablaModificada}/registro/${idRegistroModificado}`);
  }

  // Obtener auditorías recientes
  obtenerAuditoriasRecientes(): Observable<AuditoriaDTO[]> {
    return this.http.get<AuditoriaDTO[]>(`${this.baseUrl}/recientes`);
  }

  // Obtener nombres de tablas disponibles
  obtenerTablasDisponibles(): string[] {
    return [
      'USUARIO',
      'ESTUDIO_ACADEMICO',
      'VEHICULO',
      'VIVIENDA',
      'PERSONA_A_CARGO',
      'CONTACTO_EMERGENCIA',
      'RELACION_CONF'
    ];
  }

  // Obtener tipos de petición disponibles
  obtenerTiposPeticionDisponibles(): string[] {
    return ['INSERT', 'UPDATE', 'DELETE'];
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Obtener nombre legible de la tabla
  obtenerNombreLegibleTabla(tabla: string): string {
    const nombres: { [key: string]: string } = {
      'USUARIO': 'Información Personal',
      'ESTUDIO_ACADEMICO': 'Estudios Académicos',
      'VEHICULO': 'Vehículos',
      'VIVIENDA': 'Vivienda',
      'PERSONA_A_CARGO': 'Personas a Cargo',
      'CONTACTO_EMERGENCIA': 'Contactos de Emergencia',
      'RELACION_CONF': 'Declaraciones de Conflicto'
    };
    return nombres[tabla] || tabla;
  }

  // Obtener nombre legible del tipo de petición
  obtenerNombreLegibleTipoPeticion(tipo: string): string {
    const nombres: { [key: string]: string } = {
      'INSERT': 'Creación',
      'UPDATE': 'Actualización',
      'DELETE': 'Eliminación'
    };
    return nombres[tipo] || tipo;
  }

  // Obtener clase CSS para el tipo de petición
  obtenerClaseTipoPeticion(tipo: string): string {
    const clases: { [key: string]: string } = {
      'INSERT': 'badge-success',
      'UPDATE': 'badge-warning',
      'DELETE': 'badge-danger'
    };
    return clases[tipo] || 'badge-secondary';
  }
} 