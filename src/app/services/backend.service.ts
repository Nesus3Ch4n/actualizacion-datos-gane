import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

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
  private readonly API_URL = 'http://localhost:8080/api';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {}

  // ========== MÉTODO SIMPLE PARA CREAR USUARIO ==========
  
  /**
   * Crear usuario con información personal básica
   */
  crearUsuario(usuarioData: any): Observable<any> {
    console.log('👤 Creando usuario:', usuarioData);
    console.log('🌐 URL del API:', this.API_URL);
    console.log('📡 Headers:', this.httpOptions);
    
    console.log('🚀 Enviando petición HTTP POST a:', `${this.API_URL}/formulario/paso1/informacion-personal`);
    
    return this.http.post<any>(`${this.API_URL}/formulario/paso1/informacion-personal`, usuarioData, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ Respuesta del backend:', response);
          return response;
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
  getHttpOptions(): any {
    return this.httpOptions;
  }

  // ========== USUARIOS ==========
  
  /**
   * Crear usuario completo con toda la información del formulario
   */
  crearUsuarioCompleto(usuarioData: any): Observable<any> {
    console.log('🚀 Enviando datos al backend:', usuarioData);
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/crear-completo`, usuarioData, this.httpOptions)
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
   * Obtener todos los usuarios
   */
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/consulta/bd/usuarios`, this.httpOptions)
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
    return this.http.get<BackendResponse>(`${this.API_URL}/USUARIO/${id}`, this.httpOptions)
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
    return this.http.get<BackendResponse>(`${this.API_URL}/USUARIO/cedula/${cedula}`, this.httpOptions)
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
    return this.http.get<BackendResponse>(`${this.API_URL}/USUARIO/buscar?nombre=${nombre}`, this.httpOptions)
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
    
    return this.http.put(`${this.API_URL}/USUARIO/${usuarioId}`, datos, this.httpOptions).pipe(
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
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<BackendResponse>(`${this.API_URL}/USUARIO/${id}`, this.httpOptions)
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
    return this.http.get<BackendResponse>(`${this.API_URL}/estadisticas`, this.httpOptions)
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
    return this.http.get<BackendResponse>(`${this.API_URL}/auth/health`, this.httpOptions)
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
  guardarEstudios(usuarioId: number, estudios: any[]): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/estudios/usuario/${usuarioId}`, estudios, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar estudios');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar vehículos
   */
  guardarVehiculos(usuarioId: number, vehiculos: any[]): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/vehiculos/usuario/${usuarioId}`, vehiculos, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar vehículos');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar vivienda
   */
  guardarVivienda(usuarioId: number, vivienda: any): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/vivienda/usuario/${usuarioId}`, vivienda, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar vivienda');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar personas a cargo
   */
  guardarPersonasACargo(usuarioId: number, personas: any[]): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/personas-cargo/usuario/${usuarioId}`, personas, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar personas a cargo');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar contactos de emergencia
   */
  guardarContactos(usuarioId: number, contactos: any[]): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/contactos-emergencia/usuario/${usuarioId}`, contactos, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar contactos');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar declaraciones de conflicto
   */
  guardarDeclaraciones(usuarioId: number, declaraciones: any[]): Observable<any> {
    return this.http.post<BackendResponse>(`${this.API_URL}/declaraciones-conflicto/usuario/${usuarioId}`, declaraciones, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al guardar declaraciones');
          }
        }),
        catchError(this.handleError)
      );
  }
} 