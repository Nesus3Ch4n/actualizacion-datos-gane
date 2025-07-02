import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationModeService, NavigationMode } from '../../../services/navigation-mode.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit, OnDestroy {

  components = ['personal', 'academico', 'vehiculo', 'vivienda', 'personas-acargo', 'contacto', 'declaracion'];
  currentIndex = 0;
  currentMode: NavigationMode = 'complete';
  private modeSubscription!: Subscription;
  private navigationSubscription!: Subscription;

  stepsData = [
    { title: 'Información Personal', icon: 'fas fa-user', enabled: true },
    { title: 'Estudios Académicos', icon: 'fas fa-graduation-cap', enabled: true },
    { title: 'Vehículos', icon: 'fas fa-car', enabled: true },
    { title: 'Vivienda', icon: 'fas fa-home', enabled: true },
    { title: 'Personas a Cargo', icon: 'fas fa-users', enabled: true },
    { title: 'Contactos de Emergencia', icon: 'fas fa-phone', enabled: true },
    { title: 'Declaraciones', icon: 'fas fa-file-contract', enabled: true }
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private navigationModeService: NavigationModeService,
    private formNavigationService: FormNavigationService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el modo de navegación
    this.modeSubscription = this.navigationModeService.mode$.subscribe(mode => {
      this.currentMode = mode;
      this.updateStepsAvailability();
    });

    // Suscribirse a cambios en la navegación
    this.navigationSubscription = this.formNavigationService.getCurrentIndex$().subscribe(index => {
      this.currentIndex = index;
    });

    // Sincronizar currentIndex con la ruta actual
    this.syncCurrentIndexWithRoute();
  }

  private syncCurrentIndexWithRoute(): void {
    // Obtener la ruta actual
    const currentUrl = this.router.url;
    
    // Encontrar el índice del componente actual basado en la URL
    for (let i = 0; i < this.components.length; i++) {
      if (currentUrl.includes(this.components[i])) {
        this.currentIndex = i;
        this.formNavigationService.setCurrentIndex(i);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  private updateStepsAvailability(): void {
    // Habilitar todos los pasos en modo completo
    if (this.currentMode === 'complete') {
      this.stepsData.forEach(step => {
        step.enabled = true;
      });
    } else if (this.currentMode === 'conflict-only') {
      // En modo conflicto, solo habilitar declaraciones
      this.stepsData.forEach((step, index) => {
        step.enabled = index === 6; // Solo declaraciones
      });
    }
  }

  navigateTo(index: number) {
    if (index >= 0 && index < this.stepsData.length && this.stepsData[index].enabled) {
      console.log(`Navegando al paso ${index}: ${this.stepsData[index].title}`);
      this.formNavigationService.navigateTo(index);
    } else {
      console.warn(`Paso ${index} no disponible en el modo actual`);
    }
  }

  next() {
    if (this.currentIndex < this.stepsData.length - 1) {
      this.navigateTo(this.currentIndex + 1);
    } else {
      console.log('Formulario completado, redirigiendo a finalización');
      this.router.navigate(['/completado']);
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.navigateTo(this.currentIndex - 1);
    } else {
      // Regresar al inicio o dashboard
      this.router.navigate(['/']);
    }
  }

  // Método para verificar si un paso está disponible
  isStepAvailable(index: number): boolean {
    return index >= 0 && index < this.stepsData.length && this.stepsData[index].enabled;
  }

  // Método para verificar si estamos en modo "conflict-only"
  isConflictOnlyMode(): boolean {
    return this.currentMode === 'conflict-only';
  }
}
