import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private currentUserIdSubject = new BehaviorSubject<number | null>(null);
  public currentUserId$: Observable<number | null> = this.currentUserIdSubject.asObservable();

  constructor() {
    // Cargar el ID del usuario desde localStorage si existe
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      this.currentUserIdSubject.next(Number(savedUserId));
    }
  }

  /**
   * Establecer el ID del usuario actual
   */
  setCurrentUserId(userId: number): void {
    this.currentUserIdSubject.next(userId);
    localStorage.setItem('currentUserId', userId.toString());
    console.log('👤 Usuario ID establecido:', userId);
  }

  /**
   * Obtener el ID del usuario actual
   */
  getCurrentUserId(): number | null {
    return this.currentUserIdSubject.value;
  }

  /**
   * Verificar si hay un usuario logueado
   */
  isUserLoggedIn(): boolean {
    return this.getCurrentUserId() !== null;
  }

  /**
   * Limpiar la sesión del usuario
   */
  clearUser(): void {
    this.currentUserIdSubject.next(null);
    localStorage.removeItem('currentUserId');
    console.log('👤 Sesión de usuario limpiada');
  }

  /**
   * Observable para escuchar cambios en el usuario actual
   */
  getCurrentUserIdObservable(): Observable<number | null> {
    return this.currentUserId$;
  }
} 