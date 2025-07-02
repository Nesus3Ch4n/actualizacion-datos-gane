import { Injectable } from '@angular/core';
import { EmpleadoRepository } from '../../domain/repositories/empleado.repository';
import { Empleado } from '../../domain/entities/empleado.entity';
import { NumeroDocumento } from '../../domain/value-objects/numero-documento.vo';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoRepositoryImpl implements EmpleadoRepository {
  private empleados: Map<string, Empleado> = new Map();

  async buscarPorNumeroDocumento(numeroDocumento: NumeroDocumento): Promise<Empleado | null> {
    const empleado = this.empleados.get(numeroDocumento.valor);
    return empleado || null;
  }

  async guardar(empleado: Empleado): Promise<void> {
    this.empleados.set(empleado.getNumeroDocumento().valor, empleado);
  }

  async actualizar(empleado: Empleado): Promise<void> {
    if (!this.empleados.has(empleado.getNumeroDocumento().valor)) {
      throw new Error('El empleado no existe');
    }
    this.empleados.set(empleado.getNumeroDocumento().valor, empleado);
  }

  async eliminar(numeroDocumento: NumeroDocumento): Promise<void> {
    this.empleados.delete(numeroDocumento.valor);
  }

  async buscarTodos(): Promise<Empleado[]> {
    return Array.from(this.empleados.values());
  }

  async buscarPorArea(area: string): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(empleado => 
      empleado.getInformacionPersonal()?.getArea() === area
    );
  }

  async buscarPorCargo(cargo: string): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(empleado => 
      empleado.getInformacionPersonal()?.getCargo() === cargo
    );
  }

  async buscarEmpleadosConDatosIncompletos(): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(empleado => 
      !empleado.estaCompleto()
    );
  }

  async buscarEmpleadosConVehiculo(): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(empleado => 
      empleado.getInformacionVehiculo()?.getTieneVehiculo() === true
    );
  }

  async buscarEmpleadosConPersonasACargo(): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(empleado => 
      empleado.getPersonasACargo().length > 0
    );
  }

  async existeEmpleado(numeroDocumento: NumeroDocumento): Promise<boolean> {
    return this.empleados.has(numeroDocumento.valor);
  }

  async validarDocumentoUnico(numeroDocumento: NumeroDocumento): Promise<boolean> {
    return !this.empleados.has(numeroDocumento.valor);
  }

  // Método para inicializar datos de prueba
  async inicializarDatosPrueba(): Promise<void> {
    // Este método se puede usar para cargar datos iniciales
    // Por ahora lo dejamos vacío, pero se puede implementar más tarde
  }
} 