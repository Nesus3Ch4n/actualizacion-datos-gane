import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormNavigationService {
  private components = ['personal', 'academico', 'vehiculo', 'vivienda', 'personas-acargo', 'contacto', 'declaracion'];
  private currentIndex$ = new BehaviorSubject<number>(0);

  constructor(
    private router: Router
  ) {}

  // Obtener el índice actual
  getCurrentIndex(): number {
    return this.currentIndex$.value;
  }

  // Observable del índice actual
  getCurrentIndex$() {
    return this.currentIndex$.asObservable();
  }

  // Actualizar el índice actual
  setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.components.length) {
      this.currentIndex$.next(index);
    }
  }

  // Navegar al siguiente paso
  next(): void {
    const currentIndex = this.currentIndex$.value;
    if (currentIndex < this.components.length - 1) {
      this.navigateTo(currentIndex + 1);
    }
  }

  // Navegar al paso anterior
  previous(): void {
    const currentIndex = this.currentIndex$.value;
    if (currentIndex > 0) {
      this.navigateTo(currentIndex - 1);
    }
  }

  // Navegar a un paso específico
  navigateTo(index: number): void {
    if (index >= 0 && index < this.components.length) {
      this.setCurrentIndex(index);
      // Navegar usando ruta absoluta
      this.router.navigate([this.components[index]]);
    }
  }

  // Obtener el nombre del componente actual
  getCurrentComponentName(): string {
    return this.components[this.currentIndex$.value];
  }

  // Sincronizar índice con la URL actual
  syncWithCurrentRoute(): void {
    const currentUrl = this.router.url;
    for (let i = 0; i < this.components.length; i++) {
      if (currentUrl.includes(this.components[i])) {
        this.setCurrentIndex(i);
        break;
      }
    }
  }
} 