import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './shared/pages/formulario-step/formulario.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { AuditoriaDetalleModalComponent } from './components/auditoria/auditoria-detalle-modal.component';
import { FormularioModule } from './modules/formulario/formulario.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsuarioDetalleModalComponent } from '../admin-panel/presentation/components/usuario-detalle-modal.component';
import { MaterialModule } from './shared/material.module';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    AuditoriaComponent,
    UsuarioDetalleModalComponent,
    AuditoriaDetalleModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    FormularioModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
