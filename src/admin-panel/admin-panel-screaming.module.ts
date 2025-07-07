import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material imports
import { MaterialModule } from '../app/shared/material.module';

// Presentation Layer (Components)
import { AdminPanelScreamingComponent } from './presentation/components/admin-panel-screaming.component';

// Application Layer (Use Cases & Services)
import { ObtenerUsuariosUseCase } from './application/use-cases/obtener-usuarios.use-case';
import { GenerarReporteUseCase } from './application/use-cases/generar-reporte.use-case';
import { FiltrarUsuariosUseCase } from './application/use-cases/filtrar-usuarios.use-case';

// Domain Layer (Services)
import { ActualizacionDatosDomainService } from './domain/services/actualizacion-datos.domain-service';

// Infrastructure Layer (Repositories & Adapters)
import { UsuarioRepository } from './domain/repositories/usuario.repository';
import { UsuarioRepositoryImpl } from './infrastructure/repositories/usuario.repository.impl';
import { ReporteRepository } from './domain/repositories/reporte.repository';
import { ReporteRepositoryImpl } from './infrastructure/repositories/reporte.repository.impl';
import { UsuarioAdapter } from './infrastructure/adapters/usuario.adapter';
import { ReporteAdapter } from './infrastructure/adapters/reporte.adapter';
import { ExcelGeneratorService } from './infrastructure/services/excel-generator.service';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelScreamingComponent
  }
];

/**
 * Módulo del Panel de Administración con Arquitectura Screaming
 * 
 * Estructura:
 * - Presentation: Componentes de UI
 * - Application: Casos de uso y servicios de aplicación
 * - Domain: Entidades, Value Objects, Repositorios (interfaces), Servicios de dominio
 * - Infrastructure: Implementaciones de repositorios, adaptadores, servicios externos
 */
@NgModule({
  declarations: [
    // Presentation Layer
    AdminPanelScreamingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // Application Layer - Use Cases
    ObtenerUsuariosUseCase,
    GenerarReporteUseCase,
    FiltrarUsuariosUseCase,

    // Domain Layer - Domain Services
    ActualizacionDatosDomainService,

    // Infrastructure Layer - Repository Implementations
    {
      provide: UsuarioRepository,
      useClass: UsuarioRepositoryImpl
    },
    {
      provide: ReporteRepository,
      useClass: ReporteRepositoryImpl
    },

    // Infrastructure Layer - Adapters
    UsuarioAdapter,
    ReporteAdapter,

    // Infrastructure Layer - External Services
    ExcelGeneratorService
  ],
  exports: [
    AdminPanelScreamingComponent
  ]
})
export class AdminPanelScreamingModule {
  
  /**
   * Método estático para configuración con providers específicos
   */
  static forRoot() {
    return {
      ngModule: AdminPanelScreamingModule,
      providers: [
        // Configuraciones globales si fueran necesarias
      ]
    };
  }

  /**
   * Método estático para configuración de features
   */
  static forFeature() {
    return {
      ngModule: AdminPanelScreamingModule,
      providers: [
        // Providers específicos de feature
      ]
    };
  }
}

/**
 * NOTAS SOBRE LA ARQUITECTURA SCREAMING:
 * 
 * 1. PRESENTATION LAYER (Componentes):
 *    - AdminPanelScreamingComponent: Componente principal
 *    - Se comunica únicamente con la Application Layer (Use Cases)
 *    - No conoce el dominio directamente
 * 
 * 2. APPLICATION LAYER (Casos de Uso):
 *    - ObtenerUsuariosUseCase: Obtener y listar usuarios
 *    - GenerarReporteUseCase: Generar reportes Excel
 *    - FiltrarUsuariosUseCase: Filtrar y buscar usuarios
 *    - Orquesta las operaciones entre Domain e Infrastructure
 * 
 * 3. DOMAIN LAYER (Núcleo del negocio):
 *    - Entities: Usuario, Reporte
 *    - Value Objects: EstadoUsuario, TipoReporte, NombreCompleto, Email, Departamento
 *    - Repositories (interfaces): UsuarioRepository, ReporteRepository
 *    - Domain Services: ActualizacionDatosDomainService
 *    - Contiene la lógica de negocio pura
 * 
 * 4. INFRASTRUCTURE LAYER (Implementaciones):
 *    - Repository Implementations: UsuarioRepositoryImpl, ReporteRepositoryImpl
 *    - Adapters: UsuarioAdapter, ReporteAdapter
 *    - External Services: ExcelGeneratorService
 *    - Implementa interfaces del dominio
 * 
 * BENEFICIOS DE ESTA ARQUITECTURA:
 * - ✅ Separación clara de responsabilidades
 * - ✅ Fácil testing (mockear interfaces)
 * - ✅ Independencia de frameworks externos
 * - ✅ Escalabilidad y mantenibilidad
 * - ✅ Reutilización de lógica de negocio
 * - ✅ Inversión de dependencias (DIP)
 */ 