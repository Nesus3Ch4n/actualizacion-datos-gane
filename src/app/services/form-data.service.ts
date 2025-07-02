import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { FormStateService, FormularioCompleto } from './form-state.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private currentUserId$ = new BehaviorSubject<string | null>(null);

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private formStateService: FormStateService
  ) {}

  // ========== MÉTODO PRINCIPAL - GUARDAR FORMULARIO COMPLETO ==========
  
  // MÉTODO TEMPORAL DE DEBUGGING
  debugFormularioCompleto(): void {
    console.log('🔍 DEBUG: Estado actual del FormStateService:');
    const formulario = this.formStateService.getFormularioCompleto();
    console.log('📋 Formulario completo:', formulario);
    console.log('👤 Información personal:', formulario.informacionPersonal);
    
    // También verificar el resumen
    const resumen = this.formStateService.getResumenFormulario();
    console.log('📊 Resumen:', resumen);
  }
  
  async guardarFormularioCompleto(): Promise<boolean> {
    try {
      console.log('📝 Iniciando guardado de formulario completo...');
      
      const formulario = this.formStateService.getFormularioCompleto();
      console.log('📋 Formulario obtenido:', formulario);

      // Validar formulario antes de proceder
      if (!this.validarFormularioCompleto(formulario)) {
        throw new Error('El formulario no tiene la información mínima requerida');
      }

      // ========== PASO 1: CREAR/ACTUALIZAR USUARIO BÁSICO ==========
      console.log('👤 Paso 1: Guardando información personal...');
      const usuarioBasico = this.prepararUsuarioBasico(formulario.informacionPersonal);
      
      let usuarioId: string;
      const usuarioExistente = await this.verificarUsuarioExistente(formulario.informacionPersonal.cedula);
      
      if (usuarioExistente) {
        // Actualizar usuario existente
        console.log('🔄 Usuario existente encontrado, actualizando...');
        usuarioId = usuarioExistente.id.toString();
        await firstValueFrom(this.backendService.actualizarUsuario(Number(usuarioId), usuarioBasico));
        console.log('✅ Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        console.log('🆕 Creando nuevo usuario...');
        const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
        usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
        console.log('✅ Usuario creado exitosamente con ID:', usuarioId);
      }

      // Guardar ID del usuario actual
      this.setCurrentUserId(usuarioId);

      console.log('🎉 Formulario completo guardado exitosamente');
      
      // Mostrar notificación de éxito
      this.notificationService.showSuccess('Exito','Información personal guardada exitosamente');
      
      return true;

    } catch (error) {
      console.error('❌ Error al guardar formulario completo:', error);
      this.notificationService.showError('Error','Error al guardar el formulario: ' + (error as Error).message);
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

  // Verificar conexión con backend
  async verificarConexionBackend(): Promise<boolean> {
    try {
      return await this.backendService.verificarConexion();
    } catch (error) {
      console.error('❌ Error al verificar conexión con backend:', error);
      return false;
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  // Método para limpiar el formulario después del guardado exitoso
  limpiarFormularioDespuesDeGuardar(): void {
    this.formStateService.limpiarFormulario();
    this.setCurrentUserId(null);
  }

  // Obtener resumen del formulario
  obtenerResumenFormulario(): any {
    return this.formStateService.getResumenFormulario();
  }

  // Obtener formulario completo
  getFormularioCompleto(): FormularioCompleto {
    return this.formStateService.getFormularioCompleto();
  }

  // ========== GESTIÓN DE USUARIO ACTUAL ==========
  
  getCurrentUserId(): Observable<string | null> {
    return this.currentUserId$.asObservable();
  }

  setCurrentUserId(userId: string | null): void {
    this.currentUserId$.next(userId);
  }

  getCurrentUserIdValue(): string | null {
    return this.currentUserId$.value;
  }

  // ========== MÉTODOS DEPRECATED (mantener para compatibilidad temporal) ==========

  async saveUsuario(data: any): Promise<string> {
    console.warn('⚠️ saveUsuario está deprecated. Usa guardarFormularioCompleto()');
    try {
      const resultado = await firstValueFrom(this.backendService.crearUsuarioCompleto(data));
      return resultado.id?.toString() || 'unknown';
    } catch (error) {
      throw error;
    }
  }

  async saveEstudio(data: any): Promise<void> {
    console.warn('⚠️ saveEstudio está deprecated. Los estudios se guardan en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - los estudios se guardan en memoria
  }

  async saveVehiculo(data: any): Promise<void> {
    console.warn('⚠️ saveVehiculo está deprecated. Los vehículos se guardan en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - los vehículos se guardan en memoria
  }

  async saveVivienda(data: any): Promise<void> {
    console.warn('⚠️ saveVivienda está deprecated. La vivienda se guarda en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - la vivienda se guarda en memoria
  }

  async savePersonaACargo(data: any): Promise<void> {
    console.warn('⚠️ savePersonaACargo está deprecated. Las personas se guardan en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - las personas se guardan en memoria
  }

  async saveContacto(data: any): Promise<void> {
    console.warn('⚠️ saveContacto está deprecated. Los contactos se guardan en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - los contactos se guardan en memoria
  }

  async saveDeclaracion(data: any): Promise<void> {
    console.warn('⚠️ saveDeclaracion está deprecated. Las declaraciones se guardan en memoria hasta guardarFormularioCompleto()');
    // No hacer nada - las declaraciones se guardan en memoria
  }

  getFormData(): any {
    console.warn('⚠️ getFormData está deprecated. Usa getFormularioCompleto() o FormStateService.getFormularioCompleto()');
    return this.formStateService.getFormularioCompleto();
  }

  clearFormData(): void {
    console.warn('⚠️ clearFormData está deprecated. Usa limpiarFormularioDespuesDeGuardar()');
    this.limpiarFormularioDespuesDeGuardar();
  }

  // Método auxiliar para limpiar arrays
  private limpiarArray(arr: any[] | undefined): any[] {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => this.limpiarObjeto(item)).filter(item => item !== null && Object.keys(item).length > 0);
  }

  // Método auxiliar para limpiar objetos de valores undefined/null
  private limpiarObjeto(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.limpiarObjeto(item)).filter(item => item !== null && item !== undefined);
    }
    
    if (typeof obj === 'object') {
      const objetoLimpio: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            const valorLimpio = this.limpiarObjeto(value);
            if (valorLimpio !== null && Object.keys(valorLimpio).length > 0) {
              objetoLimpio[key] = valorLimpio;
            }
          } else {
            objetoLimpio[key] = value;
          }
        }
      }
      return objetoLimpio;
    }
    
    return obj;
  }

  async verificarUsuarioExistente(cedula: string): Promise<any> {
    try {
      return await firstValueFrom(this.backendService.obtenerUsuarioPorCedula(cedula));
    } catch (error) {
      // Si el usuario no existe, retornamos null en lugar de lanzar error
      console.log('ℹ️ Usuario no existe, se creará uno nuevo');
      return null;
    }
  }
} 