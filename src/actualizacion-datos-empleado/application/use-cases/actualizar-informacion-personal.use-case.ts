import { Injectable, Inject } from '@angular/core';
import { EmpleadoRepository } from '../../domain/repositories/empleado.repository';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { EstadoCivil } from '../../domain/value-objects/estado-civil.vo';
import { TipoSangre } from '../../domain/value-objects/tipo-sangre.vo';
import { InformacionPersonal } from '../../domain/entities/informacion-personal.entity';
import { ActualizarInformacionPersonalDto } from '../dto/actualizar-informacion-personal.dto';
import { EMPLEADO_REPOSITORY } from '../../actualizacion-datos-empleado.module';

@Injectable()
export class ActualizarInformacionPersonalUseCase {
  constructor(@Inject(EMPLEADO_REPOSITORY) private readonly empleadoRepository: EmpleadoRepository) {}

  async execute(dto: ActualizarInformacionPersonalDto): Promise<{ exito: boolean; mensaje: string; errores?: string[] }> {
    try {
      // Validar que el empleado existe
      const numeroDocumento = new NumeroDocumento(dto.numeroDocumento);
      const empleado = await this.empleadoRepository.buscarPorNumeroDocumento(numeroDocumento);

      if (!empleado) {
        return {
          exito: false,
          mensaje: 'Empleado no encontrado',
          errores: ['El empleado no existe en el sistema']
        };
      }

      // Crear los value objects
      const estadoCivil = new EstadoCivil(dto.estadoCivil);
      const tipoSangre = new TipoSangre(dto.tipoSangre);

      // Crear la nueva información personal
      const nuevaInformacionPersonal = new InformacionPersonal(
        numeroDocumento,
        dto.nombreCompleto,
        new Date(dto.fechaNacimiento),
        dto.ciudadExpedicionCedula,
        dto.paisNacimiento,
        dto.ciudadNacimiento,
        dto.cargo,
        dto.area,
        estadoCivil,
        tipoSangre
      );

      // Actualizar el empleado
      empleado.actualizarInformacionPersonal(nuevaInformacionPersonal);

      // Guardar en el repositorio
      await this.empleadoRepository.actualizar(empleado);

      return {
        exito: true,
        mensaje: 'Información personal actualizada exitosamente'
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: 'Error al actualizar la información personal',
        errores: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }
} 