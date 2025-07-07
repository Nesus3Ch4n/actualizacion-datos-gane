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
export class ContactoEmergenciaService {
  
  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Guardar contactos de emergencia de un usuario específico
   */
  async guardarContactosEmergencia(idUsuario: number, contactos: any[]): Promise<any> {
    try {
      console.log('💾 Guardando contactos de emergencia en base de datos:', contactos);
      console.log('👤 Usuario ID:', idUsuario);

      // Preparar datos para el backend - SOLO campos que existen en la tabla CONTACTO
      const contactosData = contactos.map(contacto => ({
        nombre: contacto.nombre,           // Se mapea a nombreCompleto en el backend
        parentesco: contacto.parentesco,   // Se mapea a parentesco en el backend
        telefono: contacto.telefono        // Se mapea a numeroCelular en el backend
      }));

      console.log('📤 Datos formateados para el backend:', contactosData);

      // Guardar en el backend usando el endpoint directo
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/contactos-emergencia/usuario/${idUsuario}`, 
          contactosData,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Contactos guardados exitosamente:', response);
      
      if (response.success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          response.message || 'Contactos de emergencia guardados exitosamente'
        );
        
        return response; // Retorna la respuesta completa
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar contactos de emergencia:', error);
      
      let errorMessage = 'No se pudieron guardar los contactos de emergencia';
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
   * Obtener contactos de emergencia de un usuario específico
   */
  async obtenerContactosPorUsuario(idUsuario: number): Promise<any[]> {
    try {
      console.log('📋 Obteniendo contactos de emergencia para usuario ID:', idUsuario);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<{success: boolean, data: any[], message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/contacto-emergencia/obtener?idUsuario=${idUsuario}`,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Contactos obtenidos exitosamente:', response);
      
      if (response.success) {
        return response.data || [];
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al obtener contactos de emergencia:', error);
      
      // No mostrar error si no hay contactos (es normal)
      if (error instanceof Error && error.message.includes('404')) {
        return [];
      }
      
      return []; // Retorna lista vacía si no hay contactos
    }
  }

  /**
   * Verificar conexión con el backend
   */
  async verificarConexion(): Promise<boolean> {
    return await this.backendService.verificarConexion();
  }
} 