import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormularioApiService, InformacionPersonalDTO, EstudioAcademicoDTO, VehiculoDTO, ViviendaDTO, PersonaACargoDTO, ContactoEmergenciaDTO } from './formulario-api.service';
import { Empleado } from '../../domain/entities/empleado.entity';
import { InformacionPersonal } from '../../domain/entities/informacion-personal.entity';
import { InformacionContacto } from '../../domain/entities/informacion-contacto.entity';
import { InformacionVivienda } from '../../domain/entities/informacion-vivienda.entity';
import { InformacionVehiculo } from '../../domain/entities/informacion-vehiculo.entity';

@Injectable({
  providedIn: 'root'
})
export class FormularioIntegrationAdapter {

  constructor(private formularioApiService: FormularioApiService) {}

  // ========== MÉTODOS DE CONVERSIÓN DE ENTIDADES A DTOs ==========

  /**
   * Convierte InformacionPersonal del dominio a DTO para la API
   */
  convertirInformacionPersonalADTO(informacion: InformacionPersonal): InformacionPersonalDTO {
    return {
      cedula: informacion.getNumeroDocumento().valor,
      nombre: informacion.getNombreCompleto(),
      correo: '', // Se necesitará obtener del InformacionContacto
      telefono: '', // Se necesitará obtener del InformacionContacto
      direccion: '', // Se necesitará obtener del InformacionVivienda
      ciudad: informacion.getCiudadNacimiento(),
      departamento: '', // No disponible en la entidad actual
      pais: informacion.getPaisNacimiento(),
      fechaNacimiento: informacion.getFechaNacimiento().toISOString().split('T')[0],
      estadoCivil: informacion.getEstadoCivil().valor,
      genero: '', // No disponible en la entidad actual
      tipoSangre: informacion.getTipoSangre().valor,
      eps: '', // No disponible en la entidad actual
      arl: '', // No disponible en la entidad actual
      fondoPension: '', // No disponible en la entidad actual
      cajaCompensacion: '' // No disponible en la entidad actual
    };
  }

  /**
   * Convierte InformacionVivienda del dominio a DTO para la API
   */
  convertirViviendaADTO(vivienda: InformacionVivienda, cedula: string): ViviendaDTO {
    const direccion = vivienda.getDireccion();
    
    return {
      cedulaEmpleado: cedula,
      tipoVivienda: vivienda.getTipoVivienda().valor,
      tipoAdquisicion: vivienda.getTipoAdquisicion().valor,
      direccion: `${direccion.calle} ${direccion.numero} ${direccion.complemento}`.trim(),
      ciudad: direccion.ciudad,
      departamento: direccion.departamento,
      barrio: direccion.barrio,
      estrato: undefined, // No disponible en la entidad actual
      valorVivienda: vivienda.getValorVivienda(),
      fechaAdquisicion: vivienda.getFechaAdquisicion()?.toISOString().split('T')[0]
    };
  }

  /**
   * Convierte InformacionVehiculo del dominio a DTO para la API
   */
  convertirVehiculoADTO(vehiculo: InformacionVehiculo, cedula: string): VehiculoDTO[] {
    if (!vehiculo.getTieneVehiculo()) {
      return [];
    }

    return [{
      cedulaEmpleado: cedula,
      tipoVehiculo: vehiculo.getTipoVehiculo()?.valor || '',
      marca: vehiculo.getMarca() || '',
      modelo: '', // No disponible en la entidad actual
      año: vehiculo.getAño() || undefined,
      placa: vehiculo.getPlaca() || '',
      color: '', // No disponible en la entidad actual
      propietario: vehiculo.getPropietario() || '',
      soat: '', // No disponible en la entidad actual
      tecnomecanica: '' // No disponible en la entidad actual
    }];
  }

  // ========== MÉTODOS DE GUARDADO PASO A PASO ==========

  /**
   * Guarda el paso 1: Información Personal
   */
  guardarPaso1InformacionPersonal(informacion: InformacionPersonal): Observable<any> {
    const dto = this.convertirInformacionPersonalADTO(informacion);
    return this.formularioApiService.guardarInformacionPersonal(dto);
  }

  /**
   * Guarda el paso 2: Estudios Académicos
   * Nota: Se necesitará implementar la entidad de estudios en el dominio
   */
  guardarPaso2Estudios(cedula: string, estudios: EstudioAcademicoDTO[]): Observable<any> {
    return this.formularioApiService.guardarEstudios(cedula, estudios);
  }

  /**
   * Guarda el paso 3: Vehículos
   */
  guardarPaso3Vehiculos(vehiculo: InformacionVehiculo | undefined, cedula: string): Observable<any> {
    if (!vehiculo) {
      return this.formularioApiService.guardarVehiculos(cedula, []);
    }
    const vehiculosDTO = this.convertirVehiculoADTO(vehiculo, cedula);
    return this.formularioApiService.guardarVehiculos(cedula, vehiculosDTO);
  }

  /**
   * Guarda el paso 4: Vivienda
   */
  guardarPaso4Vivienda(vivienda: InformacionVivienda | undefined, cedula: string): Observable<any> {
    if (!vivienda) {
      throw new Error('La información de vivienda es requerida');
    }
    const viviendaDTO = this.convertirViviendaADTO(vivienda, cedula);
    return this.formularioApiService.guardarVivienda(cedula, viviendaDTO);
  }

