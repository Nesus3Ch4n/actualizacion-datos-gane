import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
          console.log('🔒 Token expirado o inválido, cerrando sesión...');
          this.authService.logout();
        }
        
        return throwError(() => error);
      })
    );
  }
} 