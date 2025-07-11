import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

export interface UsuarioBD {
  idUsuario: number;
  documento: number;
  nombre: string;
  correo: string;
  numeroFijo?: number;
  numeroCelular?: number;
  numeroCorp?: number;
  cedulaExpedicion?: string;
  paisNacimiento?: string;
  ciudadNacimiento?: string;
  cargo?: string;
  area?: string;
  estadoCivil?: string;
  tipoSangre?: string;
  version?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  departamento: string;
  fechaIngreso: Date;
  estado: 'activo' | 'inactivo';
  ultimaActualizacion: Date;
  tieneConflictoIntereses: boolean;
  cedula: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_URL = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  /**
   * Obtener todos los usuarios de la base de datos
   */
  obtenerUsuarios(): Observable<UsuarioAdmin[]> {
    return this.http.get<any>(`${this.API_URL}/usuarios`).pipe(
      map(response => {
        if (response && response.success && response.data) {
          // Transformar los usuarios de la BD al formato del panel
          return this.transformarUsuarios(response.data);
        } else {
          // Si no hay usuarios o hay error, devolver array vacío
          return this.transformarUsuarios([]);
        }
      })
    );
  }

  /**
   * Obtener usuarios usando el endpoint de prueba
   */
  obtenerUsuariosPrueba(): Observable<UsuarioAdmin[]> {
    // Por ahora, vamos a crear algunos usuarios de prueba
    const usuariosPrueba: UsuarioAdmin[] = [
      {
        id: 1,
        nombre: 'JESUS FELIPE',
        apellido: 'CORDOBA ECHANDIA',
        email: 'jesus.cordoba@test.com',
        cargo: 'DESARROLLADOR',
        departamento: 'TECNOLOGIA',
        fechaIngreso: new Date('2023-01-15'),
        estado: 'activo',
        ultimaActualizacion: new Date('2024-01-15'),
        tieneConflictoIntereses: false,
        cedula: 1006101211
      }
    ];

    return new Observable(observer => {
      observer.next(usuariosPrueba);
      observer.complete();
    });
  }

  /**
   * Transformar usuarios de la BD al formato del panel de administración
   */
  private transformarUsuarios(usuariosBD: UsuarioBD[]): UsuarioAdmin[] {
    return usuariosBD.map(usuario => {
      return {
        id: usuario.idUsuario,
      nombre: usuario.nombre ? usuario.nombre.split(' ')[0] || usuario.nombre : 'Sin nombre',
      apellido: usuario.nombre ? usuario.nombre.split(' ').slice(1).join(' ') || 'Sin apellido' : 'Sin apellido',
      email: usuario.correo || 'Sin email',
      cargo: usuario.cargo || 'Sin cargo',
      departamento: usuario.area || 'Sin departamento',
      fechaIngreso: usuario.fechaCreacion ? new Date(usuario.fechaCreacion) : new Date(),
      estado: 'activo' as const,
        ultimaActualizacion: usuario.fechaModificacion ? new Date(usuario.fechaModificacion) : new Date(),
      tieneConflictoIntereses: false, // Por defecto false, se puede calcular después
        cedula: usuario.documento
      };
    });
  }

  /**
   * Crear usuario de prueba en la base de datos
   */
  crearUsuarioPrueba(usuarioData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/usuarios/basico`, usuarioData);
  }

  /**
   * Verificar si un usuario existe por cédula
   */
  verificarUsuarioPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/usuarios/cedula/${cedula}`);
  }

  /**
   * Generar reporte de integrantes
   */
  generarReporteIntegrantes(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/integrantes`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de conflicto de intereses
   */
  generarReporteConflictoIntereses(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/conflicto-intereses`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de estudios
   */
  generarReporteEstudios(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/estudios`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de personas de contacto
   */
  generarReporteContacto(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/contacto`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de personas a cargo
   */
  generarReportePersonasCargo(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/personas-cargo`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de vehículos
   */
  generarReporteVehiculos(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/vehiculos`, { responseType: 'blob' });
  }

  /**
   * Generar reporte de viviendas
   */
  generarReporteViviendas(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/viviendas`, { responseType: 'blob' });
  }

  /**
   * Exportar todo (reporte completo)
   */
  exportarTodo(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reportes/exportar-todo`, { responseType: 'blob' });
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(id: number, adminCedula?: string, adminNombre?: string): Observable<any> {
    let url = `${this.API_URL}/usuarios/${id}`;
    const params = new URLSearchParams();
    
    if (adminCedula) {
      params.append('adminCedula', adminCedula);
    }
    if (adminNombre) {
      params.append('adminNombre', adminNombre);
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    return this.http.delete<any>(url);
  }
} 