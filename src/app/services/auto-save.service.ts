import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { FormDataService } from './form-data.service';
import { NotificationService } from './notification.service';
import { BackendService } from './backend.service';
import { UsuarioSessionService } from './usuario-session.service';

export interface StepData {
  step: string;
  data: any;
  hasChanges: boolean;
  lastSaved?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private stepData$ = new BehaviorSubject<Map<string, StepData>>(new Map());
  private currentStep$ = new BehaviorSubject<string>('');

  constructor(
    private formDataService: FormDataService,
    private notificationService: NotificationService,
    private backendService: BackendService,
    private usuarioSessionService: UsuarioSessionService
  ) {}

  /**
   * Establecer el paso actual
   */
  setCurrentStep(step: string): void {
    this.currentStep$.next(step);
  }

  /**
   * Obtener el paso actual
   */
  getCurrentStep(): Observable<string> {
    return this.currentStep$.asObservable();
  }

  /**
   * Guardar datos de un paso específico
   */
  async saveStepData(step: string, data: any, forceSave: boolean = false): Promise<boolean> {
    try {
      console.log(`💾 AutoSave: Guardando paso ${step}...`);
      
      // Obtener datos anteriores del paso
      const previousData = this.getStepData(step);
      const hasChanges = forceSave || this.hasDataChanged(previousData?.data, data);
      
      if (!hasChanges && !forceSave) {
        console.log(`ℹ️ AutoSave: No hay cambios en paso ${step}, omitiendo guardado`);
        return true;
      }

      // Guardar datos según el tipo de paso
      const success = await this.saveStepDataToBackend(step, data);
      
      if (success) {
        // Actualizar el estado local
        this.updateStepData(step, {
          step,
          data: this.deepClone(data),
          hasChanges: false,
          lastSaved: new Date()
        });
        
        console.log(`✅ AutoSave: Paso ${step} guardado exitosamente`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ AutoSave: Error guardando paso ${step}:`, error);
      return false;
    }
  }

  /**
   * Guardar datos específicos según el tipo de paso
   */
  private async saveStepDataToBackend(step: string, data: any): Promise<boolean> {
    console.log(`🔄 AutoSave: Iniciando guardado para paso: ${step}`);
    
    // Para el paso 'personal', no necesitamos ID de usuario inicialmente
    if (step === 'personal') {
      console.log('👤 AutoSave: Guardando información personal (sin ID requerido)');
      return await this.savePersonalInfo(data);
    }
    
    // Para otros pasos, obtener el ID del usuario del UsuarioSessionService
    console.log('🔍 AutoSave: Buscando ID de usuario...');
    
    let userId = this.usuarioSessionService.getIdUsuarioActual();
    console.log('🔍 AutoSave: ID desde UsuarioSessionService:', userId);
    
    if (!userId) {
      // Backup: Intentar obtener del FormDataService
      const userIdString = this.formDataService.getCurrentUserIdValue();
      userId = userIdString ? parseInt(userIdString) : null;
      console.log('🔍 AutoSave: ID desde FormDataService (backup):', userId);
    }
    
    if (!userId) {
      // Backup: Intentar obtener del sessionStorage
      const userIdFromStorage = sessionStorage.getItem('id_usuario');
      userId = userIdFromStorage ? parseInt(userIdFromStorage) : null;
      console.log('🔍 AutoSave: ID desde sessionStorage (backup):', userId);
    }
    
    if (!userId) {
      console.error('❌ AutoSave: No hay usuario activo');
      this.notificationService.showError('Error', 'No hay usuario activo. Complete primero la información personal.');
      return false;
    }

    console.log(`✅ AutoSave: ID de usuario encontrado: ${userId} para paso: ${step}`);

    try {
      switch (step) {
        case 'academico':
          return await this.saveAcademicInfo(data, userId.toString());
          
        case 'vehiculo':
          return await this.saveVehicleInfo(data, userId.toString());
          
        case 'vivienda':
          return await this.saveHousingInfo(data, userId.toString());
          
        case 'personas-acargo':
          return await this.saveDependentsInfo(data, userId.toString());
          
        case 'contacto':
          return await this.saveContactInfo(data, userId.toString());
          
        case 'declaracion':
          return await this.saveDeclarationInfo(data, userId.toString());
          
        default:
          console.warn(`⚠️ AutoSave: Paso desconocido: ${step}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ AutoSave: Error en saveStepDataToBackend para paso ${step}:`, error);
      return false;
    }
  }

  /**
   * Guardar información personal
   */
  private async savePersonalInfo(data: any): Promise<boolean> {
    try {
      console.log('👤 AutoSave: Guardando información personal...');
      
      const mappedData = {
        documento: data.cedula,
        cedulaExpedicion: data.cedulaExpedicion,
        nombre: data.nombre,
        fechaNacimiento: data.fechaNacimiento,
        paisNacimiento: data.paisNacimiento,
        ciudadNacimiento: data.ciudadNacimiento,
        cargo: data.cargo,
        area: data.area,
        estadoCivil: data.estadoCivil,
        tipoSangre: data.tipoSangre,
        numeroCelular: data.numeroCelular,
        numeroFijo: data.numeroFijo,
        numeroCorp: data.numeroCorp,
        correo: data.correo
      };

      console.log('👤 AutoSave: Datos mapeados para backend:', mappedData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/informacion-personal/guardar`,
          mappedData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('👤 AutoSave: Respuesta del backend:', response);

      if (response.success) {
        console.log('👤 AutoSave: Respuesta exitosa, estableciendo usuario...');
        console.log('👤 AutoSave: response.data:', response.data);
        
        // Obtener el ID del usuario de la respuesta
        const userId = response.data?.idUsuario || response.data?.id;
        console.log('👤 AutoSave: ID extraído de la respuesta:', userId);
        
        if (userId) {
          // Crear objeto de usuario completo para UsuarioSessionService
          const usuarioCompleto = {
            idUsuario: userId,
            id: userId,
            cedula: data.cedula,
            documento: data.cedula,
            nombre: data.nombre,
            correo: data.correo,
            ...response.data
          };
          
          // Establecer el usuario en UsuarioSessionService (fuente principal)
          this.usuarioSessionService.setUsuarioActual(usuarioCompleto);
          
          // Backup: Establecer también en FormDataService para compatibilidad
          this.formDataService.setCurrentUserId(userId.toString());
          
          // Backup: Guardar también en sessionStorage para persistencia
          sessionStorage.setItem('id_usuario', userId.toString());
          
          console.log('✅ AutoSave: Usuario establecido en todos los servicios:', userId);
        } else {
          console.warn('⚠️ AutoSave: No se pudo obtener el ID del usuario de la respuesta');
          console.warn('⚠️ AutoSave: response.data.idUsuario:', response.data?.idUsuario);
          console.warn('⚠️ AutoSave: response.data.id:', response.data?.id);
        }
      } else {
        console.error('❌ AutoSave: Respuesta no exitosa:', response);
      }

      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información personal:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información académica
   */
  private async saveAcademicInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('📚 AutoSave: Preparando datos académicos:', data);
      
      // Filtrar estudios que no estén vacíos
      const estudiosValidos = data.estudios?.filter((estudio: any) => 
        estudio.institucion && estudio.titulo && estudio.nivelEducativo
      ) || [];

      console.log('📚 AutoSave: Estudios válidos encontrados:', estudiosValidos.length);

      const estudiosData = estudiosValidos.map((estudio: any) => {
        // Determinar el estado de graduación
        let graduacion = 'No Graduado';
        let semestre = null;
        
        if (estudio.graduado) {
          graduacion = 'Graduado';
        } else if (estudio.enCurso) {
          graduacion = 'En Curso';
          // Intentar convertir semestre a número
          if (estudio.semestre && estudio.semestre !== 'Graduado') {
            const semestreNum = parseInt(estudio.semestre);
            if (!isNaN(semestreNum)) {
              semestre = semestreNum;
            }
          }
        }
        
        // Asegurar que el semestre se envíe como número
        const semestreFinal = typeof estudio.semestre === 'number' ? estudio.semestre : semestre;
        
        return {
          nivelAcademico: estudio.nivelEducativo,
          programa: estudio.titulo,
          institucion: estudio.institucion,
          semestre: semestreFinal,
          graduacion: graduacion
        };
      });

      console.log('📚 AutoSave: Datos mapeados para backend:', estudiosData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/estudios/guardar?idUsuario=${userId}`,
          estudiosData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('📚 AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información académica:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información de vehículos
   */
  private async saveVehicleInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('🚗 AutoSave: Preparando datos de vehículos:', data);
      
      // Filtrar vehículos que no estén vacíos
      const vehiculosValidos = data.vehiculos?.filter((vehiculo: any) => 
        vehiculo.marca && vehiculo.placa
      ) || [];

      console.log('🚗 AutoSave: Vehículos válidos encontrados:', vehiculosValidos.length);

      const vehiculosData = vehiculosValidos.map((vehiculo: any) => ({
        tipoVehiculo: vehiculo.tipo || 'PARTICULAR',
        marca: vehiculo.marca,
        placa: vehiculo.placa,
        ano: vehiculo.anio || null,
        propietario: vehiculo.propietario || ''
      }));

      console.log('🚗 AutoSave: Datos mapeados para backend:', vehiculosData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/vehiculos/guardar?idUsuario=${userId}`,
          vehiculosData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('🚗 AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información de vehículos:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información de vivienda
   */
  private async saveHousingInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('🏠 AutoSave: Preparando datos de vivienda:', data);
      
      if (!data.direccion && !data.tipoVivienda) {
        console.log('🏠 AutoSave: No hay datos de vivienda, enviando objeto vacío');
        // Si no hay datos de vivienda, enviar objeto vacío para eliminar
        const response = await firstValueFrom(
          this.backendService.getHttpClient().post<any>(
            `${this.backendService.getApiUrl()}/formulario/vivienda/guardar?idUsuario=${userId}`,
            {},
            this.backendService.getHttpOptions()
          )
        );
        return response.success;
      }

      console.log('🏠 AutoSave: Datos recibidos del componente:', data);
      
      const viviendaData = {
        tipoVivienda: data.tipoVivienda,
        direccion: data.direccion,
        barrio: data.barrio || '',
        ciudad: data.ciudad || '',
        vivienda: data.vivienda || '',
        infoAdicional: data.infoAdicional || '',
        entidad: data.entidad || '',
        ano: data.ano || null,
        tipoAdquisicion: data.tipoAdquisicion || ''
      };

      console.log('🏠 AutoSave: Datos mapeados para backend:', viviendaData);
      console.log('🏠 AutoSave: tipoAdquisicion específico:', data.tipoAdquisicion);
      console.log('🏠 AutoSave: vivienda específico:', data.vivienda);
      console.log('🏠 AutoSave: ano específico:', data.ano);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/vivienda/guardar?idUsuario=${userId}`,
          viviendaData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('🏠 AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información de vivienda:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información de personas a cargo
   */
  private async saveDependentsInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('👨‍👩‍👧‍👦 AutoSave: Preparando datos de personas a cargo:', data);
      
      // Filtrar personas que no estén vacías
      const personasValidas = data.personas?.filter((persona: any) => 
        persona.nombre && persona.parentesco
      ) || [];

      console.log('👨‍👩‍👧‍👦 AutoSave: Personas válidas encontradas:', personasValidas.length);

      const personasData = personasValidas.map((persona: any) => {
        // Calcular edad si se proporciona fecha de nacimiento
        let edad = null;
        let fechaNacimiento = persona.fechaNacimiento;
        
        if (persona.fechaNacimiento) {
          // Asegurar formato correcto de fecha
          const fechaNac = new Date(persona.fechaNacimiento);
          if (!isNaN(fechaNac.getTime())) {
            fechaNacimiento = fechaNac.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            
            const hoy = new Date();
            edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
              edad--;
            }
          }
        }

        return {
          nombre: persona.nombre,
          parentesco: persona.parentesco,
          fechaNacimiento: fechaNacimiento,
          edad: edad
        };
      });

      console.log('👨‍👩‍👧‍👦 AutoSave: Datos mapeados para backend:', personasData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/personas-acargo/guardar?idUsuario=${userId}`,
          personasData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('👨‍👩‍👧‍👦 AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información de personas a cargo:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información de contactos de emergencia
   */
  private async saveContactInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('📞 AutoSave: Preparando datos de contactos:', data);
      
      // Filtrar contactos que no estén vacíos
      const contactosValidos = data.contactos?.filter((contacto: any) => 
        contacto.nombre && contacto.telefono
      ) || [];

      console.log('📞 AutoSave: Contactos válidos encontrados:', contactosValidos.length);

      const contactosData = contactosValidos.map((contacto: any) => ({
        nombreCompleto: contacto.nombre,
        parentesco: contacto.parentesco,
        numeroCelular: contacto.telefono
      }));

      console.log('📞 AutoSave: Datos mapeados para backend:', contactosData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/contactos/guardar?idUsuario=${userId}`,
          contactosData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('📞 AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información de contactos:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Guardar información de declaraciones de conflicto
   */
  private async saveDeclarationInfo(data: any, userId: string): Promise<boolean> {
    try {
      console.log('⚖️ AutoSave: Preparando datos de declaraciones:', data);
      
      // Filtrar declaraciones que no estén vacías - corregir el filtro para usar 'personas' en lugar de 'declaraciones'
      const declaracionesValidas = data.personas?.filter((persona: any) => 
        persona.nombre && persona.parentesco
      ) || [];

      console.log('⚖️ AutoSave: Declaraciones válidas encontradas:', declaracionesValidas.length);

      const declaracionesData = declaracionesValidas.map((persona: any) => ({
        nombreCompleto: persona.nombre,
        parentesco: persona.parentesco,
        tipoParteAsoc: persona.tipoParteInteresada || '',
        tieneCl: persona.tieneCl || 0,
        actualizado: 1,
        fechaCreacion: new Date().toISOString().split('T')[0] // Agregar fecha de creación
      }));

      console.log('⚖️ AutoSave: Datos mapeados para backend:', declaracionesData);

      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<any>(
          `${this.backendService.getApiUrl()}/formulario/relaciones-conflicto/guardar?idUsuario=${userId}`,
          declaracionesData,
          this.backendService.getHttpOptions()
        )
      );

      console.log('⚖️ AutoSave: Respuesta del backend:', response);
      return response.success;
    } catch (error: any) {
      console.error('❌ Error guardando información de declaraciones:', error);
      if (error.error) {
        console.error('❌ Detalles del error:', error.error);
      }
      return false;
    }
  }

  /**
   * Verificar si los datos han cambiado
   */
  private hasDataChanged(previousData: any, currentData: any): boolean {
    if (!previousData && currentData) return true;
    if (previousData && !currentData) return true;
    if (!previousData && !currentData) return false;

    return JSON.stringify(previousData) !== JSON.stringify(currentData);
  }

  /**
   * Obtener datos de un paso específico
   */
  getStepData(step: string): StepData | undefined {
    const stepDataMap = this.stepData$.value;
    return stepDataMap.get(step);
  }

  /**
   * Actualizar datos de un paso
   */
  private updateStepData(step: string, data: StepData): void {
    const currentMap = this.stepData$.value;
    currentMap.set(step, data);
    this.stepData$.next(new Map(currentMap));
  }

  /**
   * Clonar objeto profundamente
   */
  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Obtener observables de los datos de pasos
   */
  getStepData$(): Observable<Map<string, StepData>> {
    return this.stepData$.asObservable();
  }

  /**
   * Limpiar datos de un paso
   */
  clearStepData(step: string): void {
    const currentMap = this.stepData$.value;
    currentMap.delete(step);
    this.stepData$.next(new Map(currentMap));
  }

  /**
   * Limpiar todos los datos
   */
  clearAllStepData(): void {
    this.stepData$.next(new Map());
  }
} 