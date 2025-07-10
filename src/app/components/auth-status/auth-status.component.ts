import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-auth-status',
  template: `
    <div class="auth-status-container" *ngIf="showAuthStatus">
      <div class="auth-card">
        <div class="auth-header">
          <h3>
            <span class="auth-icon" [class]="authStatusIconClass">{{ authStatusIcon }}</span>
            Estado de Autenticación
          </h3>
        </div>
        
        <div class="auth-content">
          <div class="auth-info">
            <p><strong>Estado:</strong> {{ authStatusText }}</p>
            <p *ngIf="currentUser"><strong>Usuario:</strong> {{ currentUser.nombre }}</p>
            <p *ngIf="currentUser"><strong>Cédula:</strong> {{ currentUser.cedula }}</p>
            <p><strong>Token:</strong> {{ hasToken ? 'Presente' : 'No encontrado' }}</p>
          </div>
          
          <div class="auth-actions" *ngIf="!isAuthenticated">
            <button class="btn btn-primary" (click)="regenerateToken()" [disabled]="isRegenerating">
              <span class="btn-icon">🔄</span>
              {{ isRegenerating ? 'Regenerando...' : 'Regenerar Token' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-status-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }
    
    .auth-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 16px;
    }
    
    .auth-header h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #333;
    }
    
    .auth-info p {
      margin: 8px 0;
      font-size: 14px;
    }
    
    .auth-actions {
      margin-top: 16px;
      text-align: center;
    }
    
    .auth-icon {
      margin-right: 8px;
      font-size: 18px;
    }
    
    .auth-icon.authenticated {
      color: #4caf50;
    }
    
    .auth-icon.unauthenticated {
      color: #f44336;
    }
    
    .auth-icon.warning {
      color: #ff9800;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .btn-icon {
      font-size: 16px;
    }
  `]
})
export class AuthStatusComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  hasToken = false;
  currentUser: any = null;
  isRegenerating = false;
  showAuthStatus = false;
  
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Mostrar el componente solo en desarrollo o cuando hay problemas de autenticación
    this.showAuthStatus = true; // Siempre mostrar para debugging
    
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
        this.hasToken = !!this.authService.getCurrentToken();
      }
    );

    this.userSubscription = this.authService.currentUser$.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get authStatusText(): string {
    if (this.isAuthenticated) {
      return 'Autenticado';
    } else if (this.hasToken) {
      return 'Token presente pero no válido';
    } else {
      return 'No autenticado';
    }
  }

  get authStatusIcon(): string {
    if (this.isAuthenticated) {
      return '✅';
    } else if (this.hasToken) {
      return '⚠️';
    } else {
      return '❌';
    }
  }

  get authStatusIconClass(): string {
    if (this.isAuthenticated) {
      return 'authenticated';
    } else if (this.hasToken) {
      return 'warning';
    } else {
      return 'unauthenticated';
    }
  }

  async regenerateToken() {
    this.isRegenerating = true;
    
    try {
      const success = await this.authService.regenerateToken().toPromise();
      
      if (success) {
        this.notificationService.showSuccess('Token Regenerado', 'El token ha sido regenerado exitosamente.');
      } else {
        this.notificationService.showError('Error de Regeneración', 'No se pudo regenerar el token. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error regenerando token:', error);
      this.notificationService.showError('Error de Regeneración', 'Error al regenerar el token.');
    } finally {
      this.isRegenerating = false;
    }
  }
} 