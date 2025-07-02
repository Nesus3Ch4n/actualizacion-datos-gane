import { BaseEntity } from '../../../shared-kernel/common/base.entity';
import { EstadoUsuario } from '../value-objects/estado-usuario.vo';
import { Email } from '../value-objects/email.vo';
import { NombreCompleto } from '../value-objects/nombre-completo.vo';
import { Departamento } from '../value-objects/departamento.vo';

export class Usuario extends BaseEntity<number> {
  private _nombre: NombreCompleto;
  private _email: Email;
  private _cargo: string;
  private _departamento: Departamento;
  private _fechaIngreso: Date;
  private _estado: EstadoUsuario;
  private _ultimaActualizacion: Date;
  private _tieneConflictoIntereses: boolean;

  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    cargo: string,
    departamento: string,
    fechaIngreso: Date,
    estado: string,
    ultimaActualizacion: Date,
    tieneConflictoIntereses: boolean
  ) {
    super(id);
    this._nombre = new NombreCompleto(nombre, apellido);
    this._email = new Email(email);
    this._cargo = cargo;
    this._departamento = new Departamento(departamento);
    this._fechaIngreso = fechaIngreso;
    this._estado = new EstadoUsuario(estado);
    this._ultimaActualizacion = ultimaActualizacion;
    this._tieneConflictoIntereses = tieneConflictoIntereses;
  }

  validate(): string[] {
    // Las validaciones se realizan en los value objects
    // No hay validaciones adicionales a nivel de entidad
    return [];
  }

  // Getters
  get nombreCompleto(): NombreCompleto {
    return this._nombre;
  }

  get nombre(): string {
    return this._nombre.nombre;
  }

  get apellido(): string {
    return this._nombre.apellido;
  }

  get email(): Email {
    return this._email;
  }

  get emailValue(): string {
    return this._email.value;
  }

  get cargo(): string {
    return this._cargo;
  }

  get departamento(): Departamento {
    return this._departamento;
  }

  get departamentoValue(): string {
    return this._departamento.value;
  }

  get fechaIngreso(): Date {
    return this._fechaIngreso;
  }

  get estado(): EstadoUsuario {
    return this._estado;
  }

  get estadoValue(): string {
    return this._estado.value;
  }

  get ultimaActualizacion(): Date {
    return this._ultimaActualizacion;
  }

  get tieneConflictoIntereses(): boolean {
    return this._tieneConflictoIntereses;
  }

  // Métodos de negocio
  activar(): void {
    this._estado = new EstadoUsuario('activo');
    this._ultimaActualizacion = new Date();
  }

  desactivar(): void {
    this._estado = new EstadoUsuario('inactivo');
    this._ultimaActualizacion = new Date();
  }

  actualizarConflictoIntereses(tieneConflicto: boolean): void {
    this._tieneConflictoIntereses = tieneConflicto;
    this._ultimaActualizacion = new Date();
  }

  actualizarCargo(nuevoCargo: string): void {
    if (!nuevoCargo || nuevoCargo.trim().length === 0) {
      throw new Error('El cargo no puede estar vacío');
    }
    this._cargo = nuevoCargo.trim();
    this._ultimaActualizacion = new Date();
  }

  cambiarDepartamento(nuevoDepartamento: string): void {
    this._departamento = new Departamento(nuevoDepartamento);
    this._ultimaActualizacion = new Date();
  }

  puedeGenerarReportes(): boolean {
    return this._estado.esActivo();
  }

  estaActivo(): boolean {
    return this._estado.esActivo();
  }

  requiereActualizacionDatos(): boolean {
    const unAnio = 365 * 24 * 60 * 60 * 1000; // milisegundos en un año
    const ahora = new Date();
    return (ahora.getTime() - this._ultimaActualizacion.getTime()) > unAnio;
  }

  // Método para obtener información básica como string
  obtenerInformacionBasica(): string {
    return `${this._nombre.obtenerNombreCompleto()} - ${this._cargo} (${this._departamento.value})`;
  }

  // Validar si puede ser incluido en reportes específicos
  puedeSerIncluidoEnReporte(tipoReporte: string): boolean {
    switch (tipoReporte) {
      case 'conflicto-intereses':
        return this._tieneConflictoIntereses;
      case 'activos':
        return this.estaActivo();
      case 'estudios':
      case 'contacto':
      case 'personas-cargo':
      case 'integrantes':
        return true;
      default:
        return false;
    }
  }

  // Método para convertir a JSON (útil para APIs)
  toJSON(): any {
    return {
      id: this.id,
      nombre: this._nombre.nombre,
      apellido: this._nombre.apellido,
      email: this._email.value,
      cargo: this._cargo,
      departamento: this._departamento.value,
      fechaIngreso: this._fechaIngreso,
      estado: this._estado.value,
      ultimaActualizacion: this._ultimaActualizacion,
      tieneConflictoIntereses: this._tieneConflictoIntereses
    };
  }

  // Factory method para crear desde datos planos
  static fromPlainObject(data: any): Usuario {
    return new Usuario(
      data.id,
      data.nombre,
      data.apellido,
      data.email,
      data.cargo,
      data.departamento,
      new Date(data.fechaIngreso),
      data.estado,
      new Date(data.ultimaActualizacion),
      data.tieneConflictoIntereses
    );
  }
} 