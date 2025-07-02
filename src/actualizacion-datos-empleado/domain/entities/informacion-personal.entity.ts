import { NumeroDocumento } from '../value-objects/numero-documento.vo';
import { Email } from '../value-objects/email.vo';
import { EstadoCivil } from '../value-objects/estado-civil.vo';
import { TipoSangre } from '../value-objects/tipo-sangre.vo';

export class InformacionPersonal {
  constructor(
    private readonly numeroDocumento: NumeroDocumento,
    private readonly nombreCompleto: string,
    private readonly fechaNacimiento: Date,
    private readonly ciudadExpedicionCedula: string,
    private readonly paisNacimiento: string,
    private readonly ciudadNacimiento: string,
    private readonly cargo: string,
    private readonly area: string,
    private readonly estadoCivil: EstadoCivil,
    private readonly tipoSangre: TipoSangre
  ) {
    this.validarDatos();
  }

  // Getters
  getNumeroDocumento(): NumeroDocumento {
    return this.numeroDocumento;
  }

  getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  getFechaNacimiento(): Date {
    return this.fechaNacimiento;
  }

  getCiudadExpedicionCedula(): string {
    return this.ciudadExpedicionCedula;
  }

  getPaisNacimiento(): string {
    return this.paisNacimiento;
  }

  getCiudadNacimiento(): string {
    return this.ciudadNacimiento;
  }

  getCargo(): string {
    return this.cargo;
  }

  getArea(): string {
    return this.area;
  }

  getEstadoCivil(): EstadoCivil {
    return this.estadoCivil;
  }

  getTipoSangre(): TipoSangre {
    return this.tipoSangre;
  }

  // Métodos de negocio
  getEdad(): number {
    const hoy = new Date();
    const edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = this.fechaNacimiento.getMonth();
    
    if (mesActual < mesNacimiento || 
        (mesActual === mesNacimiento && hoy.getDate() < this.fechaNacimiento.getDate())) {
      return edad - 1;
    }
    
    return edad;
  }

  esMayorDeEdad(): boolean {
    return this.getEdad() >= 18;
  }

  private validarDatos(): void {
    if (!this.nombreCompleto.trim()) {
      throw new Error('El nombre completo es obligatorio');
    }

    if (this.nombreCompleto.length < 3) {
      throw new Error('El nombre completo debe tener al menos 3 caracteres');
    }

    if (!this.ciudadExpedicionCedula.trim()) {
      throw new Error('La ciudad de expedición de la cédula es obligatoria');
    }

    if (!this.paisNacimiento.trim()) {
      throw new Error('El país de nacimiento es obligatorio');
    }

    if (!this.ciudadNacimiento.trim()) {
      throw new Error('La ciudad de nacimiento es obligatoria');
    }

    if (!this.cargo.trim()) {
      throw new Error('El cargo es obligatorio');
    }

    if (!this.area.trim()) {
      throw new Error('El área es obligatoria');
    }

    const hoy = new Date();
    if (this.fechaNacimiento > hoy) {
      throw new Error('La fecha de nacimiento no puede ser futura');
    }

    if (!this.esMayorDeEdad()) {
      throw new Error('El empleado debe ser mayor de edad');
    }
  }
} 