import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-test',
  template: `
    <div class="notification-test">
      <h3>🧪 Prueba de Notificaciones</h3>
      <div class="test-buttons">
        <button (click)="testSuccess()" class="btn btn-success">✅ Éxito</button>
        <button (click)="testError()" class="btn btn-error">❌ Error</button>
        <button (click)="testWarning()" class="btn btn-warning">⚠️ Advertencia</button>
        <button (click)="testInfo()" class="btn btn-info">ℹ️ Información</button>
        <button (click)="testFormSaved()" class="btn btn-primary">📝 Formulario Guardado</button>
        <button (click)="testReportGenerated()" class="btn btn-secondary">📊 Reporte Generado</button>
        <button (click)="testUserDeleted()" class="btn btn-danger">🗑️ Usuario Eliminado</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-test {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 20px;
    }
    
    .test-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }
    
    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .btn-success { background: #4caf50; color: white; }
    .btn-error { background: #f44336; color: white; }
    .btn-warning { background: #ff9800; color: white; }
    .btn-info { background: #2196f3; color: white; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-danger { background: #dc3545; color: white; }
  `]
})
export class NotificationTestComponent {
  constructor(private notificationService: NotificationService) {}

  testSuccess() {
    this.notificationService.showSuccess('¡Éxito!', 'Esta es una notificación de éxito');
  }

  testError() {
    this.notificationService.showError('Error', 'Esta es una notificación de error');
  }

  testWarning() {
    this.notificationService.showWarning('Advertencia', 'Esta es una notificación de advertencia');
  }

  testInfo() {
    this.notificationService.showInfo('Información', 'Esta es una notificación informativa');
  }

  testFormSaved() {
    this.notificationService.showFormSaved('Información Personal');
  }

  testReportGenerated() {
    this.notificationService.showReportGenerated('Usuarios');
  }

  testUserDeleted() {
    this.notificationService.showUserDeleted('Juan Pérez');
  }
} 