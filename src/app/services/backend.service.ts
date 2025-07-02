import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
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
  private readonly MOCK_MODE = false;
  
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
    
    if (this.MOCK_MODE) {
      // Simular respuesta exitosa del backend
      const mockResponse: BackendResponse = {
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          cedula: usuarioData.cedula,
          nombre: usuarioData.nombre,
          correo: usuarioData.correo,
          fechaCreacion: new Date().toISOString(),
          estado: 'activo'
        }
      };
      
      return of(mockResponse).pipe(
        delay(800), // Simular latencia de red
        map(response => {
          console.log('✅ Usuario creado exitosamente:', response);
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error desconocido');
          }
        })
      );
    }
    
    // Código para backend real - usar el endpoint correcto
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
      if (this.MOCK_MODE) {
        return true;
      }
      
      const response = await this.http.get(`${this.API_URL}/health`, this.httpOptions).toPromise();
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
   * Verificar si está en modo simulado
   */
  isMockMode(): boolean {
    return this.MOCK_MODE;
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
    console.log('🚀 Enviando datos al backend (MODO SIMULADO):', usuarioData);
    
    if (this.MOCK_MODE) {
      // Simular respuesta exitosa del backend
      const mockResponse: BackendResponse = {
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          cedula: usuarioData.informacionPersonal?.cedula || '12345678',
          nombre: usuarioData.informacionPersonal?.nombre || 'Usuario',
          apellido: usuarioData.informacionPersonal?.apellido || 'Test',
          email: usuarioData.informacionPersonal?.email || 'test@example.com',
          fechaCreacion: new Date().toISOString(),
          estado: 'activo'
        }
      };
      
      return of(mockResponse).pipe(
        delay(1000), // Simular latencia de red
        map(response => {
          console.log('✅ Respuesta simulada del backend:', response);
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error desconocido');
          }
        })
      );
    }
    
    // Código original para cuando se active el backend real
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
    if (this.MOCK_MODE) {
      // Datos simulados de usuarios
      const mockUsuarios = [
        {
          id: 1,
          cedula: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@example.com',
          departamento: 'Tecnología',
          estado: 'activo',
          fechaCreacion: '2024-01-15'
        },
        {
          id: 2,
          cedula: '87654321',
          nombre: 'María',
          apellido: 'González',
          email: 'maria.gonzalez@example.com',
          departamento: 'Recursos Humanos',
          estado: 'activo',
          fechaCreacion: '2024-01-20'
        },
        {
          id: 3,
          cedula: '11223344',
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          email: 'carlos.rodriguez@example.com',
          departamento: 'Marketing',
          estado: 'inactivo',
          fechaCreacion: '2024-01-25'
        }
      ];
      
      return of(mockUsuarios).pipe(delay(500));
    }
    
    // Usar el endpoint correcto del backend Spring Boot
    return this.http.get<any[]>(`${this.API_URL}/consulta/bd/usuarios`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ Usuarios obtenidos:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Error al obtener usuarios:', error);
          // Si falla, devolver array vacío en lugar de error
          return of([]);
        })
      );
  }

  /**
   * Obtener usuario por ID
   */
  obtenerUsuarioPorId(id: number): Observable<any> {
    if (this.MOCK_MODE) {
      const mockUsuario = {
        id: id,
        cedula: '12345678',
        nombre: 'Usuario',
        apellido: 'Test',
        email: 'usuario.test@example.com',
        departamento: 'Tecnología',
        estado: 'activo',
        fechaCreacion: '2024-01-15'
      };
      
      return of(mockUsuario).pipe(delay(300));
    }
    
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
    if (this.MOCK_MODE) {
      const mockUsuario = {
        id: 1,
        cedula: cedula,
        nombre: 'Usuario',
        apellido: 'Test',
        email: 'usuario.test@example.com',
        departamento: 'Tecnología',
        estado: 'activo',
        fechaCreacion: '2024-01-15'
      };
      
      return of(mockUsuario).pipe(delay(300));
    }
    
    // Usar el endpoint correcto del backend Spring Boot
    return this.http.get<any>(`${this.API_URL}/consulta/bd/${cedula}/informacion-personal`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('✅ Usuario obtenido por cédula:', response);
          return response;
        }),
        catchError(error => {
          console.error('❌ Error al obtener usuario por cédula:', error);
          throw error;
        })
      );
  }

  /**
   * Buscar usuarios por nombre
   */
  buscarUsuariosPorNombre(nombre: string): Observable<any[]> {
    if (this.MOCK_MODE) {
      const mockResultados = [
        {
          id: 1,
          cedula: '12345678',
          nombre: nombre,
          apellido: 'Test',
          email: 'test@example.com',
          departamento: 'Tecnología',
          estado: 'activo'
        }
      ];
      
      return of(mockResultados).pipe(delay(400));
    }
    
    return this.http.get<BackendResponse<any[]>>(`${this.API_URL}/USUARIO/buscar?nombre=${encodeURIComponent(nombre)}`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error en la búsqueda');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(id: number, usuarioData: any): Observable<any> {
    if (this.MOCK_MODE) {
      const mockResponse = {
        id: id,
        ...usuarioData,
        fechaActualizacion: new Date().toISOString()
      };
      
      return of(mockResponse).pipe(delay(600));
    }
    
    return this.http.put<BackendResponse>(`${this.API_URL}/USUARIO/${id}`, usuarioData, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al actualizar usuario');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar usuario (eliminación lógica)
   */
  eliminarUsuario(id: number): Observable<any> {
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: 'Usuario eliminado exitosamente'
      };
      
      return of(mockResponse).pipe(delay(400));
    }
    
    return this.http.delete<BackendResponse>(`${this.API_URL}/USUARIO/${id}`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            return response;
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
    if (this.MOCK_MODE) {
      const mockEstadisticas = {
        totalUsuarios: 150,
        usuariosActivos: 142,
        usuariosInactivos: 8,
        registrosHoy: 5,
        registrosSemana: 23,
        registrosMes: 87
      };
      
      return of(mockEstadisticas).pipe(delay(300));
    }
    
    return this.http.get<BackendResponse>(`${this.API_URL}/USUARIO/estadisticas`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Error al obtener estadísticas');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar salud del servicio
   */
  verificarSalud(): Observable<any> {
    if (this.MOCK_MODE) {
      const mockHealth: BackendResponse = {
        success: true,
        message: 'Servicio funcionando correctamente (modo simulado)',
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0-mock'
        }
      };
      
      return of(mockHealth).pipe(delay(200));
    }
    
    return this.http.get<BackendResponse>(`${this.API_URL}/USUARIO/health`, this.httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  // ========== MANEJO DE ERRORES ==========
  
  private handleError = (error: any): Observable<never> => {
    console.error('❌ Error en BackendService:', error);
    
    let errorMessage = 'Error de conexión con el servidor';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  };

  // ========== ESTUDIOS ACADÉMICOS ==========
  
  /**
   * Guardar estudios académicos para un usuario
   */
  guardarEstudios(usuarioId: number, estudios: any[]): Observable<any> {
    console.log('📚 Guardando estudios académicos para usuario:', usuarioId, estudios);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: `${estudios.length} estudios académicos guardados exitosamente`,
        data: estudios.map((estudio, index) => ({
          id: Math.floor(Math.random() * 1000) + index,
          usuarioId: usuarioId,
          ...estudio,
          fechaCreacion: new Date().toISOString()
        }))
      };
      
      return of(mockResponse).pipe(
        delay(400),
        map(response => {
          console.log('✅ Estudios guardados:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/estudios`, estudios, this.httpOptions)
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

  // ========== VEHÍCULOS ==========
  
  /**
   * Guardar vehículos para un usuario
   */
  guardarVehiculos(usuarioId: number, vehiculos: any[]): Observable<any> {
    console.log('🚗 Guardando vehículos para usuario:', usuarioId, vehiculos);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: `${vehiculos.length} vehículos guardados exitosamente`,
        data: vehiculos.map((vehiculo, index) => ({
          id: Math.floor(Math.random() * 1000) + index,
          usuarioId: usuarioId,
          ...vehiculo,
          fechaCreacion: new Date().toISOString()
        }))
      };
      
      return of(mockResponse).pipe(
        delay(300),
        map(response => {
          console.log('✅ Vehículos guardados:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/vehiculos`, vehiculos, this.httpOptions)
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

  // ========== VIVIENDA ==========
  
  /**
   * Guardar información de vivienda para un usuario
   */
  guardarVivienda(usuarioId: number, vivienda: any): Observable<any> {
    console.log('🏠 Guardando vivienda para usuario:', usuarioId, vivienda);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: 'Información de vivienda guardada exitosamente',
        data: {
          id: Math.floor(Math.random() * 1000),
          usuarioId: usuarioId,
          ...vivienda,
          fechaCreacion: new Date().toISOString()
        }
      };
      
      return of(mockResponse).pipe(
        delay(300),
        map(response => {
          console.log('✅ Vivienda guardada:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/vivienda`, vivienda, this.httpOptions)
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

  // ========== PERSONAS A CARGO ==========
  
  /**
   * Guardar personas a cargo para un usuario
   */
  guardarPersonasACargo(usuarioId: number, personas: any[]): Observable<any> {
    console.log('👨‍👩‍👧‍👦 Guardando personas a cargo para usuario:', usuarioId, personas);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: `${personas.length} personas a cargo guardadas exitosamente`,
        data: personas.map((persona, index) => ({
          id: Math.floor(Math.random() * 1000) + index,
          usuarioId: usuarioId,
          ...persona,
          fechaCreacion: new Date().toISOString()
        }))
      };
      
      return of(mockResponse).pipe(
        delay(300),
        map(response => {
          console.log('✅ Personas a cargo guardadas:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/personas-cargo`, personas, this.httpOptions)
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

  // ========== CONTACTOS DE EMERGENCIA ==========
  
  /**
   * Guardar contactos de emergencia para un usuario
   */
  guardarContactos(usuarioId: number, contactos: any[]): Observable<any> {
    console.log('📞 Guardando contactos de emergencia para usuario:', usuarioId, contactos);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: `${contactos.length} contactos de emergencia guardados exitosamente`,
        data: contactos.map((contacto, index) => ({
          id: Math.floor(Math.random() * 1000) + index,
          usuarioId: usuarioId,
          ...contacto,
          fechaCreacion: new Date().toISOString()
        }))
      };
      
      return of(mockResponse).pipe(
        delay(300),
        map(response => {
          console.log('✅ Contactos guardados:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/contactos`, contactos, this.httpOptions)
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

  // ========== DECLARACIONES DE CONFLICTO ==========
  
  /**
   * Guardar declaraciones de conflicto para un usuario
   */
  guardarDeclaraciones(usuarioId: number, declaraciones: any[]): Observable<any> {
    console.log('⚖️ Guardando declaraciones de conflicto para usuario:', usuarioId, declaraciones);
    
    if (this.MOCK_MODE) {
      const mockResponse: BackendResponse = {
        success: true,
        message: `${declaraciones.length} declaraciones de conflicto guardadas exitosamente`,
        data: declaraciones.map((declaracion, index) => ({
          id: Math.floor(Math.random() * 1000) + index,
          usuarioId: usuarioId,
          ...declaracion,
          fechaCreacion: new Date().toISOString()
        }))
      };
      
      return of(mockResponse).pipe(
        delay(300),
        map(response => {
          console.log('✅ Declaraciones guardadas:', response);
          return response.data;
        })
      );
    }
    
    return this.http.post<BackendResponse>(`${this.API_URL}/USUARIO/${usuarioId}/declaraciones`, declaraciones, this.httpOptions)
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