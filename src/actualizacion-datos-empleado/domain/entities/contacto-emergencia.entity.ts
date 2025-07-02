import { Telefono } from '../value-objects/telefono.vo';
import { Parentesco } from '../value-objects/parentesco.vo';

export class ContactoEmergencia {
  constructor(
    private readonly nombre: string,
    private readonly parentesco: Parentesco,
    private readonly telefono: Telefono
  ) {
    this.validarDatos();
  }

  // Getters
  getNombre(): string {
    return this.nombre;
  }

  getParentesco(): Parentesco {
    return this.parentesco;
  }

  getTelefono(): Telefono {
    return this.telefono;
  }

  private validarDatos(): void {
    if (!this.nombre.trim()) {
      throw new Error('El nombre del contacto de emergencia es obligatorio');
    }

    if (this.nombre.length < 3) {
      throw new Error('El nombre del contacto debe tener al menos 3 caracteres');
    }

    if (this.nombre.length > 100) {
      throw new Error('El nombre del contacto no puede exceder 100 caracteres');
    }
  }
} 