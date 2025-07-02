import { InformacionPersonal } from './informacion-personal.entity';
import { InformacionContacto } from './informacion-contacto.entity';
import { InformacionVivienda } from './informacion-vivienda.entity';
import { InformacionVehiculo } from './informacion-vehiculo.entity';
import { InformacionAcademica } from './informacion-academica.entity';
import { PersonaACargo } from './persona-acargo.entity';
import { NumeroDocumento } from '../value-objects/numero-documento.vo';

export class Empleado {
  constructor(
    private readonly numeroDocumento: NumeroDocumento,
    private informacionPersonal: InformacionPersonal,
    private informacionContacto?: InformacionContacto,
    private informacionVivienda?: InformacionVivienda,
    private informacionVehiculo?: InformacionVehiculo,
    private informacionAcademica?: InformacionAcademica,
    private personasACargo: PersonaACargo[] = []
  ) {}

  // Getters
  getNumeroDocumento(): NumeroDocumento {
    return this.numeroDocumento;
  }

  getInformacionPersonal(): InformacionPersonal {
    return this.informacionPersonal;
  }

  getInformacionContacto(): InformacionContacto | undefined {
    return this.informacionContacto;
  }

  getInformacionVivienda(): InformacionVivienda | undefined {
    return this.informacionVivienda;
  }

  getInformacionVehiculo(): InformacionVehiculo | undefined {
    return this.informacionVehiculo;
  }

  getInformacionAcademica(): InformacionAcademica | undefined {
    return this.informacionAcademica;
  }

  getPersonasACargo(): PersonaACargo[] {
    return [...this.personasACargo];
  }

  // Métodos de negocio
  actualizarInformacionPersonal(informacionPersonal: InformacionPersonal): void {
    this.informacionPersonal = informacionPersonal;
  }

  actualizarInformacionContacto(informacionContacto: InformacionContacto): void {
    this.informacionContacto = informacionContacto;
  }

  actualizarInformacionVivienda(informacionVivienda: InformacionVivienda): void {
    this.informacionVivienda = informacionVivienda;
  }

  actualizarInformacionVehiculo(informacionVehiculo: InformacionVehiculo): void {
    this.informacionVehiculo = informacionVehiculo;
  }

  actualizarInformacionAcademica(informacionAcademica: InformacionAcademica): void {
    this.informacionAcademica = informacionAcademica;
  }

  agregarPersonaACargo(persona: PersonaACargo): void {
    if (this.personasACargo.length >= 10) {
      throw new Error('No se pueden registrar más de 10 personas a cargo');
    }
    this.personasACargo.push(persona);
  }

  removerPersonaACargo(numeroDocumento: string): void {
    this.personasACargo = this.personasACargo.filter(
      persona => persona.getNumeroDocumento() !== numeroDocumento
    );
  }

  estaCompleto(): boolean {
    return !!(
      this.informacionPersonal &&
      this.informacionContacto &&
      this.informacionVivienda
    );
  }

  // Método para validar reglas de negocio
  validar(): string[] {
    const errores: string[] = [];

    if (!this.informacionPersonal) {
      errores.push('La información personal es obligatoria');
    }

    if (!this.informacionContacto) {
      errores.push('La información de contacto es obligatoria');
    }

    if (!this.informacionVivienda) {
      errores.push('La información de vivienda es obligatoria');
    }

    return errores;
  }
} 