import { NivelEducativo } from '../value-objects/nivel-educativo.vo';

export class EstudioAcademico {
  constructor(
    private readonly nivelEducativo: NivelEducativo,
    private readonly titulo: string,
    private readonly institucion: string,
    private readonly fechaInicio: Date,
    private readonly fechaGraduacion?: Date,
    private readonly enCurso: boolean = false
  ) {
    this.validarDatos();
  }

  // Getters
  getNivelEducativo(): NivelEducativo {
    return this.nivelEducativo;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getInstitucion(): string {
    return this.institucion;
  }

  getFechaInicio(): Date {
    return this.fechaInicio;
  }

  getFechaGraduacion(): Date | undefined {
    return this.fechaGraduacion;
  }

  getEnCurso(): boolean {
    return this.enCurso;
  }

  // Métodos de negocio
  estaCompleto(): boolean {
    return !this.enCurso && this.fechaGraduacion !== undefined;
  }

  getDuracionEnAños(): number | undefined {
    if (!this.fechaGraduacion) return undefined;
    
    const diferencia = this.fechaGraduacion.getTime() - this.fechaInicio.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
  }

  getAñosDesdeGraduacion(): number | undefined {
    if (!this.fechaGraduacion) return undefined;
    
    const hoy = new Date();
    const diferencia = hoy.getTime() - this.fechaGraduacion.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
  }

  private validarDatos(): void {
    if (!this.titulo.trim()) {
      throw new Error('El título es obligatorio');
    }

    if (!this.institucion.trim()) {
      throw new Error('La institución es obligatoria');
    }

    if (this.titulo.length > 100) {
      throw new Error('El título no puede exceder 100 caracteres');
    }

    if (this.institucion.length > 100) {
      throw new Error('La institución no puede exceder 100 caracteres');
    }

    const hoy = new Date();
    if (this.fechaInicio > hoy) {
      throw new Error('La fecha de inicio no puede ser futura');
    }

    if (this.fechaGraduacion && this.fechaGraduacion > hoy) {
      throw new Error('La fecha de graduación no puede ser futura');
    }

    if (this.fechaGraduacion && this.fechaGraduacion <= this.fechaInicio) {
      throw new Error('La fecha de graduación debe ser posterior a la fecha de inicio');
    }

    if (this.enCurso && this.fechaGraduacion) {
      throw new Error('Un estudio en curso no puede tener fecha de graduación');
    }

    if (!this.enCurso && !this.fechaGraduacion) {
      throw new Error('Un estudio completado debe tener fecha de graduación');
    }
  }
} 