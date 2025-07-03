import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudioAcademicoService {

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Guardar estudios académicos del usuario en la base de datos
   */
  async guardarEstudiosAcademicos(idUsuario: number, estudios: any[]): Promise<any> {
    try {
      console.log('🎓 Guardando estudios académicos en base de datos:', estudios);

      // Guardar en el backend usando el endpoint del FormularioController
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/academico/guardar?idUsuario=${idUsuario}`, 
          estudios,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Estudios académicos guardados exitosamente:', response);
      
      if (response.success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          response.message || 'Estudios académicos guardados exitosamente'
        );
        
        return response.data; // Retorna los estudios guardados
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar estudios académicos:', error);
      
      this.notificationService.showError(
        '❌ Error',
        'No se pudieron guardar los estudios: ' + (error as Error).message
      );
      
      throw error;
    }
  }

  /**
   * Obtener estudios académicos del usuario desde la base de datos
   */
  async obtenerEstudiosPorUsuario(idUsuario: number): Promise<any[]> {
    try {
      console.log('📋 Obteniendo estudios académicos para usuario ID:', idUsuario);

      // Obtener desde el backend usando el endpoint del FormularioController
      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<{success: boolean, data: any[], message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/academico/obtener?idUsuario=${idUsuario}`,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Estudios académicos obtenidos exitosamente:', response);
      
      if (response.success) {
        return response.data || []; // Retorna la lista de estudios
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al obtener estudios académicos:', error);
      
      // No mostrar error si no hay estudios (es normal)
      console.log('ℹ️ No se encontraron estudios académicos para el usuario');
      
      return []; // Retorna lista vacía si no hay estudios
    }
  }

  /**
   * Verificar conexión con el backend
   */
  async verificarConexion(): Promise<boolean> {
    return await this.backendService.verificarConexion();
  }
} 