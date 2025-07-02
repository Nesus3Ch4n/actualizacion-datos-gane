import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Empleado } from '../../domain/entities/empleado.entity';
import { InformacionPersonal } from '../../domain/entities/informacion-personal.entity';
import { InformacionContacto } from '../../domain/entities/informacion-contacto.entity';
import { InformacionVivienda } from '../../domain/entities/informacion-vivienda.entity';
import { InformacionVehiculo } from '../../domain/entities/informacion-vehiculo.entity';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Telefono } from '../../domain/value-objects/telefono.vo';
import { EstadoCivil } from '../../domain/value-objects/estado-civil.vo';
import { TipoSangre } from '../../domain/value-objects/tipo-sangre.vo';
import { Direccion } from '../../domain/value-objects/direccion.vo';
import { TipoVivienda } from '../../domain/value-objects/tipo-vivienda.vo';
import { TipoAdquisicion } from '../../domain/value-objects/tipo-adquisicion.vo';
import { TipoVehiculo } from '../../domain/value-objects/tipo-vehiculo.vo';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoFormAdapter {

  convertirFormularioInformacionPersonalAEntidad(form: FormGroup): InformacionPersonal {
    const valores = form.value;
    
    return new InformacionPersonal(
      new NumeroDocumento(valores.documento),
      valores.nombre_intg,
      new Date(valores.fecha_nacimiento),
      valores.cedula_expedida,
      valores.pais_nacimiento,
      valores.ciudad_nacimiento,
      valores.cargo,
      valores.area,
      new EstadoCivil(valores.estadocivil),
      new TipoSangre(valores.tipo_sangre)
    );
  }

  convertirFormularioContactoAEntidad(form: FormGroup, contactosEmergencia: any[]): InformacionContacto {
    const valores = form.value;
    
    const informacionContacto = new InformacionContacto(
      new Telefono(valores.num_celular),
      new Email(valores.correo_personal),
      valores.num_fijo ? new Telefono(valores.num_fijo) : undefined,
      valores.num_corporativo ? new Telefono(valores.num_corporativo) : undefined
    );

    // Agregar contactos de emergencia
    // TODO: Implementar conversión de contactos de emergencia

    return informacionContacto;
  }

  convertirFormularioViviendaAEntidad(form: FormGroup): InformacionVivienda {
    const valores = form.value;
    
    const direccion = new Direccion(
      valores.calle,
      valores.numero,
      valores.complemento || '',
      valores.barrio,
      valores.ciudad,
      valores.departamento
    );

    return new InformacionVivienda(
      direccion,
      new TipoVivienda(valores.tipo_vivienda),
      new TipoAdquisicion(valores.tipo_adquisicion),
      valores.valor_vivienda,
      valores.fecha_adquisicion ? new Date(valores.fecha_adquisicion) : undefined
    );
  }

  convertirFormularioVehiculoAEntidad(form: FormGroup): InformacionVehiculo | undefined {
    const valores = form.value;
    
    if (valores.vehiculo === '1' || valores.vehiculo === 'false') {
      return new InformacionVehiculo(false);
    }

    return new InformacionVehiculo(
      true,
      new TipoVehiculo(valores.tipo_vehiculo),
      valores.marca,
      valores.placa,
      valores.año,
      valores.prop_vehiculo
    );
  }

  convertirEntidadAFormularioInformacionPersonal(informacionPersonal: InformacionPersonal): any {
    return {
      documento: informacionPersonal.getNumeroDocumento().valor,
      nombre_intg: informacionPersonal.getNombreCompleto(),
      fecha_nacimiento: informacionPersonal.getFechaNacimiento().toISOString().split('T')[0],
      cedula_expedida: informacionPersonal.getCiudadExpedicionCedula(),
      pais_nacimiento: informacionPersonal.getPaisNacimiento(),
      ciudad_nacimiento: informacionPersonal.getCiudadNacimiento(),
      cargo: informacionPersonal.getCargo(),
      area: informacionPersonal.getArea(),
      estadocivil: informacionPersonal.getEstadoCivil().valor,
      tipo_sangre: informacionPersonal.getTipoSangre().valor
    };
  }

  convertirEntidadAFormularioContacto(informacionContacto: InformacionContacto): any {
    return {
      num_celular: informacionContacto.getTelefonoCelular().valor,
      correo_personal: informacionContacto.getCorreoPersonal().valor,
      num_fijo: informacionContacto.getTelefonoFijo()?.valor || '',
      num_corporativo: informacionContacto.getTelefonoCorporativo()?.valor || ''
    };
  }

  convertirEntidadAFormularioVivienda(informacionVivienda: InformacionVivienda): any {
    const direccion = informacionVivienda.getDireccion();
    
    return {
      calle: direccion.calle,
      numero: direccion.numero,
      complemento: direccion.complemento,
      barrio: direccion.barrio,
      ciudad: direccion.ciudad,
      departamento: direccion.departamento,
      tipo_vivienda: informacionVivienda.getTipoVivienda().valor,
      tipo_adquisicion: informacionVivienda.getTipoAdquisicion().valor,
      valor_vivienda: informacionVivienda.getValorVivienda(),
      fecha_adquisicion: informacionVivienda.getFechaAdquisicion()?.toISOString().split('T')[0]
    };
  }

  convertirEntidadAFormularioVehiculo(informacionVehiculo: InformacionVehiculo): any {
    if (!informacionVehiculo.getTieneVehiculo()) {
      return {
        vehiculo: '1',
        tipo_vehiculo: '',
        marca: '',
        placa: '',
        año: '',
        prop_vehiculo: ''
      };
    }

    return {
      vehiculo: '2',
      tipo_vehiculo: informacionVehiculo.getTipoVehiculo()?.valor || '',
      marca: informacionVehiculo.getMarca() || '',
      placa: informacionVehiculo.getPlaca() || '',
      año: informacionVehiculo.getAño() || '',
      prop_vehiculo: informacionVehiculo.getPropietario() || ''
    };
  }
} 