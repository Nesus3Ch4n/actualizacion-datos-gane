import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { FormStateService, FormularioCompleto } from './form-state.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private currentUserId$ = new BehaviorSubject<string | null>(null);

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private formStateService: FormStateService,
    private authService: AuthService
  ) {}

  // ========== MÉTODO PRINCIPAL - GUARDAR FORMULARIO COMPLETO ==========
  
  /**
   * Guardar formulario completo (paso a paso)
   */
  async guardarFormularioCompleto(formulario: any): Promise<boolean> {
    try {
      console.log('📝 Iniciando guardado de formulario completo...');
      console.log('📋 Formulario obtenido:', formulario);

      // Paso 1: Verificar si el usuario existe y obtener su ID
      console.log('👤 Paso 1: Verificando usuario existente...');
      const usuarioExistente = await this.verificarUsuarioExistente(formulario.informacionPersonal.cedula);
      
      if (usuarioExistente) {
        console.log('✅ Usuario encontrado, actualizando datos...');
        // Actualizar usuario existente
        const resultado = await this.actualizarUsuarioExistente(usuarioExistente.id, formulario);
        return resultado;
      } else {
        console.log('🆕 Usuario no encontrado, creando nuevo...');
        // Crear nuevo usuario
        const resultado = await this.crearNuevoUsuario(formulario);
        return resultado;
      }
    } catch (error) {
      console.error('❌ Error al guardar formulario completo:', error);
      return false;
    }
  }

  /**
   * Actualizar usuario existente
   */
  private async actualizarUsuarioExistente(usuarioId: number, formulario: any): Promise<boolean> {
    try {
      console.log('🔄 Actualizando usuario ID:', usuarioId);
      
      // Preparar datos para actualización
      const datosActualizacion = {
        id: usuarioId,
        nombre: formulario.informacionPersonal.nombre,
        cedula: formulario.informacionPersonal.cedula,
        correo: formulario.informacionPersonal.correo,
        telefono: formulario.informacionPersonal.telefono,
        direccion: formulario.informacionPersonal.direccion,
        // Agregar otros campos según sea necesario
        informacionCompleta: formulario
      };

      const resultado = await firstValueFrom(
        this.backendService.actualizarUsuario(usuarioId, datosActualizacion)
      );

      if (resultado.success) {
        console.log('✅ Usuario actualizado exitosamente');
        return true;
      } else {
        console.error('❌ Error actualizando usuario:', resultado.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en actualización:', error);
      return false;
    }
  }

  /**
   * Crear nuevo usuario
   */
  private async crearNuevoUsuario(formulario: any): Promise<boolean> {
    try {
      console.log('🆕 Creando nuevo usuario...');
      
      // Preparar los datos del usuario usando el método existente
      const usuarioBasico = this.prepararUsuarioBasico(formulario.informacionPersonal);
      
      // Agregar la información completa del formulario
      const datosUsuario = {
        ...usuarioBasico,
        informacionCompleta: formulario
      };

      console.log('📋 Datos del usuario a crear:', datosUsuario);

      const resultado = await firstValueFrom(
        this.backendService.crearUsuarioCompleto(datosUsuario)
      );

      console.log('✅ Respuesta del backend:', resultado);

      if (resultado.success) {
        console.log('✅ Usuario creado exitosamente con ID:', resultado.data?.id);
        // Guardar el ID del usuario creado
        if (resultado.data?.id) {
          this.setCurrentUserId(resultado.data.id.toString());
        }
        return true;
      } else {
        console.error('❌ Error creando usuario:', resultado.error || resultado.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en creación:', error);
      return false;
    }
  }

  // ========== MÉTODOS DE GUARDADO PASO A PASO ==========

  /**
   * Guardar información personal (Paso 1)
   */
  async guardarInformacionPersonal(data: any): Promise<string> {
    try {
      console.log('👤 Guardando información personal...');
      
      const usuarioBasico = this.prepararUsuarioBasico(data);
      let usuarioId: string;
      
      const usuarioExistente = await this.verificarUsuarioExistente(data.cedula);
      
      if (usuarioExistente) {
        console.log('🔄 Usuario existente, actualizando...');
        usuarioId = usuarioExistente.id.toString();
        await firstValueFrom(this.backendService.actualizarUsuario(Number(usuarioId), usuarioBasico));
      } else {
        console.log('🆕 Creando nuevo usuario...');
        const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
        usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
      }
      
      this.setCurrentUserId(usuarioId);
      this.notificationService.showSuccess('✅ Éxito', 'Información personal guardada exitosamente');
      
      return usuarioId;
    } catch (error) {
      console.error('❌ Error guardando información personal:', error);
      this.notificationService.showError('❌ Error', 'Error al guardar información personal');
      throw error;
    }
  }

  /**
   * Guardar estudio académico
   */
  async guardarEstudioAcademico(estudio: any, usuarioId: string): Promise<void> {
    try {
      const estudioData = {
        ...estudio,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarEstudios(Number(usuarioId), [estudioData]));
      
      console.log('✅ Estudio académico guardado:', estudio.titulo);
    } catch (error) {
      console.error('❌ Error guardando estudio académico:', error);
      throw error;
    }
  }

  /**
   * Guardar vehículo
   */
  async guardarVehiculo(vehiculo: any, usuarioId: string): Promise<void> {
    try {
      const vehiculoData = {
        ...vehiculo,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarVehiculos(Number(usuarioId), [vehiculoData]));
      
      console.log('✅ Vehículo guardado:', vehiculo.placa);
    } catch (error) {
      console.error('❌ Error guardando vehículo:', error);
      throw error;
    }
  }

  /**
   * Guardar vivienda
   */
  async guardarVivienda(vivienda: any, usuarioId: string): Promise<void> {
    try {
      const viviendaData = {
        ...vivienda,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarVivienda(Number(usuarioId), viviendaData));
      
      console.log('✅ Vivienda guardada:', vivienda.direccion);
    } catch (error) {
      console.error('❌ Error guardando vivienda:', error);
      throw error;
    }
  }

  /**
   * Guardar persona a cargo
   */
  async guardarPersonaACargo(persona: any, usuarioId: string): Promise<void> {
    try {
      const personaData = {
        ...persona,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarPersonasACargo(Number(usuarioId), [personaData]));
      
      console.log('✅ Persona a cargo guardada:', persona.nombre);
    } catch (error) {
      console.error('❌ Error guardando persona a cargo:', error);
      throw error;
    }
  }

  /**
   * Guardar contacto de emergencia
   */
  async guardarContactoEmergencia(contacto: any, usuarioId: string): Promise<void> {
    try {
      const contactoData = {
        ...contacto,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarContactos(Number(usuarioId), [contactoData]));
      
      console.log('✅ Contacto de emergencia guardado:', contacto.nombre);
    } catch (error) {
      console.error('❌ Error guardando contacto de emergencia:', error);
      throw error;
    }
  }

  /**
   * Guardar declaración de conflicto
   */
  async guardarDeclaracionConflicto(declaracion: any, usuarioId: string): Promise<void> {
    try {
      const declaracionData = {
        ...declaracion,
        usuarioId: Number(usuarioId)
      };
      
      // Usar el método correcto del BackendService
      await firstValueFrom(this.backendService.guardarDeclaraciones(Number(usuarioId), [declaracionData]));
      
      console.log('✅ Declaración de conflicto guardada:', declaracion.tipoConflicto);
    } catch (error) {
      console.error('❌ Error guardando declaración de conflicto:', error);
      throw error;
    }
  }

  // ========== MÉTODO PARA PREPARAR USUARIO BÁSICO ==========

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

  private prepararUsuarioBasico(informacionPersonal: any): any {
    return {
      nombre: informacionPersonal.nombre,
      cedula: informacionPersonal.cedula,
      correo: informacionPersonal.correo,
      telefono: informacionPersonal.numeroCelular || informacionPersonal.numeroFijo || informacionPersonal.numeroCorp,
      direccion: informacionPersonal.direccion,
      ciudad: informacionPersonal.ciudadNacimiento || informacionPersonal.ciudad,
      departamento: informacionPersonal.departamento,
      pais: informacionPersonal.paisNacimiento || informacionPersonal.pais,
      fechaNacimiento: this.convertirFormatoFecha(informacionPersonal.fechaNacimiento),
      estadoCivil: informacionPersonal.estadoCivil,
      genero: informacionPersonal.genero,
      tipoSangre: informacionPersonal.tipoSangre,
      eps: informacionPersonal.eps,
      arl: informacionPersonal.arl,
      fondoPension: informacionPersonal.fondoPension,
      cajaCompensacion: informacionPersonal.cajaCompensacion,
      activo: true,
      version: 1
    };
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  private validarFormularioCompleto(formulario: FormularioCompleto): boolean {
    // Validación básica - información personal es requerida
    if (!formulario.informacionPersonal || Object.keys(formulario.informacionPersonal).length === 0) {
      console.error('❌ Falta información personal');
      return false;
    }

    // Validar campos críticos de información personal
    const { informacionPersonal } = formulario;
    const camposRequeridos = ['nombre', 'cedula', 'correo'];
    
    for (const campo of camposRequeridos) {
      if (!informacionPersonal[campo]) {
        console.error(`❌ Falta campo requerido: ${campo}`);
        return false;
      }
    }

    return true;
  }

  // ========== MÉTODOS DE CONSULTA DEL BACKEND ==========

  // Obtener todos los usuarios
  async obtenerUsuarios(): Promise<any[]> {
    try {
      return await firstValueFrom(this.backendService.obtenerUsuarios());
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  async obtenerUsuarioPorId(id: number): Promise<any> {
    try {
      return await firstValueFrom(this.backendService.obtenerUsuarioPorId(id));
    } catch (error) {
      console.error('❌ Error al obtener usuario por ID:', error);
      throw error;
    }
  }

  // Obtener usuario por cédula
  async obtenerUsuarioPorCedula(cedula: string): Promise<any> {
    try {
      return await firstValueFrom(this.backendService.obtenerUsuarioPorCedula(cedula));
    } catch (error) {
      console.error('❌ Error al obtener usuario por cédula:', error);
      throw error;
    }
  }

  // Buscar usuarios por nombre
  async buscarUsuariosPorNombre(nombre: string): Promise<any[]> {
    try {
      return await firstValueFrom(this.backendService.buscarUsuariosPorNombre(nombre));
    } catch (error) {
      console.error('❌ Error al buscar usuarios por nombre:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<any> {
    try {
      return await firstValueFrom(this.backendService.obtenerEstadisticas());
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Verificar conexión con el backend
  async verificarConexionBackend(): Promise<boolean> {
    try {
      return await this.backendService.verificarConexion();
    } catch (error) {
      console.error('❌ Error verificando conexión con backend:', error);
      return false;
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  limpiarFormularioDespuesDeGuardar(): void {
    this.formStateService.limpiarFormulario();
  }

  obtenerResumenFormulario(): any {
    return this.formStateService.getResumenFormulario();
  }

  getFormularioCompleto(): FormularioCompleto {
    return this.formStateService.getFormularioCompleto();
  }

  getCurrentUserId(): Observable<string | null> {
    return this.currentUserId$.asObservable();
  }

  setCurrentUserId(userId: string | null): void {
    this.currentUserId$.next(userId);
  }

  getCurrentUserIdValue(): string | null {
    return this.currentUserId$.value;
  }

  // ========== MÉTODOS DE VERIFICACIÓN ==========

  async verificarUsuarioExistente(cedula: string): Promise<any> {
    try {
      console.log('🔍 Verificando usuario existente con cédula:', cedula);
      
      const usuarios = await this.obtenerUsuarios();
      
      // Verificar que usuarios sea un array válido
      if (!Array.isArray(usuarios)) {
        console.warn('⚠️ La respuesta de usuarios no es un array:', usuarios);
        return null;
      }
      
      console.log('📋 Usuarios encontrados:', usuarios.length);
      
      // Buscar usuario por cédula
      const usuarioEncontrado = usuarios.find(usuario => {
        // Convertir ambos a string para comparación
        const usuarioCedula = String(usuario.cedula);
        const cedulaBuscada = String(cedula);
        return usuarioCedula === cedulaBuscada;
      });
      
      if (usuarioEncontrado) {
        console.log('✅ Usuario encontrado:', usuarioEncontrado);
        return usuarioEncontrado;
      } else {
        console.log('❌ Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error verificando usuario existente:', error);
      return null;
    }
  }
} 