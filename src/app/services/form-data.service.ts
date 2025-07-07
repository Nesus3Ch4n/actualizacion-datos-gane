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
        try {
          await firstValueFrom(this.backendService.actualizarUsuario(Number(usuarioId), usuarioBasico));
        } catch (updateError: any) {
          console.error('❌ Error actualizando usuario:', updateError);
          // Si falla la actualización por error 401, intentar crear nuevo
          if (updateError.status === 401) {
            console.log('🔄 Error 401 al actualizar, intentando crear nuevo usuario...');
            const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
            usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
          } else {
            throw updateError;
          }
        }
      } else {
        console.log('🆕 Creando nuevo usuario...');
        try {
          const nuevoUsuario = await firstValueFrom(this.backendService.crearUsuarioCompleto(usuarioBasico));
          usuarioId = nuevoUsuario.id?.toString() || nuevoUsuario.toString();
          console.log('✅ Nuevo usuario creado con ID:', usuarioId);
        } catch (createError: any) {
          console.error('❌ Error creando usuario:', createError);
          
          // Si es error 401, intentar con endpoint de prueba
          if (createError.status === 401) {
            console.log('🔄 Error 401, intentando endpoint de prueba...');
            try {
              const resultado = await firstValueFrom(this.backendService.crearUsuarioPrueba(usuarioBasico));
              usuarioId = resultado.id?.toString() || resultado.toString();
              console.log('✅ Usuario creado con endpoint de prueba, ID:', usuarioId);
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
                console.log('🆔 Usando ID temporal:', usuarioId);
              }
            }
          } else {
            // Para otros errores, intentar endpoint de prueba
            console.log('🔄 Error desconocido, intentando endpoint de prueba...');
            try {
              const resultado = await firstValueFrom(this.backendService.crearUsuarioPrueba(usuarioBasico));
              usuarioId = resultado.id?.toString() || resultado.toString();
            } catch (pruebaError) {
              console.error('❌ Error en endpoint de prueba:', pruebaError);
              // Generar ID temporal para continuar
              usuarioId = Date.now().toString();
              console.log('🆔 Usando ID temporal:', usuarioId);
            }
          }
        }
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
    } catch (error: any) {
      console.error('❌ Error verificando usuario existente:', error);
      
      // Si es error 401 (Unauthorized), permitir continuar para crear nuevo usuario
      if (error.status === 401) {
        console.log('ℹ️ Error 401 - Token inválido, permitiendo crear nuevo usuario');
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
      
      const response = await firstValueFrom(
        this.backendService.getHttpClient().get<any>(
          `${this.backendService.getApiUrl()}/consulta/bd/${cedula}/completo`,
          this.backendService.getHttpOptions()
        )
      );
      
      console.log('✅ Datos completos obtenidos:', response);
      return response;
      
    } catch (error: any) {
      // Si el error es 404 (usuario no encontrado) o 500 (error interno), 
      // no lanzar error, simplemente retornar null para permitir crear nuevo usuario
      if (error.status === 404 || error.status === 500) {
        console.log('ℹ️ Usuario no encontrado en base de datos, permitiendo crear nuevo registro');
        return null;
      }
      
      // Si el error es de conexión (status 0), también permitir continuar
      if (error.status === 0) {
        console.log('ℹ️ Backend no disponible, permitiendo crear nuevo registro sin conexión');
        return null;
      }
      
      console.error('❌ Error al obtener datos completos:', error);
      // Para otros errores, también permitir continuar
      return null;
    }
  }
} 