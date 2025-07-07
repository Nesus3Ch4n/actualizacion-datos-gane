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
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token directamente del localStorage para evitar dependencia circular
    const token = localStorage.getItem('jwt_token');
    
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
          console.log('🔒 Token expirado o inválido, pero permitiendo continuar...');
          
          // Verificar si ya estamos intentando regenerar para evitar bucles
          if (request.url.includes('/regenerate-token')) {
            console.log('❌ Ya estamos en proceso de regeneración, permitiendo continuar...');
            return throwError(() => error);
          }
          
          // Verificar si el error es por usuario no encontrado
          try {
            const errorBody = error.error;
            if (errorBody && errorBody.error && errorBody.error.includes('Usuario no encontrado')) {
              console.log('ℹ️ Usuario no encontrado en la base de datos, permitiendo crear nuevo registro...');
              return throwError(() => error);
            }
          } catch (e) {
            // Si no se puede parsear el error, continuar
          }
          
          // Para endpoints de creación de usuarios, permitir continuar sin token
          if (request.url.includes('/crear-completo') || 
              request.url.includes('/crear') || 
              request.url.includes('/consulta/bd/usuarios')) {
            console.log('ℹ️ Endpoint de creación/consulta, permitiendo continuar sin token...');
            return throwError(() => error);
          }
          
          // En lugar de cerrar sesión, simplemente permitir que el error se maneje
          // en el componente correspondiente
          console.log('ℹ️ Token inválido, pero permitiendo continuar sin recargar...');
          return throwError(() => error);
        }
        
        // Para otros errores, también permitir continuar sin recargar
        if (error.status === 0) {
          console.log('ℹ️ Error de conexión, permitiendo continuar en modo sin conexión...');
        }
        
        return throwError(() => error);
      })
    );
  }
} 