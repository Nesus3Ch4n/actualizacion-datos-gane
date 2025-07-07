import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take, timeout, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
    
    // Verificar de forma síncrona primero
    const isAuthSync = this.authService.isAuthenticatedSync();
    console.log('🔒 AuthGuard: Verificación síncrona:', isAuthSync);
    
    if (isAuthSync) {
      console.log('✅ AuthGuard: Acceso permitido (síncrono)');
      return true;
    }
    
    // Si no está autenticado síncronamente, verificar si ya estamos en la ruta de bienvenida
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/welcome')) {
      console.log('ℹ️ AuthGuard: Ya estamos en la ruta de bienvenida, permitiendo acceso');
      return true;
    }
    
    // Si no está autenticado y no estamos en welcome, redirigir a welcome
    console.log('❌ AuthGuard: Acceso denegado, redirigiendo a welcome...');
    return this.router.createUrlTree(['/welcome']);
  }
} 