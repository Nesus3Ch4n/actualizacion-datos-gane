import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  userId?: number;
  userData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private authService: AuthService,
    private backendService: BackendService,
    private notificationService: NotificationService
  ) {}

  /**
   * Validar autenticación y obtener ID de usuario antes de actualizar
   */
  validateBeforeUpdate(cedula: string): Observable<ValidationResult> {
    
    return this.validateAuthentication().pipe(
      switchMap(authResult => {
        if (!authResult.isValid) {
          return of(authResult);
        }
        // Buscar usuario por cédula y devolver el id_usuario
        return this.backendService.obtenerUsuarioPorCedula(cedula).pipe(
          map(response => {
            if (response && response.idUsuario) {
              // Guardar el id_usuario en sessionStorage para uso global
              sessionStorage.setItem('id_usuario', response.idUsuario.toString());
              return {
                isValid: true,
                message: 'Usuario encontrado',
                userId: response.idUsuario,
                userData: response
              };
            } else {
              this.notificationService.showWarning('Usuario No Encontrado', 'Usuario no encontrado. Se creará un nuevo registro.');
              return {
                isValid: false,
                message: 'Usuario no encontrado en la base de datos'
              };
            }
          }),
          catchError(error => {
            if (error.status === 404) {
              this.notificationService.showWarning('Usuario No Encontrado', 'Usuario no encontrado. Se creará un nuevo registro.');
              return of({
                isValid: false,
                message: 'Usuario no encontrado en la base de datos'
              });
            }
            this.notificationService.showError('Error de Verificación', 'Error al verificar el usuario. Por favor, intenta nuevamente.');
            return of({
              isValid: false,
              message: 'Error al verificar el usuario: ' + error.message
            });
          })
        );
      }),
      catchError(error => {
        return of({
          isValid: false,
          message: 'Error durante la validación: ' + error.message
        });
      })
    );
  }

  /**
   * Validar que el usuario esté autenticado
   */
  private validateAuthentication(): Observable<ValidationResult> {
    const token = this.authService.getCurrentToken();
    if (!token) {
      this.notificationService.showError('Error de Autenticación', 'No estás autenticado. Por favor, inicia sesión.');
      return of({
        isValid: false,
        message: 'No hay token de autenticación'
      });
    }
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('Sesión Expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return of({
        isValid: false,
        message: 'Usuario no autenticado'
      });
    }
    return of({
      isValid: true,
      message: 'Usuario autenticado'
    });
  }

  /**
   * Obtener ID de usuario actual (desde sessionStorage)
   */
  getCurrentUserId(): number | null {
    const storedUserId = sessionStorage.getItem('id_usuario');
    if (storedUserId) {
      return parseInt(storedUserId);
    }
    return null;
  }

  /**
   * Validar datos del formulario antes de enviar
   */
  validateFormData(formData: any): ValidationResult {
    
    // Validar que existan datos básicos
    if (!formData || !formData.informacionPersonal) {
      return {
        isValid: false,
        message: 'Datos del formulario incompletos'
      };
    }

    const personalInfo = formData.informacionPersonal;
    
    // Validar campos obligatorios
    if (!personalInfo.cedula) {
      return {
        isValid: false,
        message: 'La cédula es obligatoria'
      };
    }

    if (!personalInfo.nombre) {
      return {
        isValid: false,
        message: 'El nombre es obligatorio'
      };
    }

    if (!personalInfo.correo) {
      return {
        isValid: false,
        message: 'El correo electrónico es obligatorio'
      };
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.correo)) {
      return {
        isValid: false,
        message: 'El formato del correo electrónico no es válido'
      };
    }

    return {
      isValid: true,
      message: 'Datos del formulario válidos'
    };
  }

  /**
   * Verificar si el backend está disponible
   */
  validateBackendConnection(): Observable<boolean> {
    // Convertir la Promise a Observable
    return from(this.backendService.verificarConexion()).pipe(
      map(isConnected => {
        if (!isConnected) {
          this.notificationService.showError('Error de Conexión', 'No se puede conectar al servidor. Verifica tu conexión.');
        }
        return isConnected;
      }),
      catchError(() => {
        this.notificationService.showError('Error de Conexión', 'Error de conexión con el servidor.');
        return of(false);
      })
    );
  }

  /**
   * Validación completa antes de guardar formulario
   */
  validateCompleteForm(formData: any): Observable<ValidationResult> {
    
    // Primero validar datos del formulario
    const formValidation = this.validateFormData(formData);
    if (!formValidation.isValid) {
      this.notificationService.showError('Error de Validación', formValidation.message);
      return of(formValidation);
    }

    // Luego validar conexión con backend
    return this.validateBackendConnection().pipe(
      switchMap(isConnected => {
        if (!isConnected) {
          return of({
            isValid: false,
            message: 'No se puede conectar al servidor'
          });
        }

        // Finalmente validar autenticación y obtener ID de usuario
        const cedula = formData.informacionPersonal.cedula;
        return this.validateBeforeUpdate(cedula);
      })
    );
  }
} 