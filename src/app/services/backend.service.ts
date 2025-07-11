import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly API_URL = environment.apiBaseUrl;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ========== MÉTODO SIMPLE PARA CREAR USUARIO ==========
  
  /**
   * Crear usuario con información personal básica
   */
  crearUsuario(usuarioData: any): Observable<any> {
    console.log('👤 Creando usuario:', usuarioData);
    console.log('🌐 URL del API:', this.API_URL);
    console.log('📡 Headers:', this.httpOptions);
    
    console.log('🚀 Enviando petición HTTP POST a:', `${this.API_URL}/usuarios`);
    
    return this.http.post<any>(`${this.API_URL}/usuarios`, usuarioData, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ Respuesta del backend:', response);
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al crear usuario');
          }
        }),
        catchError(error => {
          console.error('❌ Error completo:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error statusText:', error.statusText);
          console.error('❌ Error url:', error.url);
          console.error('❌ Error message:', error.message);
          
          let errorMessage = 'Error de conexión con el servidor';
          
          if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // ========== MÉTODO PARA VERIFICAR CONEXIÓN ==========
  
  /**
   * Verificar si el backend está disponible
   */
  async verificarConexion(): Promise<boolean> {
    try {
      const response = await this.http.get(`${this.API_URL}/auth/health`, this.httpOptions).toPromise();
      return true;
    } catch (error) {
      console.error('❌ Backend no disponible:', error);
      return false;
    }
  }

  // ========== UTILIDADES ==========
  
  /**
   * Obtener URL base de la API
   */
  getApiUrl(): string {
    return this.API_URL;
  }

  /**
   * Obtener el HttpClient para uso en otros servicios
   */
  getHttpClient(): HttpClient {
    return this.http;
  }

  /**
   * Obtener las opciones HTTP para uso en otros servicios
   */
  getHttpOptions(): { headers: HttpHeaders } {
    // Si el usuario está autenticado, usar headers con token
    if (this.authService.isAuthenticated()) {
      return {
        headers: this.authService.getAuthHeaders()
      };
    }
    // Si no está autenticado, usar headers básicos
    return this.httpOptions;
  }

  // ========== USUARIOS ==========
  
  /**
   * Crear usuario completo con toda la información del formulario
   */
  crearUsuarioCompleto(usuarioData: any): Observable<any> {
    console.log('🚀 Enviando datos al backend:', usuarioData);
    
    return this.http.post<BackendResponse>(`${this.API_URL}/usuarios/completo`, usuarioData, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('✅ Respuesta del backend:', response);
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error desconocido');
          }
        }),
        catchError(error => {
          console.error('❌ Error en backend service:', error);
          const errorMessage = error.error?.message || error.message || 'Error de conexión con el servidor';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Crear usuario usando endpoint de prueba (sin autenticación)
   */
  crearUsuarioPrueba(usuarioData: any): Observable<any> {
    console.log('🚀 Enviando datos al backend (prueba):', usuarioData);
    
    return this.http.post<BackendResponse>(`${this.API_URL}/usuarios/basico`, usuarioData, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('✅ Respuesta del backend (prueba):', response);
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error desconocido');
          }
        }),
        catchError(error => {
          console.error('❌ Error en backend service (prueba):', error);
          const errorMessage = error.error?.message || error.message || 'Error de conexión con el servidor';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Obtener todos los usuarios
   */
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/usuarios`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('✅ Respuesta completa de usuarios:', response);
          // El backend devuelve {success: boolean, usuarios: any[], total: number}
          if (response.success && response.usuarios && Array.isArray(response.usuarios)) {
            console.log('✅ Usuarios obtenidos:', response.usuarios);
            return response.usuarios;
          } else {
            console.warn('⚠️ Respuesta inesperada del backend:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('❌ Error al obtener usuarios:', error);
          return throwError(() => new Error('Error al obtener usuarios'));
        })
      );
  }

  /**
   * Obtener usuario por ID
   */
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get<BackendResponse>(`${this.API_URL}/usuarios/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Usuario no encontrado');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener usuario por cédula
   */
  obtenerUsuarioPorCedula(cedula: string): Observable<any> {
    return this.http.get<BackendResponse>(`${this.API_URL}/usuarios/cedula/${cedula}`, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Usuario no encontrado');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Buscar usuarios por nombre
   */
  buscarUsuariosPorNombre(nombre: string): Observable<any[]> {
    return this.http.get<BackendResponse>(`${this.API_URL}/usuarios/buscar?nombre=${nombre}`, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            return [];
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar usuario existente
   */
  actualizarUsuario(usuarioId: number, datos: any): Observable<any> {
    console.log('🔄 Actualizando usuario ID:', usuarioId, 'con datos:', datos);
    
    return this.http.put(`${this.API_URL}/usuarios/${usuarioId}`, datos, this.getHttpOptions()).pipe(
      map((response: any) => {
        console.log('✅ Usuario actualizado exitosamente:', response);
        return { success: true, data: response };
      }),
      catchError((error) => {
        console.error('❌ Error actualizando usuario:', error);
        return of({ success: false, error: error.error?.message || 'Error al actualizar usuario' });
      })
    );
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
    
    return this.http.delete<BackendResponse>(url, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al eliminar usuario');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas
   */
  obtenerEstadisticas(): Observable<any> {
    return this.http.get<BackendResponse>(`${this.API_URL}/estadisticas`, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al obtener estadísticas');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar salud del backend
   */
  verificarSalud(): Observable<any> {
    return this.http.get<BackendResponse>(`${this.API_URL}/auth/health`, this.getHttpOptions())
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al verificar salud del backend');
          }
        }),
        catchError(this.handleError)
      );
  }

  // ========== MANEJO DE ERRORES ==========
  
  private handleError = (error: any): Observable<never> => {
    console.error('❌ Error en BackendService:', error);
    let errorMessage = 'Error de conexión con el servidor';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  };

  // ========== MÉTODOS PARA GUARDAR DATOS DEL FORMULARIO ==========

  /**
   * Guardar estudios académicos
   */
  guardarEstudios(cedula: number, estudios: any[]): Observable<any> {
    console.log(`📚 Guardando ${estudios.length} estudios para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/estudios/guardar?cedula=${cedula}`, estudios, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar estudios:', error);
          return throwError(() => new Error(`Error al guardar estudios: ${error.message || error}`));
        })
      );
  }

  /**
   * Guardar vehículos
   */
  guardarVehiculos(cedula: number, vehiculos: any[]): Observable<any> {
    console.log(`🚗 Guardando ${vehiculos.length} vehículos para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/vehiculos/guardar?cedula=${cedula}`, vehiculos, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vehículos:', error);
          return throwError(() => new Error(`Error al guardar vehículos: ${error.message || error}`));
        })
      );
  }

  /**
   * Guardar vivienda
   */
  guardarVivienda(cedula: number, vivienda: any): Observable<any> {
    console.log(`🏠 Guardando vivienda para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/vivienda/guardar?cedula=${cedula}`, vivienda, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vivienda:', error);
          return throwError(() => new Error(`Error al guardar vivienda: ${error.message || error}`));
        })
      );
  }

  /**
   * Guardar personas a cargo
   */
  guardarPersonasACargo(cedula: number, personas: any[]): Observable<any> {
    console.log(`👨‍👩‍👧‍👦 Guardando ${personas.length} personas a cargo para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/personas-acargo/guardar?cedula=${cedula}`, personas, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar personas a cargo:', error);
          return throwError(() => new Error(`Error al guardar personas a cargo: ${error.message || error}`));
        })
      );
  }

  /**
   * Guardar contactos de emergencia
   */
  guardarContactos(cedula: number, contactos: any[]): Observable<any> {
    console.log(`📞 Guardando ${contactos.length} contactos para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/contactos/guardar?cedula=${cedula}`, contactos, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar contactos:', error);
          return throwError(() => new Error(`Error al guardar contactos: ${error.message || error}`));
        })
      );
  }

  /**
   * Guardar declaraciones de conflicto
   */
  guardarDeclaraciones(cedula: number, declaraciones: any[]): Observable<any> {
    console.log(`⚖️ Guardando ${declaraciones.length} declaraciones para cédula: ${cedula}`);
    
    return this.http.post<any>(`${this.API_URL}/declaraciones/usuario/${cedula}`, declaraciones, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar declaraciones:', error);
          return throwError(() => new Error(`Error al guardar declaraciones: ${error.message || error}`));
        })
      );
  }
} 