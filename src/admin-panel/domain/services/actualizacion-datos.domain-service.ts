import { Injectable } from '@angular/core';

// Domain imports
import { Usuario } from '../entities/usuario.entity';
import { EstadoUsuario } from '../value-objects/estado-usuario.vo';
import { Departamento } from '../value-objects/departamento.vo';
import { Email } from '../value-objects/email.vo';

/**
 * Servicio de dominio para las reglas de negocio relacionadas con la actualización de datos
 * Contiene la lógica de negocio compleja que no pertenece a ninguna entidad específica
 */
@Injectable({
  providedIn: 'root'
})
export class ActualizacionDatosDomainService {

  private configuracionSistema = {
    frecuenciaActualizacionMinima: 30, // días
    requiereAprobacionGerentes: true,
    notificarCambiosImportantes: true
  };

  /**
   * Valida si un usuario puede ser actualizado según las reglas de negocio
   */
  puedeActualizarUsuario(usuario: Usuario, cambiosRequeridos: CambiosActualizacion): ResultadoValidacion {
    const errores: string[] = [];
    const advertencias: string[] = [];

    // Validar cambio de estado
    if (cambiosRequeridos.nuevoEstado) {
      const validacionEstado = this.validarCambioEstado(usuario, cambiosRequeridos.nuevoEstado);
      if (!validacionEstado.valido) {
        errores.push(...validacionEstado.errores);
      }
      advertencias.push(...validacionEstado.advertencias);
    }

    // Validar cambio de departamento
    if (cambiosRequeridos.nuevoDepartamento) {
      const validacionDepartamento = this.validarCambioDepartamento(usuario, cambiosRequeridos.nuevoDepartamento);
      if (!validacionDepartamento.valido) {
        errores.push(...validacionDepartamento.errores);
      }
      advertencias.push(...validacionDepartamento.advertencias);
    }

    // Validar cambio de email
    if (cambiosRequeridos.nuevoEmail) {
      const validacionEmail = this.validarCambioEmail(usuario, cambiosRequeridos.nuevoEmail);
      if (!validacionEmail.valido) {
        errores.push(...validacionEmail.errores);
      }
    }

    // Validar frecuencia de actualizaciones
    const validacionFrecuencia = this.validarFrecuenciaActualizacion(usuario);
    if (!validacionFrecuencia.valido) {
      advertencias.push(...validacionFrecuencia.advertencias);
    }

    return {
      valido: errores.length === 0,
      errores,
      advertencias
    };
  }

  /**
   * Determina si un usuario requiere actualización de datos
   */
  requiereActualizacionDatos(usuario: Usuario): RequisitoActualizacion {
    const ahora = new Date();
    const ultimaActualizacion = usuario.ultimaActualizacion;
    const tiempoTranscurrido = ahora.getTime() - ultimaActualizacion.getTime();
    const unAnio = 365 * 24 * 60 * 60 * 1000; // milisegundos en un año

    const requiereActualizacion = tiempoTranscurrido > unAnio;
    
    let prioridad: 'baja' | 'media' | 'alta' = 'baja';
    let razon = '';

    if (tiempoTranscurrido > unAnio * 2) {
      prioridad = 'alta';
      razon = 'Datos no actualizados por más de 2 años';
    } else if (tiempoTranscurrido > unAnio * 1.5) {
      prioridad = 'media';
      razon = 'Datos no actualizados por más de 1.5 años';
    } else if (requiereActualizacion) {
      prioridad = 'baja';
      razon = 'Datos no actualizados por más de 1 año';
    }

    return {
      requiere: requiereActualizacion,
      prioridad,
      razon,
      diasVencido: Math.floor(tiempoTranscurrido / (24 * 60 * 60 * 1000)) - 365,
      fechaLimite: new Date(ultimaActualizacion.getTime() + unAnio)
    };
  }

