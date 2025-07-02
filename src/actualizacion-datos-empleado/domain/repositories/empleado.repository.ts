import { Empleado } from '../entities/empleado.entity';
import { NumeroDocumento } from '../value-objects/numero-documento.vo';

export interface EmpleadoRepository {
  // Operaciones CRUD básicas
  buscarPorNumeroDocumento(numeroDocumento: NumeroDocumento): Promise<Empleado | null>;
  guardar(empleado: Empleado): Promise<void>;
  actualizar(empleado: Empleado): Promise<void>;
  eliminar(numeroDocumento: NumeroDocumento): Promise<void>;
  
  // Consultas específicas del dominio
  buscarTodos(): Promise<Empleado[]>;
  buscarPorArea(area: string): Promise<Empleado[]>;
  buscarPorCargo(cargo: string): Promise<Empleado[]>;
  buscarEmpleadosConDatosIncompletos(): Promise<Empleado[]>;
  buscarEmpleadosConVehiculo(): Promise<Empleado[]>;
  buscarEmpleadosConPersonasACargo(): Promise<Empleado[]>;
  
  // Operaciones de validación
  existeEmpleado(numeroDocumento: NumeroDocumento): Promise<boolean>;
  validarDocumentoUnico(numeroDocumento: NumeroDocumento): Promise<boolean>;
} 