import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EstadisticasActualizacion {
  total: number;
  completadas: number;
  pendientes: number;
  vencidas: number;
  porcentajeCompletadas: number;
  porcentajePendientes: number;
  porcentajeVencidas: number;
  necesitanActualizacion: number;
  proximosAVencer: number;
}

export interface ControlActualizacion {
  idControl: number;
  idUsuario: number;
  fechaUltimaActualizacion: string;
  fechaProximaActualizacion: string;
  estadoActualizacion: string;
  versionActualizacion: number;
  fechaCreacion: string;
  fechaModificacion: string;
  usuario?: {
    idUsuario: number;
    nombre: string;
    documento: number;
  };
}

export interface HistorialActualizacion {
  idHistorial: number;
  idUsuario: number;
  idControl: number;
  fechaActualizacion: string;
  tipoActualizacion: string;
  datosActualizados: string;
  ipAddress: string;
  userAgent: string;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActualizacionService {
  
  private readonly API_URL = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) {}
  
  /**
   * Verificar si el usuario necesita actualizar sus datos
   */
  verificarNecesidadActualizacion(): Observable<{
    necesitaActualizacion: boolean;
    mensaje: string;
    tipo: string;
  }> {
    return this.http.get<any>(`${this.API_URL}/actualizacion/verificar`);
  }
  
  /**
   * Registrar una actualización completada
   */
  registrarActualizacion(tipoActualizacion: string, datosActualizados: any): Observable<any> {
    const payload = {
      tipoActualizacion,
      datosActualizados: JSON.stringify(datosActualizados),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    return this.http.post<any>(`${this.API_URL}/actualizacion/registrar`, payload);
  }
  
  /**
   * Obtener estadísticas de actualizaciones
   */
  obtenerEstadisticas(): Observable<EstadisticasActualizacion> {
    return this.http.get<any>(`${this.API_URL}/actualizacion/estadisticas`).pipe(
      map(response => response.data)
    );
  }
  
  /**
   * Obtener controles que necesitan actualización
   */
  obtenerPendientes(): Observable<ControlActualizacion[]> {
    return this.http.get<any>(`${this.API_URL}/actualizacion/pendientes`).pipe(
      map(response => response.data)
    );
  }
  
  /**
   * Obtener controles vencidos
   */
  obtenerVencidas(): Observable<ControlActualizacion[]> {
    return this.http.get<any>(`${this.API_URL}/actualizacion/vencidas`).pipe(
      map(response => response.data)
    );
  }
  
  /**
   * Obtener historial de actualizaciones de un usuario
   */
  obtenerHistorialUsuario(idUsuario: number): Observable<HistorialActualizacion[]> {
    return this.http.get<any>(`${this.API_URL}/actualizacion/historial/${idUsuario}`).pipe(
      map(response => response.data)
    );
  }
  
  /**
   * Obtener estadísticas de historial por período
   */
  obtenerEstadisticasHistorial(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let url = `${this.API_URL}/actualizacion/historial/estadisticas`;
    const params = new URLSearchParams();
    
    if (fechaInicio) {
      params.append('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params.append('fechaFin', fechaFin);
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    return this.http.get<any>(url).pipe(
      map(response => response.data)
    );
  }

  /**
   * Inicializar datos de prueba
   */
  inicializarDatos(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/actualizacion/inicializar-datos`, {});
  }
  
  /**
   * Obtener IP del cliente (simulado)
   */
  private getClientIP(): string {
    // En un entorno real, esto se obtendría del servidor
    // Por ahora, simulamos una IP
    return '127.0.0.1';
  }
  
  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  }
  
  /**
   * Obtener estado legible
   */
  obtenerEstadoLegible(estado: string): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'COMPLETADA': 'Completada',
      'VENCIDA': 'Vencida'
    };
    
    return estados[estado] || estado;
  }
  
  /**
   * Obtener clase CSS para el estado
   */
  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'estado-pendiente',
      'COMPLETADA': 'estado-completada',
      'VENCIDA': 'estado-vencida'
    };
    
    return clases[estado] || 'estado-default';
  }
  
  /**
   * Calcular días restantes hasta la próxima actualización
   */
  calcularDiasRestantes(fechaProxima: string): number {
    if (!fechaProxima) return 0;
    
    try {
      const proxima = new Date(fechaProxima);
      const ahora = new Date();
      const diffTime = proxima.getTime() - ahora.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      return 0;
    }
  }
  
  /**
   * Obtener mensaje de días restantes
   */
  obtenerMensajeDiasRestantes(dias: number): string {
    if (dias < 0) {
      return `Vencida hace ${Math.abs(dias)} días`;
    } else if (dias === 0) {
      return 'Vence hoy';
    } else if (dias === 1) {
      return 'Vence mañana';
    } else if (dias <= 7) {
      return `Vence en ${dias} días`;
    } else if (dias <= 30) {
      return `Vence en ${dias} días`;
    } else {
      const meses = Math.floor(dias / 30);
      return `Vence en ${meses} mes${meses > 1 ? 'es' : ''}`;
    }
  }
}

// Importar map de rxjs
import { map } from 'rxjs/operators'; 