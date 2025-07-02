import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InformacionPersonalService {

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService
  ) {}

  /**
   * Convertir fecha de formato MM/DD/YYYY a YYYY-MM-DD
   */
  private convertirFormatoFecha(fecha: string): string {
    if (!fecha) return '';
    
    // Si ya está en formato YYYY-MM-DD, retornar como está
    if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fecha;
    }
    
    // Si está en formato MM/DD/YYYY, convertir a YYYY-MM-DD
    if (fecha.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const partes = fecha.split('/');
      const mes = partes[0].padStart(2, '0');
      const dia = partes[1].padStart(2, '0');
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    }
    
    // Si no reconoce el formato, retornar la fecha original
    return fecha;
  }

  /**
   * Guardar información personal del usuario en la base de datos
   */
  async guardarInformacionPersonal(informacionPersonal: any): Promise<any> {
    try {
      console.log('💾 Guardando información personal en base de datos:', informacionPersonal);

      // Preparar datos para el backend
      const usuarioData = {
        nombre: informacionPersonal.nombre,
        cedula: informacionPersonal.cedula,
        correo: informacionPersonal.correo,
        numeroFijo: informacionPersonal.numeroFijo || null,
        numeroCelular: informacionPersonal.numeroCelular || null,
        numeroCorp: informacionPersonal.numeroCorp || null,
        cedulaExpedicion: informacionPersonal.cedulaExpedicion,
        paisNacimiento: informacionPersonal.paisNacimiento,
        ciudadNacimiento: informacionPersonal.ciudadNacimiento,
        fechaNacimiento: this.convertirFormatoFecha(informacionPersonal.fechaNacimiento),
        estadoCivil: informacionPersonal.estadoCivil,
        tipoSangre: informacionPersonal.tipoSangre,
        cargo: informacionPersonal.cargo,
        area: informacionPersonal.area
      };

      console.log('📤 Datos formateados para el backend:', usuarioData);

      // Guardar en el backend usando el nuevo endpoint directo
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/informacion-personal/guardar`, 
          usuarioData,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res)
        )
      );
      
      console.log('✅ Usuario guardado exitosamente en base de datos:', response);
      
      if (response.success) {
        this.notificationService.showSuccess(
          '✅ Éxito',
          'Información personal guardada exitosamente en la base de datos'
        );
        
        return response.data; // Retorna los datos del usuario incluido el ID
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar información personal:', error);
      
      this.notificationService.showError(
        '❌ Error',
        'No se pudo guardar la información: ' + (error as Error).message
      );
      
      throw error;
    }
  }

  /**
   * Verificar conexión con el backend
   */
  async verificarConexion(): Promise<boolean> {
    return await this.backendService.verificarConexion();
  }
} 