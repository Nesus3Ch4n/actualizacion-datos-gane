import { EstudioAcademico } from './estudio-academico.entity';

export class InformacionAcademica {
  constructor(
    private readonly estaEstudiando: boolean,
    private estudios: EstudioAcademico[] = []
  ) {}

  // Getters
  getEstaEstudiando(): boolean {
    return this.estaEstudiando;
  }

  getEstudios(): EstudioAcademico[] {
    return [...this.estudios];
  }

  // Métodos de negocio
  agregarEstudio(estudio: EstudioAcademico): void {
    if (this.estudios.length >= 10) {
      throw new Error('No se pueden registrar más de 10 estudios');
    }

    const existeEstudio = this.estudios.some(e => 
      e.getInstitucion() === estudio.getInstitucion() && 
      e.getTitulo() === estudio.getTitulo()
    );

    if (existeEstudio) {
      throw new Error('Ya existe un estudio registrado con la misma institución y título');
    }

    this.estudios.push(estudio);
  }

  removerEstudio(indice: number): void {
    if (indice < 0 || indice >= this.estudios.length) {
      throw new Error('Índice de estudio inválido');
    }
    this.estudios.splice(indice, 1);
  }

  tieneEstudios(): boolean {
    return this.estudios.length > 0;
  }

  getEstudiosCompletados(): EstudioAcademico[] {
    return this.estudios.filter(estudio => estudio.estaCompleto());
  }

  getEstudiosEnCurso(): EstudioAcademico[] {
    return this.estudios.filter(estudio => !estudio.estaCompleto());
  }

  getNivelEducativoMasAlto(): string | undefined {
    if (this.estudios.length === 0) return undefined;

    const jerarquia = ['PRIMARIA', 'SECUNDARIA', 'TECNICO', 'TECNOLOGO', 'UNIVERSITARIO', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'];
    
    let nivelMasAlto = '';
    let posicionMasAlta = -1;

    for (const estudio of this.estudios) {
      const posicion = jerarquia.indexOf(estudio.getNivelEducativo().valor);
      if (posicion > posicionMasAlta) {
        posicionMasAlta = posicion;
        nivelMasAlto = estudio.getNivelEducativo().valor;
      }
    }

    return nivelMasAlto;
  }
} 