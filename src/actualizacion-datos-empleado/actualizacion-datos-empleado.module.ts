import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Servicios de aplicación
import { ActualizacionDatosService } from './application/services/actualizacion-datos.service';

// Repositorios (implementaciones de infraestructura)
import { EmpleadoRepositoryImpl } from './infrastructure/repositories/empleado.repository.impl';

// Adaptadores
import { EmpleadoFormAdapter } from './infrastructure/adapters/empleado-form.adapter';

// Casos de uso
import { ActualizarInformacionPersonalUseCase } from './application/use-cases/actualizar-informacion-personal.use-case';
import { ObtenerEmpleadoUseCase } from './application/use-cases/obtener-empleado.use-case';

// Token para inyección de dependencias del repositorio
import { InjectionToken } from '@angular/core';
import { EmpleadoRepository } from './domain/repositories/empleado.repository';

export const EMPLEADO_REPOSITORY = new InjectionToken<EmpleadoRepository>('EmpleadoRepository');

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    // Servicios de aplicación
    ActualizacionDatosService,
    
    // Repositorios - Inyección de dependencias usando token
    {
      provide: EMPLEADO_REPOSITORY,
      useClass: EmpleadoRepositoryImpl
    },
    
    // Casos de uso
    ActualizarInformacionPersonalUseCase,
    ObtenerEmpleadoUseCase,
    
    // Adaptadores
    EmpleadoFormAdapter
  ]
})
export class ActualizacionDatosEmpleadoModule { } 