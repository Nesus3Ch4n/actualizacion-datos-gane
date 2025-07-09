import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface UserInfo {
  id: number;
  nombre: string;
  cedula: number;
  correo: string;
  [key: string]: any;
}

export interface TokenInfo {
  cedula: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  roles: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiBaseUrl;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private validatingToken = false;
  private authInitialized = false;

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Inicializar autenticación
   */
  private initializeAuth(): void {
    if (this.authInitialized) {
      return;
    }

    console.log('🔐 Inicializando autenticación...');
    
    const token = this.getStoredToken();
    if (token) {
      console.log('🔐 Token encontrado, validando...');
      this.validateToken(token).subscribe(
        isValid => {
          if (isValid) {
            console.log('✅ Token válido');
            this.isAuthenticatedSubject.next(true);
          } else {
            console.log('❌ Token inválido, regenerando automáticamente...');
            this.regenerateTokenOnLoad().subscribe(
              regenerated => {
                if (regenerated) {
                  console.log('✅ Token regenerado automáticamente');
                  this.isAuthenticatedSubject.next(true);
                } else {
                  console.log('❌ No se pudo regenerar el token');
                  this.clearToken();
                }
                this.authInitialized = true;
              }
            );
          }
          this.authInitialized = true;
        },
        error => {
          console.error('❌ Error validando token:', error);
          this.regenerateTokenOnLoad().subscribe(
            regenerated => {
              if (regenerated) {
                console.log('✅ Token regenerado automáticamente');
                this.isAuthenticatedSubject.next(true);
              } else {
                console.log('❌ No se pudo regenerar el token');
                this.clearToken();
              }
              this.authInitialized = true;
            }
          );
        }
      );
    } else {
      console.log('🔐 No hay token almacenado, regenerando automáticamente...');
      this.regenerateTokenOnLoad().subscribe(
        regenerated => {
          if (regenerated) {
            console.log('✅ Token regenerado automáticamente');
            this.isAuthenticatedSubject.next(true);
          } else {
            console.log('❌ No se pudo regenerar el token');
          }
          this.authInitialized = true;
        }
      );
    }
  }

  /**
   * Obtener token del localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Guardar token en localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Remover token del localStorage
   */
  private removeStoredToken(): void {
    localStorage.removeItem('jwt_token');
  }

  /**
   * Extraer token de la URL (cuando viene de la plataforma PAU)
   */
  extractTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (tokenParam) {
      try {
        // Decodificar el token si viene codificado
        const decodedToken = decodeURIComponent(tokenParam);
        console.log('🔐 Token decodificado:', decodedToken);
        
        // Intentar parsear como JSON (formato completo con token y expiry)
        try {
          const tokenData = JSON.parse(decodedToken);
          if (tokenData.token) {
            console.log('🔐 Token extraído del JSON:', tokenData.token);
            return tokenData.token;
          }
        } catch (jsonError) {
          // Si no es JSON, usar directamente como token JWT
          console.log('🔐 Usando token directamente como JWT');
          return decodedToken;
        }
      } catch (decodeError) {
        console.error('❌ Error decodificando token:', decodeError);
        return tokenParam;
      }
    }
    
