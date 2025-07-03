import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeclaracionConflictoService {
  
  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Guardar declaraciones de conflicto de un usuario específico
   */
  async guardarDeclaracionesConflicto(idUsuario: number, declaraciones: any[]): Promise<any> {
    try {
      console.log('💾 Guardando declaraciones de conflicto en base de datos:', declaraciones);
      console.log('👤 Usuario ID:', idUsuario);

      // Preparar datos para el backend - SOLO campos que existen en la tabla RELACION_CONF
      const declaracionesData = declaraciones.map(declaracion => ({
        nombre: declaracion.nombre,                           // Se mapea a nombreCompleto en el backend
        parentesco: declaracion.parentesco,                   // Se mapea a parentesco en el backend
        tipoParteInteresada: declaracion.tipoParteInteresada  // Se mapea a tipoParteAsoc en el backend
      }));

      console.log('📤 Datos formateados para el backend:', declaracionesData);

      // Guardar en el backend usando el endpoint directo
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/declaraciones-conflicto/usuario/${idUsuario}`, 
          declaracionesData,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error: any) => {
            console.error('❌ Error HTTP en declaraciones de conflicto:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Declaraciones guardadas exitosamente en base de datos:', response);
      
      if (response.success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          'Declaraciones de conflicto guardadas exitosamente en la base de datos'
        );
        
        return response; // Retorna la respuesta completa
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar declaraciones de conflicto:', error);
      
      let errorMessage = 'No se pudieron guardar las declaraciones de conflicto';
      if (error instanceof Error) {
        errorMessage += ': ' + error.message;
      }
      
      this.notificationService.showError(
        '❌ Error',
        errorMessage
      );
      
      throw error;
    }
  }

  /**
   * Obtener declaraciones de conflicto de un usuario específico
   */
  async obtenerDeclaracionesPorUsuario(idUsuario: number): Promise<any[]> {
    try {
      console.log('📋 Obteniendo declaraciones de conflicto para usuario ID:', idUsuario);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<{success: boolean, declaraciones: any[], cantidad: number, message?: string}>(
          `${this.backendService.getApiUrl()}/declaraciones-conflicto/usuario/${idUsuario}`,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error: any) => {
            console.error('❌ Error HTTP al obtener declaraciones de conflicto:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Declaraciones obtenidas exitosamente:', response);
      
      if (response.success) {
        return response.declaraciones || [];
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al obtener declaraciones de conflicto:', error);
      return []; // Retorna array vacío si no hay declaraciones
    }
  }

  /**
   * Verificar conexión con el backend
   */
  async verificarConexion(): Promise<boolean> {
    return await this.backendService.verificarConexion();
  }
} 