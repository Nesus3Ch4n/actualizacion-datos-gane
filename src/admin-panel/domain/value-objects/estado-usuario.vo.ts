import { BaseValueObject } from '../../../shared-kernel/common/base.value-object';

export class EstadoUsuario extends BaseValueObject<string> {
  private static readonly ESTADOS_VALIDOS = ['activo', 'inactivo', 'suspendido', 'en-revision'];
  private static readonly COLORES_ESTADO: { [key: string]: string } = {
    'activo': 'primary',
    'inactivo': 'accent',
    'suspendido': 'warn',
    'en-revision': 'warn'
  };

  constructor(value: string) {
    super(value);
  }

  protected validate(): void {
    this.validarEstado();
  }

  private validarEstado(): void {
    if (!EstadoUsuario.ESTADOS_VALIDOS.includes(this.value.toLowerCase())) {
      throw new Error(`Estado de usuario inválido: ${this.value}. Debe ser uno de: ${EstadoUsuario.ESTADOS_VALIDOS.join(', ')}`);
    }
  }

  esActivo(): boolean {
    return this.value.toLowerCase() === 'activo';
  }

  esInactivo(): boolean {
    return this.value.toLowerCase() === 'inactivo';
  }

  estaSuspendido(): boolean {
    return this.value.toLowerCase() === 'suspendido';
  }

  estaEnRevision(): boolean {
    return this.value.toLowerCase() === 'en-revision';
  }

  puedeAccederSistema(): boolean {
    return this.esActivo() || this.estaEnRevision();
  }

  puedeGenerarReportes(): boolean {
    return this.esActivo();
  }

  obtenerColor(): string {
    return EstadoUsuario.COLORES_ESTADO[this.value.toLowerCase()] || 'accent';
  }

  obtenerDescripcion(): string {
    switch (this.value.toLowerCase()) {
      case 'activo':
        return 'Usuario activo en el sistema';
      case 'inactivo':
        return 'Usuario temporalmente inactivo';
      case 'suspendido':
        return 'Usuario suspendido por administración';
      case 'en-revision':
        return 'Usuario en proceso de revisión';
      default:
        return 'Estado desconocido';
    }
  }

  // Métodos estáticos de utilidad
  static obtenerEstadosValidos(): string[] {
    return [...EstadoUsuario.ESTADOS_VALIDOS];
  }

  static obtenerColor(estado: string): string {
    return EstadoUsuario.COLORES_ESTADO[estado.toLowerCase()] || 'accent';
  }

  static crearActivo(): EstadoUsuario {
    return new EstadoUsuario('activo');
  }

  static crearInactivo(): EstadoUsuario {
    return new EstadoUsuario('inactivo');
  }

  static crearSuspendido(): EstadoUsuario {
    return new EstadoUsuario('suspendido');
  }

  static crearEnRevision(): EstadoUsuario {
    return new EstadoUsuario('en-revision');
  }
} 