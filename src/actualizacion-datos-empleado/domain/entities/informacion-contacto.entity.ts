import { Email } from '../value-objects/email.vo';
import { Telefono } from '../value-objects/telefono.vo';
import { ContactoEmergencia } from './contacto-emergencia.entity';

export class InformacionContacto {
  constructor(
    private readonly telefonoCelular: Telefono,
    private readonly correoPersonal: Email,
    private readonly telefonoFijo?: Telefono,
    private readonly telefonoCorporativo?: Telefono,
    private contactosEmergencia: ContactoEmergencia[] = []
  ) {
    this.validarDatos();
  }

  // Getters
  getTelefonoCelular(): Telefono {
    return this.telefonoCelular;
  }

  getCorreoPersonal(): Email {
    return this.correoPersonal;
  }

  getTelefonoFijo(): Telefono | undefined {
    return this.telefonoFijo;
  }

  getTelefonoCorporativo(): Telefono | undefined {
    return this.telefonoCorporativo;
  }

  getContactosEmergencia(): ContactoEmergencia[] {
    return [...this.contactosEmergencia];
  }

  // Métodos de negocio
  agregarContactoEmergencia(contacto: ContactoEmergencia): void {
    if (this.contactosEmergencia.length >= 5) {
      throw new Error('No se pueden registrar más de 5 contactos de emergencia');
    }

    const existeContacto = this.contactosEmergencia.some(
      c => c.getTelefono().valor === contacto.getTelefono().valor
    );

    if (existeContacto) {
      throw new Error('Ya existe un contacto de emergencia con este número de teléfono');
    }

    this.contactosEmergencia.push(contacto);
  }

  removerContactoEmergencia(telefono: string): void {
    this.contactosEmergencia = this.contactosEmergencia.filter(
      contacto => contacto.getTelefono().valor !== telefono
    );
  }

  tieneContactosEmergencia(): boolean {
    return this.contactosEmergencia.length > 0;
  }

  private validarDatos(): void {
    if (this.contactosEmergencia.length === 0) {
      throw new Error('Debe registrar al menos un contacto de emergencia');
    }
  }
} 