  /**
   * Calcula la puntuación de completitud de los datos del usuario
   */
  calcularCompletiudDatos(usuario: Usuario): PuntuacionCompletitud {
    let puntuacionTotal = 0;
    let puntuacionMaxima = 0;
    const camposFaltantes: string[] = [];

    // Campos básicos (peso: 20 puntos cada uno)
    const camposBasicos = [
      { campo: 'nombre', valor: usuario.nombre, peso: 20 },
      { campo: 'apellido', valor: usuario.apellido, peso: 20 },
      { campo: 'email', valor: usuario.emailValue, peso: 20 },
      { campo: 'cargo', valor: usuario.cargo, peso: 20 },
      { campo: 'departamento', valor: usuario.departamentoValue, peso: 20 }
    ];

    camposBasicos.forEach(campo => {
      puntuacionMaxima += campo.peso;
      if (campo.valor && campo.valor.trim().length > 0) {
        puntuacionTotal += campo.peso;
      } else {
        camposFaltantes.push(campo.campo);
      }
    });

    const porcentaje = puntuacionMaxima > 0 ? (puntuacionTotal / puntuacionMaxima) * 100 : 0;
    
    let categoria: 'excelente' | 'buena' | 'regular' | 'deficiente';
    if (porcentaje >= 95) categoria = 'excelente';
    else if (porcentaje >= 80) categoria = 'buena';
    else if (porcentaje >= 60) categoria = 'regular';
    else categoria = 'deficiente';

    return {
      puntuacion: Math.round(porcentaje),
      categoria,
      camposFaltantes,
      sugerencias: this.generarSugerenciasMejora(camposFaltantes, usuario)
    };
  }

  /**
   * Determina el nivel de acceso que debe tener un usuario según su perfil
   */
  determinarNivelAcceso(usuario: Usuario): NivelAcceso {
    let nivel: 'basico' | 'intermedio' | 'avanzado' | 'administrador' = 'basico';
    const permisos: string[] = [];
    const restricciones: string[] = [];

    // Determinar nivel según departamento
    if (usuario.departamento.puedeVerReportesCompletos()) {
      nivel = 'avanzado';
      permisos.push('ver_reportes_completos', 'exportar_datos', 'ver_estadisticas');
    }

    if (usuario.departamento.puedeGestionarPersonal()) {
      nivel = 'administrador';
      permisos.push('gestionar_usuarios', 'configurar_sistema', 'acceso_auditoria');
    }

    if (usuario.departamento.puedeAccederInformacionFinanciera()) {
      permisos.push('ver_informacion_financiera', 'generar_reportes_financieros');
    }

    // Aplicar restricciones según estado
    if (!usuario.estaActivo()) {
      restricciones.push('acceso_limitado', 'sin_modificaciones');
      nivel = 'basico';
    }

    if (usuario.tieneConflictoIntereses) {
      restricciones.push('declaracion_conflicto_requerida');
    }

    return {
      nivel,
      permisos,
      restricciones,
      puedeModificarDatos: usuario.estaActivo() && !restricciones.includes('sin_modificaciones'),
      requiereAprobacion: usuario.tieneConflictoIntereses || usuario.cargo.toLowerCase().includes('gerente')
    };
  }