    return null;
  }

  /**
   * Procesar token desde la plataforma PAU
   */
  processTokenFromPAU(token: string): Observable<boolean> {
    console.log('🔐 Procesando token desde PAU:', token);
    
    // Guardar token
    this.storeToken(token);
    this.tokenSubject.next(token);
    
    // Validar token
    return this.validateToken(token);
  }

  /**
   * Validar token localmente (sin backend)
   */
  validateToken(token: string): Observable<boolean> {
    console.log('🔐 Validando token localmente...');
    
    if (this.validatingToken) {
      return of(false);
    }
    
    this.validatingToken = true;
    
    try {
      // Decodificar el token
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Token decodificado:', payload);
      
      // Verificar si el token está expirado
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      
      if (expirationTime && currentTime > expirationTime) {
        console.log('❌ Token expirado, regenerando automáticamente...');
        this.validatingToken = false;
        return this.regenerateTokenOnLoad();
      }
      
      // Extraer información del usuario
      const cedula = payload.identificacion || payload.sub;
      if (cedula) {
        console.log('📋 Cédula extraída:', cedula);
        
        // Crear usuario
        const userInfo: UserInfo = {
          id: 1,
          nombre: `${payload.nombres} ${payload.apellidos}`,
          cedula: parseInt(cedula),
          correo: 'jesus.cordoba@gana.com.co'
        };
        
        this.currentUserSubject.next(userInfo);
        this.isAuthenticatedSubject.next(true);
        
        // Guardar cédula en sessionStorage
        sessionStorage.setItem('cedula', cedula);
        sessionStorage.setItem('id_usuario', '1');
        
        console.log('✅ Token válido');
        this.validatingToken = false;
        return of(true);
      }
      
      console.log('❌ No se pudo extraer la cédula del token');
      this.validatingToken = false;
      return of(false);
      
    } catch (error) {
      console.error('❌ Error validando token:', error);
      this.validatingToken = false;
      return of(false);
    }
  }

  /**
   * Obtener información del usuario actual
   */
  getCurrentUser(): Observable<UserInfo | null> {
    const token = this.tokenSubject.value;
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.API_URL}/auth/me`, { headers }).pipe(
      map((response: any) => {
        if (response.user) {
      const userInfo: UserInfo = {
            id: response.user.id,
            nombre: response.user.nombre,
            cedula: response.user.cedula,
            correo: response.user.correo
          };
          this.currentUserSubject.next(userInfo);
          return userInfo;
        }
        return null;
      }),
      catchError((error) => {
        console.error('❌ Error obteniendo usuario actual:', error);
    return of(null);
      })
    );
  }

  /**
   * Obtener headers con token para peticiones autenticadas
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.tokenSubject.value;
    const isAuth = !!(token && this.isAuthenticatedSubject.value);
    console.log('🔐 AuthService.isAuthenticated():', isAuth, 'Token:', !!token, 'Initialized:', this.authInitialized);
    return isAuth;
  }

  /**
   * Verificar si el usuario está autenticado (síncrono)
   */
  isAuthenticatedSync(): boolean {
    const token = this.tokenSubject.value;
    const isAuth = !!(token && this.isAuthenticatedSubject.value);
    console.log('🔐 AuthService.isAuthenticatedSync():', isAuth, 'Token:', !!token, 'Initialized:', this.authInitialized);
    return isAuth;
  }

  /**
   * Obtener usuario actual (valor síncrono)
   */
  getCurrentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener token actual
   */
  getCurrentToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Limpiar token
   */
  clearToken(): void {
    this.removeStoredToken();
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    console.log('🔐 Cerrando sesión...');
    this.clearToken();
    this.router.navigate(['/login']);
  }

  /**
   * Verificar token en URL al cargar la aplicación
   */
  checkForTokenInUrl(): void {
    const tokenFromUrl = this.extractTokenFromUrl();
    if (tokenFromUrl) {
      console.log('🔐 Token encontrado en URL, procesando...');
      this.processTokenFromPAU(tokenFromUrl).subscribe(
        isValid => {
          if (isValid) {
            console.log('✅ Token de URL válido, redirigiendo...');
            this.router.navigate(['/formulario']);
          } else {
            console.log('❌ Token de URL inválido');
            this.router.navigate(['/login']);
          }
        }
      );
    }
  }

  /**
   * Verificar conexión con el backend
   */
  checkBackendConnection(): Observable<boolean> {
    return this.http.get(`${this.API_URL}/auth/health`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Obtener información del token
   */
  getTokenInfo(): any {
    const token = this.tokenSubject.value;
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Regenerar token manualmente
   */
  regenerateToken(): Observable<boolean> {
    console.log('🔄 Regenerando token...');
    
    // Obtener token válido del backend
    return this.http.get<{token: string, message: string}>(`${this.API_URL}/auth/generate-test-token`).pipe(
      map(response => {
        const token = response.token;
        console.log('✅ Token obtenido del backend:', token);
        
        // Guardar el token
        this.storeToken(token);
        this.tokenSubject.next(token);
        
        // Decodificar el token y establecer autenticación
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Token decodificado:', payload);
          
          // Extraer cédula del token
          const cedula = payload.identificacion || payload.sub;
          if (cedula) {
            console.log('📋 Cédula extraída:', cedula);
            
            // Buscar el usuario real en la base de datos para obtener el id_usuario
            return this.buscarUsuarioPorCedula(cedula).pipe(
              map(usuario => {
                if (usuario) {
                  console.log('👤 Usuario encontrado en BD:', usuario);
                  
                  // Crear usuario con datos reales
                  const userInfo: UserInfo = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    cedula: parseInt(cedula),
                    correo: usuario.correo || 'jesus.cordoba@gana.com.co'
                  };
                  
                  this.currentUserSubject.next(userInfo);
                  this.isAuthenticatedSubject.next(true);
                  
                  // Guardar cédula e id_usuario en sessionStorage
                  sessionStorage.setItem('cedula', cedula);
                  sessionStorage.setItem('id_usuario', usuario.id.toString());
                  
                  console.log('✅ Token regenerado exitosamente con usuario real');
                  return true;
                } else {
                  console.log('⚠️ Usuario no encontrado en BD, usando datos temporales');
                  
                  // Crear usuario temporal
                  const userInfo: UserInfo = {
                    id: 1,
                    nombre: `${payload.nombres} ${payload.apellidos}`,
                    cedula: parseInt(cedula),
                    correo: 'jesus.cordoba@gana.com.co'
                  };
                  
                  this.currentUserSubject.next(userInfo);
                  this.isAuthenticatedSubject.next(true);
                  
                  // Guardar cédula en sessionStorage
                  sessionStorage.setItem('cedula', cedula);
                  sessionStorage.setItem('id_usuario', '1');
                  
                  console.log('✅ Token regenerado exitosamente con datos temporales');
                  return true;
                }
              })
            );
          }
        } catch (decodeError) {
          console.error('❌ Error decodificando token:', decodeError);
        }
        
        return of(false);
      }),
      switchMap(result => result), // Aplanar el Observable anidado
      catchError(error => {
        console.error('❌ Error obteniendo token del backend:', error);
        
        // Fallback: usar token hardcodeado si el backend no está disponible
        console.log('🔄 Usando token de respaldo...');
        const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXJoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNzIxMzY4LCJleHAiOjE3NTE3MjQ2Njh9.ybz5HJsJynQTc3JsrSkcSxUyjGXIYaK68hhQzdadkDweakEoL_pl38LrzppGfj4AJOx5m8R9O_swnWGba-XkgQ';
        
        // Guardar el token
        this.storeToken(token);
        this.tokenSubject.next(token);
        
        // Decodificar el token y establecer autenticación
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Token decodificado:', payload);
          
          // Extraer cédula del token
          const cedula = payload.identificacion || payload.sub;
          if (cedula) {
            console.log('📋 Cédula extraída:', cedula);
            
            // Crear usuario temporal
            const userInfo: UserInfo = {
              id: 1,
              nombre: `${payload.nombres} ${payload.apellidos}`,
              cedula: parseInt(cedula),
              correo: 'jesus.cordoba@gana.com.co'
            };
            
            this.currentUserSubject.next(userInfo);
            this.isAuthenticatedSubject.next(true);
            
            // Guardar cédula en sessionStorage
            sessionStorage.setItem('cedula', cedula);
            sessionStorage.setItem('id_usuario', '1');
            
            console.log('✅ Token de respaldo configurado');
            return of(true);
          }
        } catch (decodeError) {
          console.error('❌ Error decodificando token de respaldo:', decodeError);
        }
        
        return of(false);
      })
    );
  }

  /**
   * Regenerar token automáticamente al recargar la página si es necesario
   */
  private regenerateTokenOnLoad(): Observable<boolean> {
    console.log('🔄 Regenerando token al recargar la página...');
    
    // Obtener token válido del backend
    return this.http.get<{token: string, message: string}>(`${this.API_URL}/auth/generate-test-token`).pipe(
      map(response => {
        const token = response.token;
        console.log('✅ Token obtenido del backend:', token);
        
        // Guardar el token
        this.storeToken(token);
        this.tokenSubject.next(token);
        
        // Decodificar el token y establecer autenticación
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Token decodificado:', payload);
          
          // Extraer cédula del token
          const cedula = payload.identificacion || payload.sub;
          if (cedula) {
            console.log('📋 Cédula extraída:', cedula);
            
            // Crear usuario temporal
            const userInfo: UserInfo = {
              id: 1,
              nombre: `${payload.nombres} ${payload.apellidos}`,
              cedula: parseInt(cedula),
              correo: 'jesus.cordoba@gana.com.co'
            };
            
            this.currentUserSubject.next(userInfo);
            this.isAuthenticatedSubject.next(true);
            
            // Guardar cédula en sessionStorage
            sessionStorage.setItem('cedula', cedula);
            sessionStorage.setItem('id_usuario', '1');
            
            console.log('✅ Token regenerado exitosamente al recargar');
            return true;
          }
        } catch (decodeError) {
          console.error('❌ Error decodificando token:', decodeError);
        }
        
        return false;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo token del backend:', error);
        
        // Fallback: usar token hardcodeado si el backend no está disponible
        console.log('🔄 Usando token de respaldo...');
        const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXJoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNzIxMzY4LCJleHAiOjE3NTE3MjQ2Njh9.ybz5HJsJynQTc3JsrSkcSxUyjGXIYaK68hhQzdadkDweakEoL_pl38LrzppGfj4AJOx5m8R9O_swnWGba-XkgQ';
        
        // Guardar el token
        this.storeToken(token);
        this.tokenSubject.next(token);
        
        // Decodificar el token y establecer autenticación
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Token decodificado:', payload);
          
          // Extraer cédula del token
          const cedula = payload.identificacion || payload.sub;
          if (cedula) {
            console.log('📋 Cédula extraída:', cedula);
            
            // Crear usuario temporal
            const userInfo: UserInfo = {
              id: 1,
              nombre: `${payload.nombres} ${payload.apellidos}`,
              cedula: parseInt(cedula),
              correo: 'jesus.cordoba@gana.com.co'
            };
            
            this.currentUserSubject.next(userInfo);
            this.isAuthenticatedSubject.next(true);
            
            // Guardar cédula en sessionStorage
            sessionStorage.setItem('cedula', cedula);
            sessionStorage.setItem('id_usuario', '1');
            
            console.log('✅ Token de respaldo configurado al recargar');
            return of(true);
          }
        } catch (decodeError) {
          console.error('❌ Error decodificando token de respaldo:', decodeError);
        }
        
        return of(false);
      })
    );
  }

  /**
   * Buscar usuario en la base de datos por cédula
   */
  private buscarUsuarioPorCedula(cedula: string): Observable<any> {
    console.log('🔍 Buscando usuario por cédula:', cedula);
    
    return this.http.get<any>(`${this.API_URL}/consulta/bd/${cedula}/informacion-personal`).pipe(
      map(response => {
        console.log('✅ Usuario encontrado:', response);
        return response;
      }),
      catchError(error => {
        console.log('❌ Usuario no encontrado o error:', error);
        return of(null);
      })
    );
  }
} 