export class Direccion {
  readonly calle: string;
  readonly numero: string;
  readonly complemento: string;
  readonly barrio: string;
  readonly ciudad: string;
  readonly departamento: string;

  constructor(
    calle: string,
    numero: string,
    complemento: string,
    barrio: string,
    ciudad: string,
    departamento: string
  ) {
    this.validar(calle, numero, barrio, ciudad, departamento);
    this.calle = calle.trim();
    this.numero = numero.trim();
    this.complemento = complemento.trim();
    this.barrio = barrio.trim();
    this.ciudad = ciudad.trim();
    this.departamento = departamento.trim();
  }

  private validar(
    calle: string,
    numero: string,
    barrio: string,
    ciudad: string,
    departamento: string
  ): void {
    if (!calle || !calle.trim()) {
      throw new Error('La calle es obligatoria');
    }

    if (!numero || !numero.trim()) {
      throw new Error('El número es obligatorio');
    }

    if (!barrio || !barrio.trim()) {
      throw new Error('El barrio es obligatorio');
    }

    if (!ciudad || !ciudad.trim()) {
      throw new Error('La ciudad es obligatoria');
    }

    if (!departamento || !departamento.trim()) {
      throw new Error('El departamento es obligatorio');
    }

    if (calle.length > 50) {
      throw new Error('La calle no puede exceder 50 caracteres');
    }

    if (numero.length > 20) {
      throw new Error('El número no puede exceder 20 caracteres');
    }

    if (barrio.length > 50) {
      throw new Error('El barrio no puede exceder 50 caracteres');
    }

    if (ciudad.length > 50) {
      throw new Error('La ciudad no puede exceder 50 caracteres');
    }

    if (departamento.length > 50) {
      throw new Error('El departamento no puede exceder 50 caracteres');
    }
  }

  getDireccionCompleta(): string {
    const partes = [this.calle, this.numero];
    if (this.complemento) {
      partes.push(this.complemento);
    }
    return partes.join(' ');
  }

  getDireccionConBarrio(): string {
    return `${this.getDireccionCompleta()}, ${this.barrio}`;
  }

  getDireccionConCiudad(): string {
    return `${this.getDireccionConBarrio()}, ${this.ciudad}, ${this.departamento}`;
  }

  equals(otra: Direccion): boolean {
    return (
      this.calle === otra.calle &&
      this.numero === otra.numero &&
      this.complemento === otra.complemento &&
      this.barrio === otra.barrio &&
      this.ciudad === otra.ciudad &&
      this.departamento === otra.departamento
    );
  }

  toString(): string {
    return this.getDireccionConCiudad();
  }
} 