  /**
   * Guarda el paso 5: Personas a Cargo
   * Nota: Se necesitará implementar la entidad de personas a cargo en el dominio
   */
  guardarPaso5PersonasACargo(cedula: string, personas: PersonaACargoDTO[]): Observable<any> {
    return this.formularioApiService.guardarPersonasACargo(cedula, personas);
  }

  /**
   * Guarda el paso 6: Contactos de Emergencia
   */
  guardarPaso6ContactosEmergencia(contactos: InformacionContacto | undefined, cedula: string): Observable<any> {
    // Convertir contactos de emergencia del dominio a DTOs
    const contactosDTO: ContactoEmergenciaDTO[] = [];
    
    // Aquí se necesitaría acceder a los contactos de emergencia desde InformacionContacto
    // Por ahora, se pasa un array vacío como placeholder
    
    return this.formularioApiService.guardarContactosEmergencia(cedula, contactosDTO);
  }

  // ========== MÉTODO DE GUARDADO COMPLETO ==========

  /**
   * Guarda todo el formulario de empleado paso a paso
   */
  guardarEmpleadoCompleto(empleado: Empleado): Observable<any> {
    const cedula = empleado.getInformacionPersonal().getNumeroDocumento().valor;

    // Paso 1: Información Personal
    const paso1$ = this.guardarPaso1InformacionPersonal(empleado.getInformacionPersonal());

    // Paso 2: Estudios (placeholder - se necesita implementar en el dominio)
    const paso2$ = this.guardarPaso2Estudios(cedula, []);

    // Paso 3: Vehículos
    const paso3$ = this.guardarPaso3Vehiculos(empleado.getInformacionVehiculo(), cedula);

    // Paso 4: Vivienda
    const paso4$ = this.guardarPaso4Vivienda(empleado.getInformacionVivienda(), cedula);

    // Paso 5: Personas a Cargo (placeholder - se necesita implementar en el dominio)
    const paso5$ = this.guardarPaso5PersonasACargo(cedula, []);

    // Paso 6: Contactos de Emergencia
    const paso6$ = this.guardarPaso6ContactosEmergencia(empleado.getInformacionContacto(), cedula);

    // Ejecutar todos los pasos secuencialmente
    return forkJoin([paso1$, paso2$, paso3$, paso4$, paso5$, paso6$]).pipe(
      map(resultados => {
        console.log('Todos los pasos guardados temporalmente:', resultados);
        return {
          mensaje: 'Todos los pasos guardados temporalmente',
          cedula: cedula,
          pasos: resultados
        };
      }),
      catchError(error => {
        console.error('Error al guardar los pasos:', error);
        throw error;
      })
    );
  }

  /**
   * Finaliza el proceso guardando definitivamente en la base de datos
   */
  finalizarGuardado(cedula: string): Observable<any> {
    return this.formularioApiService.guardarFormularioDefinitivo(cedula);
  }

  /**
   * Proceso completo: guarda temporalmente y luego definitivamente
   */
  procesarFormularioCompleto(empleado: Empleado): Observable<any> {
    const cedula = empleado.getInformacionPersonal().getNumeroDocumento().valor;

    return this.guardarEmpleadoCompleto(empleado).pipe(
      map(resultadoTemporal => {
        console.log('Guardado temporal completado:', resultadoTemporal);
        // Ahora guardar definitivamente
        return this.finalizarGuardado(cedula);
      }),
      catchError(error => {
        console.error('Error en el proceso completo:', error);
        // Limpiar datos temporales en caso de error
        this.formularioApiService.limpiarDatosTemporales(cedula).subscribe();
        throw error;
      })
    );
  }

  // ========== MÉTODOS DE CONSULTA ==========

  /**
   * Obtiene el estado actual del formulario
   */
  obtenerEstadoFormulario(cedula: string): Observable<any> {
    return this.formularioApiService.obtenerEstadoFormulario(cedula);
  }

  /**
   * Verifica si el empleado existe en la base de datos
   */
  verificarEmpleadoExiste(cedula: string): Observable<any> {
    return this.formularioApiService.verificarExistenciaEmpleado(cedula);
  }

  /**
   * Obtiene todos los datos del empleado desde la base de datos
   */
  obtenerDatosCompletos(cedula: string): Observable<any> {
    return this.formularioApiService.obtenerDatosCompletosBD(cedula);
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  /**
   * Limpia todos los datos temporales
   */
  limpiarDatosTemporales(cedula: string): Observable<any> {
    return this.formularioApiService.limpiarDatosTemporales(cedula);
  }

  /**
   * Valida que los datos del empleado estén completos antes de enviar
   */
  validarDatosCompletos(empleado: Empleado): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar información personal
    if (!empleado.getInformacionPersonal()) {
      errores.push('Falta información personal');
    } else {
      const info = empleado.getInformacionPersonal();
      if (!info.getNumeroDocumento().valor) {
        errores.push('Falta número de documento');
      }
      if (!info.getNombreCompleto()) {
        errores.push('Falta nombre completo');
      }
    }

    // Validar información de contacto
    if (!empleado.getInformacionContacto()) {
      errores.push('Falta información de contacto');
    }

    // Validar información de vivienda
    if (!empleado.getInformacionVivienda()) {
      errores.push('Falta información de vivienda');
    }

    // Validar información de vehículo
    if (!empleado.getInformacionVehiculo()) {
      errores.push('Falta información de vehículo');
    }

    return {
      valido: errores.length === 0,
      errores: errores
    };
  }
} 