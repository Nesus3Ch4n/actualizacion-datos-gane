import { NumeroDocumento } from '../value-objects/numero-documento.vo';
import { Parentesco } from '../value-objects/parentesco.vo';

export class PersonaACargo {
  constructor(
    private readonly numeroDocumento: NumeroDocumento,
    private readonly nombreCompleto: string,
    private readonly parentesco: Parentesco,
    private readonly fechaNacimiento: Date,
    private readonly esDependienteEconomico: boolean = true
  ) {
    this.validarDatos();
  }

  // Getters
  getNumeroDocumento(): string {
    return this.numeroDocumento.valor;
  }

  getNombreCompleto(): string {
    return this.nombreCompleto;
  }

  getParentesco(): Parentesco {
    return this.parentesco;
  }

  getFechaNacimiento(): Date {
    return this.fechaNacimiento;
  }

  getEsDependienteEconomico(): boolean {
    return this.esDependienteEconomico;
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

  esMenorDeEdad(): boolean {
    return this.getEdad() < 18;
  }

  esHijo(): boolean {
    return ['HIJO', 'HIJA'].includes(this.parentesco.valor);
  }

  esPadre(): boolean {
    return ['PADRE', 'MADRE'].includes(this.parentesco.valor);
  }

  esConyugue(): boolean {
    return ['ESPOSO', 'ESPOSA'].includes(this.parentesco.valor);
  }

  requiereAtencionEspecial(): boolean {
    // Menores de edad o adultos mayores de 65 años
    return this.esMenorDeEdad() || this.getEdad() >= 65;
  }

  private validarDatos(): void {
    if (!this.nombreCompleto.trim()) {
      throw new Error('El nombre completo de la persona a cargo es obligatorio');
    }

    if (this.nombreCompleto.length < 3) {
      throw new Error('El nombre completo debe tener al menos 3 caracteres');
    }

    if (this.nombreCompleto.length > 100) {
      throw new Error('El nombre completo no puede exceder 100 caracteres');
    }

    const hoy = new Date();
    if (this.fechaNacimiento > hoy) {
      throw new Error('La fecha de nacimiento no puede ser futura');
    }

    // Validar que la persona no sea demasiado mayor
    const edadMaxima = 120;
    if (this.getEdad() > edadMaxima) {
      throw new Error(`La edad no puede ser mayor a ${edadMaxima} años`);
    }

    // Validaciones específicas por parentesco
    if (this.esHijo() && this.getEdad() > 30 && this.esDependienteEconomico) {
      throw new Error('Un hijo mayor de 30 años generalmente no debería ser dependiente económico');
    }

    if (this.esPadre() && this.getEdad() < 40) {
      throw new Error('Un padre/madre generalmente debería tener al menos 40 años');
    }
  }
} 