  /**
   * Calcula métricas de actividad del usuario
   */
  calcularMetricasActividad(usuario: Usuario): MetricasActividad {
    const ahora = new Date();
    const fechaIngreso = usuario.fechaIngreso;
    const ultimaActualizacion = usuario.ultimaActualizacion;

    // Calcular antigüedad en meses
    const antiguedadMeses = Math.floor((ahora.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    // Calcular días desde última actualización
    const diasSinActualizar = Math.floor((ahora.getTime() - ultimaActualizacion.getTime()) / (1000 * 60 * 60 * 24));

    // Determinar nivel de actividad
    let nivelActividad: 'alta' | 'media' | 'baja';
    if (diasSinActualizar <= 30) nivelActividad = 'alta';
    else if (diasSinActualizar <= 180) nivelActividad = 'media';
    else nivelActividad = 'baja';

    return {
      antiguedadMeses,
      diasSinActualizar,
      nivelActividad,
      esEmpleadoNuevo: antiguedadMeses <= 3,
      requiereSegimiento: diasSinActualizar > 365 || usuario.tieneConflictoIntereses
    };
  }

  // Métodos privados de validación
  private validarCambioEstado(usuario: Usuario, nuevoEstado: string): ResultadoValidacion {
    const errores: string[] = [];
    const advertencias: string[] = [];

    try {
      const estadoActual = usuario.estado;
      const estadoNuevo = new EstadoUsuario(nuevoEstado);

      // Validar transiciones de estado permitidas
      if (estadoActual.estaSuspendido() && estadoNuevo.esActivo()) {
        advertencias.push('Activar usuario suspendido requiere aprobación adicional');
      }

      if (estadoActual.esActivo() && estadoNuevo.estaSuspendido()) {
        advertencias.push('Suspender usuario activo puede afectar procesos en curso');
      }

      if (estadoNuevo.estaEnRevision() && usuario.tieneConflictoIntereses) {
        advertencias.push('Usuario en revisión con conflicto de intereses requiere atención especial');
      }

    } catch (error) {
      errores.push(`Estado inválido: ${error}`);
    }

    return {
      valido: errores.length === 0,
      errores,
      advertencias
    };
  }

  private validarCambioDepartamento(usuario: Usuario, nuevoDepartamento: string): ResultadoValidacion {
    const errores: string[] = [];
    const advertencias: string[] = [];

    try {
      const departamentoActual = usuario.departamento;
      const departamentoNuevo = new Departamento(nuevoDepartamento);

      // Validar cambios de departamento sensibles
      if (departamentoActual.puedeAccederInformacionFinanciera() && 
          !departamentoNuevo.puedeAccederInformacionFinanciera()) {
        advertencias.push('Cambio desde departamento con acceso financiero requiere revisión de permisos');
      }

      if (departamentoNuevo.puedeGestionarPersonal() && 
          !departamentoActual.puedeGestionarPersonal()) {
        advertencias.push('Cambio a departamento con gestión de personal requiere entrenamiento adicional');
      }

      if (usuario.tieneConflictoIntereses && departamentoNuevo.obtenerNivelAcceso() === 'alto') {
        errores.push('Usuario con conflicto de intereses no puede moverse a departamento de alto nivel');
      }

    } catch (error) {
      errores.push(`Departamento inválido: ${error}`);
    }

    return {
      valido: errores.length === 0,
      errores,
      advertencias
    };
  }

  private validarCambioEmail(usuario: Usuario, nuevoEmail: string): ResultadoValidacion {
    const errores: string[] = [];

    try {
      const emailNuevo = new Email(nuevoEmail);
      
      if (!emailNuevo.esEmailEmpresarial()) {
        errores.push('Solo se permiten emails empresariales');
      }

      if (!emailNuevo.coincideConNombre(usuario.nombre, usuario.apellido)) {
        errores.push('El email debe coincidir con el nombre del usuario');
      }

    } catch (error) {
      errores.push(`Email inválido: ${error}`);
    }

    return {
      valido: errores.length === 0,
      errores,
      advertencias: []
    };
  }

  private validarFrecuenciaActualizacion(usuario: Usuario): { valido: boolean; advertencias: string[] } {
    const advertencias: string[] = [];
    const ahora = new Date();
    const ultimaActualizacion = usuario.ultimaActualizacion;
    const tiempoTranscurrido = ahora.getTime() - ultimaActualizacion.getTime();
    const unDia = 24 * 60 * 60 * 1000;

    if (tiempoTranscurrido < unDia) {
      advertencias.push('Usuario actualizado recientemente, considere si es necesario otro cambio');
    }

    return {
      valido: true,
      advertencias
    };
  }

  private generarSugerenciasMejora(camposFaltantes: string[], usuario: Usuario): string[] {
    const sugerencias: string[] = [];

    if (camposFaltantes.includes('nombre') || camposFaltantes.includes('apellido')) {
      sugerencias.push('Complete la información básica de nombre y apellido');
    }

    if (camposFaltantes.includes('email')) {
      sugerencias.push('Agregue un email empresarial válido');
    }

    if (camposFaltantes.includes('cargo')) {
      sugerencias.push('Especifique el cargo actual del empleado');
    }

    if (camposFaltantes.includes('departamento')) {
      sugerencias.push('Asigne el departamento correspondiente');
    }

    if (usuario.tieneConflictoIntereses) {
      sugerencias.push('Revise y actualice la declaración de conflicto de intereses');
    }

    return sugerencias;
  }
}

// Interfaces de apoyo
export interface CambiosActualizacion {
  nuevoEstado?: string;
  nuevoDepartamento?: string;
  nuevoEmail?: string;
  nuevoCargo?: string;
  conflictoIntereses?: boolean;
}

export interface ResultadoValidacion {
  valido: boolean;
  errores: string[];
  advertencias: string[];
}

export interface RequisitoActualizacion {
  requiere: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  razon: string;
  diasVencido: number;
  fechaLimite: Date;
}

export interface PuntuacionCompletitud {
  puntuacion: number; // 0-100
  categoria: 'excelente' | 'buena' | 'regular' | 'deficiente';
  camposFaltantes: string[];
  sugerencias: string[];
}

export interface NivelAcceso {
  nivel: 'basico' | 'intermedio' | 'avanzado' | 'administrador';
  permisos: string[];
  restricciones: string[];
  puedeModificarDatos: boolean;
  requiereAprobacion: boolean;
}

export interface MetricasActividad {
  antiguedadMeses: number;
  diasSinActualizar: number;
  nivelActividad: 'alta' | 'media' | 'baja';
  esEmpleadoNuevo: boolean;
  requiereSegimiento: boolean;
} 