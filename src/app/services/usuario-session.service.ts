import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSessionService {
  private usuarioActualSubject = new BehaviorSubject<any>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private backendService: BackendService) {
    // Intentar cargar usuario desde localStorage
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuarioActual');
      }
    }
  }

  // Establecer el usuario actual después del login/registro
  setUsuarioActual(usuario: any): void {
    this.usuarioActualSubject.next(usuario);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  // Obtener el ID del usuario actual
  getIdUsuarioActual(): number | null {
    const usuario = this.usuarioActualSubject.value;
    return usuario ? usuario.idUsuario : null;
  }

  // Obtener el usuario completo
  getUsuarioActual(): any {
    return this.usuarioActualSubject.value;
  }

  // Obtener la cédula del usuario actual
  getCedulaUsuarioActual(): number | null {
    const usuario = this.usuarioActualSubject.value;
    return usuario ? usuario.cedula : null;
  }

  // Buscar usuario por cédula y establecerlo como actual
  async buscarYEstablecerUsuario(cedula: number): Promise<any> {
    try {
      // Primero intentar obtener el usuario directamente por cédula
      try {
        const usuario = await this.backendService.obtenerUsuarioPorCedula(cedula.toString()).toPromise();
        if (usuario) {
          this.setUsuarioActual(usuario);
          return usuario;
        }
      } catch (error) {
        // Usuario no encontrado por cédula directa
      }
      
      // Si no se encuentra directamente, buscar en la lista completa
      const usuarios = await this.backendService.obtenerUsuarios().toPromise();
      
      if (usuarios && Array.isArray(usuarios)) {
        const usuario = usuarios.find((u: any) => {
          // Comparar tanto como string como number
          return u.cedula === cedula || u.cedula === cedula.toString() || u.cedula === cedula.toString();
        });
        
        if (usuario) {
          this.setUsuarioActual(usuario);
          return usuario;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error al buscar usuario:', error);
      throw error;
    }
  }

  // Limpiar sesión
  logout(): void {
    this.usuarioActualSubject.next(null);
    localStorage.removeItem('usuarioActual');
  }

  // Verificar si hay un usuario activo
  tieneUsuarioActivo(): boolean {
    return this.usuarioActualSubject.value !== null;
  }
} 