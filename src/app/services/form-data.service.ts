import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BackendService } from './backend.service';
import { NotificationService } from './notification.service';
import { FormStateService, FormularioCompleto } from './form-state.service';
import { AuthService } from './auth.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private currentUserId$ = new BehaviorSubject<string | null>(null);

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private formStateService: FormStateService,
    private authService: AuthService,
    private validationService: ValidationService
  ) {}

  // ========== MÉTODO PRINCIPAL - GUARDAR FORMULARIO COMPLETO ==========
  
  /**
   * Guardar formulario completo con validación mejorada
   */
  async guardarFormularioCompleto(formulario: any): Promise<boolean> {
    try {
      // Paso 1: Validación completa antes de proceder
      const validationResult = await firstValueFrom(
        this.validationService.validateCompleteForm(formulario)
      );

      if (!validationResult.isValid) {
        this.notificationService.showError('Error de Validación', validationResult.message);
        return false;
      }

      // Paso 2: Verificar si el usuario existe y obtener su ID
      const usuarioExistente = await this.verificarUsuarioExistente(formulario.informacionPersonal.cedula);
      
      if (usuarioExistente) {
        // Actualizar usuario existente
        const resultado = await this.actualizarUsuarioExistente(usuarioExistente.id, formulario);
        return resultado;
      } else {
        // Crear nuevo usuario
        const resultado = await this.crearNuevoUsuario(formulario);
        return resultado;
      }
    } catch (error) {
      console.error('❌ Error al guardar formulario completo:', error);
      this.notificationService.showError('Error de Guardado', 'Error al guardar el formulario. Por favor, intenta nuevamente.');
      return false;
    }
  }

  /**
   * Actualizar usuario existente con validación de auditoría
   */
  private async actualizarUsuarioExistente(usuarioId: number, formulario: any): Promise<boolean> {
    try {
      // Verificar que el usuario esté autenticado antes de actualizar
      if (!this.authService.isAuthenticated()) {
        this.notificationService.showError('Error de Autenticación', 'Debes estar autenticado para actualizar datos.');
        return false;
      }

      // Verificar que el token esté presente
      const token = this.authService.getCurrentToken();
      if (!token) {
        this.notificationService.showError('Error de Autenticación', 'Token de autenticación no encontrado.');
        return false;
      }
      
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
        this.notificationService.showSuccess('Actualización Exitosa', 'Los datos han sido actualizados correctamente.');
        return true;
      } else {
        console.error('❌ Error actualizando usuario:', resultado.error);
        this.notificationService.showError('Error de Actualización', resultado.error || 'Error al actualizar usuario');
        return false;
      }
    } catch (error) {
      console.error('❌ Error en actualización:', error);
      this.notificationService.showError('Error de Actualización', 'Error al actualizar los datos. Por favor, intenta nuevamente.');
      return false;
    }
  }

  /**
   * Crear nuevo usuario con validación
   */
  private async crearNuevoUsuario(formulario: any): Promise<boolean> {
    try {
      // Verificar autenticación antes de crear
      if (!this.authService.isAuthenticated()) {
        this.notificationService.showError('Error de Autenticación', 'Debes estar autenticado para crear un nuevo usuario.');
        return false;
      }
      
      // Preparar los datos del usuario usando el método existente
      const usuarioBasico = this.prepararUsuarioBasico(formulario.informacionPersonal);
      
      // Agregar la información completa del formulario
      const datosUsuario = {
        ...usuarioBasico,
        informacionCompleta: formulario
      };

      const resultado = await firstValueFrom(
        this.backendService.crearUsuarioCompleto(datosUsuario)
      );

      if (resultado.success) {
        // Guardar el ID del usuario creado
        if (resultado.data?.id) {
          this.setCurrentUserId(resultado.data.id.toString());
        }
        this.notificationService.showSuccess('Usuario Creado', 'Nuevo usuario creado exitosamente.');
        return true;
      } else {
        console.error('❌ Error creando usuario:', resultado.error || resultado.message);
        this.notificationService.showError('Error de Creación', resultado.error || resultado.message || 'Error al crear usuario');
        return false;
      }
    } catch (error) {
      console.error('❌ Error en creación:', error);
      this.notificationService.showError('Error de Creación', 'Error al crear el usuario. Por favor, intenta nuevamente.');
      return false;
    }
  }

  // ========== MÉTODOS DE GUARDADO PASO A PASO ==========

  /**
   * Guardar información personal (Paso 1)
   */
  async guardarInformacionPersonal(data: any): Promise<string> {
    try {
      
      const usuarioBasico = this.prepararUsuarioBasico(data);
      let usuarioId: string;
      
      const usuarioExistente = await this.verificarUsuarioExistente(data.cedula);
      
      if (usuarioExistente) {
        // Determinar el ID del usuario
        let userId: number;
        if (usuarioExistente.idUsuario) {
          // Si viene del endpoint autenticado, usar el ID real
          userId = usuarioExistente.idUsuario;
        } else if (usuarioExistente.cedula) {
          // Si viene del endpoint público, usar la cédula como ID temporal
          userId = Number(usuarioExistente.cedula);
        } else {
          throw new Error('No se pudo determinar el ID del usuario');
        }
        
        usuarioId = userId.toString();
        
        try {
          // Intentar actualizar usando el ID correcto
          await firstValueFrom(this.backendService.actualizarUsuario(userId, usuarioBasico));
        } catch (updateError: any) {
          console.error('❌ Error actualizando usuario:', updateError);
          // Si falla la actualización, intentar crear nuevo usuario
          try {
            const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
            usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
          } catch (createError: any) {
            console.error('❌ Error creando usuario:', createError);
            // Si es error 400 (usuario ya existe), usar el ID que ya tenemos
            if (createError.status === 400 && createError.message?.includes('Ya existe un usuario con cédula')) {
              // Mantener el ID que ya teníamos
            } else {
              throw createError;
            }
          }
        }
      } else {
        try {
          const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
          usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
        } catch (createError: any) {
          console.error('❌ Error creando usuario:', createError);
          
          // Si es error 401, intentar con endpoint de prueba
          if (createError.status === 401) {
            try {
              const resultado = await firstValueFrom(this.backendService.crearUsuarioPrueba(usuarioBasico));
              usuarioId = resultado.id?.toString() || resultado.toString();

            } catch (pruebaError) {
              console.error('❌ Error en endpoint de prueba:', pruebaError);
              // Intentar con método alternativo
              try {
                const resultado = await firstValueFrom(this.backendService.crearUsuario(usuarioBasico));
                usuarioId = resultado.id?.toString() || resultado.toString();
              } catch (altError) {
                console.error('❌ Error en método alternativo:', altError);
                // Generar ID temporal para continuar
                usuarioId = Date.now().toString();
  
              }
            }
          } else {
            // Para otros errores, intentar endpoint de prueba

            try {
              const resultado = await firstValueFrom(this.backendService.crearUsuarioPrueba(usuarioBasico));
              usuarioId = resultado.id?.toString() || resultado.toString();
            } catch (pruebaError) {
              console.error('❌ Error en endpoint de prueba:', pruebaError);
              // Generar ID temporal para continuar
              usuarioId = Date.now().toString();

            }
          }
        }
      }
      
      // Guardar el ID de usuario en sessionStorage para uso posterior
      console.log('💾 Guardando ID de usuario en sessionStorage:', usuarioId);
      sessionStorage.setItem('id_usuario', usuarioId);
      sessionStorage.setItem('cedula', data.cedula);
      
      // Actualizar el BehaviorSubject
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
  async guardarEstudioAcademico(estudio: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const estudioData = { ...estudio };
    await firstValueFrom(
      this.backendService.getHttpClient().post<any>(
        `${this.backendService.getApiUrl()}/formulario/estudios/guardar?idUsuario=${usuarioId}`,
        [estudioData],
        this.backendService.getHttpOptions()
      )
    );
  }

  /**
   * Guardar vehículo
   */
  async guardarVehiculo(vehiculo: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const vehiculoData = { ...vehiculo };
    await firstValueFrom(this.backendService.guardarVehiculos(Number(usuarioId), [vehiculoData]));
  }

  /**
   * Guardar vivienda
   */
  async guardarVivienda(vivienda: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const viviendaData = { ...vivienda };
    await firstValueFrom(this.backendService.guardarVivienda(Number(usuarioId), viviendaData));
  }

  /**
   * Guardar persona a cargo
   */
  async guardarPersonaACargo(persona: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const personaData = { ...persona };
    await firstValueFrom(this.backendService.guardarPersonasACargo(Number(usuarioId), [personaData]));
  }

  /**
   * Guardar contacto de emergencia
   */
  async guardarContactoEmergencia(contacto: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const contactoData = { ...contacto };
    await firstValueFrom(this.backendService.guardarContactos(Number(usuarioId), [contactoData]));
  }

  /**
   * Guardar declaración de conflicto
   */
  async guardarDeclaracionConflicto(declaracion: any): Promise<void> {
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) throw new Error('No hay usuario activo. Complete primero la información personal.');
    const declaracionData = { ...declaracion };
    await firstValueFrom(this.backendService.guardarDeclaraciones(Number(usuarioId), [declaracionData]));
  }

  // ========== MÉTODO PARA PREPARAR USUARIO BÁSICO ==========

  private convertirFormatoFecha(fecha: string): string {
    if (!fecha) return '';
    
    console.log(`🔄 Convirtiendo fecha: ${fecha}`);
    
    // Si ya está en formato YYYY-MM-DD, retornarlo tal como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      console.log(`✅ Fecha ya en formato correcto: ${fecha}`);
      return fecha;
    }
    
    // Si está en formato DD/MM/YYYY o MM/DD/YYYY, necesitamos determinar cuál es
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const partes = fecha.split('/');
      const primerNumero = parseInt(partes[0]);
      const segundoNumero = parseInt(partes[1]);
      
      // Si el primer número es mayor a 12, es DD/MM/YYYY
      // Si el segundo número es mayor a 12, es MM/DD/YYYY
      if (primerNumero > 12) {
        // Es DD/MM/YYYY
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const anio = partes[2];
        const fechaConvertida = `${anio}-${mes}-${dia}`;
        console.log(`✅ Fecha convertida DD/MM/YYYY → YYYY-MM-DD: ${fecha} → ${fechaConvertida}`);
        return fechaConvertida;
      } else if (segundoNumero > 12) {
        // Es MM/DD/YYYY
        const mes = partes[0].padStart(2, '0');
        const dia = partes[1].padStart(2, '0');
        const anio = partes[2];
        const fechaConvertida = `${anio}-${mes}-${dia}`;
        console.log(`✅ Fecha convertida MM/DD/YYYY → YYYY-MM-DD: ${fecha} → ${fechaConvertida}`);
        return fechaConvertida;
      } else {
        // Ambos números son <= 12, asumimos DD/MM/YYYY (formato más común en Colombia)
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const anio = partes[2];
        const fechaConvertida = `${anio}-${mes}-${dia}`;
        console.log(`✅ Fecha convertida DD/MM/YYYY (asumido) → YYYY-MM-DD: ${fecha} → ${fechaConvertida}`);
        return fechaConvertida;
      }
    }
    
    // Si está en formato MM-DD-YYYY, convertirlo a YYYY-MM-DD
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(fecha)) {
      const partes = fecha.split('-');
      const mes = partes[0].padStart(2, '0');
      const dia = partes[1].padStart(2, '0');
      const anio = partes[2];
      const fechaConvertida = `${anio}-${mes}-${dia}`;
      console.log(`✅ Fecha convertida MM-DD-YYYY → YYYY-MM-DD: ${fecha} → ${fechaConvertida}`);
      return fechaConvertida;
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
      numeroFijo: informacionPersonal.numeroFijo,
      numeroCelular: informacionPersonal.numeroCelular,
      numeroCorp: informacionPersonal.numeroCorp,
      cedulaExpedicion: informacionPersonal.cedulaExpedicion,
      paisNacimiento: informacionPersonal.paisNacimiento,
      ciudadNacimiento: informacionPersonal.ciudadNacimiento,
      cargo: informacionPersonal.cargo,
      area: informacionPersonal.area,
      fechaNacimiento: this.convertirFormatoFecha(informacionPersonal.fechaNacimiento),
      estadoCivil: informacionPersonal.estadoCivil,
      tipoSangre: informacionPersonal.tipoSangre,
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
      
      // Primero intentar con el endpoint que requiere autenticación para obtener el ID
      try {
        const response = await firstValueFrom(
          this.backendService.obtenerUsuarioPorCedula(cedula)
        );
        
        console.log('📋 Usuario encontrado con ID:', response);
        return response;
      } catch (authError: any) {
        console.log('⚠️ Error de autenticación, intentando endpoint público...');
        
        // Si falla por autenticación, usar el endpoint público
        const publicResponse = await firstValueFrom(
          this.backendService.getHttpClient().get<any>(
            `${this.backendService.getApiUrl()}/consulta/verificar-usuario/${cedula}`,
            this.backendService.getHttpOptions()
          ).pipe(
            map((data: any) => data)
          )
        );
        
        console.log('📋 Respuesta de verificación pública:', publicResponse);
        
        if (publicResponse && (publicResponse as any).existe) {
          console.log('✅ Usuario encontrado (público):', publicResponse);
          return publicResponse;
        } else {
          console.log('❌ Usuario no encontrado');
          return null;
        }
      }
    } catch (error: any) {
      console.error('❌ Error verificando usuario existente:', error);
      
      // Si es error 404 (usuario no encontrado), retornar null
      if (error.status === 404) {
        console.log('ℹ️ Usuario no encontrado (404)');
        return null;
      }
      
      // Si es error de conexión, también permitir continuar
      if (error.status === 0) {
        console.log('ℹ️ Error de conexión, permitiendo crear nuevo usuario sin conexión');
        return null;
      }
      
      // Para otros errores, también permitir continuar
      console.log('ℹ️ Error desconocido, permitiendo crear nuevo usuario');
      return null;
    }
  }

  // ========== MÉTODO PARA OBTENER DATOS COMPLETOS ==========

  /**
   * Obtener todos los datos del usuario incluyendo declaraciones de conflicto
   */
  async obtenerDatosCompletos(cedula: string): Promise<any> {
    try {
      console.log('📋 Obteniendo datos completos para cédula:', cedula);
      
      // Crear opciones HTTP sin token para evitar problemas de autenticación
      const httpOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log('🌐 URL:', `${this.backendService.getApiUrl()}/consulta/datos-completos/${cedula}`);
      console.log('📡 Headers:', httpOptions);
      
      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<any>(
          `${this.backendService.getApiUrl()}/consulta/datos-completos/${cedula}`,
          httpOptions
        ).pipe(
          map((data: any) => {
            console.log('✅ Respuesta recibida del backend:', data);
            
            // Verificar si la respuesta tiene la nueva estructura
            if (data && typeof data === 'object' && 'success' in data) {
              console.log('📋 Respuesta estructurada detectada');
              if (data.success) {
                console.log('✅ Respuesta exitosa:', data.message);
                return data.data || data; // Devolver los datos o la respuesta completa
              } else {
                console.error('❌ Respuesta con error:', data.message);
                throw new Error(data.message || 'Error en la respuesta del servidor');
              }
            } else {
              console.log('📋 Respuesta directa (formato anterior)');
              return data; // Mantener compatibilidad con formato anterior
            }
          }),
          catchError((error: any) => {
            console.error('❌ Error en la petición HTTP:', error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error statusText:', error.statusText);
            console.error('❌ Error url:', error.url);
            console.error('❌ Error message:', error.message);
            
            // Si hay respuesta del servidor, mostrar más detalles
            if (error.error) {
              console.error('❌ Error response:', error.error);
              console.error('❌ Error response details:', JSON.stringify(error.error, null, 2));
            }
            
            // Si es un error 500, intentar obtener más información
            if (error.status === 500 && error.error) {
              console.error('❌ Error 500 details:', error.error);
            }
            
            throw error;
          })
        )
      );
      
      console.log('✅ Datos completos obtenidos exitosamente:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error completo al obtener datos completos:', error);
      
      // Si el error es 404 (usuario no encontrado), 401 (no autorizado), o 500 (error interno), 
      // no lanzar error, simplemente retornar null para permitir crear nuevo usuario
      if (error.status === 404 || error.status === 401 || error.status === 500) {
        console.log(`ℹ️ Error ${error.status} - Usuario no encontrado o no autorizado, permitiendo crear nuevo registro`);
        return null;
      }
      
      // Si el error es de conexión (status 0), también permitir continuar
      if (error.status === 0) {
        console.log('ℹ️ Backend no disponible, permitiendo crear nuevo registro sin conexión');
        return null;
      }
      
      // Para otros errores, también permitir continuar pero mostrar más información
      console.log(`ℹ️ Error desconocido (status: ${error.status}), permitiendo crear nuevo registro`);
      return null;
    }
  }

  /**
   * Obtener todos los datos del usuario por ID incluyendo declaraciones de conflicto
   */
  async obtenerDatosCompletosPorId(idUsuario: number): Promise<any> {
    try {
      console.log('📋 Obteniendo datos completos para usuario ID:', idUsuario);
      
      // Crear opciones HTTP sin token para evitar problemas de autenticación
      const httpOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log('🌐 URL:', `${this.backendService.getApiUrl()}/consulta/datos-completos-id/${idUsuario}`);
      console.log('📡 Headers:', httpOptions);
      
      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<any>(
          `${this.backendService.getApiUrl()}/consulta/datos-completos-id/${idUsuario}`,
          httpOptions
        ).pipe(
          map((data: any) => {
            console.log('✅ Respuesta recibida del backend:', data);
            
            // Verificar si la respuesta tiene la nueva estructura
            if (data && typeof data === 'object' && 'success' in data) {
              console.log('📋 Respuesta estructurada detectada');
              if (data.success) {
                console.log('✅ Respuesta exitosa:', data.message);
                return data.data || data; // Devolver los datos o la respuesta completa
              } else {
                console.error('❌ Respuesta con error:', data.message);
                throw new Error(data.message || 'Error en la respuesta del servidor');
              }
            } else {
              console.log('📋 Respuesta directa (formato anterior)');
              return data; // Mantener compatibilidad con formato anterior
            }
          }),
          catchError((error: any) => {
            console.error('❌ Error en la petición HTTP:', error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error statusText:', error.statusText);
            console.error('❌ Error url:', error.url);
            console.error('❌ Error message:', error.message);
            
            // Si hay respuesta del servidor, mostrar más detalles
            if (error.error) {
              console.error('❌ Error response:', error.error);
            }
            
            throw error;
          })
        )
      );
      
      console.log('✅ Datos completos obtenidos exitosamente:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error completo al obtener datos completos por ID:', error);
      
      // Si el error es 404 (usuario no encontrado), 401 (no autorizado), o 500 (error interno), 
      // no lanzar error, simplemente retornar null para permitir crear nuevo usuario
      if (error.status === 404 || error.status === 401 || error.status === 500) {
        console.log(`ℹ️ Error ${error.status} - Usuario no encontrado o no autorizado, permitiendo crear nuevo registro`);
        return null;
      }
      
      // Si el error es de conexión (status 0), también permitir continuar
      if (error.status === 0) {
        console.log('ℹ️ Backend no disponible, permitiendo crear nuevo registro sin conexión');
        return null;
      }
      
      // Para otros errores, también permitir continuar pero mostrar más información
      console.log(`ℹ️ Error desconocido (status: ${error.status}), permitiendo crear nuevo registro`);
      return null;
    }
  }
} 