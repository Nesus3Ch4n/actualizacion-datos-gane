import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface UsuarioBD {
  id: number;
  nombre: string;
  cedula: number;
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
  fechaActualizacion?: string;
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

  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los usuarios de la base de datos
   */
  obtenerUsuarios(): Observable<UsuarioAdmin[]> {
    return this.http.get<any>(`${this.API_URL}/USUARIO/test/todos`).pipe(
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
    return usuariosBD.map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre ? usuario.nombre.split(' ')[0] || usuario.nombre : 'Sin nombre',
      apellido: usuario.nombre ? usuario.nombre.split(' ').slice(1).join(' ') || 'Sin apellido' : 'Sin apellido',
      email: usuario.correo || 'Sin email',
      cargo: usuario.cargo || 'Sin cargo',
      departamento: usuario.area || 'Sin departamento',
      fechaIngreso: usuario.fechaCreacion ? new Date(usuario.fechaCreacion) : new Date(),
      estado: 'activo' as const,
      ultimaActualizacion: usuario.fechaActualizacion ? new Date(usuario.fechaActualizacion) : new Date(),
      tieneConflictoIntereses: false, // Por defecto false, se puede calcular después
      cedula: usuario.cedula
    }));
  }

  /**
   * Crear usuario de prueba en la base de datos
   */
  crearUsuarioPrueba(usuarioData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/USUARIO/test/crear-usuario`, usuarioData);
  }

  /**
   * Verificar si un usuario existe por cédula
   */
  verificarUsuarioPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/USUARIO/test/cedula/${cedula}`);
  }
} 