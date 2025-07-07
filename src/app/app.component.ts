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
    
    // No verificar conexión con backend para evitar recargas
    console.log('ℹ️ Modo sin verificación de backend - evitando recargas');
  }
}
