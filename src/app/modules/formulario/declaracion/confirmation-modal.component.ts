import { Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="custom-modal">
      <button class="close-modal" aria-label="Cerrar" (click)="onBack()">&times;</button>
      
      <div class="modal-icon-wrapper">
        <div class="modal-icon-bg" [ngClass]="isSubmitting ? 'success-bg' : 'question-bg'">
          <mat-icon class="modal-icon" [ngClass]="isSubmitting ? 'success-icon' : 'question-icon'">
            {{ isSubmitting ? 'check_circle' : 'help_outline' }}
          </mat-icon>
        </div>
      </div>
      
      <h2 class="modal-title">{{ isSubmitting ? '¡Enviado exitosamente!' : 'Toda la información está lista' }}</h2>
      
      <p class="modal-message" *ngIf="!isSubmitting">
        ¡Cultura y Desarrollo agradece la veracidad de la información suministrada 
        en el presente proceso de actualización de datos!
      </p>
      
      <p class="modal-message success-message" *ngIf="isSubmitting">
        Sus datos han sido enviados correctamente. ¡Gracias por completar el formulario!
      </p>
      
      <div class="instructions-section" *ngIf="!isSubmitting">
        <div class="instruction-item">
          <mat-icon>send</mat-icon>
          <span>Para terminar presione <strong>"Enviar"</strong> o <kbd>Enter</kbd></span>
        </div>
        <div class="instruction-item">
          <mat-icon>close</mat-icon>
          <span>Para cancelar presione <strong>"Cerrar"</strong> o <kbd>Esc</kbd></span>
        </div>
      </div>
      
      <div class="modal-actions" *ngIf="!isSubmitting">
        <button class="btn-secondary" (click)="onBack()" [disabled]="isSubmitting">
          <mat-icon>arrow_back</mat-icon>
          Cerrar
        </button>
        <button class="btn-primary" (click)="onSubmit()" [disabled]="isSubmitting">
          <mat-icon>send</mat-icon>
          Enviar
        </button>
      </div>
      
      <div class="success-actions" *ngIf="isSubmitting">
        <button class="btn-success-final" (click)="closeModal()">
          <mat-icon>check</mat-icon>
          Finalizar
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Reset de estilos del contenedor del dialog */
    :host {
      display: block;
      background: transparent !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      width: auto !important;
      height: auto !important;
    }

    /* Estilos para remover el fondo del dialog */
    :host ::ng-deep .mat-dialog-container {
      background: transparent !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: visible !important;
    }

    .custom-modal {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      position: relative;
      max-width: 600px;
      width: 100%;
      min-width: 400px;
      font-family: 'Roboto', sans-serif;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
      margin: 0 auto;
      transform: translateZ(0);
      isolation: isolate;
    }

    .close-modal {
      position: absolute;
      top: 16px;
      right: 20px;
      background: none;
      border: none;
      font-size: 28px;
      color: #9ca3af;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
      z-index: 10;
    }

    .close-modal:hover {
      color: #374151;
      background: #f3f4f6;
      transform: rotate(90deg);
    }

    .modal-icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-icon-bg {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: iconPulse 0.8s ease-out;
      transition: all 0.6s ease;
    }

    .modal-icon-bg.question-bg {
      background: #e6f1fd;
    }

    .modal-icon-bg.success-bg {
      background: #effce0;
      animation: successTransition 0.8s ease-out;
    }

    .modal-icon {
      font-size: 40px !important;
      width: 40px !important;
      height: 40px !important;
      transition: all 0.6s ease;
    }

    .modal-icon.question-icon {
      color: #003594;
    }

    .modal-icon.success-icon {
      color: #0ed422;
    }

    .modal-title {
      font-size: 2rem;
      font-weight: 700;
      color: #181f2c;
      margin: 18px 0;
      font-family: 'Roboto', sans-serif;
      line-height: 1.2;
      transition: all 0.4s ease;
    }

    .modal-message {
      font-size: 1.1rem;
      color: #6b7280;
      margin-bottom: 24px;
      font-family: 'Roboto', sans-serif;
      line-height: 1.5;
      padding: 0 1rem;
      transition: all 0.4s ease;
    }

    .modal-message.success-message {
      color: #16a34a;
      font-weight: 500;
    }

    .instructions-section {
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .instruction-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 0.95rem;
      color: #64748b;
      border-left: 3px solid #e2e8f0;
      text-align: left;

      mat-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        color: #475569;
        flex-shrink: 0;
      }

      strong {
        color: #334155;
        font-weight: 600;
      }

      kbd {
        background: #334155;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.85rem;
        font-weight: 600;
      }
    }

    .modal-actions,
    .success-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-secondary,
    .btn-primary,
    .btn-success-final {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      font-family: 'Roboto', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
      justify-content: center;

      mat-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
      border: 2px solid #e2e8f0;

      &:hover:not(:disabled) {
        background: #e2e8f0;
        color: #334155;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(71, 85, 105, 0.2);
      }
    }

    .btn-primary {
      background: #003594;
      color: white;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);

      &:hover:not(:disabled) {
        background: #0047b3;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
      }
    }

    .btn-success-final {
      background: #0ed422;
      color: white;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
      min-width: 160px;
      animation: buttonAppear 0.6s ease-out;

      &:hover {
        background:rgb(16, 238, 38);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);

      }
    }

    @keyframes iconPulse {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes successTransition {
      0% {
        transform: scale(1) rotate(0deg);
        background: #dbeafe;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
      }
      100% {
        transform: scale(1) rotate(360deg);
        background: #dcfce7;
      }
    }

    @keyframes buttonAppear {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .custom-modal {
        padding: 1.5rem;
        margin: 1rem;
        max-width: 90vw;
        min-width: auto;
      }

      .modal-title {
        font-size: 1.75rem;
      }

      .modal-message {
        font-size: 1rem;
        padding: 0;
      }

      .modal-actions,
      .success-actions {
        flex-direction: column;
        gap: 12px;
      }

      .btn-secondary,
      .btn-primary,
      .btn-success-final {
        width: 100%;
        min-width: auto;
      }

      .instruction-item {
        flex-direction: column;
        text-align: center;
        gap: 6px;
      }
    }

    @media (max-width: 480px) {
      .custom-modal {
        padding: 1rem;
        margin: 0.5rem;
      }

      .modal-icon-bg {
        width: 64px;
        height: 64px;
      }

      .modal-icon {
        font-size: 32px !important;
        width: 32px !important;
        height: 32px !important;
      }

      .modal-title {
        font-size: 1.5rem;
        margin: 16px 0;
      }

      .close-modal {
        top: 12px;
        right: 16px;
        font-size: 24px;
      }
    }
  `]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    // Configurar el dialog para que no tenga estilos por defecto
    this.dialogRef.disableClose = false;
    this.dialogRef.addPanelClass('transparent-dialog');
  }

  ngOnInit(): void {
    // Focus en el modal para capturar eventos de teclado
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 100);
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isSubmitting) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.onSubmit();
        break;
      case 'Escape':
        event.preventDefault();
        this.onBack();
        break;
    }
  }

  onBack(): void {
    if (!this.isSubmitting) {
      this.dialogRef.close('back');
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Simular envío con delay para mostrar la transición
    setTimeout(() => {
      // Aquí iría la lógica real de envío
      console.log('Formulario enviado exitosamente');
      
      // Después de 2 segundos, permitir cerrar
      setTimeout(() => {
        // Auto-cerrar después de mostrar el éxito o esperar input del usuario
      }, 2000);
      
    }, 1000);
  }

  closeModal(): void {
    // Cerrar el modal y navegar al componente de formulario completado
    this.dialogRef.close('submit');
    this.router.navigate(['/completado']);
  }
} 