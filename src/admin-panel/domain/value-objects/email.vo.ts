import { BaseValueObject } from '../../../shared-kernel/common/base.value-object';

export class Email extends BaseValueObject<string> {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly DOMINIOS_EMPRESARIALES = ['empresa.com', 'corporacion.co', 'gane.com.co'];

  constructor(value: string) {
    super(value.toLowerCase().trim());
  }

  protected validate(): void {
    this.validarEmail();
  }

  private validarEmail(): void {
    if (!this.value || this.value.length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    if (!Email.EMAIL_REGEX.test(this.value)) {
      throw new Error('Formato de email inválido');
    }

    if (this.value.length > 254) {
      throw new Error('El email es demasiado largo (máximo 254 caracteres)');
    }

    const [localPart, domain] = this.value.split('@');
    
    if (localPart.length > 64) {
      throw new Error('La parte local del email es demasiado larga (máximo 64 caracteres)');
    }

    if (domain.length > 253) {
      throw new Error('El dominio del email es demasiado largo (máximo 253 caracteres)');
    }
  }

  obtenerDominio(): string {
    return this.value.split('@')[1];
  }

  obtenerUsuario(): string {
    return this.value.split('@')[0];
  }

  esEmailEmpresarial(): boolean {
    const dominio = this.obtenerDominio();
    return Email.DOMINIOS_EMPRESARIALES.includes(dominio);
  }

  esEmailPersonal(): boolean {
    return !this.esEmailEmpresarial();
  }

  obtenerProveedorEmail(): string {
    const dominio = this.obtenerDominio();
    const proveedores: { [key: string]: string } = {
      'gmail.com': 'Gmail',
      'hotmail.com': 'Hotmail',
      'outlook.com': 'Outlook',
      'yahoo.com': 'Yahoo',
      'yahoo.es': 'Yahoo',
      'empresa.com': 'Email Corporativo',
      'corporacion.co': 'Email Corporativo',
      'gane.com.co': 'Email Corporativo'
    };
    
    return proveedores[dominio] || 'Otro proveedor';
  }

  coincideConNombre(nombre: string, apellido: string): boolean {
    const usuario = this.obtenerUsuario().toLowerCase();
    const nombreLimpio = nombre.toLowerCase().replace(/\s/g, '');
    const apellidoLimpio = apellido.toLowerCase().replace(/\s/g, '');
    
    // Verificar diferentes combinaciones comunes
    const patronesComunes = [
      `${nombreLimpio}.${apellidoLimpio}`,
      `${nombreLimpio}${apellidoLimpio}`,
      `${apellidoLimpio}.${nombreLimpio}`,
      `${apellidoLimpio}${nombreLimpio}`,
      `${nombreLimpio.charAt(0)}${apellidoLimpio}`,
      `${nombreLimpio}${apellidoLimpio.charAt(0)}`,
      nombreLimpio,
      apellidoLimpio
    ];
    
    return patronesComunes.some(patron => usuario.includes(patron));
  }

  esValidoParaRegistro(): boolean {
    try {
      this.validarEmail();
      return this.esEmailEmpresarial(); // Solo emails empresariales para registro
    } catch {
      return false;
    }
  }

  obtenerNivelSeguridad(): 'alto' | 'medio' | 'bajo' {
    if (this.esEmailEmpresarial()) {
      return 'alto';
    }
    
    const proveedoresSegurosMedio = ['gmail.com', 'outlook.com', 'hotmail.com'];
    const dominio = this.obtenerDominio();
    
    if (proveedoresSegurosMedio.includes(dominio)) {
      return 'medio';
    }
    
    return 'bajo';
  }

  puedeRecibirNotificacionesInternas(): boolean {
    return this.esEmailEmpresarial();
  }

  // Métodos para búsqueda y filtrado
  coincideConBusqueda(termino: string): boolean {
    const terminoLimpio = termino.toLowerCase().trim();
    return this.value.includes(terminoLimpio) ||
           this.obtenerUsuario().includes(terminoLimpio) ||
           this.obtenerDominio().includes(terminoLimpio);
  }

  // Validaciones adicionales
  tieneDominioValido(): boolean {
    const dominio = this.obtenerDominio();
    // Verificar que el dominio tenga al menos un punto y no termine en punto
    return dominio.includes('.') && !dominio.endsWith('.');
  }

  tieneCaracteresEspecialesValidos(): boolean {
    const caracteresPermitidos = /^[a-zA-Z0-9._%+-]+$/;
    const usuario = this.obtenerUsuario();
    return caracteresPermitidos.test(usuario);
  }

  // Métodos estáticos
  static validarFormato(email: string): boolean {
    try {
      new Email(email);
      return true;
    } catch {
      return false;
    }
  }

  static obtenerDominiosEmpresariales(): string[] {
    return [...Email.DOMINIOS_EMPRESARIALES];
  }

  static esDominioEmpresarial(dominio: string): boolean {
    return Email.DOMINIOS_EMPRESARIALES.includes(dominio.toLowerCase());
  }

  static generarEmailSugerido(nombre: string, apellido: string): string {
    const nombreLimpio = nombre.toLowerCase().replace(/\s/g, '');
    const apellidoLimpio = apellido.toLowerCase().replace(/\s/g, '');
    const dominioEmpresarial = Email.DOMINIOS_EMPRESARIALES[0];
    
    return `${nombreLimpio}.${apellidoLimpio}@${dominioEmpresarial}`;
  }

  // Método para normalización
  normalizar(): Email {
    // Ya se normaliza en el constructor, pero útil para casos especiales
    return new Email(this.value);
  }

  // Conversión a string
  override toString(): string {
    return this.value;
  }

  // Método para logs (oculta parte del email por privacidad)
  toStringSeguro(): string {
    const [usuario, dominio] = this.value.split('@');
    const usuarioOculto = usuario.length > 3 
      ? `${usuario.substring(0, 3)}***` 
      : `${usuario.charAt(0)}***`;
    return `${usuarioOculto}@${dominio}`;
  }
} 