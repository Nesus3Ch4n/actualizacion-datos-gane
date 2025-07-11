import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InformacionPersonalService {

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Guardar información personal del usuario en la base de datos
   */
  async guardarInformacionPersonal(idUsuario: number, informacion: any): Promise<any> {
    try {
      // Asegurar que la información tenga el ID del usuario
      const datosCompletos = {
        ...informacion,
        idUsuario: idUsuario
      };

      // Guardar en el backend usando el endpoint del FormularioController
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/informacion-personal/guardar`, 
          datosCompletos,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      if (response.success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          response.message || 'Información personal guardada exitosamente'
        );
        
        return response.data; // Retorna la información guardada
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar información personal:', error);
      
      this.notificationService.showError(
        '❌ Error',
        'No se pudo guardar la información personal: ' + (error as Error).message
      );
      
      throw error;
    }
  }

  /**
   * Obtener información personal del usuario desde la base de datos
   */
  async obtenerInformacionPorCedula(cedula: string): Promise<any> {
    try {
      // Obtener desde el backend usando el endpoint del ConsultaController
      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<any>(
          `${this.backendService.getApiUrl()}/consulta/bd/${cedula}/informacion-personal`,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      return response; // Retorna la información personal

    } catch (error) {
      console.error('❌ Error al obtener información personal:', error);
      
      return null; // Retorna null si no hay información
    }
  }

  /**
   * Verificar conexión con el backend
   */
  async verificarConexion(): Promise<boolean> {
    return await this.backendService.verificarConexion();
  }
} 