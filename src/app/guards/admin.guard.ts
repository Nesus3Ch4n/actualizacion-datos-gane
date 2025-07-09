import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, timeout, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('🔒 AdminGuard: Verificando acceso de administrador...');
    
    // Obtener la cédula del usuario actual
    const currentUser = this.authService.getCurrentUserValue();
    const tokenInfo = this.authService.getTokenInfo();
    
    let cedula: string | null = null;
    
    if (currentUser && currentUser.cedula) {
      cedula = currentUser.cedula.toString();
    } else if (tokenInfo && tokenInfo.identificacion) {
      cedula = tokenInfo.identificacion;
    }
    
    if (!cedula) {
      console.log('❌ AdminGuard: No se pudo obtener la cédula del usuario');
      return of(this.router.createUrlTree(['/welcome']));
    }
    
    console.log('🔒 AdminGuard: Verificando acceso para cédula:', cedula);
    
    // Verificar si es administrador (cédula 1006101211)
    if (cedula === '1006101211') {
      console.log('✅ AdminGuard: Acceso permitido - Usuario es administrador principal');
      return of(true);
    }
    
    // Si no es administrador principal, verificar si existe en la tabla USUARIO
    return this.verificarUsuarioEnBD(cedula);
  }

  private verificarUsuarioEnBD(cedula: string): Observable<boolean | UrlTree> {
    console.log('🔍 AdminGuard: Verificando si la cédula', cedula, 'existe en la tabla USUARIO...');
    
    // Consultar si el usuario existe en la base de datos usando el endpoint de prueba
    return this.http.get<any>(`${environment.apiBaseUrl}/usuarios/cedula/${cedula}`).pipe(
      timeout(5000), // Timeout de 5 segundos
      map(response => {
        if (response && response.success && response.data) {
          console.log('✅ AdminGuard: Usuario encontrado en BD, acceso permitido');
          return true;
        } else {
          console.log('❌ AdminGuard: Usuario no encontrado en BD, acceso denegado');
          return this.router.createUrlTree(['/welcome']);
        }
      }),
      catchError(error => {
        console.error('❌ AdminGuard: Error verificando usuario en BD:', error);
        // Si hay error de conexión, permitir acceso temporalmente (para desarrollo)
        console.log('⚠️ AdminGuard: Error de conexión, permitiendo acceso temporal');
        return of(true);
      })
    );
  }
} 