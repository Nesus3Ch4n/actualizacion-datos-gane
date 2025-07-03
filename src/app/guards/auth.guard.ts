import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take, timeout, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('🔒 AuthGuard: Verificando autenticación...');
    
    // Primero verificar de forma síncrona
    const isAuthSync = this.authService.isAuthenticatedSync();
    console.log('🔒 AuthGuard: Verificación síncrona:', isAuthSync);
    
    if (isAuthSync) {
      console.log('✅ AuthGuard: Acceso permitido (síncrono)');
      return true;
    }
    
    // Si no está autenticado síncronamente, esperar a que se complete la inicialización
    console.log('🔒 AuthGuard: Esperando inicialización de autenticación...');
    return this.authService.isAuthenticated$.pipe(
      timeout(2000), // Esperar máximo 2 segundos
      take(1), // Tomar solo el primer valor
      map(isAuthenticated => {
        console.log('🔒 AuthGuard: Estado de autenticación (observable):', isAuthenticated);
        
        if (isAuthenticated) {
          console.log('✅ AuthGuard: Acceso permitido');
          return true;
        } else {
          console.log('❌ AuthGuard: Acceso denegado, redirigiendo a welcome...');
          return this.router.createUrlTree(['/welcome']);
        }
      }),
      catchError(error => {
        console.warn('⚠️ AuthGuard: Timeout o error en autenticación:', error);
        // En caso de timeout, verificar una vez más de forma síncrona
        const finalCheck = this.authService.isAuthenticatedSync();
        console.log('🔒 AuthGuard: Verificación final:', finalCheck);
        
        if (finalCheck) {
          return of(true);
        } else {
          return of(this.router.createUrlTree(['/welcome']));
        }
      })
    );
  }

  // Método para verificar si ya estamos autenticados (para evitar verificaciones innecesarias)
  private isAlreadyAuthenticated(): boolean {
    return this.authService.isAuthenticatedSync();
  }

  // Método para verificar si la ruta actual es parte del formulario
  private isFormRoute(): boolean {
    const currentUrl = this.router.url;
    const formRoutes = ['/personal', '/academico', '/vehiculo', '/vivienda', '/personas-acargo', '/contacto', '/declaracion'];
    return formRoutes.some(route => currentUrl.includes(route));
  }
} 