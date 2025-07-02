import { BaseValueObject } from '../../../shared-kernel/common/base.value-object';

export class NombreCompleto extends BaseValueObject<{nombre: string, apellido: string}> {
  private _nombre: string;
  private _apellido: string;

  constructor(nombre: string, apellido: string) {
    const valor = { nombre: nombre.trim(), apellido: apellido.trim() };
    super(valor);
    this._nombre = valor.nombre;
    this._apellido = valor.apellido;
  }

  protected validate(): void {
    this.validarNombre();
  }

  private validarNombre(): void {
    if (!this._nombre || this._nombre.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!this._apellido || this._apellido.length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this._nombre)) {
      throw new Error('El nombre solo puede contener letras y espacios');
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this._apellido)) {
      throw new Error('El apellido solo puede contener letras y espacios');
    }
  }

  get nombre(): string {
    return this._nombre;
  }

  get apellido(): string {
    return this._apellido;
  }

  obtenerNombreCompleto(): string {
    return `${this._nombre} ${this._apellido}`;
  }

  obtenerApellidoNombre(): string {
    return `${this._apellido}, ${this._nombre}`;
  }

  obtenerIniciales(): string {
    const inicialesNombre = this._nombre.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
    const inicialesApellido = this._apellido.split(' ').map(a => a.charAt(0).toUpperCase()).join('');
    return `${inicialesNombre}${inicialesApellido}`;
  }

  obtenerNombreCorto(): string {
    const primerNombre = this._nombre.split(' ')[0];
    const primerApellido = this._apellido.split(' ')[0];
    return `${primerNombre} ${primerApellido}`;
  }

  obtenerNombreFormal(): string {
    // Para uso en documentos formales
    return `${this._apellido.toUpperCase()}, ${this._nombre}`;
  }

  contienePalabra(palabra: string): boolean {
    const textoCompleto = this.obtenerNombreCompleto().toLowerCase();
    return textoCompleto.includes(palabra.toLowerCase());
  }

  empiezaCon(texto: string): boolean {
    return this.obtenerNombreCompleto().toLowerCase().startsWith(texto.toLowerCase());
  }

  // Métodos de comparación
  esIgualA(otroNombre: NombreCompleto): boolean {
    return this._nombre.toLowerCase() === otroNombre._nombre.toLowerCase() &&
           this._apellido.toLowerCase() === otroNombre._apellido.toLowerCase();
  }

  esSimilarA(otroNombre: NombreCompleto): boolean {
    // Comparación más flexible que ignora acentos y espacios adicionales
    const normalizarTexto = (texto: string) => {
      return texto.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '') // Remover acentos
                  .toLowerCase()
                  .replace(/\s+/g, ' ')
                  .trim();
    };

    const nombreNormalizado = normalizarTexto(this._nombre);
    const apellidoNormalizado = normalizarTexto(this._apellido);
    const otroNombreNormalizado = normalizarTexto(otroNombre._nombre);
    const otroApellidoNormalizado = normalizarTexto(otroNombre._apellido);

    return nombreNormalizado === otroNombreNormalizado &&
           apellidoNormalizado === otroApellidoNormalizado;
  }

  // Validaciones adicionales
  tienePalabrasReservadas(): boolean {
    const palabrasReservadas = ['admin', 'administrator', 'system', 'test', 'demo'];
    const nombreCompleto = this.obtenerNombreCompleto().toLowerCase();
    return palabrasReservadas.some(palabra => nombreCompleto.includes(palabra));
  }

  esValido(): boolean {
    try {
      this.validarNombre();
      return !this.tienePalabrasReservadas();
    } catch {
      return false;
    }
  }

  // Métodos estáticos de utilidad
  static crearDesdeTexto(nombreCompleto: string): NombreCompleto {
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length < 2) {
      throw new Error('Debe proporcionar al menos nombre y apellido');
    }
    
    // Asumimos que la última palabra es apellido y el resto es nombre
    const apellido = partes.pop() || '';
    const nombre = partes.join(' ');
    
    return new NombreCompleto(nombre, apellido);
  }

  static validarFormato(texto: string): boolean {
    try {
      NombreCompleto.crearDesdeTexto(texto);
      return true;
    } catch {
      return false;
    }
  }

  // Métodos para búsqueda y filtrado
  coincideConBusqueda(termino: string): boolean {
    const terminoLimpio = termino.toLowerCase().trim();
    const nombreCompleto = this.obtenerNombreCompleto().toLowerCase();
    
    // Buscar coincidencia exacta
    if (nombreCompleto.includes(terminoLimpio)) {
      return true;
    }
    
    // Buscar por iniciales
    const iniciales = this.obtenerIniciales().toLowerCase();
    if (iniciales.includes(terminoLimpio.replace(/\s/g, ''))) {
      return true;
    }
    
    // Buscar por palabras individuales
    const palabrasTermino = terminoLimpio.split(' ');
    const palabrasNombre = nombreCompleto.split(' ');
    
    return palabrasTermino.every(palabra => 
      palabrasNombre.some(nombrePalabra => nombrePalabra.includes(palabra))
    );
  }

  override toString(): string {
    return this.obtenerNombreCompleto();
  }
} 