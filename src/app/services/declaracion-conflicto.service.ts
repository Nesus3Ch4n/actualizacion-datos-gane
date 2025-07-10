import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { AutoSaveService } from './auto-save.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeclaracionConflictoService {
  
  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private autoSaveService: AutoSaveService
  ) {}

  /**
   * Guardar declaraciones de conflicto de un usuario específico
   */
  async guardarDeclaracionesConflicto(idUsuario: number, declaraciones: any[]): Promise<any> {
    try {
      console.log('💾 Guardando declaraciones de conflicto usando AutoSaveService:', declaraciones);
      console.log('👤 Usuario ID:', idUsuario);

      // Preparar datos para el auto-guardado
      const declaracionesData = {
        tieneConflicto: declaraciones.length > 0,
        personas: declaraciones.map(declaracion => ({
          nombre: declaracion.nombre,
          parentesco: declaracion.parentesco,
          tipoParteInteresada: declaracion.tipoParteInteresada
        }))
      };

      console.log('📤 Datos formateados para AutoSaveService:', declaracionesData);

      // Usar el servicio de auto-guardado para guardar con detección de cambios
      const success = await this.autoSaveService.saveStepData('declaracion', declaracionesData, true);
      
      if (success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          'Declaraciones de conflicto guardadas exitosamente usando actualización inteligente'
        );
        
        return { success: true, data: declaracionesData };
      } else {
        throw new Error('No se pudo guardar la información de declaraciones de conflicto');
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
          `${this.backendService.getApiUrl()}/consulta/relaciones-conflicto-id/${idUsuario}`,
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