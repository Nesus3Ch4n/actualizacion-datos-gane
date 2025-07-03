import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="welcome-header">
          <h1>🎯 Portal de Actualización de Datos</h1>
          <p class="subtitle">Sistema Integrado con la Plataforma PAU</p>
        </div>
        
        <div class="welcome-content">
          <div class="status-section">
            <h3>Estado del Sistema</h3>
            <div class="status-item" [class.connected]="backendConnected" [class.disconnected]="!backendConnected">
              <span class="status-icon">{{ backendConnected ? '✅' : '🎭' }}</span>
              <span class="status-text">
                {{ backendConnected ? 'Backend conectado' : 'Modo simulación PAU' }}
              </span>
            </div>
            
            <div class="status-item" [class.connected]="isAuthenticated" [class.disconnected]="!isAuthenticated">
              <span class="status-icon">{{ isAuthenticated ? '🔐' : '🔓' }}</span>
              <span class="status-text">
                {{ isAuthenticated ? 'Usuario autenticado' : 'Usuario no autenticado' }}
              </span>
            </div>
          </div>
          
          <div class="instructions">
            <h3>Instrucciones</h3>
            <ol>
              <li>🎭 El sistema está en modo simulación de la plataforma PAU</li>
              <li>🔐 La autenticación se valida automáticamente con el token JWT</li>
              <li>📝 Completa el formulario de actualización de datos</li>
              <li>💾 Guarda y envía tu información</li>
            </ol>
          </div>
          
          <div class="user-info" *ngIf="currentUser">
            <h3>Información del Usuario</h3>
            <div class="user-details">
              <p><strong>Nombre:</strong> {{ currentUser.nombre }}</p>
              <p><strong>Cédula:</strong> {{ currentUser.cedula }}</p>
              <p><strong>Correo:</strong> {{ currentUser.correo }}</p>
            </div>
          </div>
          
          <div class="actions">
            <button 
              *ngIf="isAuthenticated" 
              class="btn btn-primary" 
              (click)="goToForm()">
              📝 Ir al Formulario
            </button>
            
            <button 
              class="btn btn-success" 
              (click)="forceAuth()">
              🔐 Autenticación Manual
            </button>
            
            <button 
              *ngIf="isAuthenticated" 
              class="btn btn-secondary" 
              (click)="goToSimulation()">
              🎭 Ver Simulación PAU
            </button>
            
            <button 
              *ngIf="isAuthenticated" 
              class="btn btn-outline" 
              (click)="logout()">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .welcome-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      padding: 40px;
      max-width: 600px;
      width: 100%;
    }
    
    .welcome-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .welcome-header h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    
    .subtitle {
      color: #666;
      font-size: 1.2em;
      margin: 0;
    }
    
    .status-section {
      margin-bottom: 30px;
    }
    
    .status-section h3 {
      color: #333;
      margin-bottom: 15px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    
    .status-item.connected {
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    
    .status-item.disconnected {
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .status-icon {
      margin-right: 10px;
      font-size: 1.2em;
    }
    
    .status-text {
      font-weight: 500;
    }
    
    .instructions {
      margin-bottom: 30px;
    }
    
    .instructions h3 {
      color: #333;
      margin-bottom: 15px;
    }
    
    .instructions ol {
      color: #666;
      line-height: 1.6;
    }
    
    .instructions li {
      margin-bottom: 8px;
    }
    
    .user-info {
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 10px;
    }
    
    .user-info h3 {
      color: #333;
      margin-bottom: 15px;
    }
    
    .user-details p {
      margin-bottom: 8px;
      color: #666;
    }
    
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #0056b3;
    }
    
    .btn-success {
      background-color: #28a745;
      color: white;
    }
    
    .btn-success:hover {
      background-color: #218838;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #dc3545;
      border: 1px solid #dc3545;
    }
    
    .btn-outline:hover {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class WelcomeComponent implements OnInit {
  backendConnected = false;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de autenticación
    this.authService.isAuthenticated$.subscribe(
      authenticated => {
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.currentUser = this.authService.getCurrentUserValue();
        }
      }
    );

    // Verificar conexión con el backend (simulado)
    this.checkBackend();
  }

  checkBackend(): void {
    this.authService.checkBackendConnection().subscribe(
      connected => {
        this.backendConnected = connected;
      }
    );
  }

  forceAuth(): void {
    console.log('🔄 Iniciando autenticación manual...');
    
    // Token válido generado con el secreto del backend (24 horas de duración)
    const validToken = 'eyJhbGciOiJIUzUxMiJ9.eyJhcGVsbGlkb3MiOiJDT1JET0JBIEVDSEFORElBIiwic3ViIjoiQ1AxMDA2MTAxMjExIiwiaWR0aXBvZG9jdW1lbnRvIjoiMSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJpZGVudGlmaWNhY2lvbiI6IjEwMDYxMDEyMTEiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXJoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9Iiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImlkcm9sZXMiOiI1IiwiaWF0IjoxNzUxNTc5NDczLCJleHAiOjE3NTE2NjU4NzN9.c-7cq8i7uSzlt2XW5U4ipTVydAHg1lHhbpQT7Dnl2obuRiyzHwcmGoDyLVgQ5TIKre3VGdc0pYTg6UyqCrsTrw';
    
    // Procesar el token
    this.authService.processTokenFromPAU(validToken).subscribe(
      isValid => {
        if (isValid) {
          console.log('✅ Autenticación manual exitosa');
          this.router.navigate(['/formulario']);
        } else {
          console.log('❌ Autenticación manual fallida');
        }
      }
    );
  }

  goToForm(): void {
    console.log('🔄 Navegando al formulario...');
    this.router.navigate(['/personal']);
  }

  goToSimulation(): void {
    console.log('🔄 Navegando a simulación PAU...');
    this.router.navigate(['/pau-simulation']);
  }

  logout(): void {
    this.authService.logout();
  }
} 