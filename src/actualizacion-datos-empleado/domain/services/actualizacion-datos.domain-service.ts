import { Empleado } from '../entities/empleado.entity';
import { InformacionPersonal } from '../entities/informacion-personal.entity';
import { InformacionContacto } from '../entities/informacion-contacto.entity';
import { InformacionVivienda } from '../entities/informacion-vivienda.entity';
import { InformacionVehiculo } from '../entities/informacion-vehiculo.entity';
import { InformacionAcademica } from '../entities/informacion-academica.entity';
import { PersonaACargo } from '../entities/persona-acargo.entity';
import { EmpleadoRepository } from '../repositories/empleado.repository';

export class ActualizacionDatosDomainService {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async validarActualizacionCompleta(empleado: Empleado): Promise<string[]> {
    const errores: string[] = [];

    // Validar que el empleado existe
    const empleadoExistente = await this.empleadoRepository.buscarPorNumeroDocumento(
      empleado.getNumeroDocumento()
    );

    if (!empleadoExistente) {
      errores.push('El empleado no existe en el sistema');
      return errores;
    }

    // Validar reglas de negocio del empleado
    const erroresEmpleado = empleado.validar();
    errores.push(...erroresEmpleado);

    // Validar información personal
    if (!empleado.getInformacionPersonal()) {
      errores.push('La información personal es obligatoria');
    }

    // Validar información de contacto
    if (!empleado.getInformacionContacto()) {
      errores.push('La información de contacto es obligatoria');
    } else {
      const contacto = empleado.getInformacionContacto()!;
      if (!contacto.tieneContactosEmergencia()) {
        errores.push('Debe registrar al menos un contacto de emergencia');
      }
    }

    // Validar información de vivienda
    if (!empleado.getInformacionVivienda()) {
      errores.push('La información de vivienda es obligatoria');
    }

    return errores;
  }

  async procesarActualizacionPorPasos(
    numeroDocumento: string,
    paso: number,
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      const empleado = await this.empleadoRepository.buscarPorNumeroDocumento(
        new (await import('../value-objects/numero-documento.vo')).NumeroDocumento(numeroDocumento)
      );

      if (!empleado) {
        return { exito: false, errores: ['Empleado no encontrado'] };
      }

      switch (paso) {
        case 1:
          return await this.actualizarInformacionPersonal(empleado, datos);
        case 2:
          return await this.actualizarInformacionVehiculo(empleado, datos);
        case 3:
          return await this.actualizarInformacionVivienda(empleado, datos);
        case 4:
          return await this.actualizarInformacionContacto(empleado, datos);
        case 5:
          return await this.actualizarInformacionAcademica(empleado, datos);
        case 6:
          return await this.actualizarPersonasACargo(empleado, datos);
        default:
          return { exito: false, errores: ['Paso inválido'] };
      }
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error desconocido'] 
      };
    }
  }

  private async actualizarInformacionPersonal(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      // Aquí se crearían los value objects y la entidad
      // Por simplicidad, asumo que los datos ya están validados
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar información personal'] 
      };
    }
  }

  private async actualizarInformacionVehiculo(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar información de vehículo'] 
      };
    }
  }

  private async actualizarInformacionVivienda(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar información de vivienda'] 
      };
    }
  }

  private async actualizarInformacionContacto(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar información de contacto'] 
      };
    }
  }

  private async actualizarInformacionAcademica(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar información académica'] 
      };
    }
  }

  private async actualizarPersonasACargo(
    empleado: Empleado, 
    datos: any
  ): Promise<{ exito: boolean; errores: string[] }> {
    try {
      await this.empleadoRepository.actualizar(empleado);
      return { exito: true, errores: [] };
    } catch (error) {
      return { 
        exito: false, 
        errores: [error instanceof Error ? error.message : 'Error al actualizar personas a cargo'] 
      };
    }
  }

  async calcularProgresoActualizacion(empleado: Empleado): Promise<number> {
    let pasoCompletados = 0;
    const totalPasos = 6;

    if (empleado.getInformacionPersonal()) pasoCompletados++;
    if (empleado.getInformacionVehiculo()) pasoCompletados++;
    if (empleado.getInformacionVivienda()) pasoCompletados++;
    if (empleado.getInformacionContacto()) pasoCompletados++;
    if (empleado.getInformacionAcademica()) pasoCompletados++;
    if (empleado.getPersonasACargo().length > 0) pasoCompletados++;

    return Math.round((pasoCompletados / totalPasos) * 100);
  }
} 