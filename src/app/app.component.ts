import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'portal-actdatos';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('🚀 Iniciando aplicación...');
    
    // Verificar si hay un token en la URL (cuando viene de la plataforma PAU)
    this.authService.checkForTokenInUrl();
    
    // Verificar conexión con el backend
    this.authService.checkBackendConnection().subscribe(
      connected => {
        if (connected) {
          console.log('✅ Conexión con backend establecida');
        } else {
          console.warn('⚠️ No se pudo conectar con el backend');
        }
      }
    );
  }
}
