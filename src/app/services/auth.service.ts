import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  private readonly API_URL = 'http://localhost:8080/api';
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
    console.log('🔄 Inicializando autenticación...');
    
    // Verificar si hay un token almacenado
    const storedToken = this.getStoredToken();
    if (storedToken) {
      console.log('🔐 Token encontrado en localStorage, validando...');
      this.validateToken(storedToken).subscribe(
        isValid => {
          if (isValid) {
            console.log('✅ Token válido, usuario autenticado');
            this.tokenSubject.next(storedToken);
            this.isAuthenticatedSubject.next(true);
            this.authInitialized = true;
          } else {
            console.log('❌ Token inválido, limpiando...');
            this.clearToken();
          }
        },
        error => {
          console.error('❌ Error validando token:', error);
          this.clearToken();
        }
      );
    } else {
      console.log('🔐 No hay token almacenado');
      this.authInitialized = true;
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
   * Validar token con el backend
   */
  validateToken(token: string): Observable<boolean> {
    console.log('🔐 Validando token con backend...');
    
    if (this.validatingToken) {
      return of(false);
    }
    
    this.validatingToken = true;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.API_URL}/auth/validate`, {}, { headers }).pipe(
      map((response: any) => {
        console.log('✅ Token válido:', response);
        this.validatingToken = false;
        this.isAuthenticatedSubject.next(true);
        
        // Extraer información del usuario del token
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
        
        return true;
      }),
      catchError((error) => {
        console.error('❌ Error validando token:', error);
        this.validatingToken = false;
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
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
} 