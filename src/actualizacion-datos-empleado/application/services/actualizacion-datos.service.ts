import { Injectable, Inject } from '@angular/core';
import { EmpleadoRepository } from '../../domain/repositories/empleado.repository';
import { ActualizarInformacionPersonalUseCase } from '../use-cases/actualizar-informacion-personal.use-case';
import { ObtenerEmpleadoUseCase } from '../use-cases/obtener-empleado.use-case';
import { ActualizarInformacionPersonalDto } from '../dto/actualizar-informacion-personal.dto';
import { EmpleadoDto } from '../dto/empleado.dto';
import { EMPLEADO_REPOSITORY } from '../../actualizacion-datos-empleado.module';

@Injectable({
  providedIn: 'root'
})
export class ActualizacionDatosService {
  private actualizarInformacionPersonalUseCase: ActualizarInformacionPersonalUseCase;
  private obtenerEmpleadoUseCase: ObtenerEmpleadoUseCase;

  constructor(@Inject(EMPLEADO_REPOSITORY) private readonly empleadoRepository: EmpleadoRepository) {
    this.actualizarInformacionPersonalUseCase = new ActualizarInformacionPersonalUseCase(empleadoRepository);
    this.obtenerEmpleadoUseCase = new ObtenerEmpleadoUseCase(empleadoRepository);
  }

  async obtenerEmpleado(numeroDocumento: string): Promise<{ exito: boolean; empleado?: EmpleadoDto; mensaje: string }> {
    return await this.obtenerEmpleadoUseCase.execute(numeroDocumento);
  }

  async actualizarInformacionPersonal(dto: ActualizarInformacionPersonalDto): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    return await this.actualizarInformacionPersonalUseCase.execute(dto);
  }

  // Métodos para otros pasos del formulario
  async actualizarInformacionContacto(datos: any): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    // TODO: Implementar caso de uso para contacto
    return { exito: true, mensaje: 'Contacto actualizado (pendiente implementación)' };
  }

  async actualizarInformacionVivienda(datos: any): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    // TODO: Implementar caso de uso para vivienda
    return { exito: true, mensaje: 'Vivienda actualizada (pendiente implementación)' };
  }

  async actualizarInformacionVehiculo(datos: any): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    // TODO: Implementar caso de uso para vehículo
    return { exito: true, mensaje: 'Vehículo actualizado (pendiente implementación)' };
  }

  async actualizarInformacionAcademica(datos: any): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    // TODO: Implementar caso de uso para académico
    return { exito: true, mensaje: 'Información académica actualizada (pendiente implementación)' };
  }

  async actualizarPersonasACargo(datos: any): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    // TODO: Implementar caso de uso para personas a cargo
    return { exito: true, mensaje: 'Personas a cargo actualizadas (pendiente implementación)' };
  }

  // Método para obtener opciones de formularios
  getOpcionesEstadoCivil(): string[] {
    return ['SOLTERO', 'CASADO', 'UNION_LIBRE', 'DIVORCIADO', 'VIUDO', 'SEPARADO'];
  }

  getOpcionesTipoSangre(): string[] {
    return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  }

  getOpcionesTipoVivienda(): string[] {
    return ['CASA', 'APARTAMENTO', 'CASA_LOTE', 'FINCA', 'HABITACION', 'OTRO'];
  }

  getOpcionesTipoAdquisicion(): string[] {
    return ['PROPIA', 'ARRENDADA', 'FAMILIAR', 'PRESTADA', 'OTRO'];
  }

  getOpcionesTipoVehiculo(): string[] {
    return ['AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'CAMION', 'BUS', 'BICICLETA', 'OTRO'];
  }

  getOpcionesNivelEducativo(): string[] {
    return ['PRIMARIA', 'SECUNDARIA', 'TECNICO', 'TECNOLOGO', 'UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'];
  }

  getOpcionesParentesco(): string[] {
    return ['PADRE', 'MADRE', 'HERMANO', 'HERMANA', 'HIJO', 'HIJA', 'ABUELO', 'ABUELA', 'TIO', 'TIA', 'SOBRINO', 'SOBRINA', 'PRIMO', 'PRIMA', 'ESPOSO', 'ESPOSA', 'AMIGO', 'AMIGA', 'CONOCIDO'];
  }
} 