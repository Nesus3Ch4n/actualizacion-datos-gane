import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService
  ) {}

  /**
   * Convertir formato de fecha a YYYY-MM-DD
   */
  private convertirFormatoFecha(fecha: string): string {
    if (!fecha) return '';
    
    // Si ya está en formato YYYY-MM-DD, retornarlo tal como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }
    
    // Si está en formato MM/DD/YYYY, convertirlo a YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const partes = fecha.split('/');
      const mes = partes[0].padStart(2, '0');
      const dia = partes[1].padStart(2, '0');
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    }
    
    // Si está en formato DD/MM/YYYY, convertirlo a YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const partes = fecha.split('/');
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    }
    
    // Si no se puede convertir, retornar la fecha original
    console.warn(`⚠️ No se pudo convertir el formato de fecha: ${fecha}`);
    return fecha;
  }

  /**
   * Guardar información personal del usuario
   */
  async guardarInformacionPersonal(informacionPersonal: any): Promise<any> {
    try {
      // Preparar datos para el backend
      const usuarioData = {
        nombre: informacionPersonal.nombre,
        cedula: informacionPersonal.cedula,
        correo: informacionPersonal.correo,
        telefono: informacionPersonal.numeroCelular || informacionPersonal.numeroFijo || informacionPersonal.numeroCorp,
        ciudad: informacionPersonal.ciudadNacimiento,
        pais: informacionPersonal.paisNacimiento,
        fechaNacimiento: this.convertirFormatoFecha(informacionPersonal.fechaNacimiento),
        estadoCivil: informacionPersonal.estadoCivil,
        tipoSangre: informacionPersonal.tipoSangre,
        cargo: informacionPersonal.cargo,
        area: informacionPersonal.area,
        cedulaExpedicion: informacionPersonal.cedulaExpedicion,
        numeroFijo: informacionPersonal.numeroFijo,
        numeroCorp: informacionPersonal.numeroCorp,
        activo: true
      };

      // Guardar en el backend
      const resultado = await firstValueFrom(this.backendService.crearUsuario(usuarioData));
      
      this.notificationService.showSuccess(
        'Éxito',
        'Información personal guardada exitosamente en la base de datos'
      );
      
      return resultado;

    } catch (error) {
      console.error('❌ Error al guardar información personal:', error);
      
      this.notificationService.showError(
        'Error',
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