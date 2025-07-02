import { Injectable, Inject } from '@angular/core';
import { EmpleadoRepository } from '../../domain/repositories/empleado.repository';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { EmpleadoDto } from '../dto/empleado.dto';
import { EMPLEADO_REPOSITORY } from '../../actualizacion-datos-empleado.module';

@Injectable()
export class ObtenerEmpleadoUseCase {
  constructor(@Inject(EMPLEADO_REPOSITORY) private readonly empleadoRepository: EmpleadoRepository) {}

  async execute(numeroDocumento: string): Promise<{ exito: boolean; empleado?: EmpleadoDto; mensaje: string }> {
    try {
      const numeroDocumentoVO = new NumeroDocumento(numeroDocumento);
      const empleado = await this.empleadoRepository.buscarPorNumeroDocumento(numeroDocumentoVO);

      if (!empleado) {
        return {
          exito: false,
          mensaje: 'Empleado no encontrado'
        };
      }

      // Mapear entidad a DTO
      const empleadoDto: EmpleadoDto = {
        numeroDocumento: empleado.getNumeroDocumento().valor,
        informacionPersonal: empleado.getInformacionPersonal() ? {
          nombreCompleto: empleado.getInformacionPersonal()!.getNombreCompleto(),
          fechaNacimiento: empleado.getInformacionPersonal()!.getFechaNacimiento().toISOString(),
          ciudadExpedicionCedula: empleado.getInformacionPersonal()!.getCiudadExpedicionCedula(),
          paisNacimiento: empleado.getInformacionPersonal()!.getPaisNacimiento(),
          ciudadNacimiento: empleado.getInformacionPersonal()!.getCiudadNacimiento(),
          cargo: empleado.getInformacionPersonal()!.getCargo(),
          area: empleado.getInformacionPersonal()!.getArea(),
          estadoCivil: empleado.getInformacionPersonal()!.getEstadoCivil().valor,
          tipoSangre: empleado.getInformacionPersonal()!.getTipoSangre().valor,
          edad: empleado.getInformacionPersonal()!.getEdad()
        } : undefined,
        informacionContacto: empleado.getInformacionContacto() ? {
          telefonoCelular: empleado.getInformacionContacto()!.getTelefonoCelular().valor,
          correoPersonal: empleado.getInformacionContacto()!.getCorreoPersonal().valor,
          telefonoFijo: empleado.getInformacionContacto()!.getTelefonoFijo()?.valor,
          telefonoCorporativo: empleado.getInformacionContacto()!.getTelefonoCorporativo()?.valor,
          contactosEmergencia: empleado.getInformacionContacto()!.getContactosEmergencia().map(contacto => ({
            nombre: contacto.getNombre(),
            parentesco: contacto.getParentesco().valor,
            telefono: contacto.getTelefono().valor
          }))
        } : undefined,
        informacionVivienda: empleado.getInformacionVivienda() ? {
          direccion: {
            calle: empleado.getInformacionVivienda()!.getDireccion().calle,
            numero: empleado.getInformacionVivienda()!.getDireccion().numero,
            complemento: empleado.getInformacionVivienda()!.getDireccion().complemento,
            barrio: empleado.getInformacionVivienda()!.getDireccion().barrio,
            ciudad: empleado.getInformacionVivienda()!.getDireccion().ciudad,
            departamento: empleado.getInformacionVivienda()!.getDireccion().departamento
          },
          tipoVivienda: empleado.getInformacionVivienda()!.getTipoVivienda().valor,
          tipoAdquisicion: empleado.getInformacionVivienda()!.getTipoAdquisicion().valor,
          valorVivienda: empleado.getInformacionVivienda()!.getValorVivienda(),
          fechaAdquisicion: empleado.getInformacionVivienda()!.getFechaAdquisicion()?.toISOString()
        } : undefined,
        informacionVehiculo: empleado.getInformacionVehiculo() ? {
          tieneVehiculo: empleado.getInformacionVehiculo()!.getTieneVehiculo(),
          tipoVehiculo: empleado.getInformacionVehiculo()!.getTipoVehiculo()?.valor,
          marca: empleado.getInformacionVehiculo()!.getMarca(),
          placa: empleado.getInformacionVehiculo()!.getPlaca(),
          año: empleado.getInformacionVehiculo()!.getAño(),
          propietario: empleado.getInformacionVehiculo()!.getPropietario()
        } : undefined,
        informacionAcademica: empleado.getInformacionAcademica() ? {
          estaEstudiando: empleado.getInformacionAcademica()!.getEstaEstudiando(),
          estudios: empleado.getInformacionAcademica()!.getEstudios().map(estudio => ({
            nivelEducativo: estudio.getNivelEducativo().valor,
            titulo: estudio.getTitulo(),
            institucion: estudio.getInstitucion(),
            fechaInicio: estudio.getFechaInicio().toISOString(),
            fechaGraduacion: estudio.getFechaGraduacion()?.toISOString(),
            enCurso: estudio.getEnCurso()
          }))
        } : undefined,
        personasACargo: empleado.getPersonasACargo().map(persona => ({
          numeroDocumento: persona.getNumeroDocumento(),
          nombreCompleto: persona.getNombreCompleto(),
          parentesco: persona.getParentesco().valor,
          fechaNacimiento: persona.getFechaNacimiento().toISOString(),
          edad: persona.getEdad(),
          esDependienteEconomico: persona.getEsDependienteEconomico()
        })),
        estaCompleto: empleado.estaCompleto()
      };

      return {
        exito: true,
        empleado: empleadoDto,
        mensaje: 'Empleado encontrado exitosamente'
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: error instanceof Error ? error.message : 'Error al obtener el empleado'
      };
    }
  }
} 