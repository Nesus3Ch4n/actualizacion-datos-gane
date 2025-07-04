import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token actual
    const token = this.authService.getCurrentToken();
    
    // Si hay token, agregarlo al header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuar con la petición
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 (Unauthorized)
        if (error.status === 401) {
          console.log('🔒 Token expirado o inválido, intentando regenerar...');
          
          // Verificar si ya estamos intentando regenerar para evitar bucles
          if (request.url.includes('/regenerate-token')) {
            console.log('❌ Ya estamos en proceso de regeneración, cerrando sesión...');
            this.authService.logout();
            return throwError(() => error);
          }
          
          // Verificar si el error es por usuario no encontrado
          try {
            const errorBody = error.error;
            if (errorBody && errorBody.error && errorBody.error.includes('Usuario no encontrado')) {
              console.log('❌ Usuario no encontrado en la base de datos, cerrando sesión...');
              this.authService.logout();
              return throwError(() => error);
            }
          } catch (e) {
            // Si no se puede parsear el error, continuar con regeneración
          }
          
          // Intentar regenerar el token automáticamente (modo demo)
          return this.authService.regenerateToken().pipe(
            switchMap((regenerated) => {
              if (regenerated) {
                console.log('✅ Token regenerado automáticamente, reintentando petición...');
                
                // Obtener el nuevo token
                const newToken = this.authService.getCurrentToken();
                
                // Clonar la petición original con el nuevo token
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                
                // Reintentar la petición con el nuevo token
                return next.handle(newRequest);
              } else {
                console.log('❌ No se pudo regenerar el token, cerrando sesión...');
                this.authService.logout();
                return throwError(() => error);
              }
            }),
            catchError((regenerateError) => {
              console.log('❌ Error regenerando token, cerrando sesión...');
              this.authService.logout();
              return throwError(() => error);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }
} 