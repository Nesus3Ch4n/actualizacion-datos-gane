import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationModeService } from '../../../services/navigation-mode.service';

@Component({
  selector: 'app-formulario-completado',
  template: `
    <div class="completion-container">
      <div class="completion-card">
        
        <!-- Lado izquierdo con logo y decoración -->
        <div class="left-section">
          <div class="logo-container">
            <img src="assets/images/logo.png" alt="Logo" class="company-logo">
          </div>
          <div class="decoration-elements">
            <div class="decoration-circle"></div>
            <div class="decoration-line"></div>
            <div class="decoration-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Lado derecho con contenido principal -->
        <div class="right-section">
          <div class="content-wrapper">
            
            <!-- Icono de éxito -->
            <div class="success-icon-container">
              <mat-icon class="success-icon">check_circle</mat-icon>
            </div>

            <!-- Título principal -->
            <h1 class="main-title">
              ¡Formulario completado!
            </h1>

            <!-- Mensaje principal -->
            <p class="main-message">
              Ya has finalizado el formulario de actualización de datos y conflicto de intereses
            </p>

            <!-- Información adicional -->
            <div class="additional-info">
              <h3 class="info-title">
                <mat-icon>info</mat-icon>
                Información Importante
              </h3>
              <div class="info-card">
                <mat-icon class="info-icon">schedule</mat-icon>
                <div class="info-text">
                  <p><strong>Próxima actualización:</strong></p>
                  <p>Podrás volver a actualizar tus datos en <strong>1 año</strong> a partir de hoy <span>(quemado)</span></p>
                </div>
              </div>
            </div>

            <!-- Sección de actualización disponible -->
            <div class="update-section">
              <h4 class="update-title">
                Pero aún puedes actualizar lo siguiente:
              </h4>
              <div class="update-actions">
                <button mat-raised-button color="accent" class="update-button" (click)="updateConflictInterests()">
                  <mat-icon>gavel</mat-icon>
                  Conflicto de intereses
                </button>
              </div>
            </div>

            <!-- Sección administrativa 
            <div class="admin-section">
              <h4 class="admin-title">
                <mat-icon>admin_panel_settings</mat-icon>
                Panel de Administración
              </h4>
              <p class="admin-description">
                Accede al panel para gestionar usuarios y generar reportes
              </p>
              <div class="admin-actions">
                <button mat-raised-button color="primary" class="admin-button" (click)="goToAdmin()">
                  <mat-icon>dashboard</mat-icon>
                  Ir al Panel Admin
                </button>
              </div>
            </div>-->

          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./formulario-completado.component.scss']
})
export class FormularioCompletadoComponent implements OnInit {

  constructor(
    private router: Router,
    private navigationModeService: NavigationModeService
  ) {}

  ngOnInit(): void {
    // Aquí podrías agregar lógica para mostrar animaciones de entrada
  }

  updateConflictInterests(): void {
    // Activar el modo "solo conflicto de intereses"
    this.navigationModeService.setConflictOnlyMode();
    // Navegar directamente al paso 7 (declaración)
    this.router.navigate(['/declaracion']);
  }

  goToAdmin(): void {
    // Resetear el modo de navegación antes de ir al admin
    this.navigationModeService.resetToCompleteMode();
    
    // Navegar al panel de administración
    this.router.navigate(['/admin']);
  }

  logout(): void {
    // Resetear el modo de navegación antes de salir
    this.navigationModeService.resetToCompleteMode();
    
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    // Aquí podrías limpiar el localStorage, hacer una petición de logout, etc.
    // this.router.navigate(['/login']);
    
    // Por ahora, redirigimos al inicio
    window.location.href = '/';
  }

  irAConflictoIntereses(): void {
    this.navigationModeService.setMode('conflict-only');
    this.router.navigate(['/informacion-personal'], { 
      queryParams: { step: 'declaracion' } 
    });
  }

  irAAdministracion(): void {
    this.router.navigate(['/admin']);
  }

  irAAdministracionScreaming(): void {
    this.router.navigate(['/admin-screaming']);
  }
} 